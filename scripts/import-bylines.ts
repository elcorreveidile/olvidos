/**
 * Importa los autores reales de cada artículo. En WordPress la firma se guarda
 * en un campo que el tema pinta como <p class="autor"> en las páginas de sección
 * (no está en la API). Aquí raspamos esos archivos por categoría, mapeamos
 * slug → autor, y rellenamos Article.byline + Author + AuthorsOnArticles.
 *
 * Uso:  npx tsx --env-file=.env.local scripts/import-bylines.ts
 */

import { db } from "../src/lib/db";
import { slugifyName } from "../src/lib/colaboradores";

const BASE = "https://olvidosdegranada.es/index.php/category";
const CATEGORIES = [
  "editorial", "palabras", "piezas-procesos", "apostillas", "sonetos",
  "memoria-de-olvidos", "memoria-de-granada", "encuentros", "noticias",
];
const MAX_PAGES = 30;

function extractRows(html: string): { slug: string; autor: string }[] {
  const arts = html.split(/<article/).slice(1);
  const out: { slug: string; autor: string }[] = [];
  for (const a of arts) {
    const link = a.match(/class="entry-title"[^>]*>\s*<a[^>]*href="([^"]+)"/i);
    if (!link) continue;
    const slug = link[1].replace(/\/$/, "").split("/").pop() || "";
    const autores = [
      ...a.matchAll(/<p[^>]*class="[^"]*\bautor\b[^"]*"[^>]*>([\s\S]*?)<\/p>/gi),
    ]
      .map((m) =>
        m[1].replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim()
      )
      .filter(Boolean);
    if (slug) out.push({ slug, autor: autores[0] || "" });
  }
  return out;
}

const ROLE_PREFIX =
  /^\s*(textos?|autora?\s+del\s+texto|fotos?|fotograf[ií]as?|im[aá]genes?|archivo(\s+de\s+im[aá]genes)?|ilustraci[oó]n|dibujos?|selecci[oó]n|traducci[oó]n|montaje|v[ií]deo|dise[ñn]o)\s*[:.\-–—]\s*/i;
const ROLE_WORD =
  /^(textos?|autora?(\s+del\s+texto)?|fotos?|fotograf[ií]as?|im[aá]genes?|archivo(\s+de\s+im[aá]genes)?|ilustraci[oó]n|dibujos?|selecci[oó]n|traducci[oó]n|edici[oó]n|coordinaci[oó]n|montaje|v[ií]deo|dise[ñn]o)$/i;

/** Separa una firma en nombres individuales, descartando etiquetas de rol. */
function parseNames(byline: string): string[] {
  const s = byline.replace(
    /\.?\s*(coordinaci[oó]n|edici[oó]n|traducci[oó]n)\s*:.*/i,
    ""
  );
  return s
    .split(/\s*[/,·]\s*|\s+y\s+|\s+e\s+/)
    .map((x) =>
      x
        .replace(ROLE_PREFIX, "")
        .replace(/^[\s.:\-–—]+|[\s.:\-–—]+$/g, "")
        .trim()
    )
    .filter(
      (x) => x.length > 1 && /[a-záéíóúñ]/i.test(x) && !ROLE_WORD.test(x)
    );
}

async function main() {
  // 1) Raspar slug → autor de todas las secciones (dedup por slug).
  const bySlug = new Map<string, string>();
  for (const cat of CATEGORIES) {
    for (let page = 1; page <= MAX_PAGES; page++) {
      const url = page === 1 ? `${BASE}/${cat}/` : `${BASE}/${cat}/page/${page}/`;
      const res = await fetch(url);
      if (!res.ok) break;
      const rows = extractRows(await res.text());
      if (rows.length === 0) break;
      for (const r of rows) {
        if (r.autor && !bySlug.has(r.slug)) bySlug.set(r.slug, r.autor);
      }
      if (rows.length < 10) break; // última página
    }
    console.log(`   ${cat}: acumulado ${bySlug.size} firmas`);
  }
  console.log(`\nTotal de firmas raspadas: ${bySlug.size}`);

  // 2) Aplicar a cada artículo por slug.
  let updated = 0;
  let noMatch = 0;
  const authorCache = new Map<string, string>(); // slug -> Author.id

  for (const [slug, byline] of bySlug) {
    const article = await db.article.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (!article) {
      noMatch++;
      continue;
    }

    await db.article.update({ where: { id: article.id }, data: { byline } });

    // Autores individuales → Author + AuthorsOnArticles.
    const names = parseNames(byline);
    const authorIds: string[] = [];
    for (const name of names) {
      const aslug = slugifyName(name);
      if (!aslug) continue;
      let id = authorCache.get(aslug);
      if (!id) {
        const row = await db.author.upsert({
          where: { slug: aslug },
          update: { name },
          create: { name, slug: aslug },
        });
        id = row.id;
        authorCache.set(aslug, id);
      }
      if (!authorIds.includes(id)) authorIds.push(id);
    }

    await db.authorsOnArticles.deleteMany({ where: { articleId: article.id } });
    if (authorIds.length) {
      await db.authorsOnArticles.createMany({
        data: authorIds.map((authorId, i) => ({
          articleId: article.id,
          authorId,
          order: i,
        })),
        skipDuplicates: true,
      });
    }
    updated++;
  }

  // Limpia autores que quedaron sin ningún artículo (artefactos de parseos previos).
  const huerfanos = await db.author.deleteMany({
    where: { articles: { none: {} } },
  });

  console.log(
    `\n✅ Firmas aplicadas: ${updated}. Sin coincidencia de slug: ${noMatch}. Autores únicos: ${authorCache.size}. Huérfanos eliminados: ${huerfanos.count}.`
  );
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Error importando firmas:", err);
    process.exit(1);
  });
