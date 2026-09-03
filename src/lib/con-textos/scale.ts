/**
 * Escalas y formato numérico para los gráficos SVG de las islas. Sin `Intl`
 * para que el resultado sea idéntico en servidor y en cliente.
 */

export interface Linear {
  (v: number): number;
  domain: [number, number];
  range: [number, number];
  ticks: number[];
}

export function niceTicks(min: number, max: number, count = 5): number[] {
  if (!isFinite(min) || !isFinite(max)) return [0];
  if (min === max) {
    if (min === 0) return [0, 1];
    min = Math.min(0, min);
    max = Math.max(0, max);
  }
  const span = max - min;
  const rough = span / Math.max(1, count);
  const pow = Math.pow(10, Math.floor(Math.log10(rough)));
  const candidates = [1, 2, 2.5, 5, 10].map((c) => c * pow);
  const step = candidates.find((c) => c >= rough) ?? candidates[candidates.length - 1];
  const start = Math.floor(min / step) * step;
  const end = Math.ceil(max / step) * step;
  const out: number[] = [];
  for (let v = start; v <= end + step / 2; v += step) out.push(Number(v.toFixed(10)));
  return out;
}

export function linear(domain: [number, number], range: [number, number], nice = false, tickCount = 5): Linear {
  let [d0, d1] = domain;
  const ticks = niceTicks(d0, d1, tickCount);
  if (nice) {
    d0 = Math.min(d0, ticks[0]);
    d1 = Math.max(d1, ticks[ticks.length - 1]);
  }
  const [r0, r1] = range;
  const f = ((v: number) => {
    if (d1 === d0) return (r0 + r1) / 2;
    return r0 + ((v - d0) / (d1 - d0)) * (r1 - r0);
  }) as Linear;
  f.domain = [d0, d1];
  f.range = [r0, r1];
  f.ticks = ticks.filter((t) => t >= d0 && t <= d1);
  return f;
}

export interface Band {
  (key: string): number;
  bandwidth: number;
  step: number;
  keys: string[];
}

export function band(keys: string[], range: [number, number], padding = 0.2): Band {
  const n = Math.max(1, keys.length);
  const [r0, r1] = range;
  const step = (r1 - r0) / n;
  const bandwidth = step * (1 - padding);
  const offset = (step - bandwidth) / 2;
  const f = ((key: string) => {
    const i = keys.indexOf(key);
    return r0 + (i < 0 ? 0 : i) * step + offset;
  }) as Band;
  f.bandwidth = bandwidth;
  f.step = step;
  f.keys = keys;
  return f;
}

/** 1234567 → "1.234.567"; 12.5 → "12,5". Sin Intl. */
export function formatNumber(v: number, decimals?: number): string {
  if (!isFinite(v)) return "";
  const neg = v < 0;
  const abs = Math.abs(v);
  const d = decimals ?? (Number.isInteger(abs) ? 0 : abs < 10 ? 1 : 0);
  const fixed = abs.toFixed(d);
  const [int, frac] = fixed.split(".");
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return (neg ? "−" : "") + grouped + (frac ? "," + frac : "");
}

/** Formato corto para ejes: 12.000 → "12 mil"; 1.500.000 → "1,5 M". */
export function formatShort(v: number): string {
  const abs = Math.abs(v);
  if (abs >= 1_000_000) return formatNumber(v / 1_000_000, abs % 1_000_000 === 0 ? 0 : 1) + " M";
  if (abs >= 10_000) return formatNumber(v / 1000, abs % 1000 === 0 ? 0 : 1) + " mil";
  return formatNumber(v);
}

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;
const MONTHS_SHORT = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

/** Valor numérico de una x: número, año o fecha ISO (días desde 1970). */
export function xValue(x: string | number): number | undefined {
  if (typeof x === "number") return x;
  const m = x.match(ISO_DATE);
  if (m) return Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])) / 86_400_000;
  if (/^\d{4}$/.test(x)) return Number(x);
  return undefined;
}

export function isIsoDate(x: string | number): boolean {
  return typeof x === "string" && ISO_DATE.test(x);
}

/** Etiqueta breve de una x: "2026-08-13" → "13 ago"; 1921 → "1921". */
export function xLabel(x: string | number): string {
  if (typeof x === "number") return String(x);
  const m = x.match(ISO_DATE);
  if (m) return `${Number(m[3])} ${MONTHS_SHORT[Number(m[2]) - 1]}`;
  return x;
}

/** Etiqueta larga: "2026-08-13" → "13 ago 2026". */
export function xLabelLong(x: string | number): string {
  if (typeof x === "number") return String(x);
  const m = x.match(ISO_DATE);
  if (m) return `${Number(m[3])} ${MONTHS_SHORT[Number(m[2]) - 1]} ${m[1]}`;
  return x;
}

/** Ticks de un eje temporal expresado en días desde 1970 (fechas ISO). */
export function dayTicks(min: number, max: number, count = 6): Array<{ v: number; label: string }> {
  const span = max - min;
  const out: Array<{ v: number; label: string }> = [];
  if (span <= 0) return [{ v: min, label: dayLabel(min) }];
  const step = Math.max(1, Math.ceil(span / count));
  for (let v = Math.ceil(min); v <= max; v += step) out.push({ v, label: dayLabel(v) });
  return out;
}

export function dayLabel(days: number): string {
  const d = new Date(days * 86_400_000);
  return `${d.getUTCDate()} ${MONTHS_SHORT[d.getUTCMonth()]}`;
}

/** Recorta una etiqueta larga con puntos suspensivos. */
export function truncate(s: string, max: number): string {
  return s.length > max ? s.slice(0, max - 1).trimEnd() + "…" : s;
}
