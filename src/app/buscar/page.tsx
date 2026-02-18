import { redirect } from "next/navigation";
import { searchArticles, getCategoriesWithCount } from "@/lib/queries";
import { ArticleCard } from "@/components/content/ArticleCard";
import { Pagination } from "@/components/shared/Pagination";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import type { Metadata } from "next";

interface SearchPageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

/**
 * Genera metadata dinámica para la página de búsqueda
 */
export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;

  if (!q) {
    return {
      title: "Buscar — Olvidos de Granada",
      description: "Busca artículos, eventos y más en Olvidos de Granada.",
    };
  }

  const decodedQuery = decodeURIComponent(q);
  return {
    title: `"${decodedQuery}" — Resultados de búsqueda — Olvidos de Granada`,
    description: `Resultados de búsqueda para "${decodedQuery}" en Olvidos de Granada.`,
  };
}

/**
 * Server Component para la página de búsqueda
 */
export default async function SearchPage({
  searchParams,
}: SearchPageProps) {
  const { q: rawQuery, page: rawPage = "1" } = await searchParams;

  // Decodificar y limpiar la consulta
  const query = rawQuery ? decodeURIComponent(rawQuery).trim() : "";
  const currentPage = parseInt(rawPage, 10);
  const itemsPerPage = 12;

  // Obtener categorías para el sidebar (siempre)
  const categoriesWithCount = await getCategoriesWithCount();

  // Estado: No hay consulta
  if (!query) {
    return (
      <div className="min-h-screen bg-white">
        <Header />

        <main className="max-w-content mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12">
            {/* Contenido principal */}
            <div className="space-y-8">
              {/* Header de sección */}
              <header className="border-b border-acero-light pb-6">
                <h1 className="text-4xl font-bold text-azul mb-4">
                  Buscar
                </h1>
                <p className="text-lg text-acero leading-relaxed">
                  Introduce un término de búsqueda para encontrar artículos.
                </p>
              </header>

              {/* Search input */}
              <div className="bg-surface p-6 rounded-sm border border-acero-light/30">
                <form action="/buscar" method="get" className="flex gap-2">
                  <input
                    type="search"
                    name="q"
                    placeholder="Buscar artículos, eventos..."
                    className="flex-1 px-4 py-2 border border-acero-light rounded-sm text-sm focus:outline-none focus:border-coral transition-colors"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="px-6 py-2 bg-coral text-white text-sm font-bold rounded-sm hover:bg-coral-dark transition-colors"
                  >
                    Buscar
                  </button>
                </form>
              </div>
            </div>

            {/* Sidebar lateral (desktop) */}
            <aside className="hidden lg:block">
              <Sidebar
                categories={categoriesWithCount.map((cat) => ({
                  name: cat.name,
                  slug: cat.slug,
                  count: cat._count.articles,
                }))}
                recentArticles={[]}
              />
            </aside>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // Realizar búsqueda
  const searchResult = await searchArticles(query, currentPage, itemsPerPage);

  // Si la página está fuera de rango, redirigir a la página 1
  if (currentPage > searchResult.totalPages && currentPage > 1) {
    redirect(`/buscar?q=${encodeURIComponent(query)}`);
  }

  // Obtener artículos recientes para el sidebar (usando resultados de búsqueda si hay)
  const recentArticles = searchResult.articles.slice(0, 5).map((art) => ({
    title: art.title,
    slug: art.slug,
    publishedAt: art.publishedAt!,
  }));

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-content mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12">
          {/* Contenido principal */}
          <div className="space-y-8">
            {/* Header de sección */}
            <header className="border-b border-acero-light pb-6">
              <h1 className="text-4xl font-bold text-azul mb-4">
                Resultados para: <span className="text-coral">&quot;{query}&quot;</span>
              </h1>
              <p className="text-sm text-acero-light">
                {searchResult.total} resultado{searchResult.total !== 1 ? "s" : ""} encontrado{searchResult.total !== 1 ? "s" : ""}
              </p>
            </header>

            {/* Search input */}
            <div className="bg-surface p-6 rounded-sm border border-acero-light/30">
              <form action="/buscar" method="get" className="flex gap-2">
                <input
                  type="search"
                  name="q"
                  defaultValue={query}
                  placeholder="Buscar artículos, eventos..."
                  className="flex-1 px-4 py-2 border border-acero-light rounded-sm text-sm focus:outline-none focus:border-coral transition-colors"
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-coral text-white text-sm font-bold rounded-sm hover:bg-coral-dark transition-colors"
                >
                  Buscar
                </button>
              </form>
            </div>

            {/* Estado vacío: No hay resultados */}
            {searchResult.articles.length === 0 && (
              <div className="text-center py-12">
                <p className="text-acero text-lg">
                  No se encontraron resultados para &quot;{query}&quot;
                </p>
                <p className="text-acero-light mt-2">
                  Intenta con otros términos de búsqueda.
                </p>
              </div>
            )}

            {/* Grid de artículos */}
            {searchResult.articles.length > 0 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {searchResult.articles.map((article) => (
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
                {searchResult.totalPages > 1 && (
                  <div className="pt-8">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={searchResult.totalPages}
                      basePath="/buscar"
                      searchParams={{ q: query }}
                    />
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sidebar lateral (desktop) */}
          <aside className="hidden lg:block">
            <Sidebar
              categories={categoriesWithCount.map((cat) => ({
                name: cat.name,
                slug: cat.slug,
                count: cat._count.articles,
              }))}
              recentArticles={recentArticles}
            />
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
