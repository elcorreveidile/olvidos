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

export function commonsThumb(src: string, width = 1600): string {
  const m = src.match(COMMONS_RE);
  if (!m) return src;
  const [, a, ab, file] = m;
  if (/\.(svg|gif)$/i.test(file)) return src;
  return `https://upload.wikimedia.org/wikipedia/commons/thumb/${a}/${ab}/${file}/${width}px-${file}`;
}
