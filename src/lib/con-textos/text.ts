/** Normaliza para buscar sin acentos ni mayúsculas. */
export function foldAccents(s: string): string {
  return (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

/** ¿Todas las palabras de la consulta aparecen en el texto? */
export function matchesQuery(text: string, query: string): boolean {
  const q = foldAccents(query).trim();
  if (!q) return true;
  const t = foldAccents(text);
  return q.split(/\s+/).every((w) => t.includes(w));
}

/** Slug sencillo para comparar etiquetas ("VOX" y "Vox" coinciden). */
export function normKey(s: string): string {
  return foldAccents(s).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
