"use server";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { enviarManuscrito, htmlATexto } from "@/lib/la-banda";

async function checkPermission() {
  const session = await auth();
  if (!session?.user) throw new Error("No autenticado");
  const user = await db.user.findUnique({ where: { id: session.user.id }, select: { role: true, email: true } });
  if (!user || (user.role !== "EDITOR" && user.role !== "ADMIN")) throw new Error("No tienes permiso para realizar esta acción");
  return user.email ?? session.user.id;
}

/**
 * Envía un artículo del panel a la redacción de La Banda. Manda el texto
 * (sin HTML); el informe llega en minutos y se ve en /admin/redaccion/[id].
 */
export async function enviarArticuloARedaccion(formData: FormData) {
  const email = await checkPermission();
  const articleId = String(formData.get("articleId") ?? "");
  const section = String(formData.get("section") ?? "");
  if (!articleId || !section) redirect("/admin/redaccion?error=faltan-datos");

  const article = await db.article.findUnique({ where: { id: articleId }, select: { title: true, byline: true, slug: true, content: true } });
  if (!article) redirect("/admin/redaccion?error=articulo");

  const text = htmlATexto(article.content);
  if (text.length < 50) redirect("/admin/redaccion?error=texto-corto");

  let manuscriptId: string;
  try {
    const r = await enviarManuscrito({ title: article.title, byline: article.byline, section, text, sourceName: `articulo:${article.slug}`, createdBy: email });
    manuscriptId = r.manuscriptId;
  } catch (err) {
    console.error("[redaccion] enviar", err);
    redirect("/admin/redaccion?error=la-banda");
  }
  redirect(`/admin/redaccion/${manuscriptId}`);
}
