import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getArticleBySlug, getPublishedArticles } from "@/lib/actions/articles";
import { SITE_URL, SITE_NAME, ORGANIZATION } from "@/lib/site";
import { splitPasos, hasPasos } from "@/lib/pasos";
import { PasosNav } from "@/components/content/PasosNav";
import pasosTitles from "@/data/pasos-titles.json";
import { ArticleBody } from "@/components/content/ArticleBody";
import { ESPECIALES, getEspecialBySlug } from "@/lib/con-textos/especiales";
import { buildIslaContext } from "@/lib/con-textos/context";

interface ArticlePageProps {
  params: { slug: string };
  searchParams?: { paso?: string };
}

export async function generateMetadata({
  params,
  searchParams,
}: ArticlePageProps): Promise<Metadata> {
  const result = await getArticleBySlug(params.slug, true);
  if (!result.success || !result.article) {
    return { title: "Artículo no encontrado" };
  }
  const article = result.article;
  const paso = Number(searchParams?.paso);
  const pasoSuffix = hasPasos(article) && paso > 1 ? ` · Paso ${paso}` : "";
  return {
    title: (article.metaTitle || article.title) + pasoSuffix,
    description: article.metaDescription || article.excerpt || undefined,
    openGraph: {
      title: article.metaTitle || article.title,
      description: article.metaDescription || article.excerpt || undefined,
      type: "article",
      publishedTime: article.publishedAt || undefined,
      authors: article.author?.name ? [article.author.name] : undefined,
      images: article.coverImage
        ? [{ url: article.coverImage, width: 1200, height: 630, alt: article.title }]
        : undefined,
    },
  };
}

export default async function ArticlePage({
  params,
  searchParams,
}: ArticlePageProps) {
  const result = await getArticleBySlug(params.slug, true);
  if (!result.success || !result.article) notFound();

  const article = result.article;

  // "Pasos": piezas multi-parte (Piezas y Procesos) paginadas por <!--nextpage-->
  const pieza = hasPasos(article);
  const pasoTitulos = (pasosTitles as Record<string, string[]>)[article.slug];
  const pasos = pieza ? splitPasos(article.content, pasoTitulos) : [];
  const currentPaso = pieza
    ? Math.min(Math.max(1, Number(searchParams?.paso) || 1), pasos.length)
    : 1;
  const contentHtml = pieza ? pasos[currentPaso - 1].html : article.content;

  // Especiales «Con-textos»: el cuerpo lleva marcadores de islas interactivas
  // que se resuelven en servidor con los datos tipados del especial.
  const especialId = getEspecialBySlug(article.slug);
  const especialData = especialId ? ESPECIALES[especialId].data() : undefined;
  const islaCtx = especialId
    ? buildIslaContext({
        especial: especialId,
        slug: article.slug,
        basePath: `/articulos/${article.slug}`,
        mode: "paso",
        pasos,
        pasoN: currentPaso,
        html: contentHtml,
      })
    : undefined;

  // Muro para artículos "solo socios": el cuerpo NUNCA debe llegar al HTML de
  // quien no tiene acceso. Solo se llama a auth() cuando el artículo es
  // membersOnly, así los artículos normales siguen siendo estáticos.
  // Tienen acceso: staff (ADMIN/EDITOR/MEMBER_ADMIN) y socios con estado ACTIVE.
  let showFullContent = true;
  if (article.membersOnly) {
    const session = await auth();
    const role = session?.user?.role;
    if (role === "ADMIN" || role === "EDITOR" || role === "MEMBER_ADMIN") {
      showFullContent = true;
    } else if (session?.user?.id) {
      const activeMember = await db.member.findFirst({
        where: { userId: session.user.id, status: "ACTIVE" },
        select: { id: true },
      });
      showFullContent = Boolean(activeMember);
    } else {
      showFullContent = false;
    }
  }

  const recentResult = await getPublishedArticles({ limit: 5 });
  const recentArticles =
    recentResult.success && recentResult.articles ? recentResult.articles : [];

  const formattedDate = article.publishedAt
    ? new Intl.DateTimeFormat("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(article.publishedAt))
    : null;

  const category = article.categories?.[0]?.category;

  const authorNames =
    article.authors && article.authors.length > 0
      ? article.authors.map((a: any) => a.author.name)
      : article.author?.name
        ? [article.author.name]
        : [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.metaDescription || article.excerpt || undefined,
    image: article.coverImage ? [article.coverImage] : undefined,
    datePublished: article.publishedAt || undefined,
    dateModified: article.updatedAt || article.publishedAt || undefined,
    author: authorNames.map((n: string) => ({ "@type": "Person", name: n })),
    publisher: {
      "@type": "Organization",
      name: ORGANIZATION.name,
      url: SITE_URL,
    },
    mainEntityOfPage: `${SITE_URL}/articulos/${article.slug}`,
    isAccessibleForFree: !article.membersOnly,
    inLanguage: "es",
    articleSection: category?.name,
  };

  return (
    <div className="max-w-content mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Si el artículo pertenece a un número de la revista impresa, "volver"
          lleva a ese número; si es un artículo digital, a la lista general. */}
      {article.issue ? (
        <Link
          href={`/revista/${article.issue.slug}`}
          className="mb-8 inline-block text-sm font-bold text-coral transition-colors hover:text-tinta"
        >
          ← {article.issue.title}
        </Link>
      ) : (
        <Link
          href="/articulos"
          className="mb-8 inline-block text-sm font-bold text-coral transition-colors hover:text-tinta"
        >
          ← Todos los artículos
        </Link>
      )}

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_300px]">
        <article className="article-column min-w-0">
          {/* Cabecera del artículo */}
          <header className="mb-8 border-b-2 border-tinta pb-8">
            {category && (
              <Link
                href={`/categoria/${category.slug}`}
                className="category-bracket text-xs font-bold uppercase tracking-wide text-coral"
              >
                {category.name}
              </Link>
            )}
            <h1 className="mt-3 text-4xl font-black leading-tight tracking-tight text-tinta sm:text-5xl">
              {article.title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-acero">
              {article.authors && article.authors.length > 0 ? (
                article.authors.map((a: any, i: number) => (
                  <span key={a.author.slug} className="font-bold text-tinta/80">
                    <Link
                      href={`/autor/${a.author.slug}`}
                      className="transition-colors hover:text-coral"
                    >
                      {a.author.name}
                    </Link>
                    {i < article.authors.length - 1 && (
                      <span className="ml-2 font-normal text-acero">·</span>
                    )}
                  </span>
                ))
              ) : article.author?.name ? (
                <span className="font-bold text-tinta/80">
                  {article.author.name}
                </span>
              ) : null}
              {(article.authors?.length > 0 || article.author?.name) &&
                formattedDate && <span>·</span>}
              {formattedDate && <time>{formattedDate}</time>}
            </div>
          </header>

          {/* Imagen de portada */}
          {article.coverImage && (
            <figure className="mb-10">
              <div className="relative aspect-[16/9] overflow-hidden rounded-sm bg-tinta/[0.04]">
                <Image
                  src={article.coverImage}
                  alt={article.title}
                  fill
                  className={
                    article.coverPosition === "contain"
                      ? "object-contain"
                      : "object-cover"
                  }
                  style={
                    article.coverPosition === "contain"
                      ? undefined
                      : { objectPosition: article.coverPosition || "center" }
                  }
                  priority
                  sizes="(max-width: 1024px) 100vw, 760px"
                />
              </div>
              {article.coverCredit && (
                <figcaption className="mt-2 text-right text-xs text-tinta/50">
                  {article.coverCredit}
                </figcaption>
              )}
            </figure>
          )}

          {/* Pasos (móvil): la barra lateral se oculta en móvil */}
          {pieza && showFullContent && (
            <PasosNav pasos={pasos} slug={article.slug} current={currentPaso} horizontal />
          )}

          {/* Contenido (oculto si es solo para socios y no hay acceso) */}
          {showFullContent && (
            <ArticleBody html={contentHtml} ctx={islaCtx} especialData={especialData} />
          )}

          {/* Navegación entre pasos */}
          {pieza && showFullContent && pasos.length > 1 && (
            <nav className="mt-10 flex items-center justify-between gap-4 border-t border-acero-light/40 pt-6">
              {currentPaso > 1 ? (
                <Link
                  href={`/articulos/${article.slug}?paso=${currentPaso - 1}`}
                  className="inline-flex flex-col rounded-sm border border-tinta px-5 py-3 text-tinta transition-colors hover:bg-tinta hover:text-white"
                >
                  <span className="text-xs uppercase tracking-wide opacity-70">
                    ← Paso anterior
                  </span>
                  <span className="font-bold">{pasos[currentPaso - 2].title}</span>
                </Link>
              ) : (
                <span />
              )}
              {currentPaso < pasos.length ? (
                <Link
                  href={`/articulos/${article.slug}?paso=${currentPaso + 1}`}
                  className="inline-flex flex-col rounded-sm bg-coral px-5 py-3 text-right text-white transition-colors hover:bg-coral-dark"
                >
                  <span className="text-xs uppercase tracking-wide opacity-80">
                    Paso siguiente →
                  </span>
                  <span className="font-bold">{pasos[currentPaso].title}</span>
                </Link>
              ) : (
                <span />
              )}
            </nav>
          )}

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-2 border-t border-acero-light/40 pt-6">
              {article.tags.map((tagItem: any) => (
                <Link
                  key={tagItem.tag?.slug || tagItem.id}
                  href={`/etiqueta/${tagItem.tag?.slug}`}
                  className="tag-paren text-sm font-bold text-coral transition-colors hover:text-tinta"
                >
                  {tagItem.tag?.name}
                </Link>
              ))}
            </div>
          )}

          {/* Teaser socios: se muestra cuando el artículo es exclusivo y quien
              lo ve no tiene acceso (en ese caso el cuerpo no se ha renderizado). */}
          {article.membersOnly && !showFullContent && (
            <div className="mt-10 rounded-sm border border-coral/30 bg-coral/5 p-6">
              <h3 className="mb-2 font-bold text-tinta">
                Contenido exclusivo para socios
              </h3>
              {article.excerpt && (
                <p className="mb-4 font-editorial text-tinta/70">
                  {article.excerpt}
                </p>
              )}
              <Link
                href="/hazte-socio"
                className="inline-block rounded-sm bg-coral px-6 py-2 text-sm font-bold text-white transition-colors hover:bg-coral-dark"
              >
                Hazte socio para leer más
              </Link>
            </div>
          )}
        </article>

        {/* Sidebar */}
        <aside className="hidden lg:block">
          {((pieza && showFullContent) || recentArticles.length > 0) && (
            <div className="sticky top-28">
              {pieza && showFullContent && (
                <PasosNav
                  pasos={pasos}
                  slug={article.slug}
                  current={currentPaso}
                />
              )}
              {recentArticles.length > 0 && (
                <>
                  <h3 className="mb-4 text-sm font-black uppercase tracking-wide text-tinta">
                    <span className="text-coral">[</span>Recientes
                  </h3>
                  <div className="space-y-4">
                    {recentArticles
                      .filter((r) => r.slug !== article.slug)
                      .slice(0, 5)
                      .map((r) => (
                        <Link key={r.id} href={`/articulos/${r.slug}`} className="group block">
                          <h4 className="text-sm font-bold leading-snug text-tinta transition-colors group-hover:text-coral">
                            {r.title}
                          </h4>
                          {r.publishedAt && (
                            <p className="mt-1 text-xs text-acero-light">
                              {new Date(r.publishedAt).toLocaleDateString("es-ES", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </p>
                          )}
                        </Link>
                      ))}
                  </div>
                </>
              )}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const result = await getPublishedArticles({ limit: 1000 });
  if (!result.success || !result.articles) return [];
  return result.articles.map((article) => ({ slug: article.slug }));
}
