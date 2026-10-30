/**
 * Sube imágenes de portada a Vercel Blob y las asigna a artículos por slug.
 * Pensado para poner portada a los editoriales (y a cualquier artículo) sin
 * pasar uno a uno por el panel. Las imágenes viven fuera del repositorio.
 *
 *   node --env-file=.env.local node_modules/.bin/tsx scripts/asignar-portadas.ts <lista.json> [--aplicar]
 *
 * Necesita DATABASE_URL y BLOB_READ_WRITE_TOKEN en .env.local (el token está
 * en Vercel → Storage → Blob → «.env.local» / Tokens). Sin `--aplicar` solo
 * informa. La lista:
 *
 *   [
 *     { "slug": "frio-y-gripe", "imagen": "frio-y-gripe.png",
 *       "credito": "Ilustración: Olvidos (Canva)", "posicion": "center" }
 *   ]
 *
 * `imagen` es relativa a la lista; `credito` y `posicion` (valor CSS de
 * object-position, o "contain") son opcionales. Cada imagen se redimensiona
 * a 1600 px de ancho como máximo y se guarda como JPEG (calidad 82) en
 * `articulos/portadas/<slug>.jpg`, sobrescribiendo la anterior del mismo slug.
 * Lo que escriba tarda hasta 5 minutos en verse en la web (Data Cache).
 */
import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { put } from "@vercel/blob";
import sharp from "sharp";

interface Portada {
  slug: string;
  imagen: string;
  credito?: string;
  posicion?: string;
}

const MAX_WIDTH = 1600;
const JPEG_QUALITY = 82;

const args = process.argv.slice(2);
const APLICAR = args.includes("--aplicar");
const listaPath = args.find((a) => !a.startsWith("--"));

if (!listaPath) {
  console.error("Uso: tsx scripts/asignar-portadas.ts <lista.json> [--aplicar]");
  process.exit(1);
}

async function preparar(file: string): Promise<{ buf: Buffer; width: number; height: number; original: number }> {
  const original = fs.statSync(file).size;
  const buf = await sharp(file)
    .rotate()
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .flatten({ background: "#ffffff" })
    .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
    .toBuffer();
  const meta = await sharp(buf).metadata();
  return { buf, width: meta.width ?? 0, height: meta.height ?? 0, original };
}

async function main() {
  const listaFile = path.resolve(listaPath!);
  const lista = JSON.parse(fs.readFileSync(listaFile, "utf8")) as Portada[];
  if (!Array.isArray(lista) || lista.length === 0) throw new Error("La lista está vacía");
  for (const p of lista) {
    if (!p.slug || !p.imagen) throw new Error(`Entrada sin slug o imagen: ${JSON.stringify(p)}`);
    const file = path.resolve(path.dirname(listaFile), p.imagen);
    if (!fs.existsSync(file)) throw new Error(`No existe la imagen ${file} (slug ${p.slug})`);
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (APLICAR && !token) {
    throw new Error("Falta BLOB_READ_WRITE_TOKEN en .env.local (Vercel → Storage → Blob → Tokens)");
  }

  const db = new PrismaClient();
  try {
    const articulos = await db.article.findMany({
      where: { slug: { in: lista.map((p) => p.slug) } },
      select: { id: true, slug: true, title: true, coverImage: true, status: true },
    });
    const porSlug = new Map(articulos.map((a) => [a.slug, a]));
    const faltan = lista.filter((p) => !porSlug.has(p.slug)).map((p) => p.slug);
    if (faltan.length) throw new Error(`No existen estos artículos: ${faltan.join(", ")}`);

    console.log(`${APLICAR ? "Asignando" : "En seco (sin --aplicar), haría"}:`);
    for (const p of lista) {
      const art = porSlug.get(p.slug)!;
      const file = path.resolve(path.dirname(listaFile), p.imagen);
      const img = await preparar(file);
      const kb = (n: number) => `${Math.round(n / 1024)} KB`;
      console.log(`  ${art.slug} — «${art.title}» (${art.status})`);
      console.log(`    ${path.basename(file)}: ${kb(img.original)} → ${img.width}×${img.height} JPEG ${kb(img.buf.length)}`);
      if (art.coverImage) console.log(`    sustituye la portada actual: ${art.coverImage}`);
      if (p.credito) console.log(`    crédito: ${p.credito}`);
      if (p.posicion) console.log(`    posición: ${p.posicion}`);
      if (!APLICAR) continue;

      const blob = await put(`articulos/portadas/${art.slug}.jpg`, img.buf, {
        access: "public",
        contentType: "image/jpeg",
        addRandomSuffix: false,
        allowOverwrite: true,
        token,
      });
      await db.article.update({
        where: { id: art.id },
        data: {
          coverImage: blob.url,
          ...(p.credito !== undefined ? { coverCredit: p.credito || null } : {}),
          ...(p.posicion ? { coverPosition: p.posicion } : {}),
        },
      });
      console.log(`    ✓ ${blob.url}`);
    }
    if (APLICAR) {
      console.log("Hecho. La web tarda hasta 5 minutos en mostrar las portadas nuevas (o guarda un artículo desde el panel).");
    }
  } finally {
    await db.$disconnect();
  }
}

main().catch((e) => {
  console.error("Error:", e instanceof Error ? e.message : e);
  process.exit(1);
});
