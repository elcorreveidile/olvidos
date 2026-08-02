/**
 * Re-aloja en Vercel Blob todas las imágenes de artículos que hoy se sirven
 * desde el WordPress viejo (olvidosdegranada.es) u otros terceros, y reescribe
 * las URLs en `Article.coverImage` y en el HTML de `Article.content`.
 *
 * Motivo: las imágenes DENTRO del contenido salen "hotlinked" (WordPress las
 * bloquea por Referer). Un fetch desde el servidor SIN Referer devuelve la
 * imagen real; la subimos a Blob (público, mismo dominio efectivo) y ya no
 * dependemos del sitio antiguo.
 *
 * Uso:
 *   export $(grep -E '^(DATABASE_URL|BLOB_READ_WRITE_TOKEN)=' .env.local | xargs)
 *   npx tsx scripts/rehost-images.ts --dry     # solo cuenta, no escribe
 *   npx tsx scripts/rehost-images.ts           # ejecuta de verdad
 *
 * Es idempotente: las URLs que ya apuntan a Blob se ignoran, así que se puede
 * relanzar sin duplicar (p. ej. cuando se publiquen artículos nuevos).
 */
import { PrismaClient } from "@prisma/client";
import { put } from "@vercel/blob";
import crypto from "crypto";

const db = new PrismaClient();
const DRY = process.argv.includes("--dry");
const BLOB_HOST_RE = /\.public\.blob\.vercel-storage\.com$/i;
const IMG_SRC_RE = /<img[^>]+src=["']([^"']+)["']/gi;
const CONCURRENCY = 5;

function collectFromContent(html: string | null): string[] {
  if (!html) return [];
  const out: string[] = [];
  const re = new RegExp(IMG_SRC_RE);
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) out.push(m[1]);
  return out;
}

/** ¿Es una URL http(s) que conviene re-alojar (y no está ya en Blob)? */
function shouldRehost(u: string): boolean {
  try {
    const url = new URL(u);
    return (
      (url.protocol === "http:" || url.protocol === "https:") &&
      !BLOB_HOST_RE.test(url.host)
    );
  } catch {
    return false;
  }
}

function blobKeyFor(u: string): string {
  const hash = crypto.createHash("sha1").update(u).digest("hex").slice(0, 10);
  let base = "img";
  try {
    base = new URL(u).pathname.split("/").pop() || "img";
  } catch {
    /* noop */
  }
  base = base.replace(/[^a-zA-Z0-9._-]/g, "-").slice(-60) || "img";
  if (!/\.[a-zA-Z0-9]{2,5}$/.test(base)) base += ".img";
  return `articulos/${hash}-${base}`;
}

async function fetchImage(
  u: string
): Promise<{ buf: Buffer; type: string } | null> {
  try {
    // Node no envía Referer por defecto → WordPress sirve la imagen real.
    const res = await fetch(u, { headers: { Accept: "image/*,*/*" } });
    if (!res.ok) return null;
    const type = res.headers.get("content-type") || "application/octet-stream";
    if (!type.startsWith("image/")) return null;
    const ab = await res.arrayBuffer();
    return { buf: Buffer.from(ab), type };
  } catch {
    return null;
  }
}

async function main() {
  const arts = await db.article.findMany({
    select: { id: true, coverImage: true, content: true },
  });

  const urls = new Set<string>();
  for (const a of arts) {
    if (a.coverImage && shouldRehost(a.coverImage)) urls.add(a.coverImage);
    for (const u of collectFromContent(a.content))
      if (shouldRehost(u)) urls.add(u);
  }

  console.log(`Artículos: ${arts.length}`);
  console.log(`URLs únicas a re-alojar: ${urls.size}`);
  if (DRY) {
    console.log("Ejemplos:", Array.from(urls).slice(0, 8));
    return;
  }
  if (!urls.size) {
    console.log("Nada que hacer.");
    return;
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error("ERROR: falta BLOB_READ_WRITE_TOKEN en el entorno.");
    process.exit(1);
  }
  const token = process.env.BLOB_READ_WRITE_TOKEN;

  // Subida con límite de concurrencia.
  const map = new Map<string, string>();
  const queue = Array.from(urls);
  let done = 0;
  let failed = 0;

  async function worker() {
    while (queue.length) {
      const u = queue.pop()!;
      const img = await fetchImage(u);
      if (!img) {
        failed++;
        console.warn("  ✗ fetch:", u);
        continue;
      }
      try {
        const blob = await put(blobKeyFor(u), img.buf, {
          access: "public",
          contentType: img.type,
          addRandomSuffix: false,
          token,
        });
        map.set(u, blob.url);
        done++;
        if (done % 25 === 0) console.log(`  subidas ${done}/${urls.size}`);
      } catch (e) {
        failed++;
        console.warn("  ✗ upload:", u, (e as Error).message);
      }
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  console.log(`Subidas OK: ${done}, fallos: ${failed}`);

  // Reescritura en la BD.
  let updated = 0;
  for (const a of arts) {
    let newCover = a.coverImage;
    if (a.coverImage && map.has(a.coverImage))
      newCover = map.get(a.coverImage)!;

    let newContent = a.content;
    for (const [src, blobUrl] of Array.from(map.entries())) {
      if (newContent.includes(src)) newContent = newContent.split(src).join(blobUrl);
    }

    if (newCover !== a.coverImage || newContent !== a.content) {
      await db.article.update({
        where: { id: a.id },
        data: { coverImage: newCover, content: newContent },
      });
      updated++;
    }
  }
  console.log(`Artículos actualizados: ${updated}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
