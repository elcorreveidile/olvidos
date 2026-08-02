/**
 * Posiciones focales para recortar la portada de un artículo en las cajas de
 * proporción fija (tarjetas y cabecera de ficha). El valor almacenado en
 * `Article.coverPosition` es directamente un valor CSS `object-position`.
 */
export const DEFAULT_COVER_POSITION = "center";

/**
 * Valor especial: en vez de recortar para rellenar la caja, muestra la imagen
 * ENTERA (object-contain), con bandas si hace falta. Útil cuando no se puede
 * perder nada de la imagen.
 */
export const COVER_FIT_CONTAIN = "contain";

export const COVER_POSITIONS = [
  { key: "left top", label: "Arriba izquierda" },
  { key: "top", label: "Arriba" },
  { key: "right top", label: "Arriba derecha" },
  { key: "left", label: "Izquierda" },
  { key: "center", label: "Centro" },
  { key: "right", label: "Derecha" },
  { key: "left bottom", label: "Abajo izquierda" },
  { key: "bottom", label: "Abajo" },
  { key: "right bottom", label: "Abajo derecha" },
] as const;

export type CoverPositionKey = (typeof COVER_POSITIONS)[number]["key"];

/** Devuelve un `object-position` CSS válido, cayendo al centro si no se reconoce. */
export function normalizeCoverPosition(value?: string | null): string {
  if (!value) return DEFAULT_COVER_POSITION;
  return COVER_POSITIONS.some((p) => p.key === value)
    ? value
    : DEFAULT_COVER_POSITION;
}
