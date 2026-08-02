import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getIssueBySlug } from "@/lib/queries";

export const dynamic = "force-dynamic";

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const issue = await getIssueBySlug(params.slug);
  if (!issue) return { title: "Número no encontrado" };
  return {
    title: issue.title,
    description: issue.description ?? `Número de Olvidos de Granada.`,
  };
}

export default async function IssuePage({ params }: PageProps) {
  const issue = await getIssueBySlug(params.slug);
  if (!issue) notFound();

  const isNumbered = issue.number >= 1 && issue.number < 100;
  const articles = issue.articles ?? [];

  return (
    <div className="max-w-content mx-auto px-4 py-12">
      <Link
        href="/revista"
        className="mb-8 inline-block text-sm font-bold text-coral transition-colors hover:text-tinta"
      >
        ← Volver al archivo
      </Link>

      <div className="grid gap-10 md:grid-cols-[minmax(0,320px)_1fr]">
        {/* Portada */}
        <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-tinta shadow-card">
          {issue.coverImage ? (
            <Image
              src={issue.coverImage}
              alt={issue.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 320px"
              priority
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <span className="text-6xl font-black text-coral">[</span>
              <span className="text-xl font-bold">
                {isNumbered ? `N.º ${issue.number}` : issue.title}
              </span>
            </div>
          )}
        </div>

        {/* Metadatos */}
        <div>
          {isNumbered && (
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-coral">
              Número {issue.number}
              {issue.year ? ` · ${issue.year}` : ""}
            </p>
          )}
          <h1 className="text-4xl font-black leading-tight tracking-tight text-tinta sm:text-5xl">
            {issue.title}
          </h1>

          {issue.description && (
            <p className="mt-6 max-w-prose font-editorial text-lg leading-snug text-tinta/75">
              {issue.description}
            </p>
          )}

          {issue.pdfUrl && (
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={`/api/revista/${params.slug}/pdf`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-sm bg-coral px-6 py-3 font-bold text-white transition-colors hover:bg-coral-dark"
              >
                Leer el PDF →
              </a>
              <a
                href={`/api/revista/${params.slug}/pdf?download=1`}
                className="inline-flex items-center gap-2 rounded-sm border border-tinta px-6 py-3 font-bold text-tinta transition-colors hover:bg-tinta hover:text-white"
              >
                Descargar
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Artículos indexados de este número */}
      <section className="mt-16 border-t-2 border-tinta pt-8">
        <h2 className="mb-6 text-2xl font-black text-tinta">
          <span className="text-coral">[</span>En este número
        </h2>

        {articles.length > 0 ? (
          <ul className="divide-y divide-acero-light/40">
            {articles.map((article) => (
              <li key={article.id}>
                <Link
                  href={`/articulos/${article.slug}`}
                  className="group flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between"
                >
                  <span className="font-editorial text-lg text-tinta transition-colors group-hover:text-coral">
                    {article.title}
                  </span>
                  {article.author?.name && (
                    <span className="text-sm text-acero">
                      {article.author.name}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="font-editorial text-acero">
            Estamos transcribiendo los artículos de este número a formato web.
            Mientras tanto, puedes leerlo completo en el PDF.
          </p>
        )}
      </section>
    </div>
  );
}
