import type { ChartData } from "@/lib/con-textos/islas-def";
import { band, formatNumber, formatShort, linear, truncate, xLabel, xLabelLong } from "@/lib/con-textos/scale";
import { COLORS, seriesColor } from "../palette";
import { CHART_W, MARGIN } from "./ChartFrame";

/** Parte una etiqueta en hasta dos líneas de ~max caracteres. */
function wrapLabel(label: string, max: number): string[] {
  if (label.length <= max) return [label];
  const cut = label.lastIndexOf(" ", max);
  if (cut <= 0) return [truncate(label, max * 2)];
  return [label.slice(0, cut), truncate(label.slice(cut + 1), max)];
}

/**
 * Barras agrupadas: una categoría (año, votación, crisis…) por grupo de
 * barras y una barra por serie (grupo de la serie).
 */
export function GroupedBarChart({ data }: { data: ChartData }) {
  const groups = data.groups;
  const cats = Array.from(new Set(data.points.map((p) => String(p.x))));
  const maxY = Math.max(0, ...data.points.map((p) => p.y));
  const w = CHART_W;
  const h = data.height ?? 320;
  const m = { ...MARGIN, bottom: cats.some((c) => c.length > 6) ? 52 : MARGIN.bottom };
  const x0 = band(cats, [m.left, w - m.right], 0.25);
  const x1 = band(groups, [0, x0.bandwidth], 0.1);
  const y = linear([0, maxY], [h - m.bottom, m.top], true, 5);
  const showValues = cats.length * groups.length <= 24;
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
      {cats.map((c) => (
        <g key={c} transform={`translate(${x0(c)},0)`}>
          {groups.map((g, gi) => {
            const p = data.points.find((pt) => String(pt.x) === c && (pt.group ?? groups[0]) === g);
            if (!p) return null;
            const bx = x1(g);
            const by = y(p.y);
            return (
              <g key={g}>
                <title>{`${xLabelLong(p.x)} · ${g}: ${formatNumber(p.y)} ${data.unit}${p.note ? ` — ${p.note}` : ""}`}</title>
                <rect x={bx} y={by} width={x1.bandwidth} height={Math.max(1, y(0) - by)} fill={seriesColor(gi)} rx="1" />
                {showValues && (
                  <text x={bx + x1.bandwidth / 2} y={by - 4} textAnchor="middle" fontSize="10" fill={COLORS.text}>
                    {formatShort(p.y)}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      ))}
      {cats.map((c, i) => {
        const label = xLabel(c);
        const long = label.length > 6;
        const every = long ? 1 : Math.ceil(cats.length / 12);
        if (i % every !== 0) return null;
        const cx = x0(c) + x0.bandwidth / 2;
        const lines = long ? wrapLabel(label, Math.max(12, Math.floor(x0.step / 6.5))) : [label];
        return (
          <text key={c} x={cx} y={h - m.bottom + 16} textAnchor="middle" fontSize={long ? "10" : "11"} fill={COLORS.muted}>
            {lines.map((ln, li) => (
              <tspan key={li} x={cx} dy={li ? 12 : 0}>
                {ln}
              </tspan>
            ))}
          </text>
        );
      })}
      <line x1={m.left} x2={w - m.right} y1={y(0)} y2={y(0)} stroke={COLORS.axis} />
    </svg>
  );
}
