/**
 * Siembra la hemeroteca (Archivo) con los números de la revista IMPRESA.
 *
 * Puente temporal: las portadas y PDFs apuntan a los assets ya alojados en el
 * WordPress actual (olvidosdegranada.es). Cuando subamos los PDFs al nuevo
 * almacenamiento, bastará con actualizar coverImage/pdfUrl.
 *
 * Numeración sentinel (el campo `number` es Int único y obligatorio):
 *   - Preolvidos / primera época  → números negativos
 *   - Números 1..17 (7-8 doble = 7)
 *   - Separatas y monográficos    → 100+
 *
 * Uso:  npx tsx scripts/seed-archive.ts
 */

import { db } from "../src/lib/db";
import { ContentStatus } from "@prisma/client";

type SeedIssue = {
  number: number;
  slug: string;
  title: string;
  description?: string | null;
  coverImage: string;
  pdfUrl: string;
};

const ISSUES: SeedIssue[] = [
  // --- Primera época (preolvidos) ---
  {
    number: -2,
    slug: "preolvidos-1",
    title: "Olvidos de Granada — Primera época (I)",
    coverImage: "https://olvidosdegranada.es/wp-content/uploads/preolvidos-portada-1-300x249.jpg",
    pdfUrl: "https://olvidosdegranada.es/wp-content/uploads/OLVIDOS-DE-GRANADA-PRIMERA-EPOCA-1.pdf",
  },
  {
    number: -1,
    slug: "preolvidos-2",
    title: "Olvidos de Granada — Primera época (II)",
    coverImage: "https://olvidosdegranada.es/wp-content/uploads/preolvidos-portada-2-300x269.jpg",
    pdfUrl: "https://olvidosdegranada.es/wp-content/uploads/OLVIDOS-DE-GRANADA-PRIMERA-EPOCA-2.pdf",
  },
  // --- Números 1..17 ---
  { number: 1, slug: "olvidos-1", title: "Olvidos de Granada n.º 1", coverImage: "https://olvidosdegranada.es/wp-content/uploads/2020/11/olvidosdegranada1-212x300.jpg", pdfUrl: "https://olvidosdegranada.es/wp-content/uploads/olvidosdegranada1-ocr.pdf" },
  { number: 2, slug: "olvidos-2", title: "Olvidos de Granada n.º 2", coverImage: "https://olvidosdegranada.es/wp-content/uploads/2020/12/2-1-210x300.jpg", pdfUrl: "https://olvidosdegranada.es/wp-content/uploads/olvidosdegranada2-ocr.pdf" },
  { number: 3, slug: "olvidos-3", title: "Olvidos de Granada n.º 3", coverImage: "https://olvidosdegranada.es/wp-content/uploads/2020/12/3-1-210x300.jpg", pdfUrl: "https://olvidosdegranada.es/wp-content/uploads/olvidosdegranada03-ocr.pdf" },
  { number: 4, slug: "olvidos-4", title: "Olvidos de Granada n.º 4", coverImage: "https://olvidosdegranada.es/wp-content/uploads/2020/12/4-212x300.jpg", pdfUrl: "https://olvidosdegranada.es/wp-content/uploads/olvidosdegranada4-ocr.pdf" },
  { number: 5, slug: "olvidos-5", title: "Olvidos de Granada n.º 5", coverImage: "https://olvidosdegranada.es/wp-content/uploads/2020/12/5-212x300.jpg", pdfUrl: "https://olvidosdegranada.es/wp-content/uploads/olvidosdegranada5-ocr.pdf" },
  { number: 6, slug: "olvidos-6", title: "Olvidos de Granada n.º 6", coverImage: "https://olvidosdegranada.es/wp-content/uploads/2020/12/6-212x300.jpg", pdfUrl: "https://olvidosdegranada.es/wp-content/uploads/olvidosdegranada6-ocr.pdf" },
  { number: 7, slug: "olvidos-7-8", title: "Olvidos de Granada n.º 7-8", description: "Número doble", coverImage: "https://olvidosdegranada.es/wp-content/uploads/2020/12/7-8-212x300.jpg", pdfUrl: "https://olvidosdegranada.es/wp-content/uploads/olvidosdegranada7y8-ocr.pdf" },
  { number: 9, slug: "olvidos-9", title: "Olvidos de Granada n.º 9", coverImage: "https://olvidosdegranada.es/wp-content/uploads/2020/12/9-208x300.jpg", pdfUrl: "https://olvidosdegranada.es/wp-content/uploads/olvidosdegranada9-ocr.pdf" },
  { number: 10, slug: "olvidos-10", title: "Olvidos de Granada n.º 10", coverImage: "https://olvidosdegranada.es/wp-content/uploads/2020/12/10-212x300.jpg", pdfUrl: "https://olvidosdegranada.es/wp-content/uploads/olvidosdegranada10-ocr.pdf" },
  { number: 11, slug: "olvidos-11", title: "Olvidos de Granada n.º 11", coverImage: "https://olvidosdegranada.es/wp-content/uploads/2020/12/11-217x300.jpg", pdfUrl: "https://olvidosdegranada.es/wp-content/uploads/olvidosdegranada11-ocr.pdf" },
  { number: 12, slug: "olvidos-12", title: "Olvidos de Granada n.º 12", coverImage: "https://olvidosdegranada.es/wp-content/uploads/12-213x300.jpg", pdfUrl: "https://olvidosdegranada.es/wp-content/uploads/olvidosdegranada12-ocr.pdf" },
  { number: 13, slug: "olvidos-13", title: "Olvidos de Granada n.º 13", coverImage: "https://olvidosdegranada.es/wp-content/uploads/OLVIDOS-NUMERO-13-1-2-212x300.jpg", pdfUrl: "https://olvidosdegranada.es/wp-content/uploads/olvidosdegranada13-ocr.pdf" },
  { number: 14, slug: "olvidos-14", title: "Olvidos de Granada n.º 14", coverImage: "https://olvidosdegranada.es/wp-content/uploads/portada-14-288x300.jpg", pdfUrl: "https://olvidosdegranada.es/wp-content/uploads/olvidosdegranada14-ocr.pdf" },
  { number: 15, slug: "olvidos-15", title: "Olvidos de Granada n.º 15", coverImage: "https://olvidosdegranada.es/wp-content/uploads/PORTADA-15-300x291.jpg", pdfUrl: "https://olvidosdegranada.es/wp-content/uploads/olvidosdegranada15-ocr.pdf" },
  { number: 16, slug: "olvidos-16", title: "Olvidos de Granada n.º 16", coverImage: "https://olvidosdegranada.es/wp-content/uploads/portada-16-192x300.jpg", pdfUrl: "https://olvidosdegranada.es/wp-content/uploads/olvidos-de-granadaocr-16.pdf" },
  { number: 17, slug: "olvidos-17", title: "Olvidos de Granada n.º 17", coverImage: "https://olvidosdegranada.es/wp-content/uploads/portada-17-198x300.jpg", pdfUrl: "https://olvidosdegranada.es/wp-content/uploads/olvidos-de-granadaocr-17.pdf" },
  // --- Separatas y monográficos (100+) ---
  { number: 101, slug: "separata-fragmentos-1", title: "Separata · Fragmentos 1 (n.º 10)", coverImage: "https://olvidosdegranada.es/wp-content/uploads/portada-separata-fragmentos-1-285x300.jpg", pdfUrl: "https://olvidosdegranada.es/wp-content/uploads/separata_olvidos10-ocr-LGM.pdf" },
  { number: 102, slug: "separata-fragmentos-2", title: "Separata · Fragmentos 2 (n.º 11)", coverImage: "https://olvidosdegranada.es/wp-content/uploads/SEPARATA-FRAGMENTOS-2-NUM-11-214x300.jpg", pdfUrl: "https://olvidosdegranada.es/wp-content/uploads/SEPARATA-FRAGMENTOS-2-NUMERO-11.pdf" },
  { number: 103, slug: "separata-fragmentos-3", title: "Separata · Fragmentos 3 (n.º 12)", coverImage: "https://olvidosdegranada.es/wp-content/uploads/SEPARATA-FRAGMENTOS-3-NUM-12-196x300.jpg", pdfUrl: "https://olvidosdegranada.es/wp-content/uploads/SEPARATA-FRAGMENTOS-3-NUMERO-12.pdf" },
  { number: 104, slug: "separata-fragmentos-4", title: "Separata · Fragmentos 4 (n.º 14)", coverImage: "https://olvidosdegranada.es/wp-content/uploads/SEPARATA-FRAGMENTOS-4-NUMERO-14-1-183x300.jpg", pdfUrl: "https://olvidosdegranada.es/wp-content/uploads/SEPARATA-FRAGMENTOS-4-NUMERO-14.pdf" },
  { number: 105, slug: "separata-ineditos-del-50", title: "Separata · Inéditos del 50", coverImage: "https://olvidosdegranada.es/wp-content/uploads/SEPARATA-INEDITOS-DEL-50-1-218x300.jpg", pdfUrl: "https://olvidosdegranada.es/wp-content/uploads/SEPARATA-INEDITOS-DEL-50_.pdf" },
  { number: 106, slug: "separata-fragmentos-6", title: "Separata · Fragmentos 6 (n.º 16)", coverImage: "https://olvidosdegranada.es/wp-content/uploads/SEPARATA-FRAGMENTOS-6-NUM-16-212x300.jpg", pdfUrl: "https://olvidosdegranada.es/wp-content/uploads/SEPARATA-FRAGMENTOS-6-NUMERO-16.pdf" },
  { number: 107, slug: "separata-suena-una-musica", title: "Separata · Suena una música (n.º 14)", coverImage: "https://olvidosdegranada.es/wp-content/uploads/suena-jpg-1-300x291.jpg", pdfUrl: "https://olvidosdegranada.es/wp-content/uploads/SEPARATA-SUENA-UNA-MUSICA-NUMERO-14-2.pdf" },
  { number: 108, slug: "separata-te-golpeare-sin-colera", title: "Separata · Te golpearé sin cólera", coverImage: "https://olvidosdegranada.es/wp-content/uploads/sin-colera-1-298x300.jpg", pdfUrl: "https://olvidosdegranada.es/wp-content/uploads/te-golpeare-sin-colera.pdf.pdf" },
  { number: 109, slug: "separata-presenca", title: "Separata · Presença", coverImage: "https://olvidosdegranada.es/wp-content/uploads/presenca-225x300.jpg", pdfUrl: "https://olvidosdegranada.es/wp-content/uploads/presenca-ocr.pdf" },
];

// Fecha neutra dentro de la época impresa; solo satisface el filtro
// `publishedAt != null` de getAllIssues, no se muestra como año en la ficha.
const PUBLISHED_AT = new Date("1985-01-01T00:00:00.000Z");

async function main() {
  console.log(`📚 Sembrando ${ISSUES.length} números del archivo impreso...\n`);

  let created = 0;
  let updated = 0;

  for (const issue of ISSUES) {
    const existing = await db.magazineIssue.findUnique({
      where: { slug: issue.slug },
      select: { id: true },
    });

    await db.magazineIssue.upsert({
      where: { slug: issue.slug },
      update: {
        number: issue.number,
        title: issue.title,
        description: issue.description ?? null,
        coverImage: issue.coverImage,
        pdfUrl: issue.pdfUrl,
        status: ContentStatus.PUBLISHED,
        publishedAt: PUBLISHED_AT,
      },
      create: {
        number: issue.number,
        slug: issue.slug,
        title: issue.title,
        description: issue.description ?? null,
        coverImage: issue.coverImage,
        pdfUrl: issue.pdfUrl,
        // year es obligatorio en el schema; 0 = año desconocido (se oculta en UI).
        year: 0,
        status: ContentStatus.PUBLISHED,
        publishedAt: PUBLISHED_AT,
      },
    });

    if (existing) {
      updated++;
      console.log(`   ↻ ${issue.slug}`);
    } else {
      created++;
      console.log(`   ＋ ${issue.slug}`);
    }
  }

  console.log(`\n✅ Listo. Creados: ${created}, actualizados: ${updated}.`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Error sembrando el archivo:", err);
    process.exit(1);
  });
