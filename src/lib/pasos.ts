/**
 * "Pasos" de las piezas multi-parte (categoría Piezas y Procesos).
 *
 * En la web original de WordPress estas piezas se paginaban con el marcador
 * `<!--nextpage-->` (plugin Multi Page Posts) y mostraban un menú de "pasos".
 * Ese marcador se conservó en `Article.content` al migrar, así que aquí solo lo
 * parseamos: cada corte es un paso.
 */

import { extractPasoId } from "./islas";

const NEXTPAGE = /<!--\s*nextpage\s*-->/i;

/** Categorías cuyos artículos se paginan por pasos cuando llevan el marcador. */
export const PASOS_CATEGORIES = ["piezas-procesos", "con-textos"] as const;

export interface Paso {
  /** Identificador estable del paso (de <!--paso:ID--> o "paso-N"). */
  id: string;
  /** Título derivado (primer encabezado del paso, o "Introducción"/"Parte N"). */
  title: string;
  /** HTML del paso (sin el marcador de id). */
  html: string;
}

function pasoTitle(html: string, index: number): string {
  const h = html.match(/<h[2-4][^>]*>([\s\S]*?)<\/h[2-4]>/i);
  if (h) {
    const t = h[1]
      .replace(/<[^>]+>/g, "")
      .replace(/&#?\w+;/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (t) return t.length > 70 ? t.slice(0, 67) + "…" : t;
  }
  return index === 0 ? "Introducción" : `Parte ${index + 1}`;
}

/**
 * Divide el contenido HTML en pasos por los cortes `<!--nextpage-->`.
 * Si se pasan `titles` (rascados del original, en `src/data/pasos-titles.json`),
 * se usan como título de cada paso; si no, se derivan por heurística.
 */
export function splitPasos(content: string, titles?: string[]): Paso[] {
  return (content || "")
    .split(new RegExp(NEXTPAGE.source, "i"))
    .map((raw) => extractPasoId(raw.trim()))
    .map(({ id, html }, i) => ({
      id: id || `paso-${i + 1}`,
      title: titles?.[i]?.trim() || pasoTitle(html, i),
      html: html.trim(),
    }));
}

/** ¿El artículo es una pieza multi-parte (Piezas y Procesos, Con-textos)? */
export function hasPasos(article: {
  content?: string | null;
  categories?: Array<{ category?: { slug?: string } }> | null;
}): boolean {
  const isPieza = (article.categories ?? []).some((c) =>
    (PASOS_CATEGORIES as readonly string[]).includes(c?.category?.slug ?? "")
  );
  return isPieza && new RegExp(NEXTPAGE.source, "i").test(article.content || "");
}
