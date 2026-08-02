import Link from "next/link";
import type { Paso } from "@/lib/pasos";

/**
 * Menú de "pasos" de una pieza multi-parte. Vertical en la barra lateral
 * (escritorio) y horizontal arriba del contenido (móvil).
 */
export function PasosNav({
  pasos,
  slug,
  current,
  horizontal = false,
}: {
  pasos: Paso[];
  slug: string;
  current: number;
  horizontal?: boolean;
}) {
  if (horizontal) {
    return (
      <nav
        aria-label="Pasos"
        className="mb-8 flex gap-2 overflow-x-auto border-y border-acero-light/40 py-3 lg:hidden"
      >
        {pasos.map((p, i) => {
          const n = i + 1;
          const active = n === current;
          return (
            <Link
              key={n}
              href={`/articulos/${slug}?paso=${n}`}
              aria-current={active ? "page" : undefined}
              className={`shrink-0 rounded-sm px-3 py-1.5 text-sm font-bold transition-colors ${
                active
                  ? "bg-coral text-white"
                  : "text-tinta/70 hover:bg-coral/10 hover:text-coral"
              }`}
            >
              <span className="tabular-nums">{n}.</span> {p.title}
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <nav aria-label="Pasos" className="mb-8">
      <h3 className="mb-4 text-sm font-black uppercase tracking-wide text-tinta">
        <span className="text-coral">[</span>Pasos
      </h3>
      <ol className="space-y-2">
        {pasos.map((p, i) => {
          const n = i + 1;
          const active = n === current;
          return (
            <li key={n}>
              <Link
                href={`/articulos/${slug}?paso=${n}`}
                aria-current={active ? "page" : undefined}
                className={`flex gap-2 text-sm leading-snug transition-colors ${
                  active
                    ? "font-bold text-coral"
                    : "text-tinta hover:text-coral"
                }`}
              >
                <span className="tabular-nums text-acero-light">{n}.</span>
                <span>{p.title}</span>
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
