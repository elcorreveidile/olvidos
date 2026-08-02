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

export default async function RevistaPage() {
  const all = await getAllIssues();

  // Orden ascendente para leer el archivo cronológicamente (1 → 17 → separatas).
  const sorted = [...all].sort((a, b) => a.number - b.number);
  const numeros = sorted.filter((i) => i.number < SEPARATA_FROM);
  const separatas = sorted.filter((i) => i.number >= SEPARATA_FROM);

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

      {all.length === 0 ? (
        <div className="rounded-sm border border-acero-light/50 bg-gray-50 py-16 text-center">
          <p className="font-editorial text-lg text-acero">
            Estamos digitalizando el archivo. Muy pronto podrás consultar aquí
            todos los números.
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
