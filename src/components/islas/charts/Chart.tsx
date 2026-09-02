import type { ChartData } from "@/lib/con-textos/islas-def";
import { ChartFrame } from "./ChartFrame";
import { BarChart } from "./BarChart";
import { GroupedBarChart } from "./GroupedBarChart";
import { LineChart } from "./LineChart";

/** Isla «grafico»: SVG generado en servidor, sin JavaScript en el cliente. */
export function Chart({ data }: { data: ChartData }) {
  if (!data.points.length) {
    return (
      <ChartFrame data={data} legend={false}>
        <p className="text-xs text-acero">Sin datos verificados para esta serie.</p>
      </ChartFrame>
    );
  }
  let kind = data.kind;
  if (kind === "grouped" && data.groups.length <= 1) kind = "bar";
  // «Líneas» en las que cada grupo es una fuente con una sola cifra: no hay
  // evolución que trazar; se comparan como barras.
  if (kind === "line" && data.groups.length > 1) {
    const perGroup = data.groups.map((g) => data.points.filter((p) => (p.group ?? "") === g).length);
    if (Math.max(...perGroup) <= 1) kind = "bar";
  }
  return (
    <ChartFrame data={data} legend={kind !== "bar"}>
      {kind === "line" ? <LineChart data={data} /> : kind === "grouped" ? <GroupedBarChart data={data} /> : <BarChart data={data} />}
    </ChartFrame>
  );
}
