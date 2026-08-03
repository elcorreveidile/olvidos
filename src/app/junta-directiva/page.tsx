import Link from "next/link";
import type { Metadata } from "next";
import { CategoryHeading } from "@/components/content/CategoryHeading";
import { JUNTA_DIRECTIVA, JUNTA_NOTA } from "@/lib/junta";

export const metadata: Metadata = {
  title: "Junta Directiva",
  description:
    "Junta Directiva de la Asociación Cultural Olvidos de Granada: presidencia, vicepresidencia y secretaría.",
};

export default function JuntaDirectivaPage() {
  return (
    <div className="max-w-content mx-auto px-4 py-12">
      {/* Cabecera editorial */}
      <header className="mb-12 border-b-2 border-tinta pb-8 text-center">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-coral">
          La asociación
        </p>
        <CategoryHeading>junta directiva</CategoryHeading>
        <p className="mx-auto mt-6 max-w-2xl font-editorial text-lg leading-snug text-tinta/70">
          La Junta Directiva es el órgano de gobierno y representación de la
          Asociación Cultural Olvidos de Granada, elegido por la Asamblea General
          de los socios.
        </p>
      </header>

      {/* Cargos */}
      <section className="mb-12">
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-sm bg-acero-light/40 sm:grid-cols-3">
          {JUNTA_DIRECTIVA.map((c) => (
            <div key={c.cargo} className="bg-white p-8 text-center">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-coral">
                {c.cargo}
              </p>
              <p className="font-editorial text-xl font-medium text-tinta">
                {c.nombre}
              </p>
              {c.memberNumber && (
                <p className="mt-1 text-sm text-tinta/50">Socio nº {c.memberNumber}</p>
              )}
            </div>
          ))}
        </div>
        <p className="mt-6 max-w-article font-editorial text-sm text-tinta/60">
          {JUNTA_NOTA}
        </p>
      </section>

      {/* Fundador */}
      <section className="mb-16 max-w-article">
        <div className="prose-editorial">
          <p>
            La asociación honra la memoria de <strong>Mariano Maresca</strong>,
            fundador y director de <em>Olvidos de Granada</em>, primer socio de
            honor de la asociación.
          </p>
        </div>
      </section>

      <div className="text-center">
        <Link
          href="/sobre-nosotros"
          className="text-sm font-bold text-coral transition-colors hover:text-coral-dark"
        >
          ← Sobre Olvidos
        </Link>
      </div>
    </div>
  );
}
