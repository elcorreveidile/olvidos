/**
 * Contexto que reciben los loaders de las islas: identifica el especial, el
 * paso que se está pintando, el modo de lectura y las fuentes citadas.
 */
import { extractCited } from "@/lib/islas";
import type { Paso } from "@/lib/pasos";
import type { IslaContext, PasoRef } from "./islas-def";

export function pasoRefs(pasos: Paso[]): PasoRef[] {
  return pasos.map((p, i) => ({ n: i + 1, id: p.id, title: p.title }));
}

export function buildIslaContext(opts: {
  especial: string;
  slug: string;
  basePath: string;
  mode: "paso" | "todo";
  pasos: Paso[];
  pasoN: number;
  html: string;
}): IslaContext {
  const refs = pasoRefs(opts.pasos);
  const current = refs[opts.pasoN - 1];
  return {
    especial: opts.especial,
    slug: opts.slug,
    basePath: opts.basePath,
    mode: opts.mode,
    pasoN: opts.pasoN,
    pasoId: current?.id ?? `paso-${opts.pasoN}`,
    pasos: refs,
    cited: extractCited(opts.html),
  };
}
