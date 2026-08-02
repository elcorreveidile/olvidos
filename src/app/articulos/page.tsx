import Link from "next/link";
import type { Metadata } from "next";
import {
  getPublishedArticles,
  getArticlesByCategory,
  getArticlesByTag,
  searchArticles,
} from "@/lib/queries";
import { ArticleCard } from "@/components/content/ArticleCard";
import { CategoryHeading } from "@/components/content/CategoryHeading";
import { Pagination } from "@/components/shared/Pagination";
import { SearchInline } from "@/components/shared/SearchInline";

export const dynamic = "force-dynamic";

const PER_PAGE = 24;

export const metadata: Metadata = {
  title: "Artículos",
  description:
    "Artículos, ensayos y creación de Olvidos de Granada: editoriales, palabras, piezas y procesos, Soneto500 y más.",
};

interface ArticulosPageProps {
  searchParams: { categoria?: string; tag?: string; q?: string; page?: string };
}

export default async function ArticulosPage({
  searchParams,
}: ArticulosPageProps) {
  const { categoria, tag } = searchParams;
  const q = searchParams.q?.trim() || "";
  const page = Math.max(1, Number(searchParams.page) || 1);

  let articles;
  let totalPages = 1;
  let total = 0;
  let eyebrow = "La época digital";
  let title = "artículos";
  let intro: string | null = null;
  let categoryName: string | null = null;
  const searching = q.length > 0;
  const spForPagination: Record<string, string> = {};

  if (searching) {
    const r = await searchArticles(q, page, PER_PAGE, categoria);
    articles = r.articles;
    totalPages = r.totalPages;
    total = r.total;
    categoryName = r.category?.name ?? categoria ?? null;
    eyebrow = categoryName ? `Búsqueda · ${categoryName}` : "Búsqueda";
    title = q;
    spForPagination.q = q;
    if (categoria) spForPagination.categoria = categoria;
  } else if (categoria) {
    const r = await getArticlesByCategory(categoria, page, PER_PAGE);
    articles = r.articles;
    totalPages = r.totalPages;
    total = r.total;
    eyebrow = "Categoría";
    title = r.category?.name ?? categoria;
    categoryName = r.category?.name ?? categoria;
    intro = r.category?.description ?? null;
    spForPagination.categoria = categoria;
  } else if (tag) {
    const r = await getArticlesByTag(tag, page, PER_PAGE);
    articles = r.articles;
    totalPages = r.totalPages;
    total = r.total;
    eyebrow = "Etiqueta";
    title = r.tag?.name ?? tag;
    spForPagination.tag = tag;
  } else {
    const r = await getPublishedArticles(page, PER_PAGE);
    articles = r.articles;
    totalPages = r.totalPages;
    total = r.total;
  }

  const noun = searching ? "resultado" : "artículo";
  const resetHref = categoria ? `/articulos?categoria=${categoria}` : "/articulos";

  return (
    <div className="max-w-content mx-auto px-4 py-12">
      <header className="mb-10 border-b-2 border-tinta pb-8 text-center">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-coral">
          {eyebrow}
        </p>
        <CategoryHeading>{title}</CategoryHeading>
        {intro && (
          <p className="mx-auto mt-6 max-w-2xl font-editorial text-lg leading-snug text-tinta/75">
            {intro}
          </p>
        )}
        <p className="mt-6 font-editorial text-lg text-tinta/70">
          {total} {noun}
          {total !== 1 ? "s" : ""}
          {(searching || categoria || tag) && (
            <>
              {" · "}
              <Link
                href={searching ? resetHref : "/articulos"}
                className="font-bold text-coral hover:text-tinta"
              >
                {searching ? "quitar búsqueda" : "ver todos"}
              </Link>
            </>
          )}
        </p>
      </header>

      {/* Buscador (dentro de la categoría si procede) */}
      <div className="mb-10">
        <SearchInline
          categoria={categoria}
          defaultValue={q}
          scopeLabel={categoryName ?? undefined}
        />
      </div>

      {articles.length === 0 ? (
        <div className="rounded-sm border border-acero-light/40 bg-gray-50 py-16 text-center">
          <p className="font-editorial text-acero">
            {searching
              ? `No se han encontrado resultados para «${q}»${
                  categoryName ? ` en ${categoryName}` : ""
                }.`
              : "No hay artículos en esta selección."}
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
                coverPosition={article.coverPosition}
                publishedAt={article.publishedAt}
                categories={article.categories.map((c) => c.category)}
                author={article.author}
                authors={article.authors}
                highlightCategory={categoria}
              />
            ))}
          </div>
          <div className="mt-12">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              basePath="/articulos"
              searchParams={spForPagination}
            />
          </div>
        </>
      )}
    </div>
  );
}
