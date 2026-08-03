// Junta Directiva de la Asociación Cultural Olvidos de Granada.
// Se renueva en Asamblea (mandato de 4 años, Art. 15 de los estatutos).
// Para actualizarla tras una Asamblea, edita este array.

export type CargoJunta = {
  cargo: string;
  nombre: string;
  memberNumber?: number;
};

export const JUNTA_DIRECTIVA: CargoJunta[] = [
  { cargo: "Presidencia", nombre: "Ramón Repiso Ruiz", memberNumber: 2 },
  { cargo: "Vicepresidencia", nombre: "Javier Benítez Laínez", memberNumber: 4 },
  { cargo: "Secretaría", nombre: "Alfonso Salazar Mendías", memberNumber: 3 },
];

// La Tesorería, al no haber un vocal que la asuma, corresponde a la Secretaría
// (Art. 22 de los estatutos).
export const JUNTA_NOTA =
  "La Tesorería es asumida por la Secretaría, conforme al artículo 22 de los estatutos. La Junta Directiva se renovará y ampliará en la próxima Asamblea General.";
