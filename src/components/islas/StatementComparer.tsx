"use client";

import { useId, useRef, useState } from "react";
import type { Bloc } from "@/lib/con-textos/types";
import type { ComparadorData, ComparadorLayout, SlimSource, StatementItem } from "@/lib/con-textos/islas-def";
import { BLOC_COLORS, BLOC_LABELS } from "./palette";

/** Declaraciones visibles por bloque en modo apilado antes de «Ver más». */
const INITIAL = 4;
const STEP = 8;

/** Literales completos para que Tailwind genere las clases. */
const GRID: Record<number, string> = {
  2: "md:grid-cols-2",
  3: "md:grid-cols-2 xl:grid-cols-3",
  4: "md:grid-cols-2 xl:grid-cols-4",
};

function Statement({ s, sources }: { s: StatementItem; sources: Record<string, SlimSource> }) {
  const refs = s.sourceIds.map((id) => sources[id]).filter(Boolean);
  return (
    <li className="border-t border-acero-light/40 pt-3">
      <p className="text-sm font-bold text-tinta">
        {s.speaker}
        <span className="font-normal text-acero"> · {s.role}</span>
      </p>
      <p className="text-xs font-bold uppercase tracking-wide text-coral">{s.dateLabel}</p>
      <blockquote className="mt-1.5 font-editorial text-[1.02rem] leading-snug text-tinta/90">«{s.text}»</blockquote>
      {s.note && <p className="mt-1 text-xs italic leading-snug text-acero">{s.note}</p>}
      {refs.length > 0 && (
        <p className="mt-1.5 flex flex-wrap gap-x-3 text-xs">
          {refs.map((src) => (
            <a key={src.id} href={src.url} target="_blank" rel="noopener noreferrer" className="text-coral underline decoration-coral-light hover:text-tinta">
              {src.publisher || src.title}
            </a>
          ))}
        </p>
      )}
    </li>
  );
}

/**
 * Bloques de una crisis. En columnas cuando están compensados; apilados
 * («fuente / caja, fuente / caja») con «Ver más» por bloque cuando uno tiene
 * muchas más declaraciones que los otros. La disposición viene decidida del
 * servidor (`data.layout`). Se monta con `key={crisis.id}` para que el estado
 * de «Ver más» se reinicie al cambiar de pestaña.
 */
function CrisisPanel({
  blocs,
  groups,
  layout,
  sources,
}: {
  blocs: Bloc[];
  groups: Partial<Record<Bloc, StatementItem[]>>;
  layout: ComparadorLayout;
  sources: Record<string, SlimSource>;
}) {
  const [shown, setShown] = useState<Partial<Record<Bloc, number>>>({});
  const stacked = layout === "apilada";
  return (
    <div className={stacked ? "space-y-8" : `grid gap-6 ${GRID[Math.min(blocs.length, 4)] ?? ""}`}>
      {blocs.map((b) => {
        const items = groups[b] ?? [];
        const n = stacked ? (shown[b] ?? INITIAL) : items.length;
        const visible = items.slice(0, n);
        return (
          <section key={b} className="min-w-0" aria-label={BLOC_LABELS[b] ?? b}>
            <h4 className="mb-3 border-b-2 pb-1 text-xs font-black uppercase tracking-wide" style={{ borderColor: BLOC_COLORS[b], color: BLOC_COLORS[b] }}>
              {BLOC_LABELS[b] ?? b}
              {stacked && <span className="ml-2 font-normal normal-case tracking-normal text-acero">{items.length}</span>}
            </h4>
            <ul className={stacked ? "grid gap-x-8 gap-y-3 md:grid-cols-2" : "space-y-3"}>
              {visible.map((s) => (
                <Statement key={s.id} s={s} sources={sources} />
              ))}
            </ul>
            {items.length > n && (
              <p className="mt-3">
                <button
                  type="button"
                  onClick={() => setShown((prev) => ({ ...prev, [b]: n + STEP }))}
                  className="rounded-sm border border-tinta px-4 py-2 text-sm font-bold text-tinta transition-colors hover:bg-tinta hover:text-white"
                >
                  Ver más ({items.length - n} restantes)
                </button>
              </p>
            )}
          </section>
        );
      })}
    </div>
  );
}

/**
 * Isla «comparador»: «quién dijo qué» en cada crisis, con una pestaña por
 * crisis y un bloque por actor (Gobierno, derecha, izquierda, nacionalistas,
 * Marruecos, Corona, otros). Pestañas accesibles por teclado.
 */
export function StatementComparer({ data }: { data: ComparadorData }) {
  const [current, setCurrent] = useState(data.crises[0]?.id ?? "");
  const baseId = useId();
  const tabsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const crisis = data.crises.find((c) => c.id === current) ?? data.crises[0];
  if (!crisis) return null;
  const groups = data.byCrisis[crisis.id] ?? {};
  const blocs = data.blocs.filter((b) => (groups[b]?.length ?? 0) > 0);
  const layout = data.layout?.[crisis.id] ?? "columnas";

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const n = data.crises.length;
    let j = -1;
    if (e.key === "ArrowRight") j = (i + 1) % n;
    else if (e.key === "ArrowLeft") j = (i - 1 + n) % n;
    else if (e.key === "Home") j = 0;
    else if (e.key === "End") j = n - 1;
    if (j >= 0) {
      e.preventDefault();
      setCurrent(data.crises[j].id);
      tabsRef.current[j]?.focus();
    }
  };

  return (
    <section className="isla-comparador" aria-label="Quién dijo qué">
      <h3 className="mb-2 text-sm font-black uppercase tracking-wide text-tinta">
        <span className="text-coral">[</span>Quién dijo qué
      </h3>
      {data.crises.length > 1 && (
        <div role="tablist" aria-label="Crisis" className="mb-4 flex flex-wrap gap-1.5 border-b border-acero-light/40 pb-2">
          {data.crises.map((c, i) => {
            const selected = c.id === crisis.id;
            return (
              <button
                key={c.id}
                ref={(el) => {
                  tabsRef.current[i] = el;
                }}
                role="tab"
                id={`${baseId}-tab-${c.id}`}
                aria-selected={selected}
                aria-controls={`${baseId}-panel-${c.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setCurrent(c.id)}
                onKeyDown={(e) => onKey(e, i)}
                className={`rounded-sm px-3 py-1.5 text-sm font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-coral ${
                  selected ? "bg-coral text-white" : "text-tinta/70 hover:bg-coral/10 hover:text-coral"
                }`}
              >
                {c.label} <span className="font-normal opacity-80">{c.year}</span>
              </button>
            );
          })}
        </div>
      )}
      <div
        role={data.crises.length > 1 ? "tabpanel" : undefined}
        id={`${baseId}-panel-${crisis.id}`}
        aria-labelledby={data.crises.length > 1 ? `${baseId}-tab-${crisis.id}` : undefined}
      >
        {data.crises.length === 1 && <p className="mb-3 text-sm font-bold text-tinta">{crisis.label} ({crisis.year})</p>}
        {blocs.length === 0 ? (
          <p className="text-sm text-acero">Sin declaraciones verificadas para esta crisis.</p>
        ) : (
          <CrisisPanel key={crisis.id} blocs={blocs} groups={groups} layout={layout} sources={data.sources ?? {}} />
        )}
      </div>
    </section>
  );
}
