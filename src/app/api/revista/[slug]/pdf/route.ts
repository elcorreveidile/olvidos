import { NextResponse } from "next/server";
import { getIssueBySlug } from "@/lib/queries";

export const dynamic = "force-dynamic";

/**
 * Proxy del PDF de un número de la revista.
 *
 * Sirve el PDF desde nuestro propio dominio (olvidos.es) en lugar de exponer la
 * URL del alojamiento original. Además permite dos comportamientos:
 *   - por defecto  → se ABRE en el navegador (Content-Disposition: inline)
 *   - ?download=1  → se DESCARGA (Content-Disposition: attachment)
 *
 * El atributo `download` de un enlace <a> se ignora en URLs de otro dominio, por
 * eso hace falta este proxy para que "Descargar" descargue de verdad.
 */
export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  const issue = await getIssueBySlug(params.slug);

  if (!issue?.pdfUrl) {
    return NextResponse.json({ error: "PDF no encontrado" }, { status: 404 });
  }

  let upstream: Response;
  try {
    upstream = await fetch(issue.pdfUrl, {
      // Sin cabecera Referer para no chocar con la protección antihotlink.
      headers: { Accept: "application/pdf,*/*" },
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      { error: "No se pudo obtener el PDF" },
      { status: 502 }
    );
  }

  if (!upstream.ok || !upstream.body) {
    return NextResponse.json(
      { error: "No se pudo obtener el PDF" },
      { status: 502 }
    );
  }

  const download = new URL(req.url).searchParams.has("download");
  const disposition = download ? "attachment" : "inline";
  const filename = `${params.slug}.pdf`;

  return new Response(upstream.body, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `${disposition}; filename="${filename}"`,
      // Cacheable en el CDN: el PDF de un número no cambia.
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
