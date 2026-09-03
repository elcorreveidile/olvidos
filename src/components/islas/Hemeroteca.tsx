"use client";

import { useMemo, useState } from "react";
import type { HemerotecaData, QuoteItem } from "@/lib/con-textos/islas-def";
import { matchesQuery } from "@/lib/con-textos/text";
import { BLOC_COLORS, BLOC_LABELS } from "./palette";

const CHAMBER_LABEL: Record<string, string> = {
  congreso: "Congreso de los Diputados",
  senado: "Senado",
  "cortes-franquistas": "Cortes Españolas",
  otro: "Otras sedes",
};

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

function QuoteCard({ q }: { q: QuoteItem }) {
  return (
    <li id={`q-${q.id}`} className="border-l-2 pl-4" style={{ borderColor: BLOC_COLORS[q.bloc] ?? "#a1b6c4", scrollMarginTop: "6rem" }}>
      <p className="text-xs text-acero">
        <span className="font-bold uppercase tracking-wide text-coral">{q.dateLabel}</span>
        {" · "}
        {CHAMBER_LABEL[q.chamber] ?? q.chamber}
        {" · "}
        {q.sessionRef}
      </p>
      <p className="mt-1 text-sm font-bold text-tinta">
        {q.speaker}
        {q.party ? <span className="font-normal text-acero"> · {q.party}</span> : null}
        {q.role ? <span className="font-normal text-acero"> · {q.role}</span> : null}
      </p>
      <blockquote className="mt-2 font-editorial text-[1.05rem] leading-snug text-tinta/90">«{q.text}»</blockquote>
      {q.context && <p className="mt-1.5 text-xs italic leading-snug text-acero">{q.context}</p>}
      <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs">
        {q.pdfUrl && (
          <a href={q.pdfUrl} target="_blank" rel="noopener noreferrer" className="font-bold text-coral underline decoration-coral-light hover:text-tinta">
            Diario de Sesiones (PDF)
          </a>
        )}
        {q.videoUrl && (
          <a href={q.videoUrl} target="_blank" rel="noopener noreferrer" className="font-bold text-coral underline decoration-coral-light hover:text-tinta">
            {q.pdfUrl ? "Vídeo de la sesión" : "Vídeo de la intervención"}
          </a>
        )}
        {!q.pdfUrl && q.chamber !== "otro" && <span className="text-acero">Diario de Sesiones pendiente</span>}
        <span className="text-acero">{BLOC_LABELS[q.bloc] ?? q.bloc}</span>
      </p>
    </li>
  );
}

/**
 * Isla «hemeroteca»: citas parlamentarias verificadas con facetas (época,
 * bloque, partido, cámara, tema) y búsqueda sin acentos. Estado local; cada
 * cita tiene ancla #q-<id>.
 */
export function Hemeroteca({ data }: { data: HemerotecaData }) {
  const [eras, setEras] = useState<Set<string>>(new Set());
  const [blocs, setBlocs] = useState<Set<string>>(new Set());
  const [party, setParty] = useState("");
  const [chamber, setChamber] = useState("");
  const [topics, setTopics] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(data.limit);

  const visible = useMemo(
    () =>
      data.quotes.filter(
        (q) =>
          (!eras.size || eras.has(q.era)) &&
          (!blocs.size || blocs.has(q.bloc)) &&
          (!party || q.partyKey === party) &&
          (!chamber || q.chamber === chamber) &&
          (!topics.size || q.topics.some((t) => topics.has(t))) &&
          (!query || matchesQuery(`${q.speaker} ${q.party} ${q.text} ${q.context ?? ""} ${q.dateLabel} ${q.sessionRef}`, query)),
      ),
    [data.quotes, eras, blocs, party, chamber, topics, query],
  );
  const shown = visible.slice(0, limit);
  const toggle = (set: Set<string>, v: string, setter: (s: Set<string>) => void) => {
    const next = new Set(set);
    if (next.has(v)) next.delete(v);
    else next.add(v);
    setter(next);
  };
  const showEras = data.facets.eras.length > 1;
  const showTopics = data.facets.topics.length > 3;
  const topTopics = data.facets.topics.slice(0, 14);

  return (
    <section className="isla-hemeroteca" aria-label="Hemeroteca parlamentaria">
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <h3 className="text-sm font-black uppercase tracking-wide text-tinta">
          <span className="text-coral">[</span>Hemeroteca parlamentaria
        </h3>
        <span className="text-xs text-acero">
          {visible.length} de {data.total} intervenciones
        </span>
      </div>
      <div className="space-y-2">
        {showEras && (
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Época">
            {data.facets.eras.map((e) => (
              <Chip key={e.id} active={eras.has(e.id)} onClick={() => toggle(eras, e.id, setEras)}>
                {e.label} <span className="font-normal opacity-70">{e.n}</span>
              </Chip>
            ))}
          </div>
        )}
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Bloque">
          {data.facets.blocs.map((b) => (
            <Chip key={b.id} active={blocs.has(b.id)} onClick={() => toggle(blocs, b.id, setBlocs)} color={BLOC_COLORS[b.id]}>
              {BLOC_LABELS[b.id] ?? b.id} <span className="font-normal opacity-70">{b.n}</span>
            </Chip>
          ))}
        </div>
        {showTopics && (
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Tema">
            {topTopics.map((t) => (
              <Chip key={t.id} active={topics.has(t.id)} onClick={() => toggle(topics, t.id, setTopics)}>
                {t.id.replace(/-/g, " ")} <span className="font-normal opacity-70">{t.n}</span>
              </Chip>
            ))}
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          {data.facets.parties.length > 1 && (
            <label className="text-xs text-acero">
              <span className="sr-only">Partido</span>
              <select value={party} onChange={(e) => setParty(e.target.value)} className="rounded-sm border border-acero-light/70 bg-white px-2 py-1.5 text-sm text-tinta">
                <option value="">Todos los partidos</option>
                {data.facets.parties.map((p) => (
                  <option key={p.key} value={p.key}>
                    {p.label} ({p.n})
                  </option>
                ))}
              </select>
            </label>
          )}
          {data.facets.chambers.length > 1 && (
            <label className="text-xs text-acero">
              <span className="sr-only">Cámara</span>
              <select value={chamber} onChange={(e) => setChamber(e.target.value)} className="rounded-sm border border-acero-light/70 bg-white px-2 py-1.5 text-sm text-tinta">
                <option value="">Todas las cámaras</option>
                {data.facets.chambers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {CHAMBER_LABEL[c.id] ?? c.id} ({c.n})
                  </option>
                ))}
              </select>
            </label>
          )}
          <label className="min-w-[12rem] flex-1">
            <span className="sr-only">Buscar en las citas</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar orador, partido o palabra…"
              className="w-full rounded-sm border border-acero-light/70 px-3 py-1.5 text-sm focus:border-tinta focus:outline-none"
            />
          </label>
        </div>
      </div>
      <ol className="mt-4 space-y-5">
        {shown.map((q) => (
          <QuoteCard key={q.id} q={q} />
        ))}
      </ol>
      {visible.length === 0 && <p className="mt-4 text-sm text-acero">Ninguna intervención coincide con los filtros.</p>}
      {shown.length < visible.length && (
        <p className="mt-4">
          <button
            type="button"
            onClick={() => setLimit(limit + 10)}
            className="rounded-sm border border-tinta px-4 py-2 text-sm font-bold text-tinta transition-colors hover:bg-tinta hover:text-white"
          >
            Ver más ({visible.length - shown.length} restantes)
          </button>
        </p>
      )}
    </section>
  );
}
