import Link from "next/link";
import { Logo } from "@/components/layout/Logo";

/**
 * Cabecera editorial de la portada. La entrada dramática la aporta el telón
 * (CurtainIntro); aquí buscamos un masthead sobrio tipo portada de revista.
 */
export function Hero() {
  return (
    <section className="mb-16 border-b-2 border-tinta pb-10">
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-coral">
        Revista de acciones culturales · Granada
      </p>
      <h1 className="text-6xl leading-none sm:text-8xl">
        <Logo />
      </h1>
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <p className="max-w-xl font-editorial text-lg leading-snug text-tinta/70">
          Literatura, pensamiento y memoria cultural granadina. Desde 1981,
          entre la página impresa y el presente digital.
        </p>
        <Link
          href="/memoria"
          className="shrink-0 self-start text-sm font-bold text-coral transition-colors hover:text-tinta sm:self-auto"
        >
          Explorar el archivo →
        </Link>
      </div>
    </section>
  );
}
