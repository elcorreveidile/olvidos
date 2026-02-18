"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const ArticleSchema = z.object({
  title: z.string().min(1, "El título es obligatorio").max(200, "El título no puede exceder 200 caracteres"),
  slug: z.string().min(1, "El slug es obligatorio").regex(/^[a-z0-9-]+$/, "El slug solo puede contener letras minúsculas, números y guiones"),
  excerpt: z.string().optional(),
  content: z.string().min(1, "El contenido es obligatorio"),
  coverImage: z.string().url().optional().or(z.literal("")),
  metaTitle: z.string().max(60, "El título SEO no puede exceder 60 caracteres").optional(),
  metaDescription: z.string().max(160, "La descripción SEO no puede exceder 160 caracteres").optional(),
  status: z.enum(["DRAFT", "REVIEW", "PUBLISHED", "ARCHIVED"]),
  featured: z.boolean().default(false),
  membersOnly: z.boolean().default(false),
  issueId: z.string().optional(),
  categoryIds: z.array(z.string()).optional(),
  tagNames: z.array(z.string()).optional(),
});

export type ArticleInput = z.infer<typeof ArticleSchema>;

// Check if user has permission
async function checkPermission() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("No autenticado");
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (!user || (user.role !== "EDITOR" && user.role !== "ADMIN")) {
    throw new Error("No tienes permiso para realizar esta acción");
  }

  return session.user.id;
}

// Generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// Create article
export async function createArticle(data: ArticleInput) {
  try {
    const userId = await checkPermission();

    // Validate data
    const validatedData = ArticleSchema.parse(data);

    // Check if slug already exists
    const existingArticle = await db.article.findUnique({
      where: { slug: validatedData.slug },
    });

    if (existingArticle) {
      throw new Error("Ya existe un artículo con ese slug");
    }

    // Create article
    const article = await db.article.create({
      data: {
        title: validatedData.title,
        slug: validatedData.slug,
        excerpt: validatedData.excerpt,
        content: validatedData.content,
        coverImage: validatedData.coverImage || null,
        metaTitle: validatedData.metaTitle,
        metaDescription: validatedData.metaDescription,
        status: validatedData.status,
        featured: validatedData.featured,
        membersOnly: validatedData.membersOnly,
        authorId: userId,
        issueId: validatedData.issueId || null,
        publishedAt: validatedData.status === "PUBLISHED" ? new Date() : null,
        categories: validatedData.categoryIds
          ? {
              create: validatedData.categoryIds.map((categoryId) => ({
                categoryId,
              })),
            }
          : undefined,
        tags: validatedData.tagNames
          ? {
              create: await Promise.all(
                validatedData.tagNames.map(async (tagName) => {
                  const slug = generateSlug(tagName);
                  const tag = await db.tag.upsert({
                    where: { slug },
                    create: { name: tagName, slug },
                    update: {},
                  });
                  return { tagId: tag.id };
                })
              ),
            }
          : undefined,
      },
      include: {
        categories: true,
        tags: { include: { tag: true } },
        author: true,
      },
    });

    revalidatePath("/admin/articulos");
    revalidatePath("/articulos");
    revalidatePath(`/articulos/${article.slug}`);

    return { success: true, article };
  } catch (error) {
    console.error("Error creating article:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al crear el artículo",
    };
  }
}

// Update article
export async function updateArticle(id: string, data: ArticleInput) {
  try {
    const userId = await checkPermission();

    // Validate data
    const validatedData = ArticleSchema.parse(data);

    // Check if article exists
    const existingArticle = await db.article.findUnique({
      where: { id },
    });

    if (!existingArticle) {
      throw new Error("El artículo no existe");
    }

    // Check if slug changed and if it's already in use
    if (validatedData.slug !== existingArticle.slug) {
      const slugExists = await db.article.findUnique({
        where: { slug: validatedData.slug },
      });
      if (slugExists) {
        throw new Error("Ya existe un artículo con ese slug");
      }
    }

    // Update publishedAt if status changed to PUBLISHED
    const publishedAt =
      validatedData.status === "PUBLISHED" && existingArticle.status !== "PUBLISHED"
        ? new Date()
        : existingArticle.publishedAt;

    // Delete existing categories and tags
    await db.categoriesOnArticles.deleteMany({
      where: { articleId: id },
    });

    await db.tagsOnArticles.deleteMany({
      where: { articleId: id },
    });

    // Update article
    const article = await db.article.update({
      where: { id },
      data: {
        title: validatedData.title,
        slug: validatedData.slug,
        excerpt: validatedData.excerpt,
        content: validatedData.content,
        coverImage: validatedData.coverImage || null,
        metaTitle: validatedData.metaTitle,
        metaDescription: validatedData.metaDescription,
        status: validatedData.status,
        featured: validatedData.featured,
        membersOnly: validatedData.membersOnly,
        issueId: validatedData.issueId || null,
        publishedAt,
        categories: validatedData.categoryIds
          ? {
              create: validatedData.categoryIds.map((categoryId) => ({
                categoryId,
              })),
            }
          : undefined,
        tags: validatedData.tagNames
          ? {
              create: await Promise.all(
                validatedData.tagNames.map(async (tagName) => {
                  const slug = generateSlug(tagName);
                  const tag = await db.tag.upsert({
                    where: { slug },
                    create: { name: tagName, slug },
                    update: {},
                  });
                  return { tagId: tag.id };
                })
              ),
            }
          : undefined,
      },
      include: {
        categories: true,
        tags: { include: { tag: true } },
        author: true,
      },
    });

    revalidatePath("/admin/articulos");
    revalidatePath("/articulos");
    revalidatePath(`/articulos/${article.slug}`);
    revalidatePath(`/admin/articulos/${id}/editar`);

    return { success: true, article };
  } catch (error) {
    console.error("Error updating article:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al actualizar el artículo",
    };
  }
}

// Delete article (soft delete - change status to ARCHIVED)
export async function deleteArticle(id: string) {
  try {
    const userId = await checkPermission();

    // Check if article exists
    const existingArticle = await db.article.findUnique({
      where: { id },
    });

    if (!existingArticle) {
      throw new Error("El artículo no existe");
    }

    // Soft delete by changing status to ARCHIVED
    await db.article.update({
      where: { id },
      data: {
        status: "ARCHIVED",
      },
    });

    revalidatePath("/admin/articulos");
    revalidatePath("/articulos");

    return { success: true };
  } catch (error) {
    console.error("Error deleting article:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al eliminar el artículo",
    };
  }
}

// Get article by ID
export async function getArticle(id: string) {
  try {
    const article = await db.article.findUnique({
      where: { id },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        author: true,
        issue: true,
      },
    });

    if (!article) {
      throw new Error("Artículo no encontrado");
    }

    return { success: true, article };
  } catch (error) {
    console.error("Error fetching article:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al obtener el artículo",
    };
  }
}

// Get all articles with filters
export async function getArticles(filters?: {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  try {
    const status = filters?.status;
    const search = filters?.search;
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (status && status !== "all") {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
      ];
    }

    const [articles, total] = await Promise.all([
      db.article.findMany({
        where,
        include: {
          author: true,
          categories: {
            include: {
              category: true,
            },
          },
          tags: {
            include: {
              tag: true,
            },
          },
          issue: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      db.article.count({ where }),
    ]);

    return {
      success: true,
      articles,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error("Error fetching articles:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al obtener los artículos",
    };
  }
}

// Get published articles for public pages
export async function getPublishedArticles(filters?: {
  category?: string;
  tag?: string;
  search?: string;
  limit?: number;
}) {
  try {
    const where: any = {
      status: "PUBLISHED",
    };

    if (filters?.category) {
      where.categories = {
        some: {
          category: {
            slug: filters.category,
          },
        },
      };
    }

    if (filters?.tag) {
      where.tags = {
        some: {
          tag: {
            slug: filters.tag,
          },
        },
      };
    }

    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: "insensitive" } },
        { excerpt: { contains: filters.search, mode: "insensitive" } },
        { content: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    const articles = await db.article.findMany({
      where,
      include: {
        author: true,
        categories: {
          include: {
            category: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: {
        publishedAt: "desc",
      },
      take: filters?.limit || undefined,
    });

    return { success: true, articles };
  } catch (error) {
    console.error("Error fetching published articles:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al obtener los artículos publicados",
      articles: [],
    };
  }
}

// Get article by slug for public pages
export async function getArticleBySlug(slug: string, publishedOnly = false) {
  try {
    const where: any = { slug };

    if (publishedOnly) {
      where.status = "PUBLISHED";
    }

    const article = await db.article.findFirst({
      where,
      include: {
        author: true,
        categories: {
          include: {
            category: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        issue: true,
      },
    });

    if (!article) {
      throw new Error("Artículo no encontrado");
    }

    return { success: true, article };
  } catch (error) {
    console.error("Error fetching article by slug:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al obtener el artículo",
    };
  }
}

// Get all categories
export async function getCategories() {
  try {
    const categories = await db.category.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return { success: true, categories };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al obtener las categorías",
    };
  }
}

// Get all magazine issues
export async function getMagazineIssues() {
  try {
    const issues = await db.magazineIssue.findMany({
      orderBy: {
        number: "desc",
      },
    });

    return { success: true, issues };
  } catch (error) {
    console.error("Error fetching magazine issues:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al obtener los números de revista",
    };
  }
}
