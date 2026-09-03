import Image from "next/image";
import Link from "next/link";
import type { Paso } from "@/lib/pasos";
import type { EspecialData } from "@/lib/con-textos/especiales";
import { buildIslaContext } from "@/lib/con-textos/context";
import { PasosNav } from "@/components/content/PasosNav";
import { ArticleBody, ArticleBodyAll } from "@/components/content/ArticleBody";
import { ReadingProgress } from "@/components/content/ReadingProgress";

/**
 * Vista de un artículo (cabecera, portada, cuerpo, pasos, etiquetas y barra
 * lateral). La usan la página pública /articulos/[slug] y la vista previa de
 * los especiales «Con-textos» en el panel de administración.
 */
export interface ArticleViewModel {
  slug: string;
  /** Ruta base de los enlaces de pasos (/articulos/<slug> o la vista previa). */
  basePath: string;
  title: string;
  category?: { name: string; slug: string } | null;
  authors: Array<{ name: string; slug?: string | null }>;
  dateLabel?: string | null;
  cover?: { src: string; alt: string; credit?: string | null; position?: string | null } | null;
  tags: Array<{ name: string; slug: string }>;
  backLink: { href: string; label: string };
  pieza: boolean;
  pasos: Paso[];
  mode: "paso" | "todo";
  currentPaso: number;
  /** HTML del paso actual (o del artículo entero si no hay pasos). */
  contentHtml: string;
  showFullContent: boolean;
  membersOnly: boolean;
  excerpt?: string | null;
  especial?: { id: string; slug: string; basePath: string };
  especialData?: EspecialData;
  recent: Array<{ id: string; slug: string; title: string; dateLabel?: string | null }>;
  jsonLd?: Record<string, unknown>;
}

export function ArticleView({ vm }: { vm: ArticleViewModel }) {
  const { pasos, pieza, showFullContent, currentPaso, basePath } = vm;
  const modeTodo = pieza && vm.mode === "todo";
  const islaCtx =
    vm.especial && vm.especialData
      ? buildIslaContext({
          especial: vm.especial.id,
          slug: vm.especial.slug,
          basePath: vm.especial.basePath,
          mode: "paso",
          pasos,
          pasoN: currentPaso,
          html: vm.contentHtml,
        })
      : undefined;

  return (
    <div className="max-w-content mx-auto px-4 py-12">
      {vm.jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(vm.jsonLd) }} />
      )}
      <Link
        href={vm.backLink.href}
        className="mb-8 inline-block text-sm font-bold text-coral transition-colors hover:text-tinta"
      >
        ← {vm.backLink.label}
      </Link>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_300px]">
        <article className="article-column min-w-0">
          {/* Cabecera del artículo */}
          <header className="mb-8 border-b-2 border-tinta pb-8">
            {vm.category && (
              <Link
                href={`/categoria/${vm.category.slug}`}
                className="category-bracket text-xs font-bold uppercase tracking-wide text-coral"
              >
                {vm.category.name}
              </Link>
            )}
            <h1 className="mt-3 text-4xl font-black leading-tight tracking-tight text-tinta sm:text-5xl">
              {vm.title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-acero">
              {vm.authors.map((a, i) => (
                <span key={a.slug || a.name} className="font-bold text-tinta/80">
                  {a.slug ? (
                    <Link href={`/autor/${a.slug}`} className="transition-colors hover:text-coral">
                      {a.name}
                    </Link>
                  ) : (
                    a.name
                  )}
                  {i < vm.authors.length - 1 && <span className="ml-2 font-normal text-acero">·</span>}
                </span>
              ))}
              {vm.authors.length > 0 && vm.dateLabel && <span>·</span>}
              {vm.dateLabel && <time>{vm.dateLabel}</time>}
            </div>
          </header>

          {/* Imagen de portada */}
          {vm.cover && (
            <figure className="mb-10">
              <div className="relative aspect-[16/9] overflow-hidden rounded-sm bg-tinta/[0.04]">
                <Image
                  src={vm.cover.src}
                  alt={vm.cover.alt}
                  fill
                  className={vm.cover.position === "contain" ? "object-contain" : "object-cover"}
                  style={vm.cover.position === "contain" ? undefined : { objectPosition: vm.cover.position || "center" }}
                  priority
                  sizes="(max-width: 1024px) 100vw, 760px"
                />
              </div>
              {vm.cover.credit && (
                <figcaption className="mt-2 text-right text-xs text-tinta/50">{vm.cover.credit}</figcaption>
              )}
            </figure>
          )}

          {/* Pasos (móvil): la barra lateral se oculta en móvil */}
          {pieza && showFullContent && (
            <PasosNav pasos={pasos} slug={vm.slug} current={currentPaso} basePath={basePath} mode={vm.mode} horizontal />
          )}

          {/* Contenido (oculto si es solo para socios y no hay acceso) */}
          {showFullContent && modeTodo && (
            <>
              <ReadingProgress />
              <ArticleBodyAll pasos={pasos} especial={vm.especial} especialData={vm.especialData} />
            </>
          )}
          {showFullContent && !modeTodo && (
            <ArticleBody html={vm.contentHtml} ctx={islaCtx} especialData={vm.especialData} />
          )}

          {/* Navegación entre pasos */}
          {pieza && showFullContent && !modeTodo && pasos.length > 1 && (
            <nav className="mt-10 flex items-center justify-between gap-4 border-t border-acero-light/40 pt-6">
              {currentPaso > 1 ? (
                <Link
                  href={`${basePath}?paso=${currentPaso - 1}`}
                  className="inline-flex flex-col rounded-sm border border-tinta px-5 py-3 text-tinta transition-colors hover:bg-tinta hover:text-white"
                >
                  <span className="text-xs uppercase tracking-wide opacity-70">← Paso anterior</span>
                  <span className="font-bold">{pasos[currentPaso - 2].title}</span>
                </Link>
              ) : (
                <span />
              )}
              {currentPaso < pasos.length ? (
                <Link
                  href={`${basePath}?paso=${currentPaso + 1}`}
                  className="inline-flex flex-col rounded-sm bg-coral px-5 py-3 text-right text-white transition-colors hover:bg-coral-dark"
                >
                  <span className="text-xs uppercase tracking-wide opacity-80">Paso siguiente →</span>
                  <span className="font-bold">{pasos[currentPaso].title}</span>
                </Link>
              ) : (
                <span />
              )}
            </nav>
          )}

          {/* Tags */}
          {vm.tags.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-2 border-t border-acero-light/40 pt-6">
              {vm.tags.map((t) => (
                <Link
                  key={t.slug}
                  href={`/etiqueta/${t.slug}`}
                  className="tag-paren text-sm font-bold text-coral transition-colors hover:text-tinta"
                >
                  {t.name}
                </Link>
              ))}
            </div>
          )}

          {/* Teaser socios: se muestra cuando el artículo es exclusivo y quien
              lo ve no tiene acceso (en ese caso el cuerpo no se ha renderizado). */}
          {vm.membersOnly && !showFullContent && (
            <div className="mt-10 rounded-sm border border-coral/30 bg-coral/5 p-6">
              <h3 className="mb-2 font-bold text-tinta">Contenido exclusivo para socios</h3>
              {vm.excerpt && <p className="mb-4 font-editorial text-tinta/70">{vm.excerpt}</p>}
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
          {((pieza && showFullContent) || vm.recent.length > 0) && (
            <div className="sticky top-28">
              {pieza && showFullContent && (
                <PasosNav pasos={pasos} slug={vm.slug} current={currentPaso} basePath={basePath} mode={vm.mode} />
              )}
              {vm.recent.length > 0 && (
                <>
                  <h3 className="mb-4 text-sm font-black uppercase tracking-wide text-tinta">
                    <span className="text-coral">[</span>Recientes
                  </h3>
                  <div className="space-y-4">
                    {vm.recent.map((r) => (
                      <Link key={r.id} href={`/articulos/${r.slug}`} className="group block">
                        <h4 className="text-sm font-bold leading-snug text-tinta transition-colors group-hover:text-coral">
                          {r.title}
                        </h4>
                        {r.dateLabel && <p className="mt-1 text-xs text-acero-light">{r.dateLabel}</p>}
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
