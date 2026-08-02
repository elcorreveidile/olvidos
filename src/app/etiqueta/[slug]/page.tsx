import type { Metadata } from "next";
import { getArticlesByTag } from "@/lib/queries";
import { ArticleCard } from "@/components/content/ArticleCard";
import { CategoryHeading } from "@/components/content/CategoryHeading";
import { Pagination } from "@/components/shared/Pagination";

export const dynamic = "force-dynamic";

const PER_PAGE = 24;

interface TagPageProps {
  params: { slug: string };
  searchParams: { page?: string };
}

export async function generateMetadata({
  params,
}: TagPageProps): Promise<Metadata> {
  const { tag } = await getArticlesByTag(params.slug, 1, 1);
  return { title: tag?.name ? `#${tag.name}` : "Etiqueta" };
}

export default async function TagPage({ params, searchParams }: TagPageProps) {
  const page = Math.max(1, Number(searchParams.page) || 1);
  const { articles, totalPages, total, tag } = await getArticlesByTag(
    params.slug,
    page,
    PER_PAGE
  );

  return (
    <div className="max-w-content mx-auto px-4 py-12">
      <header className="mb-12 border-b-2 border-tinta pb-8 text-center">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-coral">
          Etiqueta
        </p>
        <CategoryHeading>{tag?.name ?? params.slug}</CategoryHeading>
        <p className="mt-6 font-editorial text-lg text-tinta/70">
          {total} artículo{total !== 1 ? "s" : ""}
        </p>
      </header>

      {articles.length === 0 ? (
        <div className="rounded-sm border border-acero-light/40 bg-gray-50 py-16 text-center">
          <p className="font-editorial text-acero">
            No hay artículos con esta etiqueta.
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
              />
            ))}
          </div>
          <div className="mt-12">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              basePath={`/etiqueta/${params.slug}`}
            />
          </div>
        </>
      )}
    </div>
  );
}
