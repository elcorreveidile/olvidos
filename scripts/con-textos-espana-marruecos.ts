/**
 * Publica (o actualiza) en la base de datos el especial «Con-textos»
 * «Ceuta no empezó en julio. España y Marruecos, 1859-2026» a partir de los
 * ficheros del repositorio (src/content/con-textos/espana-marruecos/*.html)
 * y de los datos tipados (src/data/con-textos/espana-marruecos/).
 *
 *   npx tsx --env-file=.env.local scripts/con-textos-espana-marruecos.ts [opciones]
 *
 * Opciones:
 *   --dry-run       Compone y valida sin tocar la base de datos.
 *   --publish       Deja el artículo en PUBLISHED (por defecto queda en DRAFT
 *                   si no existía; si ya estaba publicado NUNCA se degrada).
 *   --sync-titles   Escribe los títulos de los pasos en src/data/pasos-titles.json.
 *   --strict        Falla si la composición tiene avisos (no solo errores).
 *   --verbose       Imprime los bytes de datos de cada isla, no solo por paso.
 *
 * Variables opcionales:
 *   CON_TEXTOS_USER_EMAIL  Usuario propietario (Article.authorId); si no, el
 *                          primer ADMIN.
 */
import fs from "node:fs";
import path from "node:path";
import { compose, ESPECIAL_META } from "../src/lib/con-textos/espana-marruecos/compose";
import { ESPECIALES } from "../src/lib/con-textos/especiales";
import { slugifyName } from "../src/lib/colaboradores";
import { slugify } from "../src/lib/utils";

const args = new Set(process.argv.slice(2));
const DRY = args.has("--dry-run");
const PUBLISH = args.has("--publish");
const SYNC_TITLES = args.has("--sync-titles");
const STRICT = args.has("--strict");
const VERBOSE = args.has("--verbose");

function syncTitles(slug: string, titles: string[]) {
  const file = path.join(process.cwd(), "src", "data", "pasos-titles.json");
  const json = JSON.parse(fs.readFileSync(file, "utf8")) as Record<string, string[]>;
  const same = JSON.stringify(json[slug] ?? []) === JSON.stringify(titles);
  if (same) return false;
  json[slug] = titles;
  fs.writeFileSync(file, JSON.stringify(json, null, 2) + "\n");
  return true;
}

async function main() {
  console.log(`▶ Componiendo «${ESPECIAL_META.title}»…`);
  const c = compose({ strict: true });
  for (const p of c.pasos) {
    console.log(`  ${String(p.n).padStart(2)}. ${p.id.padEnd(26)} ${String(p.islas.length).padStart(2)} islas · ${String(p.cited.length).padStart(2)} citas · ${String(Math.round(p.bytes / 1024)).padStart(4)} KB`);
    if (VERBOSE) for (const i of p.islaBytes) console.log(`        ${String(Math.round(i.bytes / 1024)).padStart(4)} KB  ${i.raw}`);
  }
  for (const w of c.warnings) console.log(`  ${w.level === "error" ? "✗" : "⚠"} ${w.paso ? `[${w.paso}] ` : ""}${w.message}`);
  if (STRICT && c.warnings.length) throw new Error("Hay avisos y se ha pedido --strict.");
  console.log(`  HTML: ${Math.round(c.html.length / 1024)} KB · datos de islas: ${Math.round(c.pasos.reduce((s, p) => s + p.bytes, 0) / 1024)} KB`);

  // Títulos de los pasos (los usa la web para el menú de pasos).
  const titlesFile = path.join(process.cwd(), "src", "data", "pasos-titles.json");
  const current = (JSON.parse(fs.readFileSync(titlesFile, "utf8")) as Record<string, string[]>)[ESPECIAL_META.slug] ?? [];
  if (JSON.stringify(current) !== JSON.stringify(c.titles)) {
    if (SYNC_TITLES) {
      syncTitles(ESPECIAL_META.slug, c.titles);
      console.log("  ✓ src/data/pasos-titles.json actualizado (recuerda hacer commit).");
    } else {
      console.log("  ⚠ src/data/pasos-titles.json no coincide con los títulos de los pasos: ejecuta con --sync-titles.");
    }
  }

  if (DRY) {
    console.log("▶ --dry-run: no se escribe en la base de datos.");
    return;
  }

  const { db } = await import("../src/lib/db");
  try {
    // Usuario propietario del artículo.
    const email = process.env.CON_TEXTOS_USER_EMAIL;
    const owner = email
      ? await db.user.findUnique({ where: { email }, select: { id: true, name: true } })
      : await db.user.findFirst({ where: { role: "ADMIN" }, orderBy: { createdAt: "asc" }, select: { id: true, name: true } });
    if (!owner) throw new Error(email ? `No existe el usuario ${email}` : "No hay ningún usuario ADMIN.");

    // Categoría «Con-textos» (upsert por nombre, como en la migración).
    const cat = await db.category.upsert({
      where: { name: ESPECIAL_META.category.name },
      update: { slug: ESPECIAL_META.category.slug, description: ESPECIAL_META.category.description },
      create: { name: ESPECIAL_META.category.name, slug: ESPECIAL_META.category.slug, description: ESPECIAL_META.category.description },
    });

    // Etiquetas.
    const tagIds: string[] = [];
    for (const name of ESPECIAL_META.tags) {
      const t = await db.tag.upsert({ where: { name }, update: {}, create: { name, slug: slugify(name) } });
      tagIds.push(t.id);
    }

    // Autor (firma enlazada).
    const authorSlug = slugifyName(ESPECIAL_META.byline);
    const author = await db.author.upsert({
      where: { slug: authorSlug },
      update: { name: ESPECIAL_META.byline },
      create: { name: ESPECIAL_META.byline, slug: authorSlug },
    });

    // Portada.
    const data = ESPECIALES[ESPECIAL_META.id].data();
    const cover = data.IMAGES.find((i) => i.id === ESPECIAL_META.coverImageId);
    if (!cover) throw new Error(`No existe la imagen de portada ${ESPECIAL_META.coverImageId}`);

    const existing = await db.article.findUnique({ where: { slug: ESPECIAL_META.slug }, select: { id: true, status: true, publishedAt: true } });
    const wasPublished = existing?.status === "PUBLISHED";
    const status = PUBLISH || wasPublished ? "PUBLISHED" : "DRAFT";
    const publishedAt = status === "PUBLISHED" ? (existing?.publishedAt ?? new Date()) : null;

    const common = {
      title: ESPECIAL_META.title,
      excerpt: ESPECIAL_META.excerpt,
      content: c.html,
      byline: ESPECIAL_META.byline,
      metaTitle: ESPECIAL_META.metaTitle,
      metaDescription: ESPECIAL_META.metaDescription,
      coverImage: cover.src,
      coverCredit: `${cover.credit} · ${cover.license}`,
      coverPosition: "center",
      status,
      publishedAt,
    } as const;

    const article = await db.article.upsert({
      where: { slug: ESPECIAL_META.slug },
      update: common,
      create: { ...common, slug: ESPECIAL_META.slug, authorId: owner.id, featured: false, membersOnly: false },
    });

    await db.categoriesOnArticles.deleteMany({ where: { articleId: article.id } });
    await db.categoriesOnArticles.create({ data: { articleId: article.id, categoryId: cat.id } });
    await db.tagsOnArticles.deleteMany({ where: { articleId: article.id } });
    await db.tagsOnArticles.createMany({ data: tagIds.map((tagId) => ({ articleId: article.id, tagId })), skipDuplicates: true });
    await db.authorsOnArticles.deleteMany({ where: { articleId: article.id } });
    await db.authorsOnArticles.create({ data: { articleId: article.id, authorId: author.id, order: 1 } });

    console.log(`✓ Artículo ${existing ? "actualizado" : "creado"}: /articulos/${ESPECIAL_META.slug} (${status}${wasPublished && !PUBLISH ? ", ya estaba publicado" : ""}).`);
    console.log(`  Categoría: ${cat.name} (/articulos?categoria=${cat.slug}) · etiquetas: ${ESPECIAL_META.tags.join(", ")} · firma: ${author.name}`);
    if (status === "DRAFT") console.log("  Publícalo desde el panel de administración o vuelve a ejecutar con --publish.");
  } finally {
    await db.$disconnect();
  }
}

main().catch((e) => {
  console.error("✗", e instanceof Error ? e.message : e);
  process.exit(1);
});
