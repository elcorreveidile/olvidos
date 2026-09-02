import { notFound } from "next/navigation";
import { Metadata } from "next";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getArticleBySlug, getPublishedArticles } from "@/lib/actions/articles";
import { SITE_URL, ORGANIZATION } from "@/lib/site";
import { splitPasos, hasPasos } from "@/lib/pasos";
import pasosTitles from "@/data/pasos-titles.json";
import { ArticleView, type ArticleViewModel } from "@/components/content/ArticleView";
import { ESPECIALES, getEspecialBySlug } from "@/lib/con-textos/especiales";

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
  const pieza = hasPasos(article);
  const paso = Number(searchParams?.paso);
  const pasoSuffix = !pieza
    ? ""
    : searchParams?.paso === "todo"
      ? " · Lectura completa"
      : paso > 1
        ? ` · Paso ${paso}`
        : "";
  return {
    title: (article.metaTitle || article.title) + pasoSuffix,
    description: article.metaDescription || article.excerpt || undefined,
    // Las vistas por paso y la lectura seguida son la misma pieza: una sola
    // URL canónica sin parámetros.
    alternates: pieza ? { canonical: `${SITE_URL}/articulos/${article.slug}` } : undefined,
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

const DATE_LONG = new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "long", year: "numeric" });
const DATE_SHORT = new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "short", year: "numeric" });

export default async function ArticlePage({
  params,
  searchParams,
}: ArticlePageProps) {
  const result = await getArticleBySlug(params.slug, true);
  if (!result.success || !result.article) notFound();

  const article = result.article;

  // "Pasos": piezas multi-parte (Piezas y Procesos, Con-textos) paginadas por <!--nextpage-->
  const pieza = hasPasos(article);
  const pasoTitulos = (pasosTitles as Record<string, string[]>)[article.slug];
  const pasos = pieza ? splitPasos(article.content, pasoTitulos) : [];
  // Modo «leer seguido» (?paso=todo): todos los pasos en una sola página.
  const mode: "paso" | "todo" = pieza && searchParams?.paso === "todo" ? "todo" : "paso";
  const currentPaso = pieza
    ? Math.min(Math.max(1, Number(searchParams?.paso) || 1), pasos.length)
    : 1;
  const contentHtml = pieza ? pasos[currentPaso - 1].html : article.content;
  const basePath = `/articulos/${article.slug}`;

  // Especiales «Con-textos»: el cuerpo lleva marcadores de islas interactivas
  // que se resuelven en servidor con los datos tipados del especial.
  const especialId = getEspecialBySlug(article.slug);
  const especialData = especialId ? ESPECIALES[especialId].data() : undefined;

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

  const formattedDate = article.publishedAt ? DATE_LONG.format(new Date(article.publishedAt)) : null;

  const category = article.categories?.[0]?.category;

  const authors: ArticleViewModel["authors"] =
    article.authors && article.authors.length > 0
      ? article.authors.map((a: any) => ({ name: a.author.name, slug: a.author.slug }))
      : article.author?.name
        ? [{ name: article.author.name }]
        : [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.metaDescription || article.excerpt || undefined,
    image: article.coverImage ? [article.coverImage] : undefined,
    datePublished: article.publishedAt || undefined,
    dateModified: article.updatedAt || article.publishedAt || undefined,
    author: authors.map((a) => ({ "@type": "Person", name: a.name })),
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

  const vm: ArticleViewModel = {
    slug: article.slug,
    basePath,
    title: article.title,
    category: category ? { name: category.name, slug: category.slug } : null,
    authors,
    dateLabel: formattedDate,
    cover: article.coverImage
      ? { src: article.coverImage, alt: article.title, credit: article.coverCredit, position: article.coverPosition }
      : null,
    tags: (article.tags ?? [])
      .filter((t: any) => t.tag?.slug)
      .map((t: any) => ({ name: t.tag.name, slug: t.tag.slug })),
    // Si el artículo pertenece a un número de la revista impresa, "volver"
    // lleva a ese número; si es un artículo digital, a la lista general.
    backLink: article.issue
      ? { href: `/revista/${article.issue.slug}`, label: article.issue.title }
      : { href: "/articulos", label: "Todos los artículos" },
    pieza,
    pasos,
    mode,
    currentPaso,
    contentHtml,
    showFullContent,
    membersOnly: Boolean(article.membersOnly),
    excerpt: article.excerpt,
    especial: especialId ? { id: especialId, slug: article.slug, basePath } : undefined,
    especialData,
    recent: recentArticles
      .filter((r) => r.slug !== article.slug)
      .slice(0, 5)
      .map((r) => ({
        id: r.id,
        slug: r.slug,
        title: r.title,
        dateLabel: r.publishedAt ? DATE_SHORT.format(new Date(r.publishedAt)) : null,
      })),
    jsonLd,
  };

  return <ArticleView vm={vm} />;
}

export async function generateStaticParams() {
  const result = await getPublishedArticles({ limit: 1000 });
  if (!result.success || !result.articles) return [];
  return result.articles.map((article) => ({ slug: article.slug }));
}
