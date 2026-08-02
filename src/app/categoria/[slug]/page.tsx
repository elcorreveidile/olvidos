import type { Metadata } from "next";
import { getArticlesByCategory } from "@/lib/queries";
import { ArticleCard } from "@/components/content/ArticleCard";
import { CategoryHeading } from "@/components/content/CategoryHeading";
import { Pagination } from "@/components/shared/Pagination";
import { SearchInline } from "@/components/shared/SearchInline";

export const dynamic = "force-dynamic";

const PER_PAGE = 24;

interface CategoryPageProps {
  params: { slug: string };
  searchParams: { page?: string };
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category } = await getArticlesByCategory(params.slug, 1, 1);
  return { title: category?.name ?? "Categoría" };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const page = Math.max(1, Number(searchParams.page) || 1);
  const { articles, totalPages, total, category } = await getArticlesByCategory(
    params.slug,
    page,
    PER_PAGE
  );

  return (
    <div className="max-w-content mx-auto px-4 py-12">
      <header className="mb-12 border-b-2 border-tinta pb-8 text-center">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-coral">
          Categoría
        </p>
        <CategoryHeading>{category?.name ?? params.slug}</CategoryHeading>
        {category?.description && (
          <p className="mx-auto mt-6 max-w-2xl font-editorial text-lg leading-snug text-tinta/75">
            {category.description}
          </p>
        )}
        <p className="mt-6 font-editorial text-lg text-tinta/70">
          {total} artículo{total !== 1 ? "s" : ""}
        </p>
      </header>

      <div className="mb-10">
        <SearchInline categoria={params.slug} scopeLabel={category?.name} />
      </div>

      {articles.length === 0 ? (
        <div className="rounded-sm border border-acero-light/40 bg-gray-50 py-16 text-center">
          <p className="font-editorial text-acero">
            No hay artículos publicados en esta categoría.
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
                highlightCategory={params.slug}
              />
            ))}
          </div>
          <div className="mt-12">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              basePath={`/categoria/${params.slug}`}
            />
          </div>
        </>
      )}
    </div>
  );
}
