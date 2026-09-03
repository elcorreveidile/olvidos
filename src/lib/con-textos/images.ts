/**
 * Miniaturas de Wikimedia Commons: en vez de servir el original (a veces de
 * miles de píxeles), se pide la versión reescalada que Commons genera en
 * `/wikipedia/commons/thumb/<a>/<ab>/<Fichero>/<ancho>px-<Fichero>`.
 * Los SVG y GIF se dejan tal cual.
 */
const COMMONS_RE = /^https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\/([0-9a-f])\/([0-9a-f]{2})\/([^/?#]+)$/i;

export function isCommonsUrl(src: string): boolean {
  return /^https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\//i.test(src);
}

/**
 * Anchos de miniatura que Wikimedia sirve (septiembre de 2026): cualquier
 * otro devuelve un error 400 «Use thumbnail sizes listed…». Se pide el
 * primero igual o mayor que el solicitado.
 */
export const COMMONS_THUMB_WIDTHS = [1280, 1920] as const;

export function commonsThumbWidth(width: number): number {
  return COMMONS_THUMB_WIDTHS.find((w) => w >= width) ?? COMMONS_THUMB_WIDTHS[COMMONS_THUMB_WIDTHS.length - 1];
}

export function commonsThumb(src: string, width = 1920): string {
  const m = src.match(COMMONS_RE);
  if (!m) return src;
  const [, a, ab, file] = m;
  if (/\.(svg|gif)$/i.test(file)) return src;
  const w = commonsThumbWidth(width);
  return `https://upload.wikimedia.org/wikipedia/commons/thumb/${a}/${ab}/${file}/${w}px-${file}`;
}
