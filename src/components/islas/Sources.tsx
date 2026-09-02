import type { SlimSource, SourcesData } from "@/lib/con-textos/islas-def";
import type { SourceKind } from "@/lib/con-textos/types";

const KIND_LABEL: Record<SourceKind, string> = {
  parlamentaria: "Diarios de Sesiones y documentación parlamentaria",
  oficial: "Fuentes oficiales",
  dato: "Datos y estadísticas",
  academica: "Bibliografía académica",
  archivo: "Archivos y hemerotecas",
  prensa: "Prensa",
  multimedia: "Audiovisual",
};
const KIND_ORDER: SourceKind[] = ["parlamentaria", "oficial", "dato", "academica", "archivo", "prensa", "multimedia"];

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function SourceItem({ s }: { s: SlimSource & { n: number } }) {
  return (
    <li id={`f-${s.n}`} className="flex gap-2 text-sm leading-snug text-tinta/85">
      <span className="w-6 shrink-0 text-right tabular-nums text-acero">{s.n}.</span>
      <span>
        <a href={s.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-tinta underline decoration-acero-light hover:text-coral">
          {s.title}
        </a>
        <span className="text-acero">
          {s.publisher ? ` · ${s.publisher}` : ""}
          {s.date ? ` · ${s.date}` : ""}
          {hostOf(s.url) ? ` · ${hostOf(s.url)}` : ""}
        </span>
        {s.note ? <span className="block text-xs italic text-acero">{s.note}</span> : null}
      </span>
    </li>
  );
}

/**
 * Isla «fuentes»: las fuentes citadas en el paso ([[cite:…]]) numeradas, más
 * las añadidas con `ids`. Sin JavaScript.
 */
export function Sources({ data }: { data: SourcesData }) {
  if (!data.sources.length) return null;
  const groups = data.grouped
    ? KIND_ORDER.map((k) => ({ k, items: data.sources.filter((s) => s.kind === k) })).filter((g) => g.items.length)
    : [{ k: undefined, items: data.sources }];
  return (
    <section className="isla-fuentes" aria-label={data.title || "Fuentes"}>
      <h3 className="mb-3 text-sm font-black uppercase tracking-wide text-tinta">
        <span className="text-coral">[</span>
        {data.title || "Fuentes"}
      </h3>
      {groups.map((g) => (
        <div key={g.k ?? "todas"} className="mb-4">
          {g.k ? <h4 className="mb-2 text-xs font-bold uppercase tracking-wide text-acero">{KIND_LABEL[g.k]}</h4> : null}
          <ol className="space-y-2">
            {g.items.map((s) => (
              <SourceItem key={s.id} s={s} />
            ))}
          </ol>
        </div>
      ))}
    </section>
  );
}
