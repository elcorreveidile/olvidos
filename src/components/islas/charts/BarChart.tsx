import type { ChartData } from "@/lib/con-textos/islas-def";
import { band, formatNumber, formatShort, linear, truncate, xLabel, xLabelLong } from "@/lib/con-textos/scale";
import { COLORS, seriesColor } from "../palette";
import { CHART_W, MARGIN } from "./ChartFrame";

/**
 * Barras de una serie. Si las categorías son texto (comparación de cifras
 * según la fuente, votaciones…), las barras son horizontales para que quepan
 * las etiquetas; si son años, verticales.
 */
export function BarChart({ data }: { data: ChartData }) {
  const points = data.points;
  const numericX = points.every((p) => typeof p.x === "number");
  // Varias cifras para el mismo año (una por fuente) no caben en barras
  // verticales: se comparan en horizontal, con la fuente como etiqueta.
  const duplicated = new Set(points.map((p) => String(p.x))).size < points.length;
  const horizontal = !numericX || duplicated;
  const maxY = Math.max(0, ...points.map((p) => p.y));
  const minY = Math.min(0, ...points.map((p) => p.y));
  const groups = data.groups;
  const colorOf = (g?: string) => (g && groups.length > 1 ? seriesColor(Math.max(0, groups.indexOf(g))) : COLORS.coral);
  const labelOf = (p: ChartData["points"][number]) => (p.group && horizontal ? `${p.group}` : xLabel(p.x));
  const subOf = (p: ChartData["points"][number]) => {
    if (!p.group || !horizontal) return "";
    const sub = xLabelLong(p.x);
    return sub === p.group ? "" : sub;
  };

  if (horizontal) {
    // Horizontal
    const rowH = 30;
    const labelW = 200;
    const m = { top: 8, right: 64, bottom: 28, left: labelW };
    const h = m.top + m.bottom + rowH * points.length;
    const w = CHART_W;
    const keys = points.map((_, i) => String(i));
    const y = band(keys, [m.top, h - m.bottom], 0.25);
    const x = linear([minY, maxY], [m.left, w - m.right], true, 4);
    return (
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={data.height ?? undefined} role="img" aria-labelledby={`t-${data.id}`} className="block max-w-full" style={{ fontFamily: "inherit" }}>
        <title id={`t-${data.id}`}>{`${data.title} (${data.unit})`}</title>
        {x.ticks.map((t) => (
          <g key={t}>
            <line x1={x(t)} x2={x(t)} y1={m.top} y2={h - m.bottom} stroke={COLORS.grid} />
            <text x={x(t)} y={h - m.bottom + 16} textAnchor="middle" fontSize="11" fill={COLORS.muted}>
              {formatShort(t)}
            </text>
          </g>
        ))}
        {points.map((p, i) => {
          const yy = y(String(i));
          const x0 = x(Math.min(0, p.y));
          const x1 = x(Math.max(0, p.y));
          const label = labelOf(p);
          const sub = subOf(p);
          return (
            <g key={i}>
              <title>{`${label}${sub ? ` (${sub})` : ""}: ${formatNumber(p.y)} ${data.unit}${p.note ? ` — ${p.note}` : ""}`}</title>
              <text x={m.left - 8} y={yy + y.bandwidth / 2 + (sub ? -2 : 4)} textAnchor="end" fontSize="12" fill={COLORS.text}>
                {truncate(label, 30)}
              </text>
              {sub && (
                <text x={m.left - 8} y={yy + y.bandwidth / 2 + 11} textAnchor="end" fontSize="10" fill={COLORS.muted}>
                  {truncate(sub, 34)}
                </text>
              )}
              <rect x={x0} y={yy} width={Math.max(1, x1 - x0)} height={y.bandwidth} fill={colorOf(p.group)} rx="1" />
              <text x={x1 + 6} y={yy + y.bandwidth / 2 + 4} fontSize="11" fill={COLORS.text} className="tabular-nums">
                {formatNumber(p.y)}
              </text>
            </g>
          );
        })}
        <line x1={x(0)} x2={x(0)} y1={m.top} y2={h - m.bottom} stroke={COLORS.axis} />
      </svg>
    );
  }

  // Vertical (años)
  const w = CHART_W;
  const h = data.height ?? 300;
  const m = MARGIN;
  const keys = points.map((p) => String(p.x));
  const x = band(Array.from(new Set(keys)), [m.left, w - m.right], 0.25);
  const y = linear([minY, maxY], [h - m.bottom, m.top], true, 5);
  const every = Math.ceil(x.keys.length / 12);
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
      {points.map((p, i) => {
        const xx = x(String(p.x));
        const y0 = y(Math.max(0, p.y));
        const y1 = y(Math.min(0, p.y));
        return (
          <g key={i}>
            <title>{`${xLabelLong(p.x)}: ${formatNumber(p.y)} ${data.unit}${p.note ? ` — ${p.note}` : ""}`}</title>
            <rect x={xx} y={y0} width={x.bandwidth} height={Math.max(1, y1 - y0)} fill={colorOf(p.group)} rx="1" />
            {x.keys.length <= 16 && (
              <text x={xx + x.bandwidth / 2} y={y0 - 4} textAnchor="middle" fontSize="10" fill={COLORS.text}>
                {formatShort(p.y)}
              </text>
            )}
          </g>
        );
      })}
      {x.keys.map((k, i) =>
        i % every === 0 ? (
          <text key={k} x={x(k) + x.bandwidth / 2} y={h - m.bottom + 16} textAnchor="middle" fontSize="11" fill={COLORS.muted}>
            {k}
          </text>
        ) : null,
      )}
      <line x1={m.left} x2={w - m.right} y1={y(0)} y2={y(0)} stroke={COLORS.axis} />
    </svg>
  );
}
