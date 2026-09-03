/**
 * Paleta de las islas, con los colores de la casa. Vive en src/components
 * para que Tailwind también vea las clases que se usen aquí.
 */
export const COLORS = {
  coral: "#ff6261",
  coralLight: "#fc9292",
  tinta: "#141414",
  acero: "#617685",
  aceroLight: "#a1b6c4",
  teatro: "#7a1420",
  ocre: "#d9a441",
  grid: "#e6ebef",
  axis: "#a1b6c4",
  text: "#141414",
  muted: "#617685",
};

/** Colores por serie/grupo, en orden. */
export const SERIES_COLORS = [COLORS.coral, COLORS.tinta, COLORS.acero, COLORS.ocre, COLORS.teatro, COLORS.aceroLight];

export function seriesColor(i: number): string {
  return SERIES_COLORS[i % SERIES_COLORS.length];
}

/** Colores por orientación del Gobierno (línea temporal). */
export const GOVERNMENT_COLORS: Record<string, string> = {
  derecha: "#1f4e79",
  liberal: "#d9a441",
  izquierda: "#ff6261",
  dictadura: "#4a4a4a",
};

export const GOVERNMENT_LABELS: Record<string, string> = {
  derecha: "Gobierno conservador / de derecha",
  liberal: "Gobierno liberal",
  izquierda: "Gobierno de izquierda / progresista",
  dictadura: "Dictadura",
};

/** Colores por bloque (comparador, hemeroteca). */
export const BLOC_COLORS: Record<string, string> = {
  gobierno: "#141414",
  derecha: "#1f4e79",
  izquierda: "#ff6261",
  nacionalistas: "#2e7d5b",
  marruecos: "#7a1420",
  monarquia: "#d9a441",
  otro: "#617685",
};

export const BLOC_LABELS: Record<string, string> = {
  gobierno: "Gobierno",
  derecha: "Derecha / oposición conservadora",
  izquierda: "Izquierda",
  nacionalistas: "Nacionalistas e independentistas",
  marruecos: "Marruecos",
  monarquia: "La Corona",
  otro: "Otros",
};
