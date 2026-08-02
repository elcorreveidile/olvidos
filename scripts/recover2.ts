/**
 * Segunda pasada de PRECISIÓN. Corrige tanto los placeholders que quedaron como
 * las imágenes que la 1ª pasada pudo poner mal (nombres genéricos ambiguos).
 *
 * Por cada artículo afectado: lee su contenido ORIGINAL en la API de WordPress
 * (por wpId), extrae sus imágenes reales EN ORDEN, y las empareja POR POSICIÓN
 * con las imágenes actuales del artículo (dentro de un artículo el nombre es
 * único → desambigua). Para cada una descarga el original a tamaño completo
 * (con su subcarpeta exacta), lo redimensiona y lo sube; reescribe la BD.
 *
 * Uso:
 *   export $(grep -E '^(DATABASE_URL|BLOB_READ_WRITE_TOKEN)=' .env.local | xargs)
 *   npx tsx scripts/recover2.ts --dry
 *   npx tsx scripts/recover2.ts
 */
import { PrismaClient } from "@prisma/client";
import { put } from "@vercel/blob";
import crypto from "crypto";
import sharp from "sharp";

const db = new PrismaClient();
const DRY = process.argv.includes("--dry");
const REFERER = "https://olvidosdegranada.es/";
const WP_API = "https://olvidosdegranada.es/wp-json/wp/v2/posts/";
const THUMB = /-\d+x\d+(\.(jpg|jpeg|png|gif|webp))$/i;
const MAX_W = 1600;
const CONC = 8;

const fetchT = (u: string, opts: any = {}, ms = 20000) =>
  fetch(u, { ...opts, signal: AbortSignal.timeout(ms) });
const stripThumb = (u: string) => u.replace(THUMB, "$1");
const attr = (tag: string, name: string) => {
  const m = tag.match(new RegExp(`${name}=["']([^"']*)["']`, "i"));
  return m ? m[1] : null;
};
/** URLs de imagen reales de un HTML de WP, EN ORDEN (salta las vacías). */
function wpRealUrls(html: string): string[] {
  const out: string[] = [];
  for (const m of html.matchAll(/<img\b[^>]*>/gi)) {
    const tag = m[0];
    let u = attr(tag, "src");
    if (!u || !/^https?:/i.test(u))
      u = attr(tag, "data-src") || attr(tag, "data-lazy-src") || attr(tag, "data-orig-file");
    if (!u) {
      const ss = attr(tag, "srcset");
      if (ss) u = ss.split(",")[0].trim().split(/\s+/)[0];
    }
    if (u && /^https?:/i.test(u) && /\.(jpe?g|png|gif|webp)/i.test(u)) out.push(u);
  }
  return out;
}
function dbImgSrcs(html: string): string[] {
  return [...html.matchAll(/<img[^>]*\ssrc=["']([^"']+)["']/gi)].map((m) => m[1]);
}
async function fetchImage(u: string): Promise<Buffer | null> {
  try {
    const r = await fetchT(u, { headers: { Referer: REFERER, "User-Agent": "Mozilla/5.0" } });
    if (!r.ok) return null;
    if (!(r.headers.get("content-type") || "").startsWith("image/")) return null;
    return Buffer.from(await r.arrayBuffer());
  } catch { return null; }
}
async function downsize(buf: Buffer): Promise<{ data: Buffer; ct: string; ext: string }> {
  const img = sharp(buf, { failOn: "none", animated: true });
  const meta = await img.metadata();
  if (meta.format === "gif") return { data: buf, ct: "image/gif", ext: "gif" };
  let pipe = img;
  if ((meta.width || 0) > MAX_W) pipe = pipe.resize({ width: MAX_W, withoutEnlargement: true });
  if (meta.format === "png") return { data: await pipe.png({ compressionLevel: 9 }).toBuffer(), ct: "image/png", ext: "png" };
  if (meta.format === "webp") return { data: await pipe.webp({ quality: 82 }).toBuffer(), ct: "image/webp", ext: "webp" };
  return { data: await pipe.jpeg({ quality: 82, mozjpeg: true }).toBuffer(), ct: "image/jpeg", ext: "jpg" };
}

const uploadCache = new Map<string, string | null>();
async function getOrUpload(full: string, token: string): Promise<string | null> {
  if (uploadCache.has(full)) return uploadCache.get(full)!;
  const buf = await fetchImage(full);
  if (!buf) { uploadCache.set(full, null); return null; }
  try {
    const { data, ct, ext } = await downsize(buf);
    const key = `articulos/rec-${crypto.createHash("sha1").update(full).digest("hex").slice(0, 12)}.${ext}`;
    const blob = await put(key, data, { access: "public", contentType: ct, addRandomSuffix: false, allowOverwrite: true, token });
    uploadCache.set(full, blob.url);
    return blob.url;
  } catch { uploadCache.set(full, null); return null; }
}

async function pool<T>(items: T[], fn: (t: T) => Promise<void>) {
  const q = [...items];
  await Promise.all(Array.from({ length: CONC }, async () => { while (q.length) await fn(q.pop()!); }));
}

async function main() {
  const token = process.env.BLOB_READ_WRITE_TOKEN!;
  const arts = await db.article.findMany({ select: { id: true, wpId: true, title: true, content: true } });
  // afectados: contienen imágenes recuperadas (rec-) o miniaturas placeholder
  const affected = arts.filter(a => /\/articulos\/(rec-|[a-f0-9]{10}-[^"'<>]*-\d+x\d+\.)/i.test(a.content || ""));
  console.log("Artículos a revisar:", affected.length);

  let okArts = 0, replaced = 0, skipMismatch = 0, skipNoWp = 0;
  const mismatches: string[] = [];

  await pool(affected, async (a) => {
    if (!a.wpId) { skipNoWp++; return; }
    let wpHtml = "";
    for (let attempt = 0; attempt < 4 && !wpHtml; attempt++) {
      try {
        const r = await fetchT(`${WP_API}${a.wpId}?_fields=content`, {}, 30000);
        if (r.ok) { const j: any = await r.json(); wpHtml = j.content?.rendered || ""; }
      } catch {}
    }
    if (!wpHtml) { skipNoWp++; return; }

    let wpUrls = wpRealUrls(wpHtml);
    const curSrcs = dbImgSrcs(a.content || "");
    // promote-covers movió la 1ª imagen del cuerpo a la portada → db = wp - 1
    if (curSrcs.length === wpUrls.length - 1) wpUrls = wpUrls.slice(1);
    if (curSrcs.length !== wpUrls.length || wpUrls.length === 0) {
      skipMismatch++; mismatches.push(`${a.title} (db:${curSrcs.length} wp:${wpUrls.length})`); return;
    }
    if (DRY) { okArts++; replaced += curSrcs.length; return; }

    let content = a.content || "";
    let changed = false;
    for (let i = 0; i < curSrcs.length; i++) {
      const full = stripThumb(wpUrls[i]);
      const neu = await getOrUpload(full, token);
      if (!neu) continue;
      if (curSrcs[i] !== neu && content.includes(curSrcs[i])) {
        content = content.split(curSrcs[i]).join(neu);
        changed = true; replaced++;
      }
    }
    if (changed) { await db.article.update({ where: { id: a.id }, data: { content } }); okArts++; }
  });

  console.log(`Artículos corregidos: ${okArts} · imágenes sustituidas: ${replaced}`);
  console.log(`Saltados por desajuste de nº de imágenes: ${skipMismatch} · sin wpId/WP: ${skipNoWp}`);
  if (mismatches.length) console.log("Desajustes:", JSON.stringify(mismatches.slice(0, 30)));
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => db.$disconnect());
