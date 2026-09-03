import type { EraId, EventKind, TimelineEvent } from "./types";

/** Definición de un paso del artículo (fuente única de orden, ids y títulos). */
export interface PasoDef {
  id: string;
  title: string;
  /** Fichero HTML en src/content/con-textos/<especial>/. */
  file: string;
  /** Rango de años que cubre (para enlazar eventos de la línea temporal). */
  years?: [number, number];
  eras?: EraId[];
  kinds?: EventKind[];
}

export function yearOfDate(date: string | number): number {
  return Number(String(date).slice(0, 4));
}

/** Paso al que pertenece un evento: el suyo o el primero cuyo rango lo contiene. */
export function pasoForEvent(ev: TimelineEvent, pasos: PasoDef[]): PasoDef | undefined {
  if (ev.pasoId) {
    const p = pasos.find((x) => x.id === ev.pasoId);
    if (p) return p;
  }
  const y = yearOfDate(ev.date);
  return pasos.find((p) => p.years && y >= p.years[0] && y <= p.years[1]);
}
