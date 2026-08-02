/**
 * Migración de artículos desde el WordPress actual (olvidosdegranada.es)
 * a la nueva web, usando la API REST de WordPress.
 *
 * - Idempotente: upsert por Article.wpId (se puede re-ejecutar sin duplicar).
 * - Conserva slugs (SEO), fechas reales, categorías, etiquetas y autor.
 * - Imágenes: se mantienen apuntando a olvidosdegranada.es (puente).
 *
 * Uso:  npx tsx scripts/migrate-wordpress.ts
 */

import { db } from "../src/lib/db";
import { ContentStatus } from "@prisma/client";

const WP = "https://olvidosdegranada.es/wp-json/wp/v2";
const PER_PAGE = 100;
// Categorías residuales de WP que no queremos arrastrar como sección.
const SKIP_CATEGORY_SLUGS = new Set(["uncategorized"]);

// Artículos a importar como ARCHIVADOS (despublicados) — curación editorial.
const ARCHIVE_SLUGS = new Set([
  "dia-mundial-de-la-poesia-en-granada-2017",
  "dia-mundial-de-la-poesia-en-granada-2018",
]);

// Recategorización en la importación: slug → cambiar una categoría por otra.
const RECATEGORIZE: Record<string, { from: string; to: string }> = {
  "entrevista-a-di-tella": { from: "encuentros", to: "palabras" },
};

// Introducciones que en el WordPress original están en el tema (no en la API),
// copiadas a mano del sitio actual. Tienen prioridad sobre la descripción REST.
const MANUAL_CATEGORY_DESCRIPTIONS: Record<string, string> = {
  "memoria-de-olvidos":
    "A partir del año 1984 se comenzó a publicar la revista Olvidos de Granada, en la imprenta de la Diputación Provincial. Treinta años después, reeditamos digitalmente aquella publicación. Cada Olvidos de Granada será comentado por uno de los colaboradores de olvidos.es donde confrontaremos el pasado de la ciudad, el presente, y el futuro que esperamos.",
};

type WpTerm = { id: number; slug: string; name: string; description?: string };
type WpPost = {
  id: number;
  slug: string;
  date_gmt: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  author: number;
  categories: number[];
  tags: number[];
  _embedded?: {
    author?: { name?: string }[];
    "wp:featuredmedia"?: { source_url?: string }[];
  };
};

function decodeEntities(s: string): string {
  return s
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&hellip;/g, "…")
    .replace(/&laquo;/g, "«")
    .replace(/&raquo;/g, "»")
    .replace(/&ldquo;/g, "“")
    .replace(/&rdquo;/g, "”")
    .replace(/&lsquo;/g, "‘")
    .replace(/&rsquo;/g, "’")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–");
}

function toText(html: string): string {
  return decodeEntities(html.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
}

async function fetchAllTerms(kind: "categories" | "tags"): Promise<WpTerm[]> {
  const out: WpTerm[] = [];
  for (let page = 1; ; page++) {
    const res = await fetch(`${WP}/${kind}?per_page=${PER_PAGE}&page=${page}`);
    if (!res.ok) break;
    const batch = (await res.json()) as WpTerm[];
    out.push(...batch);
    const totalPages = Number(res.headers.get("x-wp-totalpages") || "1");
    if (page >= totalPages) break;
  }
  return out;
}

async function main() {
  console.log("🔄 Migración WordPress → Olvidos\n");

  // 1) Categorías: upsert y mapa wpId -> {dbId, slug}
  const wpCategories = await fetchAllTerms("categories");
  const catMap = new Map<number, { id: string; slug: string }>();
  for (const c of wpCategories) {
    if (SKIP_CATEGORY_SLUGS.has(c.slug)) continue;
    const name = decodeEntities(c.name);
    const description =
      MANUAL_CATEGORY_DESCRIPTIONS[c.slug] ??
      (c.description ? toText(c.description) || null : null);
    // Upsert por NOMBRE (único y estable): si el seed ya creó la categoría con
    // otro slug, reaprovechamos la fila y le fijamos el slug de WordPress.
    const row = await db.category.upsert({
      where: { name },
      update: { slug: c.slug, description },
      create: { name, slug: c.slug, description },
    });
    catMap.set(c.id, { id: row.id, slug: c.slug });
  }
  console.log(`   Categorías: ${catMap.size}`);

  // 2) Etiquetas: upsert y mapa wpId -> dbId
  const wpTags = await fetchAllTerms("tags");
  const tagMap = new Map<number, string>();
  for (const t of wpTags) {
    const name = decodeEntities(t.name);
    const row = await db.tag.upsert({
      where: { name },
      update: { slug: t.slug },
      create: { name, slug: t.slug },
    });
    tagMap.set(t.id, row.id);
  }
  console.log(`   Etiquetas: ${tagMap.size}`);

  // 3) Autores: se crean bajo demanda (upsert por email sintético)
  const authorCache = new Map<number, string>();
  async function resolveAuthor(wpId: number, name?: string): Promise<string> {
    const cached = authorCache.get(wpId);
    if (cached) return cached;
    const email = `wp-author-${wpId}@import.olvidos.es`;
    const displayName =
      !name || name.toLowerCase() === "admin"
        ? "Redacción Olvidos"
        : decodeEntities(name);
    const user = await db.user.upsert({
      where: { email },
      update: { name: displayName },
      create: { email, name: displayName, role: "USER" },
    });
    authorCache.set(wpId, user.id);
    return user.id;
  }

  // 4) Artículos: paginar y upsert por wpId
  let created = 0;
  let updated = 0;
  let totalPages = 1;

  for (let page = 1; page <= totalPages; page++) {
    const res = await fetch(
      `${WP}/posts?per_page=${PER_PAGE}&page=${page}&_embed=author,wp:featuredmedia`
    );
    if (!res.ok) {
      console.error(`   ⚠ Página ${page} devolvió ${res.status}`);
      break;
    }
    totalPages = Number(res.headers.get("x-wp-totalpages") || "1");
    const posts = (await res.json()) as WpPost[];

    for (const p of posts) {
      const authorId = await resolveAuthor(p.author, p._embedded?.author?.[0]?.name);
      const cover = p._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? null;
      const excerpt = toText(p.excerpt.rendered).slice(0, 400) || null;

      const existing = await db.article.findUnique({
        where: { wpId: p.id },
        select: { id: true },
      });

      const data = {
        // toText limpia etiquetas HTML (p. ej. <br>) además de decodificar entidades
        title: toText(p.title.rendered) || `Artículo ${p.id}`,
        excerpt,
        content: p.content.rendered,
        coverImage: cover,
        status: ARCHIVE_SLUGS.has(p.slug)
          ? ContentStatus.ARCHIVED
          : ContentStatus.PUBLISHED,
        publishedAt: new Date(p.date_gmt),
        authorId,
      };

      const article = existing
        ? await db.article.update({ where: { wpId: p.id }, data })
        : await db.article.create({
            data: { ...data, slug: p.slug, wpId: p.id },
          });

      // Sincroniza categorías y etiquetas (borra y recrea, idempotente)
      const categoryIds = p.categories
        .map((id) => catMap.get(id)?.id)
        .filter((x): x is string => Boolean(x));
      const remap = RECATEGORIZE[p.slug];
      if (remap) {
        const fromId = [...catMap.values()].find((c) => c.slug === remap.from)?.id;
        const toId = [...catMap.values()].find((c) => c.slug === remap.to)?.id;
        const kept = categoryIds.filter((id) => id !== fromId);
        if (toId && !kept.includes(toId)) kept.push(toId);
        categoryIds.length = 0;
        categoryIds.push(...kept);
      }
      const tagIds = p.tags
        .map((id) => tagMap.get(id))
        .filter((x): x is string => Boolean(x));

      await db.categoriesOnArticles.deleteMany({ where: { articleId: article.id } });
      if (categoryIds.length) {
        await db.categoriesOnArticles.createMany({
          data: categoryIds.map((categoryId) => ({ articleId: article.id, categoryId })),
          skipDuplicates: true,
        });
      }
      await db.tagsOnArticles.deleteMany({ where: { articleId: article.id } });
      if (tagIds.length) {
        await db.tagsOnArticles.createMany({
          data: tagIds.map((tagId) => ({ articleId: article.id, tagId })),
          skipDuplicates: true,
        });
      }

      if (existing) updated++;
      else created++;
    }
    console.log(`   Página ${page}/${totalPages} — acumulado: ${created + updated}`);
  }

  console.log(`\n✅ Hecho. Artículos creados: ${created}, actualizados: ${updated}.`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Error en la migración:", err);
    process.exit(1);
  });
