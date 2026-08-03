import Link from "next/link";
import type { Metadata } from "next";
import { getAllIssues } from "@/lib/queries";
import { MagazineIssue } from "@/components/content/MagazineIssue";
import { CategoryHeading } from "@/components/content/CategoryHeading";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Archivo — la revista impresa",
  description:
    "Hemeroteca de Olvidos de Granada: la revista impresa desde su primera época. Cada número en PDF y, progresivamente, en formato web.",
};

/** Separatas y monográficos se numeran a partir de 100 al sembrar. */
const SEPARATA_FROM = 100;

export default async function RevistaPage({
  searchParams,
}: {
  searchParams?: { year?: string; q?: string };
}) {
  const all = await getAllIssues();

  // Orden ascendente para leer el archivo cronológicamente (1 → 17 → separatas).
  const sorted = [...all].sort((a, b) => a.number - b.number);

  // Filtros: por año y por número/título.
  const yearFilter =
    searchParams?.year && searchParams.year !== "all"
      ? Number(searchParams.year)
      : null;
  const q = (searchParams?.q ?? "").trim();
  const qLower = q.toLowerCase();
  const filtering = Boolean(yearFilter || q);

  const matches = (i: (typeof sorted)[number]) => {
    if (yearFilter && i.year !== yearFilter) return false;
    if (q) {
      const byNum = /^\d+$/.test(q) && i.number === Number(q);
      const byTitle = i.title.toLowerCase().includes(qLower);
      if (!byNum && !byTitle) return false;
    }
    return true;
  };

  // Años disponibles (excluye el 0 = desconocido).
  const years = Array.from(new Set(all.map((i) => i.year).filter((y) => y > 0))).sort(
    (a, b) => a - b
  );

  const filtered = sorted.filter(matches);
  const numeros = (filtering ? filtered : sorted).filter(
    (i) => i.number < SEPARATA_FROM
  );
  const separatas = (filtering ? filtered : sorted).filter(
    (i) => i.number >= SEPARATA_FROM
  );

  return (
    <div className="max-w-content mx-auto px-4 py-12">
      {/* Cabecera editorial */}
      <header className="mb-12 border-b-2 border-tinta pb-8 text-center">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-coral">
          Archivo · La revista impresa
        </p>
        <CategoryHeading>hemeroteca</CategoryHeading>
        <p className="mx-auto mt-6 max-w-2xl font-editorial text-lg leading-snug text-tinta/70">
          La colección completa de <em>Olvidos de Granada</em> desde su primera
          época. Cada número puede leerse en PDF y, poco a poco, artículo por
          artículo en formato web.
        </p>
      </header>

      {/* Filtros de la hemeroteca */}
      {all.length > 0 && (
        <form method="get" className="mb-10 flex flex-wrap items-end gap-3">
          <div>
            <label htmlFor="year" className="mb-1 block text-xs font-bold uppercase tracking-wide text-coral">
              Año
            </label>
            <select
              id="year"
              name="year"
              defaultValue={searchParams?.year ?? "all"}
              className="h-10 rounded-sm border border-acero-light/60 bg-white px-3"
            >
              <option value="all">Todos</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
          <div className="min-w-[180px] flex-1">
            <label htmlFor="q" className="mb-1 block text-xs font-bold uppercase tracking-wide text-coral">
              Buscar número o título
            </label>
            <input
              id="q"
              name="q"
              defaultValue={q}
              placeholder="Ej.: 9, música…"
              className="h-10 w-full rounded-sm border border-acero-light/60 px-3 focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/30"
            />
          </div>
          <button
            type="submit"
            className="h-10 rounded-sm bg-coral px-5 font-bold text-white transition-colors hover:bg-coral-dark"
          >
            Buscar
          </button>
          {filtering && (
            <Link
              href="/revista"
              className="h-10 leading-10 font-bold text-coral transition-colors hover:text-tinta"
            >
              Ver todo
            </Link>
          )}
        </form>
      )}

      {all.length === 0 ? (
        <div className="rounded-sm border border-acero-light/50 bg-gray-50 py-16 text-center">
          <p className="font-editorial text-lg text-acero">
            Estamos digitalizando el archivo. Muy pronto podrás consultar aquí
            todos los números.
          </p>
        </div>
      ) : filtering && numeros.length + separatas.length === 0 ? (
        <div className="rounded-sm border border-acero-light/50 bg-gray-50 py-16 text-center">
          <p className="font-editorial text-lg text-acero">
            No hay números que coincidan con la búsqueda.{" "}
            <Link href="/revista" className="font-bold text-coral hover:text-tinta">
              Ver todo
            </Link>
          </p>
        </div>
      ) : (
        <>
          <section className="mb-16">
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
              {numeros.map((issue) => (
                <MagazineIssue
                  key={issue.id}
                  number={issue.number}
                  title={issue.title}
                  slug={issue.slug}
                  description={issue.description}
                  coverImage={issue.coverImage}
                  publishedAt={issue.publishedAt}
                  articleCount={issue._count?.articles}
                />
              ))}
            </div>
          </section>

          {separatas.length > 0 && (
            <section className="mb-16">
              <h2 className="mb-6 text-2xl font-black text-tinta">
                <span className="text-coral">[</span>Separatas y monográficos
              </h2>
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
                {separatas.map((issue) => (
                  <MagazineIssue
                    key={issue.id}
                    number={issue.number}
                    title={issue.title}
                    slug={issue.slug}
                    description={issue.description}
                    coverImage={issue.coverImage}
                    publishedAt={issue.publishedAt}
                    articleCount={issue._count?.articles}
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* CTA socio */}
      <section className="curtain-velvet rounded-sm p-10 text-center">
        <h2 className="mb-3 text-2xl font-bold text-white">
          <span className="text-coral">[</span>Sostén la memoria de Olvidos
        </h2>
        <p className="mx-auto mb-6 max-w-xl font-editorial text-white/80">
          Hazte socio de la Asociación Cultural Olvidos de Granada y ayúdanos a
          preservar y digitalizar el archivo.
        </p>
        <Link
          href="/hazte-socio"
          className="inline-block rounded-sm bg-coral px-8 py-3 font-bold text-white transition-colors hover:bg-coral-dark"
        >
          Hazte socio
        </Link>
      </section>
    </div>
  );
}
