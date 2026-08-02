import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { SITE_URL } from "@/lib/site";
import { ContentStatus } from "@prisma/client";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, categories, issues, authors, tags] = await Promise.all([
    db.article.findMany({
      where: { status: ContentStatus.PUBLISHED },
      select: { slug: true, updatedAt: true },
    }),
    db.category.findMany({
      where: { articles: { some: { article: { status: ContentStatus.PUBLISHED } } } },
      select: { slug: true },
    }),
    db.magazineIssue.findMany({
      where: { publishedAt: { not: null } },
      select: { slug: true, updatedAt: true },
    }),
    db.author.findMany({
      where: { articles: { some: {} } },
      select: { slug: true },
    }),
    db.tag.findMany({
      where: { articles: { some: { article: { status: ContentStatus.PUBLISHED } } } },
      select: { slug: true },
    }),
  ]);

  const staticPaths = [
    "",
    "/articulos",
    "/revista",
    "/memoria",
    "/actividades",
    "/sobre-nosotros",
    "/contacto",
    "/hazte-socio",
    "/granada-2031",
    "/privacidad",
    "/aviso-legal",
  ];

  const now = new Date();
  const url = (path: string) => `${SITE_URL}${path}`;

  return [
    ...staticPaths.map((p) => ({
      url: url(p),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: p === "" ? 1 : 0.7,
    })),
    ...articles.map((a) => ({
      url: url(`/articulos/${a.slug}`),
      lastModified: a.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...categories.map((c) => ({
      url: url(`/categoria/${c.slug}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...issues.map((i) => ({
      url: url(`/revista/${i.slug}`),
      lastModified: i.updatedAt,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    ...authors.map((a) => ({
      url: url(`/autor/${a.slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    ...tags.map((t) => ({
      url: url(`/etiqueta/${t.slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.4,
    })),
  ];
}
