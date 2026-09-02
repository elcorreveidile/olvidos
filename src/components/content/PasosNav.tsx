import Link from "next/link";
import type { Paso } from "@/lib/pasos";
import { ChapterNav } from "./ChapterNav";

/**
 * Menú de "pasos" de una pieza multi-parte. Vertical en la barra lateral
 * (escritorio) y horizontal arriba del contenido (móvil).
 *
 * Con `mode="todo"` (lectura seguida, `?paso=todo`) los pasos son anclas
 * dentro de la misma página y el menú resalta el capítulo en pantalla.
 */
export function PasosNav({
  pasos,
  slug,
  current,
  horizontal = false,
  basePath,
  mode = "paso",
}: {
  pasos: Paso[];
  slug: string;
  current: number;
  horizontal?: boolean;
  basePath?: string;
  mode?: "paso" | "todo";
}) {
  const base = basePath ?? `/articulos/${slug}`;
  const chapters = pasos.map((p, i) => ({ n: i + 1, id: p.id, title: p.title }));

  const modeSwitch = (
    <p className={`flex items-center gap-2 text-xs ${horizontal ? "mb-2 lg:hidden" : "mt-4"}`}>
      {mode === "todo" ? (
        <>
          <span className="font-bold text-tinta">Lectura seguida</span>
          <span className="text-acero-light">·</span>
          <Link href={`${base}?paso=1`} className="text-coral underline decoration-coral-light hover:text-tinta">
            Leer por pasos
          </Link>
        </>
      ) : (
        <>
          <span className="font-bold text-tinta">Por pasos</span>
          <span className="text-acero-light">·</span>
          <Link href={`${base}?paso=todo`} className="text-coral underline decoration-coral-light hover:text-tinta">
            Leer seguido
          </Link>
        </>
      )}
    </p>
  );

  if (mode === "todo") {
    if (horizontal) {
      return (
        <div>
          {modeSwitch}
          <ChapterNav chapters={chapters} horizontal />
        </div>
      );
    }
    return (
      <div className="mb-8">
        <h3 className="mb-4 text-sm font-black uppercase tracking-wide text-tinta">
          <span className="text-coral">[</span>Pasos
        </h3>
        <ChapterNav chapters={chapters} />
        {modeSwitch}
      </div>
    );
  }

  if (horizontal) {
    return (
      <div>
        {modeSwitch}
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
                href={`${base}?paso=${n}`}
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
      </div>
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
                href={`${base}?paso=${n}`}
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
      {modeSwitch}
    </nav>
  );
}
