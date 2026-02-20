import { notFound } from "next/navigation";
import { getPublishedArticles } from "@/lib/actions/articles";
import Link from "next/link";
import Image from "next/image";
import { Calendar, User, Hash } from "lucide-react";

interface TagPageProps {
  params: {
    slug: string;
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { slug } = params;

  // Obtener artículos con esta etiqueta
  const result = await getPublishedArticles({ tag: slug });

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

  // Obtener nombre de etiqueta desde el primer artículo
  const tagName = articles[0]?.tags?.find(
    (tagItem: any) => tagItem.tag?.slug === slug
  )?.tag?.name || slug;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-azul text-white py-16 mt-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <Hash className="w-8 h-8 text-coral" />
            <h1 className="text-5xl font-black">{tagName}</h1>
          </div>
          <p className="text-xl opacity-90">
            {articles.length} artículo{articles.length !== 1 ? "s" : ""} con esta etiqueta
          </p>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="container mx-auto px-4 py-12">
        {articles.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-sm shadow-card">
            <Hash className="w-16 h-16 text-acero-light mx-auto mb-4" />
            <p className="text-acero text-lg">
              No hay artículos publicados con esta etiqueta.
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

                  {/* Tags */}
                  {article.tags && article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {article.tags.slice(0, 3).map((tagItem: any) => (
                        <Link
                          key={tagItem.id}
                          href={`/etiqueta/${tagItem.tag.slug}`}
                          className="px-2 py-1 bg-gray-100 text-xs text-acero rounded hover:bg-coral hover:text-white transition-colors"
                        >
                          #{tagItem.tag.name}
                        </Link>
                      ))}
                    </div>
                  )}

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
