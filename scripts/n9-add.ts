/**
 * Utilidad reutilizable para ir transcribiendo artículos del nº9: crea el Author
 * (firma), el Article (PUBLISHED, enlazado al nº9) y el enlace autor-artículo.
 * Cada lote importa `addArticle` y pasa sus artículos.
 */
import { db } from "../src/lib/db";
import { slugifyName } from "../src/lib/colaboradores";

export type NuevoArticulo = {
  title: string;
  slug: string;
  byline: string;
  pages: string;
  excerpt: string;
  paragraphs: string[];
};

export async function addArticle(a: NuevoArticulo, issueNumber = 9) {
  const issue = await db.magazineIssue.findFirst({
    where: { number: issueNumber },
    select: { id: true, publishedAt: true },
  });
  if (!issue) throw new Error(`No existe el nº${issueNumber}`);
  const admin = await db.user.findFirst({ where: { role: "ADMIN" }, select: { id: true } });

  const authorSlug = slugifyName(a.byline);
  const author = await db.author.upsert({
    where: { slug: authorSlug },
    update: { name: a.byline },
    create: { name: a.byline, slug: authorSlug },
  });

  const content = a.paragraphs.map((p) => `<p>${p}</p>`).join("\n");

  const article = await db.article.upsert({
    where: { slug: a.slug },
    update: { content, status: "PUBLISHED", byline: a.byline, excerpt: a.excerpt, pages: a.pages },
    create: {
      title: a.title,
      slug: a.slug,
      excerpt: a.excerpt,
      content,
      byline: a.byline,
      status: "PUBLISHED",
      issueId: issue.id,
      authorId: admin?.id ?? "",
      pages: a.pages,
      publishedAt: issue.publishedAt ?? new Date("1986-01-01T00:00:00Z"),
    },
  });

  await db.authorsOnArticles.deleteMany({ where: { articleId: article.id } });
  await db.authorsOnArticles.create({
    data: { articleId: article.id, authorId: author.id, order: 0 },
  });

  console.log(`✓ ${a.title} — ${a.byline} (págs. ${a.pages})`);
}
