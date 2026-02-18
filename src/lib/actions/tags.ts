"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { tagSchema, type TagInput } from "@/lib/validations/tag";

export async function createTag(data: TagInput) {
  const session = await auth();

  if (!session?.user) {
    return { error: "No autorizado" };
  }

  if (session.user.role !== "ADMIN" && session.user.role !== "EDITOR") {
    return { error: "No tienes permisos para crear tags" };
  }

  try {
    const validatedData = tagSchema.parse(data);

    // Check if slug already exists
    const existingTag = await prisma.tag.findUnique({
      where: { slug: validatedData.slug },
    });

    if (existingTag) {
      return { error: "Ya existe un tag con ese slug" };
    }

    // Create tag
    const tag = await prisma.tag.create({
      data: {
        name: validatedData.name,
        slug: validatedData.slug,
      },
    });

    revalidatePath("/admin/tags");
    revalidatePath("/");

    return { success: true, tag };
  } catch (error) {
    console.error("Error creating tag:", error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Error al crear el tag" };
  }
}

export async function updateTag(id: string, data: TagInput) {
  const session = await auth();

  if (!session?.user) {
    return { error: "No autorizado" };
  }

  if (session.user.role !== "ADMIN" && session.user.role !== "EDITOR") {
    return { error: "No tienes permisos para actualizar tags" };
  }

  try {
    const validatedData = tagSchema.parse(data);

    // Check if tag exists
    const existingTag = await prisma.tag.findUnique({
      where: { id },
    });

    if (!existingTag) {
      return { error: "Tag no encontrado" };
    }

    // Check if new slug conflicts with another tag
    if (validatedData.slug !== existingTag.slug) {
      const slugConflict = await prisma.tag.findUnique({
        where: { slug: validatedData.slug },
      });

      if (slugConflict) {
        return { error: "Ya existe un tag con ese slug" };
      }
    }

    // Update tag
    const tag = await prisma.tag.update({
      where: { id },
      data: {
        name: validatedData.name,
        slug: validatedData.slug,
      },
    });

    revalidatePath("/admin/tags");
    revalidatePath("/admin/tags/[id]/editar");
    revalidatePath("/");

    return { success: true, tag };
  } catch (error) {
    console.error("Error updating tag:", error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Error al actualizar el tag" };
  }
}

export async function deleteTag(id: string) {
  const session = await auth();

  if (!session?.user) {
    return { error: "No autorizado" };
  }

  if (session.user.role !== "ADMIN" && session.user.role !== "EDITOR") {
    return { error: "No tienes permisos para eliminar tags" };
  }

  try {
    // Check if tag exists
    const tag = await prisma.tag.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            articles: true,
          },
        },
      },
    });

    if (!tag) {
      return { error: "Tag no encontrado" };
    }

    // Check if tag has articles
    if (tag._count.articles > 0) {
      return {
        error: `No se puede eliminar. El tag tiene ${tag._count.articles} artículo(s) asociado(s). Elimina la asociación primero.`,
      };
    }

    // Delete tag
    await prisma.tag.delete({
      where: { id },
    });

    revalidatePath("/admin/tags");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Error deleting tag:", error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Error al eliminar el tag" };
  }
}

export async function getTag(id: string) {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  if (session.user.role !== "ADMIN" && session.user.role !== "EDITOR") {
    return null;
  }

  try {
    const tag = await prisma.tag.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            articles: true,
          },
        },
      },
    });

    return tag;
  } catch (error) {
    console.error("Error getting tag:", error);
    return null;
  }
}

export async function getAllTags(search?: string) {
  const session = await auth();

  if (!session?.user) {
    return { error: "No autorizado" };
  }

  if (session.user.role !== "ADMIN" && session.user.role !== "EDITOR") {
    return { error: "No tienes permisos para ver tags" };
  }

  try {
    const tags = await prisma.tag.findMany({
      where: search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { slug: { contains: search, mode: "insensitive" } },
            ],
          }
        : undefined,
      include: {
        _count: {
          select: {
            articles: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return { success: true, tags };
  } catch (error) {
    console.error("Error getting tags:", error);
    return { error: "Error al obtener los tags" };
  }
}

export async function getPopularTags(limit: number = 10) {
  const session = await auth();

  if (!session?.user) {
    return { error: "No autorizado" };
  }

  if (session.user.role !== "ADMIN" && session.user.role !== "EDITOR") {
    return { error: "No tienes permisos para ver tags" };
  }

  try {
    const tags = await prisma.tag.findMany({
      include: {
        _count: {
          select: {
            articles: true,
          },
        },
      },
      orderBy: {
        articles: {
          _count: "desc",
        },
      },
      take: limit,
    });

    return { success: true, tags };
  } catch (error) {
    console.error("Error getting popular tags:", error);
    return { error: "Error al obtener los tags populares" };
  }
}
