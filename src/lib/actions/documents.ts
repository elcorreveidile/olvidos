"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { put, del } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import type { DocumentCategory } from "@prisma/client";

const CATEGORIES: DocumentCategory[] = [
  "ESTATUTOS",
  "ACTA",
  "LIBRO_SOCIOS",
  "OTRO",
];

type ActionResult = { success: true } | { success: false; error: string };

async function requireAdmin() {
  const session = await auth();
  const role = session?.user?.role;
  if (role === "ADMIN" || role === "MEMBER_ADMIN" || role === "EDITOR") {
    return session!.user;
  }
  return null;
}

/** Todos los documentos (para el área de socios y el panel). */
export async function getDocuments() {
  return db.document.findMany({
    orderBy: [{ category: "asc" }, { createdAt: "desc" }],
  });
}

/** Sube un documento a Vercel Blob y guarda sus metadatos. Solo admin. */
export async function createDocument(formData: FormData): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!admin) return { success: false, error: "No autorizado." };

  const title = String(formData.get("title") ?? "").trim();
  const category = String(formData.get("category") ?? "OTRO") as DocumentCategory;
  const file = formData.get("file");

  if (title.length < 2) return { success: false, error: "Indica un título." };
  if (!CATEGORIES.includes(category)) {
    return { success: false, error: "Categoría no válida." };
  }
  if (!(file instanceof File) || file.size === 0) {
    return { success: false, error: "Adjunta un archivo." };
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return {
      success: false,
      error:
        "El almacenamiento (Vercel Blob) aún no está configurado. Añade BLOB_READ_WRITE_TOKEN.",
    };
  }

  try {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const blob = await put(`documentos/${safeName}`, file, {
      access: "public",
      addRandomSuffix: true,
      contentType: file.type || undefined,
    });

    await db.document.create({
      data: {
        title,
        category,
        fileUrl: blob.url,
        fileName: file.name,
        size: file.size,
        mimeType: file.type || null,
        uploadedById: admin.id,
      },
    });

    revalidatePath("/admin/documentos");
    revalidatePath("/mi-cuenta/documentos");
    return { success: true };
  } catch (error) {
    console.error("[documents] upload error:", error);
    return { success: false, error: "No se pudo subir el documento." };
  }
}

/** Variante para useFormState (recibe el estado previo). */
export async function uploadDocumentAction(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  return createDocument(formData);
}

/** Borra el documento (archivo en Blob + registro). Solo admin. */
export async function deleteDocument(id: string): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!admin) return { success: false, error: "No autorizado." };

  const doc = await db.document.findUnique({ where: { id } });
  if (!doc) return { success: false, error: "Documento no encontrado." };

  try {
    if (doc.fileUrl && process.env.BLOB_READ_WRITE_TOKEN) {
      await del(doc.fileUrl).catch(() => {});
    }
    await db.document.delete({ where: { id } });
    revalidatePath("/admin/documentos");
    revalidatePath("/mi-cuenta/documentos");
    return { success: true };
  } catch (error) {
    console.error("[documents] delete error:", error);
    return { success: false, error: "No se pudo borrar el documento." };
  }
}
