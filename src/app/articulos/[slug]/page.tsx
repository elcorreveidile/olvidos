import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getArticleBySlug, getPublishedArticles, getCategoriesWithCount } from "@/lib/queries";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Sidebar } from "@/components/layout/Sidebar";
import { ContentStatus } from "@prisma/client";

interface ArticlePageProps {
  params: {
    slug: string;
  };
}

// Generar metadatos dinámicos para SEO
export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug);

  if (!article) {
    return {
      title: "Artículo no encontrado",
    };
  }

  return {
    title: article.metaTitle || article.title,
    description: article.metaDescription || article.excerpt || undefined,
    openGraph: {
      title: article.metaTitle || article.title,
      description: article.metaDescription || article.excerpt || undefined,
      type: "article",
      publishedTime: article.publishedAt || undefined,
      authors: article.author.name ? [article.author.name] : undefined,
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

// Server Component para la página de artículo
export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = await getArticleBySlug(params.slug);

  // 404 si el artículo no existe
  if (!article) {
    notFound();
  }

  // Obtener artículos recientes y categorías para el sidebar
  const [recentArticles, categoriesWithCount] = await Promise.all([
    getPublishedArticles(1, 5),
    getCategoriesWithCount(),
  ]);

  // Formatear fecha en español
  const formattedDate = article.publishedAt
    ? new Intl.DateTimeFormat("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(article.publishedAt))
    : null;

  // TODO: Implementar lógica de membresía cuando se tenga auth
  // Por ahora, mostramos el contenido completo si está publicado
  const showFullContent = article.status === "PUBLISHED";

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-content mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12">
          {/* Contenido principal del artículo */}
          <article className="max-w-article">
            {/* Título H1 con estilo editorial */}
            <h1 className="text-h1-article text-azul font-bold mb-8">
              {article.title}
            </h1>

            {/* Imagen de portada si existe */}
            {article.coverImage && (
              <div className="mb-8 aspect-[16/10] relative overflow-hidden rounded-sm">
                <Image
                  src={article.coverImage}
                  alt={article.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 695px) 100vw, 695px"
                />
              </div>
            )}

            {/* Metadatos del artículo */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-acero mb-8 pb-8 border-b border-acero-light/30">
              {/* Autor */}
              {article.author.name && (
                <span className="font-medium">{article.author.name}</span>
              )}

              {/* Fecha de publicación */}
              {formattedDate && <span>{formattedDate}</span>}

              {/* Categorías */}
              {article.categories.length > 0 && (
                <span className="flex items-center gap-2">
                  {article.categories.map((cat, index) => (
                    <span key={cat.category.slug}>
                      <Link
                        href={`/articulos?categoria=${cat.category.slug}`}
                        className="category-bracket hover:text-coral transition-colors"
                      >
                        {cat.category.name}
                      </Link>
                      {index < article.categories.length - 1 && ", "}
                    </span>
                  ))}
                </span>
              )}

              {/* Número de revista si existe */}
              {article.issue && (
                <span>
                  <Link
                    href={`/revista/${article.issue.slug}`}
                    className="hover:text-coral transition-colors"
                  >
                    Nº {article.issue.number}
                  </Link>
                </span>
              )}
            </div>

            {/* Tags */}
            {article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {article.tags.map((tag) => (
                  <Link
                    key={tag.tag.slug}
                    href={`/articulos?tag=${tag.tag.slug}`}
                    className="tag-paren text-sm text-acero hover:text-coral transition-colors"
                  >
                    {tag.tag.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Contenido del artículo */}
            {showFullContent ? (
              <div
                className="prose-editorial"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            ) : (
              <div className="prose-editorial">
                <p className="text-acero-light italic">
                  Este artículo aún no está disponible.
                </p>
              </div>
            )}

            {/* Teaser para miembros (cuando se implemente auth) */}
            {article.membersOnly && !showFullContent && article.excerpt && (
              <div className="mt-8 p-6 bg-surface rounded-sm border border-acero-light/30">
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
            <Sidebar
              categories={categoriesWithCount.map((cat) => ({
                name: cat.name,
                slug: cat.slug,
                count: cat._count.articles,
              }))}
              recentArticles={recentArticles.articles.map((art) => ({
                title: art.title,
                slug: art.slug,
                publishedAt: art.publishedAt!,
              }))}
            />
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// Generar rutas estáticas para todos los artículos publicados
export async function generateStaticParams() {
  const articles = await getPublishedArticles(1, 1000);

  return articles.articles.map((article) => ({
    slug: article.slug,
  }));
}
