import { NextResponse } from "next/server";
import { list } from "@vercel/blob";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Solo las carpetas de imágenes de artículos. NO se listan `socios/` (fotos de
// carnet, privadas) ni `documentos/`.
const PREFIX = "articulos/";
const IMAGE = /\.(jpe?g|png|gif|webp|avif|svg)$/i;
const PAGE = 1000;
const MAX_PAGES = 3;

/**
 * Biblioteca de imágenes: lo que ya hay en Vercel Blob bajo `articulos/`
 * (subidas desde el panel y las migradas de la web antigua), de la más reciente
 * a la más antigua. Solo admin/editor.
 */
export async function GET() {
  const session = await auth();
  const role = session?.user?.role;
  if (!(role === "ADMIN" || role === "EDITOR" || role === "MEMBER_ADMIN")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "El almacenamiento (Vercel Blob) no está configurado." },
      { status: 500 }
    );
  }

  try {
    const items: { url: string; name: string; size: number; uploadedAt: string }[] = [];
    let cursor: string | undefined;
    let truncated = false;
    for (let page = 0; page < MAX_PAGES; page++) {
      const res = await list({
        prefix: PREFIX,
        limit: PAGE,
        cursor,
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });
      for (const b of res.blobs) {
        if (!IMAGE.test(b.pathname)) continue;
        items.push({
          url: b.url,
          name: b.pathname.slice(PREFIX.length),
          size: b.size,
          uploadedAt: new Date(b.uploadedAt).toISOString(),
        });
      }
      if (!res.hasMore) break;
      cursor = res.cursor;
      if (page === MAX_PAGES - 1) truncated = true;
    }
    items.sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
    return NextResponse.json({ items, truncated });
  } catch (e) {
    console.error("media list error:", e);
    return NextResponse.json(
      { error: "No se pudo cargar la biblioteca." },
      { status: 500 }
    );
  }
}
