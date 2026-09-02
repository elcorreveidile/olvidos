import type { ChartData } from "@/lib/con-textos/islas-def";
import { formatNumber, xLabelLong } from "@/lib/con-textos/scale";
import { seriesColor } from "../palette";

/**
 * Marco común de los gráficos: título, leyenda, SVG, tabla de datos
 * desplegable (accesible y para quien prefiera las cifras), nota y fuentes.
 */
export function ChartFrame({
  data,
  children,
  legend = true,
}: {
  data: ChartData;
  children: React.ReactNode;
  legend?: boolean;
}) {
  const hasGroups = data.groups.length > 1 || (data.groups.length === 1 && data.points.some((p) => p.group));
  return (
    <figure className="isla-grafico m-0">
      <figcaption className="mb-2 text-left">
        <span className="block text-base font-bold leading-snug text-tinta">{data.title}</span>
        <span className="block text-xs text-acero">{data.unit}</span>
      </figcaption>
      {legend && hasGroups && (
        <ul className="mb-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-tinta/80" aria-label="Leyenda">
          {data.groups.map((g, i) => (
            <li key={g} className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: seriesColor(i) }} aria-hidden="true" />
              {g}
            </li>
          ))}
        </ul>
      )}
      <div className="overflow-x-auto">{children}</div>
      <details className="mt-2 text-xs text-tinta/80">
        <summary className="cursor-pointer font-bold text-acero hover:text-coral">Ver los datos</summary>
        <table className="mt-2 w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-acero-light/60">
              <th className="py-1 pr-3 font-bold">Dato</th>
              {hasGroups && <th className="py-1 pr-3 font-bold">Serie</th>}
              <th className="py-1 pr-3 text-right font-bold">{data.unit}</th>
              <th className="py-1 font-bold">Nota</th>
            </tr>
          </thead>
          <tbody>
            {data.points.map((p, i) => (
              <tr key={i} className="border-b border-acero-light/30 align-top">
                <td className="py-1 pr-3">{xLabelLong(p.x)}</td>
                {hasGroups && <td className="py-1 pr-3">{p.group ?? ""}</td>}
                <td className="py-1 pr-3 text-right tabular-nums">{formatNumber(p.y)}</td>
                <td className="py-1 text-acero">{p.note ?? ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
      {data.note && <p className="mt-2 text-xs italic leading-snug text-acero">{data.note}</p>}
      {data.sources.length > 0 && (
        <p className="mt-1 text-xs leading-snug text-acero">
          Fuente{data.sources.length > 1 ? "s" : ""}:{" "}
          {data.sources.map((s, i) => (
            <span key={s.id}>
              {i > 0 && "; "}
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="underline decoration-acero-light hover:text-coral">
                {s.title}
              </a>
              {s.publisher ? ` (${s.publisher}${s.date ? `, ${s.date}` : ""})` : ""}
            </span>
          ))}
          .
        </p>
      )}
    </figure>
  );
}

export const CHART_W = 720;
export const MARGIN = { top: 12, right: 16, bottom: 36, left: 56 };
