/**
 * Arreglo GENERAL de imágenes (3ª pasada, la buena).
 *
 * Por cada artículo recuperado, coge sus imágenes EXACTAS de su propio contenido
 * en WordPress (por wpId), emparejadas POR POSICIÓN con las del artículo, y usa
 * la versión que de verdad existe: primero la URL exacta que muestra el original,
 * si es placeholder prueba la completa (sin -WxH), y si ninguna es real la deja.
 * Corrige las imágenes equivocadas que dejó el casado por nombre genérico.
 *
 * Uso:
 *   export $(grep -E '^(DATABASE_URL|BLOB_READ_WRITE_TOKEN)=' .env.local | xargs)
 *   npx tsx scripts/recover3.ts --dry
 *   npx tsx scripts/recover3.ts
 */
import { PrismaClient } from "@prisma/client";
import { put } from "@vercel/blob";
import crypto from "crypto";
import sharp from "sharp";

const db = new PrismaClient();
const DRY = process.argv.includes("--dry");
const WP_API = "https://olvidosdegranada.es/wp-json/wp/v2/posts/";
const THUMB = /-\d+x\d+(\.(jpg|jpeg|png|gif|webp))$/i;
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36";
const CONC = 3; // gentil con la API de WordPress
const REFS = [
  "rec-a1ea62037a60.jpg", "rec-1641cb7dd2a6.jpg", "rec-7aed70636887.jpg",
  "rec-1cd8d4003e8b.jpg", "rec-bc931de77299.jpg",
].map((f) => `https://0fozgfuttuxgknhs.public.blob.vercel-storage.com/articulos/${f}`);

const attr = (t: string, n: string) => (t.match(new RegExp(`${n}=["']([^"']*)["']`, "i")) || [])[1] || null;
function wpReal(html: string): string[] {
  const out: string[] = [];
  for (const m of html.matchAll(/<img\b[^>]*>/gi)) {
    const t = m[0];
    let u = attr(t, "src");
    if (!u || !/^https?:/i.test(u)) u = attr(t, "data-src") || attr(t, "data-lazy-src") || attr(t, "data-orig-file");
    if (!u) { const ss = attr(t, "srcset"); if (ss) u = ss.split(",")[0].trim().split(/\s+/)[0]; }
    if (u && /^https?:/i.test(u) && /\.(jpe?g|png|gif|webp)/i.test(u)) out.push(u);
  }
  return out;
}
const dbImgSrcs = (html: string) => Array.from(html.matchAll(/<img[^>]*\ssrc=["']([^"']+)["']/gi)).map((m) => m[1]);

async function fetchT(u: string, opts: any = {}, ms = 30000) {
  return fetch(u, { ...opts, signal: AbortSignal.timeout(ms) });
}
async function fetchImg(u: string): Promise<Buffer | null> {
  try {
    const r = await fetchT(u, { headers: { Referer: "https://olvidosdegranada.es/", "User-Agent": UA } });
    if (!r.ok) return null;
    if (!(r.headers.get("content-type") || "").startsWith("image/")) return null;
    return Buffer.from(await r.arrayBuffer());
  } catch { return null; }
}
async function dhash(b: Buffer): Promise<bigint | null> {
  try {
    const px = await sharp(b, { failOn: "none" }).resize(9, 8, { fit: "fill" }).grayscale().raw().toBuffer();
    let bits = 0n;
    for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) { const i = r * 9 + c; if (px[i] < px[i + 1]) bits |= 1n << BigInt(r * 8 + c); }
    return bits;
  } catch { return null; }
}
const ham = (a: bigint, b: bigint) => { let x = a ^ b, n = 0; while (x) { n += Number(x & 1n); x >>= 1n; } return n; };
let REF_HASHES: bigint[] = [];
async function isPlaceholder(b: Buffer | null): Promise<boolean> {
  if (!b) return true;
  if (b.length < 14000) return true;
  const h = await dhash(b);
  return h !== null && REF_HASHES.some((r) => ham(h, r) <= 12);
}
const upCache = new Map<string, string>();
async function upload(buf: Buffer, src: string, token: string): Promise<string> {
  if (upCache.has(src)) return upCache.get(src)!;
  const img = sharp(buf, { failOn: "none", animated: true });
  const m = await img.metadata();
  let p = img;
  if ((m.width || 0) > 1600) p = p.resize({ width: 1600, withoutEnlargement: true });
  let data: Buffer, ct: string, ext: string;
  if (m.format === "png") { data = await p.png({ compressionLevel: 9 }).toBuffer(); ct = "image/png"; ext = "png"; }
  else if (m.format === "webp") { data = await p.webp({ quality: 82 }).toBuffer(); ct = "image/webp"; ext = "webp"; }
  else if (m.format === "gif") { data = buf; ct = "image/gif"; ext = "gif"; }
  else { data = await p.jpeg({ quality: 82, mozjpeg: true }).toBuffer(); ct = "image/jpeg"; ext = "jpg"; }
  const key = `articulos/rec-${crypto.createHash("sha1").update(src).digest("hex").slice(0, 12)}.${ext}`;
  const blob = await put(key, data, { access: "public", contentType: ct, addRandomSuffix: false, allowOverwrite: true, token });
  upCache.set(src, blob.url);
  return blob.url;
}
async function pool<T>(items: T[], fn: (t: T) => Promise<void>) {
  const q = [...items];
  await Promise.all(Array.from({ length: CONC }, async () => { while (q.length) await fn(q.pop()!); }));
}

async function main() {
  const token = process.env.BLOB_READ_WRITE_TOKEN!;
  for (const u of REFS) { const b = await fetchImg(u); if (b) { const h = await dhash(b); if (h !== null) REF_HASHES.push(h); } }

  const arts = await db.article.findMany({ select: { id: true, wpId: true, title: true, content: true } });
  const affected = arts.filter((a) => /\/articulos\/rec-/.test(a.content || ""));
  console.log("Artículos recuperados a revisar:", affected.length);
  if (DRY) return;

  let fixedArts = 0, changedImgs = 0, skipMismatch = 0, skipNoWp = 0;
  await pool(affected, async (a) => {
    if (!a.wpId) { skipNoWp++; return; }
    let html = "";
    for (let i = 0; i < 4 && !html; i++) {
      try { const r = await fetchT(`${WP_API}${a.wpId}?_fields=content`, { headers: { "User-Agent": UA } }); if (r.ok) { const j: any = await r.json(); html = j.content?.rendered || ""; } } catch {}
    }
    if (!html) { skipNoWp++; return; }

    let wp = wpReal(html);
    const cur = dbImgSrcs(a.content || "");
    if (cur.length === wp.length - 1) wp = wp.slice(1); // portada promovida
    if (cur.length !== wp.length || wp.length === 0) { skipMismatch++; return; }

    let content = a.content || "", changed = false;
    for (let i = 0; i < wp.length; i++) {
      const exact = wp[i], full = exact.replace(THUMB, "$1");
      let buf = await fetchImg(exact), used = exact;
      if (await isPlaceholder(buf)) { const fb = await fetchImg(full); if (!(await isPlaceholder(fb))) { buf = fb; used = full; } }
      if (!buf || (await isPlaceholder(buf))) continue; // no hay real: dejar como está
      const url = await upload(buf, used, token);
      if (cur[i] !== url && content.includes(cur[i])) { content = content.split(cur[i]).join(url); changed = true; changedImgs++; }
    }
    if (changed) { await db.article.update({ where: { id: a.id }, data: { content } }); fixedArts++; }
  });

  console.log(`Artículos con cambios: ${fixedArts} · imágenes corregidas: ${changedImgs}`);
  console.log(`Saltados desajuste: ${skipMismatch} · sin WP: ${skipNoWp}`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => db.$disconnect());
