import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getArticleBySlug, getPublishedArticles } from "@/lib/actions/articles";
import { Calendar, User, FolderOpen } from "lucide-react";

interface ArticlePageProps {
  params: {
    slug: string;
  };
}

// Generar metadatos dinámicos para SEO
export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const result = await getArticleBySlug(params.slug, true);

  if (!result.success || !result.article) {
    return {
      title: "Artículo no encontrado",
    };
  }

  const article = result.article;

  return {
    title: article.metaTitle || article.title,
    description: article.metaDescription || article.excerpt || undefined,
    openGraph: {
      title: article.metaTitle || article.title,
      description: article.metaDescription || article.excerpt || undefined,
      type: "article",
      publishedTime: article.publishedAt || undefined,
      authors: article.author?.name ? [article.author.name] : undefined,
      images: article.coverImage
        ? [
            {
              url: article.coverImage,
              width: 1200,
              height: 630,
              alt: article.title,
            },
          ]
        : undefined,
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const result = await getArticleBySlug(params.slug, true);

  if (!result.success || !result.article) {
    notFound();
  }

  const article = result.article;

  // Obtener artículos recientes para sidebar
  const recentResult = await getPublishedArticles({ limit: 5 });
  const recentArticles = recentResult.success && recentResult.articles ? recentResult.articles : [];

  // Formatear fecha en español
  const formattedDate = article.publishedAt
    ? new Intl.DateTimeFormat("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(article.publishedAt))
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-200 py-4 mt-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-acero">
            <Link href="/" className="hover:text-coral transition-colors">
              Inicio
            </Link>
            <span>/</span>
            <Link href="/articulos" className="hover:text-coral transition-colors">
              Artículos
            </Link>
            <span>/</span>
            <span className="text-azul font-medium">{article.title}</span>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
          {/* Contenido principal del artículo */}
          <article className="bg-white rounded-sm shadow-card p-8">
            {/* Título H1 */}
            <h1 className="text-4xl md:text-5xl font-black text-azul mb-6">
              {article.title}
            </h1>

            {/* Metadatos del artículo */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-acero mb-8 pb-8 border-b border-gray-200">
              {/* Autor */}
              {article.author && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="font-medium">{article.author.name}</span>
                </div>
              )}

              {/* Fecha de publicación */}
              {formattedDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formattedDate}</span>
                </div>
              )}

              {/* Categorías */}
              {article.categories && article.categories.length > 0 && (
                <div className="flex items-center gap-2">
                  <FolderOpen className="w-4 h-4" />
                  <span className="flex items-center gap-2">
                    {article.categories.map((cat: any, index: number) => (
                      <span key={cat.category?.slug || cat.id}>
                        <Link
                          href={`/categoria/${cat.category?.slug}`}
                          className="text-coral hover:text-coral/80 transition-colors font-medium"
                        >
                          {cat.category?.name}
                        </Link>
                        {index < (article.categories?.length || 0) - 1 && ", "}
                      </span>
                    ))}
                  </span>
                </div>
              )}
            </div>

            {/* Imagen de portada si existe */}
            {article.coverImage && (
              <div className="mb-8 aspect-[16/10] relative overflow-hidden rounded-sm">
                <Image
                  src={article.coverImage}
                  alt={article.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 768px"
                />
              </div>
            )}

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {article.tags.map((tagItem: any) => (
                  <Link
                    key={tagItem.tag?.slug || tagItem.id}
                    href={`/etiqueta/${tagItem.tag?.slug}`}
                    className="px-3 py-1 bg-gray-100 text-acero text-sm rounded-full hover:bg-coral hover:text-white transition-colors"
                  >
                    #{tagItem.tag?.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Contenido del artículo */}
            <div
              className="prose prose-lg max-w-none text-acero"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Teaser para miembros */}
            {article.membersOnly && article.excerpt && (
              <div className="mt-8 p-6 bg-coral/10 rounded-sm border border-coral/30">
                <h3 className="text-azul font-bold mb-2">Contenido exclusivo para socios</h3>
                <p className="text-acero mb-4">{article.excerpt}</p>
                <Link
                  href="/hazte-socio"
                  className="inline-block px-6 py-2 bg-coral text-white text-sm font-bold rounded-sm hover:bg-coral-dark transition-colors"
                >
                  Hazte socio para leer más
                </Link>
              </div>
            )}
          </article>

          {/* Sidebar lateral (desktop) */}
          <aside className="hidden lg:block">
            {/* Artículos recientes */}
            {recentArticles.length > 0 && (
              <div className="bg-white rounded-sm shadow-card p-6 mb-6">
                <h3 className="text-lg font-bold text-azul mb-4">Artículos recientes</h3>
                <div className="space-y-4">
                  {recentArticles.slice(0, 5).map((recentArticle) => (
                    <Link
                      key={recentArticle.id}
                      href={`/articulos/${recentArticle.slug}`}
                      className="block group"
                    >
                      <h4 className="text-sm font-medium text-azul group-hover:text-coral transition-colors line-clamp-2">
                        {recentArticle.title}
                      </h4>
                      {recentArticle.publishedAt && (
                        <p className="text-xs text-acero-light mt-1">
                          {new Date(recentArticle.publishedAt).toLocaleDateString("es-ES", {
                            day: "numeric",
                            month: "short",
                          })}
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}

// Generar rutas estáticas para todos los artículos publicados
export async function generateStaticParams() {
  const result = await getPublishedArticles({ limit: 1000 });

  if (!result.success || !result.articles) {
    return [];
  }

  return result.articles.map((article) => ({
    slug: article.slug,
  }));
}
