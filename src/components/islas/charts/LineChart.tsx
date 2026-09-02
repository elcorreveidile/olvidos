import type { ChartData } from "@/lib/con-textos/islas-def";
import { band, dayTicks, formatNumber, formatShort, isIsoDate, linear, niceTicks, xLabel, xLabelLong, xValue } from "@/lib/con-textos/scale";
import { COLORS, seriesColor } from "../palette";
import { CHART_W, MARGIN } from "./ChartFrame";

/**
 * Líneas (una por grupo). El eje x es numérico si las x son años o fechas
 * ISO; si no, categórico en el orden de los datos.
 */
export function LineChart({ data }: { data: ChartData }) {
  const groups = data.groups.length ? data.groups : [""];
  const points = data.points;
  const numeric = points.every((p) => xValue(p.x) !== undefined);
  const dates = numeric && points.every((p) => isIsoDate(p.x));
  const w = CHART_W;
  const h = data.height ?? 300;
  const m = MARGIN;
  const maxY = Math.max(0, ...points.map((p) => p.y));
  const y = linear([0, maxY], [h - m.bottom, m.top], true, 5);

  let xOf: (x: string | number) => number;
  let xTicks: Array<{ v: number; label: string }>;
  if (numeric) {
    const xs = points.map((p) => xValue(p.x) as number);
    const x = linear([Math.min(...xs), Math.max(...xs)], [m.left, w - m.right]);
    xOf = (v) => x(xValue(v) as number);
    xTicks = dates
      ? dayTicks(x.domain[0], x.domain[1], 6).map((t) => ({ v: x(t.v), label: t.label }))
      : niceTicks(x.domain[0], x.domain[1], 8)
          .filter((t) => t >= x.domain[0] && t <= x.domain[1])
          .map((t) => ({ v: x(t), label: String(t) }));
  } else {
    const cats = Array.from(new Set(points.map((p) => String(p.x))));
    const x = band(cats, [m.left, w - m.right], 0);
    xOf = (v) => x(String(v)) + x.bandwidth / 2;
    const every = Math.ceil(cats.length / 8);
    xTicks = cats.filter((_, i) => i % every === 0).map((c) => ({ v: xOf(c), label: xLabel(c) }));
  }

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" role="img" aria-labelledby={`t-${data.id}`} className="block max-w-full" style={{ fontFamily: "inherit" }}>
      <title id={`t-${data.id}`}>{`${data.title} (${data.unit})`}</title>
      {y.ticks.map((t) => (
        <g key={t}>
          <line x1={m.left} x2={w - m.right} y1={y(t)} y2={y(t)} stroke={COLORS.grid} />
          <text x={m.left - 8} y={y(t) + 4} textAnchor="end" fontSize="11" fill={COLORS.muted}>
            {formatShort(t)}
          </text>
        </g>
      ))}
      {xTicks.map((t, i) => (
        <text key={i} x={t.v} y={h - m.bottom + 16} textAnchor="middle" fontSize="11" fill={COLORS.muted}>
          {t.label}
        </text>
      ))}
      <line x1={m.left} x2={w - m.right} y1={y(0)} y2={y(0)} stroke={COLORS.axis} />
      {groups.map((g, gi) => {
        const pts = points
          .filter((p) => (p.group ?? "") === g || (groups.length === 1 && !p.group))
          .map((p) => ({ ...p, px: xOf(p.x), py: y(p.y) }));
        if (!pts.length) return null;
        const sorted = numeric ? [...pts].sort((a, b) => a.px - b.px) : pts;
        const d = sorted.map((p, i) => `${i ? "L" : "M"}${p.px.toFixed(1)},${p.py.toFixed(1)}`).join(" ");
        const color = seriesColor(gi);
        return (
          <g key={g || "serie"}>
            {sorted.length > 1 && <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />}
            {sorted.map((p, i) => (
              <circle key={i} cx={p.px} cy={p.py} r={sorted.length > 30 ? 2 : 3.5} fill={color}>
                <title>{`${xLabelLong(p.x)}${g ? ` · ${g}` : ""}: ${formatNumber(p.y)} ${data.unit}${p.note ? ` — ${p.note}` : ""}`}</title>
              </circle>
            ))}
          </g>
        );
      })}
    </svg>
  );
}
