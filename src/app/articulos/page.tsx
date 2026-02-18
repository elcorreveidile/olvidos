import { getPublishedArticles } from "@/lib/actions/articles";
import Link from "next/link";
import { Calendar, User, Tag } from "lucide-react";

export const dynamic = "force-dynamic";

interface ArticulosPageProps {
  searchParams: {
    categoria?: string;
    tag?: string;
  };
}

export default async function ArticulosPage({
  searchParams,
}: ArticulosPageProps) {
  const { categoria, tag } = searchParams;

  // Obtener artículos con filtro si existe
  const result = await getPublishedArticles(
    categoria ? { category: categoria } : tag ? { tag } : undefined
  );

  const articles = result.success && result.articles ? result.articles : [];

  // Obtener nombre de la categoría/tag si está filtrando
  let filterName = "";
  let filterType = "";

  if (articles.length > 0) {
    if (categoria) {
      filterName =
        articles[0]?.categories?.find(
          (cat: any) => cat.category?.slug === categoria
        )?.category?.name || categoria;
      filterType = "categoría";
    } else if (tag) {
      filterName =
        articles[0]?.tags?.find(
          (tagItem: any) => tagItem.tag?.slug === tag
        )?.tag?.name || tag;
      filterType = "etiqueta";
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-azul text-white py-16 mt-16">
        <div className="container mx-auto px-4">
          {filterName ? (
            <div>
              <p className="text-lg opacity-75 mb-2">
                {filterType === "categoría" ? "Categoría" : "Etiqueta"}:{" "}
                <span className="font-bold">{filterName}</span>
              </p>
              <h1 className="text-5xl font-black mb-4">
                {articles.length} artículo{articles.length !== 1 ? "s" : ""}
              </h1>
              <Link
                href="/articulos"
                className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors"
              >
                <Tag className="w-4 h-4" />
                Ver todos los artículos
              </Link>
            </div>
          ) : (
            <div>
              <h1 className="text-5xl font-black mb-4">Artículos</h1>
              <p className="text-xl opacity-90">
                Explora nuestra colección de artículos culturales y literarios
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="container mx-auto px-4 py-12">
        {articles.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-sm shadow-card">
            <Tag className="w-16 h-16 text-acero-light mx-auto mb-4" />
            <p className="text-acero text-lg mb-4">
              {filterName
                ? `No hay artículos en ${filterType} "${filterName}"`
                : "No hay artículos publicados aún."}
            </p>
            {filterName && (
              <Link
                href="/articulos"
                className="inline-block px-6 py-2 bg-coral text-white font-bold rounded-sm hover:bg-coral-dark transition-colors"
              >
                Ver todos los artículos
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <article
                key={article.id}
                className="bg-white rounded-sm shadow-card hover:shadow-card-hover transition-all"
              >
                {/* Article Image */}
                {article.coverImage && (
                  <Link href={`/articulos/${article.slug}`}>
                    <div className="relative h-48 overflow-hidden rounded-t-sm">
                      <img
                        src={article.coverImage}
                        alt={article.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </Link>
                )}

                {/* Article Content */}
                <div className="p-6">
                  {/* Categories */}
                  {article.categories && article.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {article.categories.map((catItem: any) => (
                        <Link
                          key={catItem.id}
                          href={`/articulos?categoria=${catItem.category.slug}`}
                          className="text-xs font-bold text-coral hover:text-coral/80"
                        >
                          {catItem.category.name}
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Title */}
                  <Link href={`/articulos/${article.slug}`}>
                    <h2 className="text-xl font-bold text-azul mb-3 hover:text-coral transition-colors line-clamp-2">
                      {article.title}
                    </h2>
                  </Link>

                  {/* Excerpt */}
                  <p className="text-acero mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-sm text-acero-light">
                    {article.author && (
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{article.author.name}</span>
                      </div>
                    )}
                    {article.publishedAt && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <time>
                          {new Date(article.publishedAt).toLocaleDateString(
                            "es-ES",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </time>
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  {article.tags && article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-acero/10">
                      {article.tags.slice(0, 3).map((tagItem: any) => (
                        <Link
                          key={tagItem.id}
                          href={`/articulos?tag=${tagItem.tag.slug}`}
                          className="flex items-center gap-1 text-xs text-acero hover:text-coral transition-colors"
                        >
                          <Tag className="w-3 h-3" />
                          {tagItem.tag.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
