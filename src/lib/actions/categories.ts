"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { categorySchema, type CategoryInput } from "@/lib/validations/category";
import { redirect } from "next/navigation";

export async function createCategory(data: CategoryInput) {
  const session = await auth();

  if (!session?.user) {
    return { error: "No autorizado" };
  }

  if (session.user.role !== "ADMIN" && session.user.role !== "EDITOR") {
    return { error: "No tienes permisos para crear categorías" };
  }

  try {
    const validatedData = categorySchema.parse(data);

    // Check if slug already exists
    const existingCategory = await prisma.category.findUnique({
      where: { slug: validatedData.slug },
    });

    if (existingCategory) {
      return { error: "Ya existe una categoría con ese slug" };
    }

    // Create category
    const category = await prisma.category.create({
      data: {
        name: validatedData.name,
        slug: validatedData.slug,
        description: validatedData.description,
        parentId: validatedData.parentId || null,
      },
    });

    revalidatePath("/admin/categorias");
    revalidatePath("/");

    return { success: true, category };
  } catch (error) {
    console.error("Error creating category:", error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Error al crear la categoría" };
  }
}

export async function updateCategory(id: string, data: CategoryInput) {
  const session = await auth();

  if (!session?.user) {
    return { error: "No autorizado" };
  }

  if (session.user.role !== "ADMIN" && session.user.role !== "EDITOR") {
    return { error: "No tienes permisos para actualizar categorías" };
  }

  try {
    const validatedData = categorySchema.parse(data);

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      return { error: "Categoría no encontrada" };
    }

    // Check if new slug conflicts with another category
    if (validatedData.slug !== existingCategory.slug) {
      const slugConflict = await prisma.category.findUnique({
        where: { slug: validatedData.slug },
      });

      if (slugConflict) {
        return { error: "Ya existe una categoría con ese slug" };
      }
    }

    // Prevent circular reference in parent
    if (validatedData.parentId === id) {
      return { error: "Una categoría no puede ser su propia padre" };
    }

    // Update category
    const category = await prisma.category.update({
      where: { id },
      data: {
        name: validatedData.name,
        slug: validatedData.slug,
        description: validatedData.description,
        parentId: validatedData.parentId || null,
      },
    });

    revalidatePath("/admin/categorias");
    revalidatePath("/admin/categorias/[id]/editar");
    revalidatePath("/");

    return { success: true, category };
  } catch (error) {
    console.error("Error updating category:", error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Error al actualizar la categoría" };
  }
}

export async function deleteCategory(id: string) {
  const session = await auth();

  if (!session?.user) {
    return { error: "No autorizado" };
  }

  if (session.user.role !== "ADMIN" && session.user.role !== "EDITOR") {
    return { error: "No tienes permisos para eliminar categorías" };
  }

  try {
    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        articles: true,
        children: true,
      },
    });

    if (!category) {
      return { error: "Categoría no encontrada" };
    }

    // Check if category has articles
    if (category.articles.length > 0) {
      return {
        error: `No se puede eliminar. La categoría tiene ${category.articles.length} artículo(s) asociado(s). Reasigna los artículos primero.`,
      };
    }

    // Check if category has children
    if (category.children.length > 0) {
      return {
        error: `No se puede eliminar. La categoría tiene ${category.children.length} subcategoría(s). Elimina o reasigna las subcategorías primero.`,
      };
    }

    // Delete category
    await prisma.category.delete({
      where: { id },
    });

    revalidatePath("/admin/categorias");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Error deleting category:", error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Error al eliminar la categoría" };
  }
}

export async function getCategory(id: string) {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  if (session.user.role !== "ADMIN" && session.user.role !== "EDITOR") {
    return null;
  }

  try {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        children: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        _count: {
          select: {
            articles: true,
          },
        },
      },
    });

    return category;
  } catch (error) {
    console.error("Error getting category:", error);
    return null;
  }
}

export async function getAllCategories() {
  const session = await auth();

  if (!session?.user) {
    return { error: "No autorizado" };
  }

  if (session.user.role !== "ADMIN" && session.user.role !== "EDITOR") {
    return { error: "No tienes permisos para ver categorías" };
  }

  try {
    const categories = await prisma.category.findMany({
      include: {
        parent: {
          select: {
            id: true,
            name: true,
          },
        },
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

    return { success: true, categories };
  } catch (error) {
    console.error("Error getting categories:", error);
    return { error: "Error al obtener las categorías" };
  }
}

export async function getCategoryTree() {
  const session = await auth();

  if (!session?.user) {
    return { error: "No autorizado" };
  }

  if (session.user.role !== "ADMIN" && session.user.role !== "EDITOR") {
    return { error: "No tienes permisos para ver categorías" };
  }

  try {
    // Get all categories
    const categories = await prisma.category.findMany({
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

    // Build tree structure
    const buildTree = (parentId: string | null) => {
      return categories
        .filter((cat) => cat.parentId === parentId)
        .map((cat) => ({
          ...cat,
          children: buildTree(cat.id),
        }));
    };

    const tree = buildTree(null);

    return { success: true, categories: tree };
  } catch (error) {
    console.error("Error getting category tree:", error);
    return { error: "Error al obtener el árbol de categorías" };
  }
}
