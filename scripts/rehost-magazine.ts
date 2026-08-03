/**
 * Re-aloja en Vercel Blob los PDFs y las portadas de la revista que hoy viven en
 * el servidor viejo (olvidosdegranada.es), y actualiza MagazineIssue.pdfUrl /
 * coverImage. Deja la hemeroteca independiente del servidor antiguo.
 *
 * Para las portadas intenta primero la versión ORIGINAL (quitando el sufijo
 * -AnchoxAlto); si no existe, usa la enlazada.
 *
 * Idempotente (salta lo que ya esté en Blob). Uso:
 *   npx tsx scripts/rehost-magazine.ts --dry     (solo comprueba descargas)
 *   npx tsx scripts/rehost-magazine.ts           (migra de verdad)
 */
import { readFileSync } from "node:fs";
import { db } from "../src/lib/db";
import { put } from "@vercel/blob";

const DRY = process.argv.includes("--dry");
const BLOB_HOST = "public.blob.vercel-storage.com";
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

function token(): string {
  if (process.env.BLOB_READ_WRITE_TOKEN) return process.env.BLOB_READ_WRITE_TOKEN;
  const line = readFileSync(".env.local", "utf8")
    .split("\n")
    .find((l) => l.startsWith("BLOB_READ_WRITE_TOKEN="));
  return line ? line.slice("BLOB_READ_WRITE_TOKEN=".length).replace(/^"|"$/g, "").trim() : "";
}
const TOKEN = token();

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function fetchBuf(url: string, tries = 3): Promise<Buffer | null> {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": UA } });
      if (res.ok) return Buffer.from(await res.arrayBuffer());
      if (res.status === 404) return null;
    } catch {
      /* reintenta */
    }
    await sleep(500 * (i + 1));
  }
  return null;
}

/** Quita el sufijo -AnchoxAlto para intentar la imagen original. */
function originalCover(url: string): string {
  return url.replace(/-\d+x\d+(\.\w+)(\?.*)?$/, "$1");
}

function safeName(url: string): string {
  const base = decodeURIComponent(url.split("?")[0].split("/").pop() || "archivo");
  return base.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-90);
}

function contentType(name: string): string {
  const ext = name.toLowerCase().split(".").pop();
  if (ext === "pdf") return "application/pdf";
  if (ext === "png") return "image/png";
  if (ext === "webp") return "image/webp";
  return "image/jpeg";
}

async function upload(prefix: string, url: string, buf: Buffer): Promise<string> {
  const name = safeName(url);
  const ct = contentType(name);
  const blob = await put(`${prefix}/${name}`, buf, {
    access: "public",
    addRandomSuffix: true,
    contentType: ct,
    token: TOKEN,
    multipart: ct === "application/pdf", // robusto para los PDFs grandes
  });
  return blob.url;
}

async function main() {
  if (!TOKEN) throw new Error("Falta BLOB_READ_WRITE_TOKEN");
  console.log(DRY ? "== DRY-RUN (no escribe) ==\n" : "== MIGRACIÓN ==\n");

  const issues = await db.magazineIssue.findMany({
    select: { id: true, number: true, pdfUrl: true, coverImage: true },
    orderBy: { number: "asc" },
  });

  let pdfDone = 0;
  let coverDone = 0;
  const fails: string[] = [];

  for (const it of issues) {
    // --- PDF ---
    if (it.pdfUrl && !it.pdfUrl.includes(BLOB_HOST)) {
      const buf = await fetchBuf(it.pdfUrl);
      if (!buf) {
        fails.push(`#${it.number} PDF (${it.pdfUrl})`);
      } else {
        const kb = (buf.length / 1024).toFixed(0);
        if (DRY) {
          console.log(`#${it.number} PDF ok (${kb} KB)`);
        } else {
          const newUrl = await upload("revista/pdf", it.pdfUrl, buf);
          await db.magazineIssue.update({ where: { id: it.id }, data: { pdfUrl: newUrl } });
          console.log(`✓ #${it.number} PDF → Blob (${kb} KB)`);
        }
        pdfDone++;
      }
    }

    // --- Portada (intenta original primero) ---
    if (it.coverImage && !it.coverImage.includes(BLOB_HOST)) {
      const orig = originalCover(it.coverImage);
      let src = orig;
      let buf = await fetchBuf(orig);
      if (!buf && orig !== it.coverImage) {
        src = it.coverImage;
        buf = await fetchBuf(it.coverImage);
      }
      if (!buf) {
        fails.push(`#${it.number} portada (${it.coverImage})`);
      } else {
        const kb = (buf.length / 1024).toFixed(0);
        const tag = src === orig && orig !== it.coverImage ? "original" : "enlazada";
        if (DRY) {
          console.log(`#${it.number} portada ok (${tag}, ${kb} KB)`);
        } else {
          const newUrl = await upload("revista/portadas", src, buf);
          await db.magazineIssue.update({ where: { id: it.id }, data: { coverImage: newUrl } });
          console.log(`✓ #${it.number} portada → Blob (${tag}, ${kb} KB)`);
        }
        coverDone++;
      }
    }
  }

  console.log(`\nPDFs: ${pdfDone} | portadas: ${coverDone}`);
  if (fails.length) {
    console.log(`\n⚠ Fallos (${fails.length}):`);
    fails.forEach((f) => console.log("  -", f));
  }
}

main().finally(() => db.$disconnect());
