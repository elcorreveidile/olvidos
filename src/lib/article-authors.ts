import type { PrismaClient } from "@prisma/client";
import { db } from "./db";
import { slugifyName } from "./colaboradores";

/**
 * Firmas de los artículos: la tabla `Author` (lo que se muestra y enlaza en la
 * web) se sincroniza a partir de la firma escrita (`Article.byline`). Lo usan
 * las acciones del panel y `scripts/importar-articulo.ts`.
 */

/** Separa una firma ("A · B", "A y B", "A, B") en nombres de autor. */
export function parseAuthorNames(byline?: string | null): string[] {
  if (!byline) return [];
  return byline
    .split(/·|,| y | & |;/i)
    .map((s) => s.trim())
    .filter((s) => s.length > 1);
}

/**
 * Sincroniza los autores enlazados (tabla Author) de un artículo a partir de la
 * firma escrita en el editor. Así el autor real se muestra y enlaza en la web
 * (que usa `authors`), en vez del usuario que publicó.
 */
export async function syncArticleAuthors(
  articleId: string,
  byline?: string | null,
  client: PrismaClient = db
) {
  const names = parseAuthorNames(byline);
  await client.authorsOnArticles.deleteMany({ where: { articleId } });
  let order = 0;
  for (const name of names) {
    const slug = slugifyName(name);
    if (!slug) continue;
    const author = await client.author.upsert({
      where: { slug },
      create: { name, slug },
      update: {},
    });
    await client.authorsOnArticles.create({
      data: { articleId, authorId: author.id, order: order++ },
    });
  }
}
