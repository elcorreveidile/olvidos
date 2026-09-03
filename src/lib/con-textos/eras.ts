import type { Era, EraId } from "./types";

/** Etapas históricas usadas por la línea temporal, la hemeroteca y el mapa. */
export const ERAS: Era[] = [
  { id: "isabelina", label: "Reinado de Isabel II", from: 1833, to: 1868 },
  { id: "sexenio", label: "Sexenio Democrático", from: 1868, to: 1874 },
  { id: "restauracion", label: "Restauración", from: 1875, to: 1923 },
  { id: "dictadura-primo", label: "Dictadura de Primo de Rivera", from: 1923, to: 1931 },
  { id: "republica", label: "II República y guerra civil", from: 1931, to: 1939 },
  { id: "franquismo", label: "Franquismo", from: 1939, to: 1975 },
  { id: "transicion", label: "Transición", from: 1975, to: 1982 },
  { id: "democracia", label: "Democracia (1982-)", from: 1982, to: 2026 },
];

export const ERA_LABEL: Record<EraId, string> = Object.fromEntries(
  ERAS.map((e) => [e.id, e.label])
) as Record<EraId, string>;

/** Etapa a la que pertenece un año. */
export function eraOfYear(year: number): EraId {
  const found = ERAS.find((e) => year >= e.from && year <= e.to);
  return found?.id ?? "democracia";
}
