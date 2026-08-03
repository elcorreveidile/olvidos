import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 4 * 1024 * 1024;

/**
 * Sube la FOTO DEL CARNÉ de un socio a Vercel Blob y la guarda en
 * `Member.cardImageUrl`. La sube el propio socio desde su perfil (no se toma de
 * Google/GitHub). Solo para usuarios autenticados que sean socios.
 */
export async function POST(req: Request) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const member = await db.member.findUnique({
    where: { userId },
    select: { id: true },
  });
  if (!member) {
    return NextResponse.json({ error: "No eres socio" }, { status: 403 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "El almacenamiento (Vercel Blob) no está configurado." },
      { status: 500 }
    );
  }

  let file: FormDataEntryValue | null;
  try {
    file = (await req.formData()).get("file");
  } catch {
    return NextResponse.json({ error: "Petición inválida" }, { status: 400 });
  }
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Falta el archivo" }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "El archivo debe ser una imagen." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "La imagen supera el máximo de 4 MB." },
      { status: 413 }
    );
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").slice(-50) || "foto";
  try {
    const blob = await put(`socios/${member.id}-${safeName}`, file, {
      access: "public",
      addRandomSuffix: true,
      contentType: file.type || undefined,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    await db.member.update({
      where: { id: member.id },
      data: { cardImageUrl: blob.url },
    });
    revalidatePath("/mi-cuenta/carnet");
    revalidatePath("/mi-cuenta/perfil");
    return NextResponse.json({ url: blob.url });
  } catch (e) {
    console.error("member photo upload error:", e);
    return NextResponse.json({ error: "No se pudo subir la foto." }, { status: 500 });
  }
}
