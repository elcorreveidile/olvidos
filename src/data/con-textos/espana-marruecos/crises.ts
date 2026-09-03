import type { Crisis } from "@/lib/con-textos/types";

/** Crisis con declaraciones por bloque en `statements.ts` (orden cronológico). */
export const CRISES = [
  { id: "sahara-1975", label: "Marcha Verde y Acuerdos de Madrid", year: 1975 },
  { id: "perejil-2002", label: "Perejil", year: 2002 },
  { id: "ceuta-melilla-2007", label: "Visita de los Reyes a Ceuta y Melilla", year: 2007 },
  { id: "tarajal-2014", label: "El Tarajal", year: 2014 },
  { id: "ceuta-2021", label: "Ceuta, mayo de 2021", year: 2021 },
  { id: "sahara-2022", label: "La carta sobre el Sáhara", year: 2022 },
  { id: "melilla-2022", label: "Melilla, 24 de junio de 2022", year: 2022 },
  { id: "ceuta-2026", label: "Ceuta, julio-septiembre de 2026", year: 2026 },
] satisfies Crisis[];
