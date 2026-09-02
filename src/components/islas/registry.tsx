/**
 * Registro nombre de isla → componente React. El de servidor (ArticleBody)
 * ejecuta el loader correspondiente y pasa aquí solo los datos aligerados.
 */
import type { ComponentType } from "react";
import type { IslaName } from "@/lib/con-textos/islas-def";
import { Figure } from "./Figure";
import { Sources } from "./Sources";
import { Pendiente } from "./Pendiente";

type IslaComponent = ComponentType<{ data: any; name: string }>;

export const COMPONENTS = {
  "linea-temporal": Pendiente,
  hemeroteca: Pendiente,
  comparador: Pendiente,
  grafico: Pendiente,
  mapa: Pendiente,
  video: Pendiente,
  figura: Figure,
  fuentes: Sources,
} satisfies Record<IslaName, IslaComponent>;

/** Islas que se pintan más anchas que la columna de texto. */
export const WIDE_ISLAS: ReadonlySet<string> = new Set(["linea-temporal", "hemeroteca", "comparador", "mapa"]);

export function isWide(name: string, data: unknown): boolean {
  if (WIDE_ISLAS.has(name)) return true;
  if (name === "figura" && data && typeof data === "object" && (data as { wide?: boolean }).wide) return true;
  if (name === "grafico" && data && typeof data === "object") {
    const d = data as { kind?: string; points?: unknown[] };
    return d.kind === "grouped" || (d.points?.length ?? 0) > 16;
  }
  return false;
}
