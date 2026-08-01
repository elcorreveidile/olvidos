"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  magazineIssueSchema,
  type MagazineIssueInput,
} from "@/lib/validations/magazine-issue";

function canManage(role?: string | null) {
  return role === "ADMIN" || role === "EDITOR";
}

/** Convierte los datos validados en el payload que espera Prisma. */
function toData(validated: MagazineIssueInput) {
  const publishedAt = validated.publishedAt
    ? new Date(validated.publishedAt)
    : validated.status === "PUBLISHED"
      ? new Date()
      : null;

  return {
    number: validated.number,
    title: validated.title,
    slug: validated.slug,
    year: validated.year,
    month: validated.month ?? null,
    description: validated.description ?? null,
    coverImage: validated.coverImage ?? null,
    pdfUrl: validated.pdfUrl ?? null,
    status: validated.status,
    publishedAt,
  };
}

export async function createMagazineIssue(data: MagazineIssueInput) {
  const session = await auth();

  if (!session?.user) {
    return { error: "No autorizado" };
  }

  if (!canManage(session.user.role)) {
    return { error: "No tienes permisos para crear números" };
  }

  try {
    const validated = magazineIssueSchema.parse(data);

    const [numberConflict, slugConflict] = await Promise.all([
      prisma.magazineIssue.findUnique({ where: { number: validated.number } }),
      prisma.magazineIssue.findUnique({ where: { slug: validated.slug } }),
    ]);

    if (numberConflict) {
      return { error: "Ya existe un número con ese valor" };
    }
    if (slugConflict) {
      return { error: "Ya existe un número con ese slug" };
    }

    const issue = await prisma.magazineIssue.create({ data: toData(validated) });

    revalidatePath("/admin/revista");
    revalidatePath("/revista");

    return { success: true, issue };
  } catch (error) {
    console.error("Error creating magazine issue:", error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Error al crear el número" };
  }
}

export async function updateMagazineIssue(id: string, data: MagazineIssueInput) {
  const session = await auth();

  if (!session?.user) {
    return { error: "No autorizado" };
  }

  if (!canManage(session.user.role)) {
    return { error: "No tienes permisos para actualizar números" };
  }

  try {
    const validated = magazineIssueSchema.parse(data);

    const existing = await prisma.magazineIssue.findUnique({ where: { id } });
    if (!existing) {
      return { error: "Número no encontrado" };
    }

    if (validated.number !== existing.number) {
      const numberConflict = await prisma.magazineIssue.findUnique({
        where: { number: validated.number },
      });
      if (numberConflict) {
        return { error: "Ya existe un número con ese valor" };
      }
    }

    if (validated.slug !== existing.slug) {
      const slugConflict = await prisma.magazineIssue.findUnique({
        where: { slug: validated.slug },
      });
      if (slugConflict) {
        return { error: "Ya existe un número con ese slug" };
      }
    }

    const issue = await prisma.magazineIssue.update({
      where: { id },
      data: toData(validated),
    });

    revalidatePath("/admin/revista");
    revalidatePath(`/admin/revista/${id}/editar`);
    revalidatePath("/revista");
    revalidatePath(`/revista/${issue.slug}`);

    return { success: true, issue };
  } catch (error) {
    console.error("Error updating magazine issue:", error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Error al actualizar el número" };
  }
}

export async function deleteMagazineIssue(id: string) {
  const session = await auth();

  if (!session?.user) {
    return { error: "No autorizado" };
  }

  if (!canManage(session.user.role)) {
    return { error: "No tienes permisos para eliminar números" };
  }

  try {
    const issue = await prisma.magazineIssue.findUnique({
      where: { id },
      include: { _count: { select: { articles: true } } },
    });

    if (!issue) {
      return { error: "Número no encontrado" };
    }

    if (issue._count.articles > 0) {
      return {
        error: `No se puede eliminar. El número tiene ${issue._count.articles} artículo(s) asociado(s). Reasígnalos primero.`,
      };
    }

    await prisma.magazineIssue.delete({ where: { id } });

    revalidatePath("/admin/revista");
    revalidatePath("/revista");

    return { success: true };
  } catch (error) {
    console.error("Error deleting magazine issue:", error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Error al eliminar el número" };
  }
}

export async function getMagazineIssue(id: string) {
  const session = await auth();

  if (!session?.user || !canManage(session.user.role)) {
    return null;
  }

  try {
    return await prisma.magazineIssue.findUnique({
      where: { id },
      include: { _count: { select: { articles: true } } },
    });
  } catch (error) {
    console.error("Error getting magazine issue:", error);
    return null;
  }
}

export async function getMagazineIssuesList() {
  const session = await auth();

  if (!session?.user) {
    return { error: "No autorizado" };
  }

  if (!canManage(session.user.role)) {
    return { error: "No tienes permisos para ver los números" };
  }

  try {
    const issues = await prisma.magazineIssue.findMany({
      include: { _count: { select: { articles: true } } },
      orderBy: [{ year: "desc" }, { number: "desc" }],
    });

    return { success: true, issues };
  } catch (error) {
    console.error("Error getting magazine issues:", error);
    return { error: "Error al obtener los números" };
  }
}
