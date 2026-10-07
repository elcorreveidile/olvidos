/**
 * Quita de los artículos y actividades los `srcset`/`sizes` de las imágenes que
 * aún apuntan al WordPress viejo (olvidosdegranada.es). La migración re-alojó
 * los `src` en Vercel Blob, pero no tocó los `srcset`, y el navegador prefiere
 * el `srcset`: pide la imagen al dominio antiguo y recibe el cartel «This image
 * was hotlinked» (los originales ya no existen allí: 404). Sin `srcset`, el
 * navegador usa el `src` de Blob.
 *
 * También informa (sin tocar) de lo que sigue apuntando al dominio antiguo:
 * `src` de imágenes sin re-alojar, enlaces `href` a `wp-content/uploads` y los
 * PDF de los visores FlowPaper.
 *
 * Uso (desde el clon local):
 *   node --env-file=.env.local node_modules/.bin/tsx scripts/legacy/fix-srcset-legacy.ts            # solo informa
 *   node --env-file=.env.local node_modules/.bin/tsx scripts/legacy/fix-srcset-legacy.ts --aplicar  # escribe
 *
 * Tras aplicar, la web tarda hasta 5 min en reflejarlo (Data Cache).
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const APLICAR = process.argv.includes("--aplicar");
const OLD_HOST = /olvidosdegranada\.es/i;

type Fix = { html: string; quitados: number };

/** Quita `srcset` y `sizes` de cada <img> cuyo srcset cite el dominio antiguo. */
function limpiarSrcset(html: string): Fix {
  let quitados = 0;
  const out = html.replace(/<img\b[^>]*>/gi, (tag) => {
    const srcset = tag.match(/\ssrcset\s*=\s*("[^"]*"|'[^']*')/i);
    if (!srcset || !OLD_HOST.test(srcset[1])) return tag;
    quitados++;
    return tag
      .replace(/\ssrcset\s*=\s*("[^"]*"|'[^']*')/gi, "")
      .replace(/\ssizes\s*=\s*("[^"]*"|'[^']*')/gi, "");
  });
  return { html: out, quitados };
}

function cuenta(html: string, re: RegExp): number {
  return (html.match(re) ?? []).length;
}

const SRC_VIEJO = /<img\b[^>]*\ssrc\s*=\s*["'][^"']*olvidosdegranada\.es[^"']*["']/gi;
const HREF_VIEJO = /<a\b[^>]*\shref\s*=\s*["'][^"']*olvidosdegranada\.es\/wp-content\/uploads[^"']*["']/gi;
const PDF_VIEJO = /flowpaper\.com\/flipbook\/\?pdf=https?:\/\/olvidosdegranada\.es[^"'&\s]*/gi;

async function main() {
  const articulos = await prisma.article.findMany({
    select: { id: true, slug: true, content: true },
    orderBy: { slug: "asc" },
  });
  const actividades = await prisma.event.findMany({
    select: { id: true, slug: true, description: true },
  });

  const filas = [
    ...articulos.map((a) => ({ tipo: "artículo" as const, id: a.id, slug: a.slug, html: a.content ?? "" })),
    ...actividades.map((e) => ({ tipo: "actividad" as const, id: e.id, slug: e.slug, html: e.description ?? "" })),
  ];

  let textosConSrcset = 0;
  let imgsArregladas = 0;
  const pendientes: string[] = [];

  for (const fila of filas) {
    const { html, quitados } = limpiarSrcset(fila.html);
    const srcViejo = cuenta(fila.html, SRC_VIEJO);
    const hrefViejo = cuenta(fila.html, HREF_VIEJO);
    const pdfViejo = cuenta(fila.html, PDF_VIEJO);

    if (quitados) {
      textosConSrcset++;
      imgsArregladas += quitados;
      console.log(`■ ${fila.tipo} ${fila.slug}: ${quitados} srcset al dominio antiguo${APLICAR ? " → quitados" : ""}`);
      if (APLICAR) {
        if (fila.tipo === "artículo") {
          await prisma.article.update({ where: { id: fila.id }, data: { content: html } });
        } else {
          await prisma.event.update({ where: { id: fila.id }, data: { description: html } });
        }
      }
    }
    if (srcViejo || hrefViejo || pdfViejo) {
      pendientes.push(
        `  ${fila.tipo} ${fila.slug}: ${srcViejo ? `${srcViejo} img con src antiguo; ` : ""}${hrefViejo ? `${hrefViejo} enlaces a uploads; ` : ""}${pdfViejo ? `${pdfViejo} PDF de FlowPaper; ` : ""}`.replace(/; $/, "")
      );
    }
  }

  console.log(`\n${filas.length} textos; ${textosConSrcset} con srcset al dominio antiguo (${imgsArregladas} imágenes)${APLICAR ? ", ya limpiados" : ". Nada escrito: añade --aplicar"}.`);
  if (pendientes.length) {
    console.log(`\nSiguen apuntando al dominio antiguo (no se tocan; informativo):`);
    for (const p of pendientes) console.log(p);
  } else {
    console.log("Ninguna otra referencia al dominio antiguo.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
