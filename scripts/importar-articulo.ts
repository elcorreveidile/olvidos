/**
 * Importa (crea o actualiza) un artículo en la base de datos a partir de una
 * ficha JSON y de un fichero HTML con el cuerpo. Pensado para textos que no
 * entran por el panel: la sección «La espuma de los días», los escaneos de los
 * PDF antiguos, etc. Los borradores no se suben al repositorio: la ficha y el
 * HTML viven fuera de él.
 *
 *   node --env-file=.env.local node_modules/.bin/tsx scripts/importar-articulo.ts <ficha.json> [--aplicar]
 *
 * Sin `--aplicar` solo informa de lo que haría. La ficha:
 *
 *   {
 *     "slug": "desconecte-y-vuelva-a-conectar",
 *     "title": "«Desconecte y vuelva a conectar»",
 *     "excerpt": "Lo que el reglamento ferroviario…",         // opcional
 *     "byline": "Olvidos",                                     // firma; opcional
 *     "html": "desconecte.html",                               // ruta relativa a la ficha
 *     "categorias": [                                          // por slug; crea las que falten
 *       { "slug": "editorial" },
 *       { "slug": "la-espuma-de-los-dias", "name": "La espuma de los días",
 *         "description": "…", "parentSlug": "editorial" }
 *     ],
 *     "etiquetas": ["Ferrocarril"],                            // opcional; crea las que falten
 *     "fecha": "2026-10-30",                                   // publishedAt; opcional
 *     "estado": "DRAFT",                                       // DRAFT (defecto) | PUBLISHED | REVIEW
 *     "autorEmail": "informa@blablaele.com",                   // usuario que figura como Article.author
 *     "coverImage": "https://…",                               // opcional
 *     "metaTitle": "…", "metaDescription": "…"                 // opcionales
 *   }
 *
 * Si el artículo ya existe (mismo slug) se actualizan texto, metadatos,
 * categorías, etiquetas y firma; el estado solo cambia si la ficha lo indica
 * explícitamente y nunca se degrada un artículo publicado a borrador.
 * Lo que escriba tarda hasta 5 minutos en verse en la web (Data Cache).
 */
import fs from "node:fs";
import path from "node:path";
import { ContentStatus, PrismaClient } from "@prisma/client";
import { sanitizeArticleHtml } from "../src/lib/sanitize-html";
import { hasVisibleContent } from "../src/lib/article-content";
import { syncArticleAuthors } from "../src/lib/article-authors";
import { slugifyName } from "../src/lib/colaboradores";

interface FichaCategoria {
  slug: string;
  name?: string;
  description?: string;
  parentSlug?: string;
}

interface Ficha {
  slug: string;
  title: string;
  excerpt?: string;
  byline?: string;
  html: string;
  categorias?: FichaCategoria[];
  etiquetas?: string[];
  fecha?: string;
  estado?: keyof typeof ContentStatus;
  autorEmail: string;
  coverImage?: string;
  coverCredit?: string;
  metaTitle?: string;
  metaDescription?: string;
}

const args = process.argv.slice(2);
const APLICAR = args.includes("--aplicar");
const fichaPath = args.find((a) => !a.startsWith("--"));

if (!fichaPath) {
  console.error("Uso: tsx scripts/importar-articulo.ts <ficha.json> [--aplicar]");
  process.exit(1);
}

function leerFicha(file: string): Ficha {
  const ficha = JSON.parse(fs.readFileSync(file, "utf8")) as Ficha;
  const faltan = (["slug", "title", "html", "autorEmail"] as const).filter((k) => !ficha[k]);
  if (faltan.length) throw new Error(`La ficha no tiene: ${faltan.join(", ")}`);
  if (!/^[a-z0-9-]+$/.test(ficha.slug)) throw new Error(`Slug no válido: ${ficha.slug}`);
  if (ficha.estado && !(ficha.estado in ContentStatus)) throw new Error(`Estado no válido: ${ficha.estado}`);
  if (ficha.fecha && Number.isNaN(new Date(ficha.fecha).getTime())) throw new Error(`Fecha no válida: ${ficha.fecha}`);
  return ficha;
}

async function main() {
  const fichaFile = path.resolve(fichaPath!);
  const ficha = leerFicha(fichaFile);
  const htmlFile = path.resolve(path.dirname(fichaFile), ficha.html);
  const bruto = fs.readFileSync(htmlFile, "utf8");
  const content = sanitizeArticleHtml(bruto);
  if (!hasVisibleContent(content)) throw new Error(`El HTML de ${htmlFile} no tiene contenido visible`);

  const db = new PrismaClient();
  try {
    const autor = await db.user.findUnique({ where: { email: ficha.autorEmail }, select: { id: true, name: true } });
    if (!autor) throw new Error(`No existe el usuario ${ficha.autorEmail}`);

    const existente = await db.article.findUnique({
      where: { slug: ficha.slug },
      select: { id: true, status: true, publishedAt: true, title: true },
    });

    // Estado: el de la ficha (nunca degradar PUBLISHED), el existente, o DRAFT.
    let status: ContentStatus = existente?.status ?? ContentStatus.DRAFT;
    if (ficha.estado) {
      status = existente?.status === ContentStatus.PUBLISHED ? ContentStatus.PUBLISHED : ContentStatus[ficha.estado];
    }
    let publishedAt: Date | null = existente?.publishedAt ?? null;
    if (ficha.fecha) publishedAt = new Date(ficha.fecha);
    else if (status === ContentStatus.PUBLISHED && !publishedAt) publishedAt = new Date();

    const categorias = ficha.categorias ?? [];
    const slugsCat = categorias.map((c) => c.slug);
    const catExistentes = await db.category.findMany({
      where: { slug: { in: [...slugsCat, ...categorias.map((c) => c.parentSlug).filter((s): s is string => Boolean(s))] } },
      select: { id: true, slug: true, name: true },
    });
    const porSlug = new Map(catExistentes.map((c) => [c.slug, c]));
    const aCrear = categorias.filter((c) => !porSlug.has(c.slug));
    for (const c of aCrear) {
      if (!c.name) throw new Error(`La categoría «${c.slug}» no existe y la ficha no trae su nombre para crearla`);
      if (c.parentSlug && !porSlug.has(c.parentSlug) && !aCrear.some((x) => x.slug === c.parentSlug)) {
        throw new Error(`La categoría padre «${c.parentSlug}» de «${c.slug}» no existe`);
      }
    }

    const etiquetas = (ficha.etiquetas ?? []).map((n) => n.trim()).filter(Boolean);

    console.log(`${APLICAR ? "Importando" : "En seco (sin --aplicar), haría"}:`);
    console.log(`  ${existente ? "Actualizar" : "Crear"} /articulos/${ficha.slug} — «${ficha.title}»`);
    console.log(`  Estado: ${status}${existente ? ` (antes ${existente.status})` : ""}; fecha: ${publishedAt ? publishedAt.toISOString().slice(0, 10) : "—"}`);
    console.log(`  Autor (usuario): ${autor.name ?? ficha.autorEmail}; firma: ${ficha.byline ?? "—"}`);
    console.log(`  Cuerpo: ${bruto.length} caracteres (${content.length} tras sanitizar)`);
    console.log(`  Categorías: ${slugsCat.join(", ") || "—"}${aCrear.length ? ` (se crean: ${aCrear.map((c) => `${c.slug}${c.parentSlug ? ` dentro de ${c.parentSlug}` : ""}`).join(", ")})` : ""}`);
    console.log(`  Etiquetas: ${etiquetas.join(", ") || "—"}`);
    if (!APLICAR) return;

    for (const c of aCrear) {
      const creada = await db.category.create({
        data: {
          name: c.name!,
          slug: c.slug,
          description: c.description ?? null,
          parentId: c.parentSlug ? porSlug.get(c.parentSlug)?.id ?? null : null,
        },
        select: { id: true, slug: true, name: true },
      });
      porSlug.set(creada.slug, creada);
    }

    const data = {
      title: ficha.title,
      excerpt: ficha.excerpt ?? null,
      content,
      byline: ficha.byline?.trim() || null,
      coverImage: ficha.coverImage ?? null,
      coverCredit: ficha.coverCredit ?? null,
      metaTitle: ficha.metaTitle ?? null,
      metaDescription: ficha.metaDescription ?? null,
      status,
      publishedAt,
      authorId: autor.id,
    };
    const article = existente
      ? await db.article.update({ where: { id: existente.id }, data })
      : await db.article.create({ data: { ...data, slug: ficha.slug } });

    await db.categoriesOnArticles.deleteMany({ where: { articleId: article.id } });
    const categoryIds = slugsCat.map((s) => porSlug.get(s)!.id);
    if (categoryIds.length) {
      await db.categoriesOnArticles.createMany({
        data: categoryIds.map((categoryId) => ({ articleId: article.id, categoryId })),
        skipDuplicates: true,
      });
    }

    await db.tagsOnArticles.deleteMany({ where: { articleId: article.id } });
    for (const name of etiquetas) {
      const slug = slugifyName(name);
      const tag = await db.tag.upsert({ where: { slug }, create: { name, slug }, update: {} });
      await db.tagsOnArticles.create({ data: { articleId: article.id, tagId: tag.id } });
    }

    await syncArticleAuthors(article.id, ficha.byline, db);

    console.log(`✓ Artículo ${existente ? "actualizado" : "creado"} (${status}).`);
    if (status !== ContentStatus.PUBLISHED) console.log("  Revísalo y publícalo desde /admin/articulos.");
    console.log("  La web tarda hasta 5 minutos en reflejar los cambios (o guarda el artículo desde el panel).");
  } finally {
    await db.$disconnect();
  }
}

main().catch((e) => {
  console.error("Error:", e instanceof Error ? e.message : e);
  process.exit(1);
});
