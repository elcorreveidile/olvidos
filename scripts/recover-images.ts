/**
 * Recuperación de imágenes que quedaron como placeholder "hotlinked" en Blob.
 *
 * Estrategia fiable: descarga el ÍNDICE completo de la mediateca de WordPress
 * (/wp-json/wp/v2/media, ~15 peticiones) → mapa nombreRaíz → URL original real.
 * Para cada miniatura de Blob (-WxH), busca su original por nombre, lo descarga,
 * lo REDIMENSIONA (máx 1600px, calidad 82) y lo sube a Blob; reescribe la BD.
 *
 * Uso:
 *   export $(grep -E '^(DATABASE_URL|BLOB_READ_WRITE_TOKEN)=' .env.local | xargs)
 *   npx tsx scripts/recover-images.ts --dry
 *   npx tsx scripts/recover-images.ts
 */
import { PrismaClient } from "@prisma/client";
import { put } from "@vercel/blob";
import crypto from "crypto";
import sharp from "sharp";

const db = new PrismaClient();
const DRY = process.argv.includes("--dry");
const REFERER = "https://olvidosdegranada.es/";
const MEDIA = "https://olvidosdegranada.es/wp-json/wp/v2/media";
const BLOB = /https:\/\/[a-z0-9]+\.public\.blob\.vercel-storage\.com\/articulos\/[^\s"'<>)]+/gi;
const THUMB = /-\d+x\d+(\.(jpg|jpeg|png|gif|webp))$/i;
const MAX_W = 1600;
const CONC = 10;

const fetchT = (u: string, opts: any = {}, ms = 20000) =>
  fetch(u, { ...opts, signal: AbortSignal.timeout(ms) });
const baseAfterHash = (b: string) => (b.split("/").pop() || "").replace(/^[a-f0-9]{10}-/, "");
const isThumb = (u: string) => THUMB.test(baseAfterHash(u));
const stripThumb = (u: string) => u.replace(THUMB, "$1");
/** nombre raíz: sin extensión, sin -scaled, sin -WxH → para casar variantes. */
function rootName(basename: string): string {
  return basename
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/-\d+x\d+$/i, "")
    .replace(/-scaled$/i, "");
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
async function pool<T>(items: T[], fn: (t: T) => Promise<void>) {
  const q = [...items];
  await Promise.all(Array.from({ length: CONC }, async () => { while (q.length) await fn(q.pop()!); }));
}

async function main() {
  // Pass A: índice completo de la mediateca → rootName -> source_url
  const media = new Map<string, string>();
  let page = 1, total = Infinity;
  while ((page - 1) * 100 < total) {
    const r = await fetchT(`${MEDIA}?per_page=100&page=${page}&_fields=source_url,media_type`);
    if (page === 1) total = Number(r.headers.get("x-wp-total")) || 0;
    const items: any[] = await r.json();
    for (const it of items) {
      const su: string = it.source_url || "";
      if (!/\.(jpe?g|png|gif|webp)$/i.test(su)) continue;
      const root = rootName(su.split("/").pop() || "");
      if (root && !media.has(root)) media.set(root, su);
    }
    if (!items.length) break;
    page++;
  }
  console.log(`Mediateca: ${media.size} nombres (de ${total} items).`);

  // Pass B: reunir miniaturas Blob de la BD y casarlas con la mediateca
  const arts = await db.article.findMany({ select: { id: true, coverImage: true, content: true } });
  type Task = { blobUrl: string; source: string | null };
  const byArticle = new Map<string, Task[]>();
  const uniqueSource = new Set<string>();
  let matched = 0, unmatched = 0;
  for (const a of arts) {
    const urls = new Set<string>([...(a.content || "").matchAll(BLOB)].map(m => m[0]));
    if (a.coverImage && /blob\.vercel-storage/.test(a.coverImage)) urls.add(a.coverImage);
    const tasks: Task[] = [];
    for (const bu of urls) {
      if (!isThumb(bu)) continue;
      const root = rootName(baseAfterHash(bu));
      const source = media.get(root) || null;
      tasks.push({ blobUrl: bu, source });
      if (source) { uniqueSource.add(source); matched++; } else unmatched++;
    }
    if (tasks.length) byArticle.set(a.id, tasks);
  }
  console.log(`Miniaturas Blob: ${matched + unmatched} · casadas: ${matched} · sin casar: ${unmatched} · originales únicos: ${uniqueSource.size}`);
  if (DRY) {
    console.log("Ejemplos:", JSON.stringify([...uniqueSource].slice(0, 5)));
    return;
  }

  // Pass C: descargar + redimensionar + subir cada original único
  const token = process.env.BLOB_READ_WRITE_TOKEN!;
  const srcToNew = new Map<string, string | null>();
  let done = 0, ok = 0, fail = 0;
  await pool([...uniqueSource], async (src) => {
    const buf = await fetchImage(src);
    if (buf) {
      try {
        const { data, ct, ext } = await downsize(buf);
        const key = `articulos/rec-${crypto.createHash("sha1").update(src).digest("hex").slice(0, 12)}.${ext}`;
        const blob = await put(key, data, { access: "public", contentType: ct, addRandomSuffix: false, allowOverwrite: true, token });
        srcToNew.set(src, blob.url); ok++;
      } catch { srcToNew.set(src, null); fail++; }
    } else { srcToNew.set(src, null); fail++; }
    done++;
    if (done % 50 === 0) console.log(`  subidas ${done}/${uniqueSource.size} (ok:${ok} fail:${fail})`);
  });
  console.log(`Originales subidos: ${ok}, fallidos: ${fail}`);

  // Pass D: reescribir la BD
  let artsUpdated = 0, replaced = 0;
  for (const [artId, tasks] of byArticle) {
    const a = arts.find(x => x.id === artId)!;
    let content = a.content || "", cover = a.coverImage;
    for (const t of tasks) {
      const neu = t.source ? srcToNew.get(t.source) : null;
      if (!neu) continue;
      if (cover === t.blobUrl) cover = neu;
      if (content.includes(t.blobUrl)) content = content.split(t.blobUrl).join(neu);
      replaced++;
    }
    if (content !== a.content || cover !== a.coverImage) {
      await db.article.update({ where: { id: artId }, data: { content, coverImage: cover } });
      artsUpdated++;
    }
  }
  console.log(`Imágenes sustituidas: ${replaced} · Artículos actualizados: ${artsUpdated}`);
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => db.$disconnect());
