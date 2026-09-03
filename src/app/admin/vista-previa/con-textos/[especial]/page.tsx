import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { splitPasos } from "@/lib/pasos";
import { ESPECIALES } from "@/lib/con-textos/especiales";
import { COMPOSERS } from "@/lib/con-textos/composers";
import { ArticleView, type ArticleViewModel } from "@/components/content/ArticleView";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Vista previa · Con-textos", robots: { index: false, follow: false } };

/**
 * Vista previa de un especial «Con-textos» compuesta directamente desde los
 * ficheros del repositorio (sin base de datos). Misma ruta de renderizado que
 * la página pública: los pasos se parten del HTML compuesto.
 */
export default function VistaPreviaConTextos({
  params,
  searchParams,
}: {
  params: { especial: string };
  searchParams?: { paso?: string };
}) {
  const entry = ESPECIALES[params.especial];
  const composer = COMPOSERS[params.especial];
  if (!entry || !composer) notFound();

  const composed = composer({ strict: false });
  const basePath = `/admin/vista-previa/con-textos/${params.especial}`;
  const pasos = splitPasos(composed.html, composed.titles);
  const mode: "paso" | "todo" = searchParams?.paso === "todo" ? "todo" : "paso";
  const currentPaso = Math.min(Math.max(1, Number(searchParams?.paso) || 1), pasos.length);
  const data = entry.data();
  const cover = data.IMAGES.find((i) => i.id === composed.meta.coverImageId);
  const errors = composed.warnings.filter((w) => w.level === "error");
  const warns = composed.warnings.filter((w) => w.level === "warn");

  const vm: ArticleViewModel = {
    slug: composed.meta.slug,
    basePath,
    title: composed.meta.title,
    category: { name: composed.meta.category.name, slug: composed.meta.category.slug },
    authors: [{ name: composed.meta.byline }],
    dateLabel: "Vista previa (sin publicar)",
    cover: cover ? { src: cover.src, alt: cover.alt, credit: `${cover.credit} · ${cover.license}` } : null,
    tags: composed.meta.tags.map((t) => ({ name: t, slug: t.toLowerCase().replace(/\s+/g, "-") })),
    backLink: { href: "/admin/articulos", label: "Artículos" },
    pieza: true,
    pasos,
    mode,
    currentPaso,
    contentHtml: pasos[currentPaso - 1]?.html ?? "",
    showFullContent: true,
    membersOnly: false,
    especial: { id: entry.id, slug: composed.meta.slug, basePath },
    especialData: data,
    recent: [],
  };

  return (
    <div>
      <div className="border-b border-acero-light/50 bg-tinta/[0.03] px-4 py-3 text-sm">
        <div className="max-w-content mx-auto flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="font-bold text-tinta">Vista previa · {params.especial}</span>
          <Link href={`${basePath}?paso=1`} className="text-coral underline">Por pasos</Link>
          <Link href={`${basePath}?paso=todo`} className="text-coral underline">Seguido</Link>
          <span className="text-acero">
            {pasos.length} pasos · {composed.pasos.reduce((s, p) => s + p.islas.length, 0)} islas ·{" "}
            {Math.round(composed.pasos.reduce((s, p) => s + p.bytes, 0) / 1024)} KB de datos
          </span>
        </div>
        {(errors.length > 0 || warns.length > 0) && (
          <div className="max-w-content mx-auto mt-2 space-y-1">
            {errors.map((w, i) => (
              <p key={`e${i}`} className="text-xs text-teatro">
                <strong>Error</strong>
                {w.paso ? ` [${w.paso}]` : ""}: {w.message}
              </p>
            ))}
            {warns.map((w, i) => (
              <p key={`w${i}`} className="text-xs text-acero">
                <strong>Aviso</strong>
                {w.paso ? ` [${w.paso}]` : ""}: {w.message}
              </p>
            ))}
          </div>
        )}
      </div>
      <ArticleView vm={vm} />
    </div>
  );
}
