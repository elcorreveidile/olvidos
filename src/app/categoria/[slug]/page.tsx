import { notFound } from "next/navigation";
import { getPublishedArticles } from "@/lib/actions/articles";
import Link from "next/link";
import Image from "next/image";
import { Calendar, User } from "lucide-react";

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = params;

  // Obtener artículos de esta categoría
  const result = await getPublishedArticles({ category: slug });

  if (!result.success || !result.articles) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <p className="text-acero">Cargando...</p>
        </div>
      </div>
    );
  }

  const articles = result.articles;

  // Obtener nombre de categoría desde el primer artículo
  const categoryName = articles[0]?.categories?.find(
    (cat: any) => cat.category?.slug === slug
  )?.category?.name || slug;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-azul text-white py-16 mt-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-black mb-4">{categoryName}</h1>
          <p className="text-xl opacity-90">
            {articles.length} artículo{articles.length !== 1 ? "s" : ""} en esta categoría
          </p>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="container mx-auto px-4 py-12">
        {articles.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-sm shadow-card">
            <p className="text-acero text-lg">
              No hay artículos publicados en esta categoría.
            </p>
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
                      <Image
                        src={article.coverImage}
                        alt={article.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </Link>
                )}

                {/* Article Content */}
                <div className="p-6">
                  {/* Categories */}
                  {article.categories && article.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {article.categories.map((cat: any) => (
                        <Link
                          key={cat.id}
                          href={`/categoria/${cat.category.slug}`}
                          className="text-xs font-bold text-coral hover:text-coral/80"
                        >
                          {cat.category.name}
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
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
