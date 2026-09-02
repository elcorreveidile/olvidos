/**
 * «Islas»: componentes interactivos incrustados en el HTML de un artículo
 * mediante marcadores de comentario, p. ej.
 *
 *   <!--isla:linea-temporal anios="1909-1927" eras="restauracion"-->
 *
 * Este módulo es TypeScript puro (sin React) para poder usarse tanto en el
 * renderizado del artículo como en los scripts de Node que lo componen y
 * validan. Los marcadores van en línea propia y fuera de <p>.
 *
 * Cada paso de un artículo multi-parte puede empezar por <!--paso:ID--> para
 * tener un identificador estable (anclas y enlaces desde las islas).
 */

export const ISLA_RE =
  /<!--\s*isla:([a-z][a-z0-9-]*)((?:\s+[a-z][a-z0-9-]*="[^"]*")*)\s*-->/gi;
export const PASO_ID_RE = /^\s*<!--\s*paso:([a-z0-9-]+)\s*-->\s*/i;

export type IslaProps = Record<string, string>;

export type Block =
  | { type: "html"; html: string }
  | { type: "isla"; name: string; props: IslaProps; raw: string; index: number };

const ATTR_RE = /([a-z][a-z0-9-]*)="([^"]*)"/gi;

function decodeAttr(value: string): string {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

/** Parsea `clave="valor" otra="valor"` a un objeto de props. */
export function parseIslaAttrs(attrs: string): IslaProps {
  const props: IslaProps = {};
  for (const m of attrs.matchAll(ATTR_RE)) {
    props[m[1].toLowerCase()] = decodeAttr(m[2]).trim();
  }
  return props;
}

/** Trocea el HTML en bloques de html y de isla, conservando el orden. */
export function splitIslas(html: string): Block[] {
  const blocks: Block[] = [];
  const src = html || "";
  let last = 0;
  let index = 0;
  const re = new RegExp(ISLA_RE.source, "gi");
  for (const m of src.matchAll(re)) {
    const start = m.index ?? 0;
    const before = src.slice(last, start).trim();
    if (before) blocks.push({ type: "html", html: before });
    blocks.push({
      type: "isla",
      name: m[1].toLowerCase(),
      props: parseIslaAttrs(m[2] ?? ""),
      raw: m[0],
      index: index++,
    });
    last = start + m[0].length;
  }
  const rest = src.slice(last).trim();
  if (rest) blocks.push({ type: "html", html: rest });
  return blocks;
}

/** Lista separada (por defecto por comas), sin vacíos. */
export function listProp(props: IslaProps, key: string, sep = ","): string[] {
  const v = props[key];
  if (!v) return [];
  return v
    .split(sep)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function boolProp(props: IslaProps, key: string): boolean {
  const v = (props[key] ?? "").toLowerCase();
  return v === "true" || v === "1" || v === "si" || v === "sí";
}

export function numberProp(props: IslaProps, key: string): number | undefined {
  const v = props[key];
  if (v === undefined || v === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

/** Rango de años "1909-1927" (o un solo año "2026"). */
export function rangeProp(props: IslaProps, key: string): [number, number] | undefined {
  const v = props[key];
  if (!v) return undefined;
  const m = v.match(/^\s*(\d{4})\s*(?:-\s*(\d{4}))?\s*$/);
  if (!m) return undefined;
  const a = Number(m[1]);
  const b = m[2] ? Number(m[2]) : a;
  return a <= b ? [a, b] : [b, a];
}

/** Extrae el marcador <!--paso:ID--> del principio del HTML de un paso. */
export function extractPasoId(html: string): { id?: string; html: string } {
  const src = html || "";
  const m = src.match(PASO_ID_RE);
  if (!m) return { html: src };
  return { id: m[1].toLowerCase(), html: src.slice(m[0].length) };
}

/** ¿El HTML contiene marcadores de isla o de paso? */
export function hasIslas(html: string): boolean {
  return /<!--\s*(isla|paso):/i.test(html || "");
}
