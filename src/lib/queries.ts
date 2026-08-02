import { db } from "@/lib/db";
import type {
  ArticleSummary,
  ArticleFull,
  MagazineIssueSummary,
} from "@/types/content";
import { ContentStatus, EventStatus } from "@prisma/client";

/**
 * Obtiene artículos publicados con paginación
 * @param page - Número de página (empezando desde 1)
 * @param limit - Cantidad de artículos por página
 */
export async function getPublishedArticles(
  page: number = 1,
  limit: number = 12
): Promise<{ articles: ArticleSummary[]; total: number; totalPages: number }> {
  const skip = (page - 1) * limit;

  const [articles, total] = await Promise.all([
    db.article.findMany({
      where: { status: ContentStatus.PUBLISHED },
      skip,
      take: limit,
      orderBy: { publishedAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        coverPosition: true,
        publishedAt: true,
        author: {
          select: { name: true },
        },
        byline: true,
        authors: {
          orderBy: { order: "asc" },
          select: { author: { select: { name: true, slug: true } } },
        },
        categories: {
          select: {
            category: {
              select: { name: true, slug: true },
            },
          },
        },
      },
    }),
    db.article.count({ where: { status: ContentStatus.PUBLISHED } }),
  ]);

  return {
    articles,
    total,
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * Obtiene artículos destacados (limitado a 3)
 */
export async function getFeaturedArticles(): Promise<ArticleSummary[]> {
  return db.article.findMany({
    where: {
      status: ContentStatus.PUBLISHED,
      featured: true,
    },
    take: 3,
    orderBy: { publishedAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      coverImage: true,
      coverPosition: true,
      publishedAt: true,
      author: {
        select: { name: true },
      },
      categories: {
        select: {
          category: {
            select: { name: true, slug: true },
          },
        },
      },
    },
  });
}

/**
 * Obtiene próximos eventos publicados
 */
export async function getUpcomingEvents(limit: number = 5) {
  const now = new Date();

  return db.event.findMany({
    where: {
      status: EventStatus.PUBLISHED,
      startDate: { gte: now },
    },
    take: limit,
    orderBy: { startDate: "asc" },
    select: {
      id: true,
      title: true,
      slug: true,
      shortDesc: true,
      location: true,
      address: true,
      startDate: true,
      endDate: true,
      eventType: true,
    },
  });
}

/**
 * Obtiene un artículo completo por su slug
 * @param slug - Slug del artículo
 */
export async function getArticleBySlug(
  slug: string
): Promise<ArticleFull | null> {
  return db.article.findUnique({
    where: { slug },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      coverImage: true,
      coverPosition: true,
      publishedAt: true,
      content: true,
      featured: true,
      membersOnly: true,
      metaTitle: true,
      metaDescription: true,
      author: {
        select: { name: true },
      },
      categories: {
        select: {
          category: {
            select: { name: true, slug: true },
          },
        },
      },
      tags: {
        select: {
          tag: {
            select: { name: true, slug: true },
          },
        },
      },
      issue: {
        select: {
          number: true,
          title: true,
          slug: true,
        },
      },
    },
  });
}

/**
 * Obtiene una categoría por su slug con sus artículos
 * @param slug - Slug de la categoría
 */
export async function getCategoryBySlug(slug: string) {
  return db.category.findUnique({
    where: { slug },
    include: {
      parent: {
        select: {
          name: true,
          slug: true,
        },
      },
      children: {
        select: {
          name: true,
          slug: true,
        },
      },
    },
  });
}

/**
 * Obtiene artículos de una categoría específica
 * @param categorySlug - Slug de la categoría
 * @param page - Número de página
 * @param limit - Cantidad de artículos por página
 */
export async function getArticlesByCategory(
  categorySlug: string,
  page: number = 1,
  limit: number = 12
) {
  const skip = (page - 1) * limit;

  const [articles, total, category] = await Promise.all([
    db.article.findMany({
      where: {
        status: ContentStatus.PUBLISHED,
        categories: {
          some: {
            category: { slug: categorySlug },
          },
        },
      },
      skip,
      take: limit,
      orderBy: { publishedAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        coverPosition: true,
        publishedAt: true,
        author: {
          select: { name: true },
        },
        byline: true,
        authors: {
          orderBy: { order: "asc" },
          select: { author: { select: { name: true, slug: true } } },
        },
        categories: {
          select: {
            category: {
              select: { name: true, slug: true },
            },
          },
        },
      },
    }),
    db.article.count({
      where: {
        status: ContentStatus.PUBLISHED,
        categories: {
          some: {
            category: { slug: categorySlug },
          },
        },
      },
    }),
    db.category.findUnique({
      where: { slug: categorySlug },
      select: {
        name: true,
        slug: true,
        description: true,
      },
    }),
  ]);

  return {
    articles,
    total,
    totalPages: Math.ceil(total / limit),
    category,
  };
}

/**
 * Obtiene un tag por su slug
 * @param slug - Slug del tag
 */
export async function getTagBySlug(slug: string) {
  return db.tag.findUnique({
    where: { slug },
    select: {
      name: true,
      slug: true,
    },
  });
}

/**
 * Obtiene artículos de un tag específico
 * @param tagSlug - Slug del tag
 * @param page - Número de página
 * @param limit - Cantidad de artículos por página
 */
export async function getArticlesByTag(
  tagSlug: string,
  page: number = 1,
  limit: number = 12
) {
  const skip = (page - 1) * limit;

  const [articles, total, tag] = await Promise.all([
    db.article.findMany({
      where: {
        status: ContentStatus.PUBLISHED,
        tags: {
          some: {
            tag: { slug: tagSlug },
          },
        },
      },
      skip,
      take: limit,
      orderBy: { publishedAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        coverPosition: true,
        publishedAt: true,
        author: {
          select: { name: true },
        },
        byline: true,
        authors: {
          orderBy: { order: "asc" },
          select: { author: { select: { name: true, slug: true } } },
        },
        categories: {
          select: {
            category: {
              select: { name: true, slug: true },
            },
          },
        },
      },
    }),
    db.article.count({
      where: {
        status: ContentStatus.PUBLISHED,
        tags: {
          some: {
            tag: { slug: tagSlug },
          },
        },
      },
    }),
    db.tag.findUnique({
      where: { slug: tagSlug },
      select: {
        name: true,
        slug: true,
      },
    }),
  ]);

  return {
    articles,
    total,
    totalPages: Math.ceil(total / limit),
    tag,
  };
}

/**
 * Obtiene todas las categorías
 */
export async function getAllCategories() {
  return db.category.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      parentId: true,
    },
  });
}

/**
 * Obtiene categorías con conteo de artículos publicados
 */
export async function getCategoriesWithCount() {
  return db.category.findMany({
    orderBy: { name: "asc" },
    select: {
      name: true,
      slug: true,
      _count: {
        select: {
          articles: {
            where: {
              article: {
                status: ContentStatus.PUBLISHED,
              },
            },
          },
        },
      },
    },
  });
}

/**
 * Obtiene todos los tags
 */
export async function getAllTags() {
  return db.tag.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
    },
  });
}

/**
 * Busca artículos por título o contenido
 * @param query - Término de búsqueda
 * @param page - Número de página
 * @param limit - Cantidad de resultados por página
 */
export async function searchArticles(
  query: string,
  page: number = 1,
  limit: number = 12,
  categorySlug?: string
) {
  const skip = (page - 1) * limit;
  const ci = { contains: query, mode: "insensitive" as const };

  const where = {
    status: ContentStatus.PUBLISHED,
    ...(categorySlug
      ? { categories: { some: { category: { slug: categorySlug } } } }
      : {}),
    OR: [
      { title: ci },
      { content: ci },
      { excerpt: ci },
      { byline: ci },
      { authors: { some: { author: { name: ci } } } },
    ],
  };

  const [articles, total, category] = await Promise.all([
    db.article.findMany({
      where,
      skip,
      take: limit,
      orderBy: { publishedAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        coverPosition: true,
        publishedAt: true,
        author: { select: { name: true } },
        byline: true,
        authors: {
          orderBy: { order: "asc" },
          select: { author: { select: { name: true, slug: true } } },
        },
        categories: {
          select: { category: { select: { name: true, slug: true } } },
        },
      },
    }),
    db.article.count({ where }),
    categorySlug
      ? db.category.findUnique({
          where: { slug: categorySlug },
          select: { name: true, slug: true },
        })
      : Promise.resolve(null),
  ]);

  return {
    articles,
    total,
    totalPages: Math.ceil(total / limit),
    query,
    category,
  };
}

/**
 * Obtiene todos los números de la revista
 */
export async function getAllIssues(): Promise<MagazineIssueSummary[]> {
  return db.magazineIssue.findMany({
    where: { publishedAt: { not: null } },
    orderBy: { number: "desc" },
    select: {
      id: true,
      number: true,
      title: true,
      slug: true,
      description: true,
      coverImage: true,
      publishedAt: true,
      _count: {
        select: { articles: true },
      },
    },
  });
}

/**
 * Obtiene un número de revista por su slug
 */
export async function getIssueBySlug(slug: string) {
  return db.magazineIssue.findUnique({
    where: { slug },
    include: {
      articles: {
        where: { status: ContentStatus.PUBLISHED },
        orderBy: { publishedAt: "asc" },
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          coverImage: true,
          coverPosition: true,
          publishedAt: true,
          author: {
            select: { name: true },
          },
        },
      },
    },
  });
}

/**
 * Obtiene los artículos firmados por un autor (por slug del Author) con paginación.
 */
export async function getArticlesByAuthor(
  authorSlug: string,
  page: number = 1,
  limit: number = 24
) {
  const skip = (page - 1) * limit;
  const where = {
    status: ContentStatus.PUBLISHED,
    authors: { some: { author: { slug: authorSlug } } },
  } as const;

  const [articles, total, author] = await Promise.all([
    db.article.findMany({
      where,
      skip,
      take: limit,
      orderBy: { publishedAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        coverPosition: true,
        publishedAt: true,
        author: { select: { name: true } },
        byline: true,
        authors: {
          orderBy: { order: "asc" },
          select: { author: { select: { name: true, slug: true } } },
        },
        categories: {
          select: { category: { select: { name: true, slug: true } } },
        },
      },
    }),
    db.article.count({ where }),
    db.author.findUnique({ where: { slug: authorSlug }, select: { name: true } }),
  ]);

  return { articles, total, totalPages: Math.ceil(total / limit), author };
}
