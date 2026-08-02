import type { DocumentCategory } from "@prisma/client";

/** Etiquetas visibles y orden de las categorías de documentos. */
export const DOCUMENT_CATEGORY_LABELS: Record<DocumentCategory, string> = {
  ESTATUTOS: "Estatutos",
  ACTA: "Actas de reuniones",
  LIBRO_SOCIOS: "Libro de socios",
  OTRO: "Otros documentos",
};

export const DOCUMENT_CATEGORY_ORDER: DocumentCategory[] = [
  "ESTATUTOS",
  "ACTA",
  "LIBRO_SOCIOS",
  "OTRO",
];
