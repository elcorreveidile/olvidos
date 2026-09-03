"use client";

import { useMemo, useState } from "react";
import type { SlimSource, TimelineData, TimelineItem } from "@/lib/con-textos/islas-def";
import { matchesQuery } from "@/lib/con-textos/text";
import { GOVERNMENT_COLORS, GOVERNMENT_LABELS } from "./palette";
import { TimelineRuler } from "./TimelineRuler";

const KIND_LABEL: Record<string, string> = {
  guerra: "Guerra",
  territorial: "Territorio",
  migratoria: "Migración",
  diplomatica: "Diplomacia",
  monarquia: "Corona",
  parlamentaria: "Parlamento",
  judicial: "Justicia",
  militar: "Militar",
  geopolitica: "Geopolítica",
  europea: "Europa",
  informativa: "Información",
  politica: "Política",
  seguridad: "Seguridad",
};

const GOV_ORDER = ["derecha", "liberal", "izquierda", "dictadura"];
const PAGE = 12;

function Chip({ active, onClick, color, children }: { active: boolean; onClick: () => void; color?: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-sm border px-2 py-1 text-xs font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-coral ${
        active ? "border-tinta bg-tinta text-white" : "border-acero-light/70 bg-white text-tinta/80 hover:border-tinta"
      }`}
    >
      {color && <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} aria-hidden="true" />}
      {children}
    </button>
  );
}

function EventCard({ ev, active, sources }: { ev: TimelineItem; active: boolean; sources: Record<string, SlimSource> }) {
  const refs = ev.sourceIds.map((id) => sources[id]).filter(Boolean);
  return (
    <li
      id={`ev-${ev.id}`}
      className={`relative border-l-2 pl-4 ${active ? "border-coral" : "border-acero-light/60"}`}
      style={{ scrollMarginTop: "6rem" }}
    >
      <span
        className="absolute -left-[7px] top-1.5 h-3 w-3 rounded-full border-2 border-white"
        style={{ backgroundColor: GOVERNMENT_COLORS[ev.government] ?? "#999" }}
        aria-hidden="true"
      />
      <p className="m-0 text-xs font-bold uppercase tracking-wide text-coral">{ev.dateLabel}</p>
      <h4 className="m-0 mt-0.5 text-base font-bold leading-snug text-tinta">{ev.title}</h4>
      <p className="m-0 mt-1 text-xs text-acero">
        {ev.governmentLabel}
        {ev.headOfState ? ` · Jefe del Estado: ${ev.headOfState}` : ""}
      </p>
      <p className="mt-2 text-sm leading-snug text-tinta/85">{ev.summary}</p>
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-acero">
        {ev.kinds.map((k) => (
          <span key={k} className="rounded-sm bg-tinta/[0.05] px-1.5 py-0.5">
            {KIND_LABEL[k] ?? k}
          </span>
        ))}
        {refs.map((s) => (
          <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" className="underline decoration-acero-light hover:text-coral">
            {s.publisher || s.title}
          </a>
        ))}
        {ev.pasoHref && (
          <a href={ev.pasoHref} className="font-bold text-coral hover:text-tinta">
            Ir a «{ev.pasoTitle}» →
          </a>
        )}
      </div>
    </li>
  );
}

/**
 * Isla «linea-temporal»: regla con bandas por Gobierno y tarjetas de
 * eventos, con filtros por orientación del Gobierno, tipo de hecho y texto.
 * El estado de los filtros es local; los enlaces profundos usan anclas.
 */
export function Timeline({ data }: { data: TimelineData }) {
  const [govs, setGovs] = useState<Set<string>>(new Set());
  const [kinds, setKinds] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<string | null>(null);
  const [limit, setLimit] = useState(data.compact ? 8 : PAGE);

  const kindOptions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const ev of data.events) for (const k of ev.kinds) counts.set(k, (counts.get(k) ?? 0) + 1);
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  }, [data.events]);
  const govOptions = useMemo(() => GOV_ORDER.filter((g) => data.events.some((e) => e.government === g)), [data.events]);

  const visible = useMemo(
    () =>
      data.events.filter(
        (ev) =>
          (!govs.size || govs.has(ev.government)) &&
          (!kinds.size || ev.kinds.some((k) => kinds.has(k))) &&
          (!query || matchesQuery(`${ev.title} ${ev.summary} ${ev.dateLabel} ${ev.headOfState ?? ""}`, query)),
      ),
    [data.events, govs, kinds, query],
  );
  const visibleIds = useMemo(() => new Set(visible.map((e) => e.id)), [visible]);
  const shown = visible.slice(0, limit);

  const toggle = (set: Set<string>, v: string, setter: (s: Set<string>) => void) => {
    const next = new Set(set);
    if (next.has(v)) next.delete(v);
    else next.add(v);
    setter(next);
  };

  const pick = (id: string) => {
    setActive(id);
    const idx = visible.findIndex((e) => e.id === id);
    if (idx >= limit) setLimit(idx + 1);
    // Tras el render (si hacía falta ampliar la lista), desplazar a la tarjeta.
    requestAnimationFrame(() => document.getElementById(`ev-${id}`)?.scrollIntoView({ block: "center", behavior: "smooth" }));
  };

  return (
    <section className="isla-linea-temporal" aria-label="Línea temporal">
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <h3 className="m-0 text-sm font-black uppercase tracking-wide text-tinta">
          <span className="text-coral">[</span>Línea temporal {data.range[0]}
          {data.range[1] !== data.range[0] ? `-${data.range[1]}` : ""}
        </h3>
        <span className="text-xs text-acero">
          {visible.length} de {data.events.length} hechos
        </span>
      </div>
      <TimelineRuler data={data} visibleIds={visibleIds} activeId={active} onPick={pick} />
      {!data.compact && (
        <div className="mt-3 space-y-2">
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filtrar por Gobierno">
            {govOptions.map((g) => (
              <Chip key={g} active={govs.has(g)} onClick={() => toggle(govs, g, setGovs)} color={GOVERNMENT_COLORS[g]}>
                {GOVERNMENT_LABELS[g]}
              </Chip>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filtrar por tipo de hecho">
            {kindOptions.map(([k, n]) => (
              <Chip key={k} active={kinds.has(k)} onClick={() => toggle(kinds, k, setKinds)}>
                {KIND_LABEL[k] ?? k} <span className="font-normal opacity-70">{n}</span>
              </Chip>
            ))}
          </div>
          <label className="block">
            <span className="sr-only">Buscar en la línea temporal</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar (sin acentos vale): Annual, Perejil, Alfonso XIII…"
              className="w-full rounded-sm border border-acero-light/70 px-3 py-1.5 text-sm focus:border-tinta focus:outline-none"
            />
          </label>
        </div>
      )}
      <ol className="mt-4 space-y-5">
        {shown.map((ev) => (
          <EventCard key={ev.id} ev={ev} active={ev.id === active} sources={data.sources ?? {}} />
        ))}
      </ol>
      {visible.length === 0 && <p className="mt-4 text-sm text-acero">Ningún hecho coincide con los filtros.</p>}
      {shown.length < visible.length && (
        <p className="mt-4">
          <button
            type="button"
            onClick={() => setLimit(limit + PAGE * 2)}
            className="rounded-sm border border-tinta px-4 py-2 text-sm font-bold text-tinta transition-colors hover:bg-tinta hover:text-white"
          >
            Ver más ({visible.length - shown.length} restantes)
          </button>
        </p>
      )}
    </section>
  );
}
