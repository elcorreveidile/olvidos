"use client";

import type { TimelineData } from "@/lib/con-textos/islas-def";
import { GOVERNMENT_COLORS } from "./palette";

const W = 1000;
const H = 84;
const PAD = 8;

function dayOf(iso: string): number {
  const [y, m, d] = iso.split("-").map(Number);
  return Date.UTC(y, (m || 1) - 1, d || 1) / 86_400_000;
}

/**
 * Regla SVG de la línea temporal: bandas de color por orientación del
 * Gobierno, etapas históricas, marcas por década y un punto por evento.
 * Pulsar un punto lleva a su tarjeta.
 */
export function TimelineRuler({
  data,
  visibleIds,
  activeId,
  onPick,
}: {
  data: TimelineData;
  visibleIds: Set<string>;
  activeId: string | null;
  onPick: (id: string) => void;
}) {
  const [y0, y1] = data.range;
  const start = dayOf(`${y0}-01-01`);
  const end = dayOf(`${y1 + 1}-01-01`);
  const x = (day: number) => PAD + ((day - start) / Math.max(1, end - start)) * (W - PAD * 2);
  const xYear = (year: number) => x(dayOf(`${year}-01-01`));
  const span = y1 - y0 + 1;
  const tickStep = span > 120 ? 20 : span > 60 ? 10 : span > 25 ? 5 : span > 8 ? 2 : 1;
  const ticks: number[] = [];
  for (let y = Math.ceil(y0 / tickStep) * tickStep; y <= y1 + 1; y += tickStep) ticks.push(y);
  // Un solo año: marcas por mes.
  const months = span === 1 ? Array.from({ length: 12 }, (_, i) => i) : [];
  const MONTHS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" className="block max-w-full select-none" role="img" aria-label={`Regla de ${y0} a ${y1}`} style={{ fontFamily: "inherit" }}>
      {/* Etapas */}
      {data.eras.map((e) => {
        const a = xYear(Math.max(e.from, y0));
        const b = xYear(Math.min(e.to, y1 + 1));
        if (b - a < 2) return null;
        return (
          <g key={e.id}>
            <rect x={a} y={2} width={b - a} height={12} fill="#f1f4f6" stroke="#fff" />
            {b - a > 60 && (
              <text x={a + 4} y={11} fontSize="9" fill="#617685">
                {e.label}
              </text>
            )}
          </g>
        );
      })}
      {/* Gobiernos */}
      {data.periods.map((p) => {
        const a = xYear(p.from);
        const b = xYear(p.to);
        return (
          <rect key={p.id} x={a} y={20} width={Math.max(1, b - a)} height={10} fill={GOVERNMENT_COLORS[p.government] ?? "#999"} opacity="0.85">
            <title>{`${p.label}, ${p.from}-${p.to}`}</title>
          </rect>
        );
      })}
      {/* Eje y marcas */}
      <line x1={PAD} x2={W - PAD} y1={46} y2={46} stroke="#a1b6c4" />
      {months.length
        ? months.map((m) => {
            const xx = x(dayOf(`${y0}-${String(m + 1).padStart(2, "0")}-01`));
            return (
              <g key={m}>
                <line x1={xx} x2={xx} y1={42} y2={50} stroke="#a1b6c4" />
                <text x={xx + 3} y={62} fontSize="10" fill="#617685">
                  {MONTHS[m]}
                </text>
              </g>
            );
          })
        : ticks.map((t) => (
            <g key={t}>
              <line x1={xYear(t)} x2={xYear(t)} y1={42} y2={50} stroke="#a1b6c4" />
              <text x={xYear(t)} y={62} fontSize="10" fill="#617685" textAnchor="middle">
                {t}
              </text>
            </g>
          ))}
      {/* Eventos */}
      {data.events.map((ev) => {
        const visible = visibleIds.has(ev.id);
        const xx = x(dayOf(ev.date));
        const active = ev.id === activeId;
        return (
          <g
            key={ev.id}
            transform={`translate(${xx},46)`}
            onClick={() => onPick(ev.id)}
            style={{ cursor: "pointer", opacity: visible ? 1 : 0.18 }}
          >
            <title>{`${ev.dateLabel}: ${ev.title}`}</title>
            <circle r={active ? 7 : 4.5} fill={GOVERNMENT_COLORS[ev.government] ?? "#999"} stroke="#fff" strokeWidth="1.5" />
            {active && <circle r={11} fill="none" stroke="#ff6261" strokeWidth="2" />}
          </g>
        );
      })}
      {/* Leyenda breve */}
      {Object.entries(GOVERNMENT_COLORS).map(([g, c], i) => (
        <g key={g} transform={`translate(${PAD + i * 150},${H - 6})`}>
          <rect width="10" height="10" y="-9" fill={c} />
          <text x="14" fontSize="9" fill="#617685">
            {g === "derecha" ? "Gob. conservador" : g === "liberal" ? "Gob. liberal" : g === "izquierda" ? "Gob. progresista" : "Dictadura"}
          </text>
        </g>
      ))}
    </svg>
  );
}
