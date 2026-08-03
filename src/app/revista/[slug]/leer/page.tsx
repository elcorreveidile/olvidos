import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const issue = await db.magazineIssue.findUnique({
    where: { slug: params.slug },
    select: { title: true },
  });
  return { title: issue ? `Leer · ${issue.title}` : "Leer la revista" };
}

export default async function LeerRevistaPage({
  params,
}: {
  params: { slug: string };
}) {
  const issue = await db.magazineIssue.findUnique({
    where: { slug: params.slug },
    select: { title: true, number: true, pdfUrl: true, slug: true },
  });
  if (!issue || !issue.pdfUrl) notFound();

  const downloadUrl = `${issue.pdfUrl}${issue.pdfUrl.includes("?") ? "&" : "?"}download=1`;

  return (
    <div className="mx-auto max-w-content px-4 py-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link
            href={`/revista/${issue.slug}`}
            className="text-sm font-bold text-coral transition-colors hover:text-tinta"
          >
            ← Volver a la ficha
          </Link>
          <h1 className="text-xl font-black text-tinta">{issue.title}</h1>
        </div>
        <a
          href={downloadUrl}
          className="inline-flex items-center gap-2 rounded-sm border border-tinta px-5 py-2 font-bold text-tinta transition-colors hover:bg-tinta hover:text-white"
        >
          Descargar PDF
        </a>
      </div>

      {/* Visor incrustado (PDF alojado en nuestro Blob). Marco vertical y
          centrado, acorde a las páginas de la revista (más altas que anchas).
          El visor nativo ajusta la página a lo ancho y se baja con scroll. */}
      <iframe
        src={issue.pdfUrl}
        title={issue.title}
        className="mx-auto block h-[88vh] w-full max-w-3xl rounded-lg border border-acero-light/50 bg-tinta/[0.03]"
      />

      <p className="mt-2 text-xs text-tinta/50">
        ¿No se ve el visor?{" "}
        <a
          href={issue.pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-coral hover:text-tinta"
        >
          Ábrelo en una pestaña nueva
        </a>
        .
      </p>
    </div>
  );
}
