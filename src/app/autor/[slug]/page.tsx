import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { nameFromSlug, resolveAuthorSlug } from "@/lib/colaboradores";
import { getArticlesByAuthor } from "@/lib/queries";
import { ArticleCard } from "@/components/content/ArticleCard";
import { Pagination } from "@/components/shared/Pagination";

export const dynamic = "force-dynamic";

const PER_PAGE = 24;

interface AutorPageProps {
  params: { slug: string };
  searchParams: { page?: string };
}

export async function generateMetadata({
  params,
}: AutorPageProps): Promise<Metadata> {
  const { author } = await getArticlesByAuthor(params.slug, 1, 1);
  const name = author?.name ?? nameFromSlug(params.slug);
  return {
    title: name ? `${name}` : "Autor",
    description: name
      ? `Artículos firmados por ${name} en Olvidos de Granada.`
      : undefined,
  };
}

export default async function AutorPage({
  params,
  searchParams,
}: AutorPageProps) {
  // Alias (nombre de la lista distinto al de la firma) → autor canónico.
  const canonical = resolveAuthorSlug(params.slug);
  if (canonical !== params.slug) redirect(`/autor/${canonical}`);

  const page = Math.max(1, Number(searchParams.page) || 1);
  const { articles, total, totalPages, author } = await getArticlesByAuthor(
    params.slug,
    page,
    PER_PAGE
  );

  // Nombre: del Author real o, si es un colaborador sin firmas, de la lista.
  const name = author?.name ?? nameFromSlug(params.slug);
  if (!name) notFound();

  return (
    <div className="max-w-content mx-auto px-4 py-12">
      <header className="mb-12 border-b-2 border-tinta pb-8 text-center">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-coral">
          Autor · Olvidos de Granada
        </p>
        <h1 className="text-4xl font-black leading-tight tracking-tight text-coral sm:text-6xl">
          <span>[</span>
          {name}
        </h1>
        <p className="mt-4 text-sm text-acero">
          {total} artículo{total !== 1 ? "s" : ""}
        </p>
      </header>

      {articles.length === 0 ? (
        <div className="rounded-sm border border-acero-light/40 bg-gray-50 py-16 text-center">
          <p className="font-editorial text-acero">
            Todavía no hay artículos firmados por {name} en la web.{" "}
            <Link href="/sobre-nosotros" className="font-bold text-coral hover:text-tinta">
              Ver colaboradores
            </Link>
            .
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard
                key={article.id}
                title={article.title}
                slug={article.slug}
                excerpt={article.excerpt}
                coverImage={article.coverImage}
                publishedAt={article.publishedAt}
                categories={article.categories.map((c) => c.category)}
                author={article.author}
                authors={article.authors}
              />
            ))}
          </div>
          <div className="mt-12">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              basePath={`/autor/${params.slug}`}
            />
          </div>
        </>
      )}
    </div>
  );
}
