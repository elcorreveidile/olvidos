import { notFound, redirect } from "next/navigation";
import { getArticlesByCategory, getCategoriesWithCount } from "@/lib/queries";
import { ArticleCard } from "@/components/content/ArticleCard";
import { Pagination } from "@/components/shared/Pagination";
import { Sidebar } from "@/components/layout/Sidebar";
import type { Metadata } from "next";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

/**
 * Genera metadata dinámica para la categoría
 */
export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getArticlesByCategory(slug, 1, 1);

  if (!result.category) {
    return {
      title: "Categoría no encontrada",
    };
  }

  return {
    title: `[${result.category.name} — Olvidos de Granada`,
    description:
      result.category.description ||
      `Artículos de la categoría ${result.category.name} en Olvidos de Granada.`,
  };
}

/**
 * Server Component para listar artículos por categoría
 */
export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params;
  const { page = "1" } = await searchParams;

  // Validar página
  const currentPage = parseInt(page, 10);
  const itemsPerPage = 12;

  // Obtener datos
  const result = await getArticlesByCategory(slug, currentPage, itemsPerPage);

  // Si la categoría no existe, mostrar 404
  if (!result.category) {
    notFound();
  }

  // Si la página está fuera de rango, redirigir a la página 1
  if (currentPage > result.totalPages && currentPage > 1) {
    redirect(`/categoria/${slug}`);
  }

  // Obtener categorías y artículos recientes para el sidebar
  const [categories, recentArticles] = await Promise.all([
    getCategoriesWithCount(),
    getArticlesByCategory(slug, 1, 5).then((r) =>
      r.articles.map((a) => ({
        title: a.title,
        slug: a.slug,
        publishedAt: a.publishedAt!,
      }))
    ),
  ]);

  const categoriesWithCount = categories.map((cat) => ({
    name: cat.name,
    slug: cat.slug,
    count: cat._count.articles,
  }));

  return (
    <div className="max-w-content mx-auto px-4 py-8">
      <div className="lg:grid lg:grid-cols-[1fr_300px] lg:gap-12">
        {/* Contenido principal */}
        <div className="space-y-8">
          {/* Header de sección */}
          <header className="border-b border-acero-light pb-6">
            <h1 className="text-4xl font-bold text-azul mb-4">
              <span className="text-coral">[</span>
              {result.category.name}
            </h1>
            {result.category.description && (
              <p className="text-lg text-acero leading-relaxed">
                {result.category.description}
              </p>
            )}
            <p className="text-sm text-acero-light mt-2">
              {result.total} artículo{result.total !== 1 ? "s" : ""}
            </p>
          </header>

          {/* Estado vacío */}
          {result.articles.length === 0 && (
            <div className="text-center py-12">
              <p className="text-acero text-lg">
                No hay artículos publicados en esta categoría.
              </p>
            </div>
          )}

          {/* Grid de artículos */}
          {result.articles.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {result.articles.map((article) => (
                  <ArticleCard
                    key={article.id}
                    title={article.title}
                    slug={article.slug}
                    excerpt={article.excerpt}
                    coverImage={article.coverImage}
                    publishedAt={article.publishedAt}
                    category={article.categories[0]?.category || null}
                    author={article.author}
                  />
                ))}
              </div>

              {/* Paginación */}
              {result.totalPages > 1 && (
                <div className="pt-8">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={result.totalPages}
                    basePath={`/categoria/${slug}`}
                  />
                </div>
              )}
            </>
          )}
        </div>

        {/* Sidebar */}
        <aside>
          <Sidebar
            categories={categoriesWithCount}
            recentArticles={recentArticles}
          />
        </aside>
      </div>
    </div>
  );
}
