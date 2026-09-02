/**
 * Comprobaciones de calidad de los datos de un especial Con-textos.
 * Uso: npx tsx scripts/con-textos-check.ts espana-marruecos
 */
import { join } from "node:path";

const especial = process.argv[2] ?? "espana-marruecos";
const dir = join(process.cwd(), "src", "data", "con-textos", especial);

async function main() {
  const { SOURCES } = await import(join(dir, "sources.ts"));
  const { TIMELINE } = await import(join(dir, "timeline.ts"));
  const { QUOTES } = await import(join(dir, "quotes.ts"));
  const { STATEMENTS } = await import(join(dir, "statements.ts"));
  const { SERIES } = await import(join(dir, "series.ts"));

  const problems: string[] = [];
  const ids = new Set<string>();
  for (const s of SOURCES) {
    if (ids.has(s.id)) problems.push(`fuente duplicada ${s.id}`);
    ids.add(s.id);
    if (!/^https?:\/\//.test(s.url)) problems.push(`fuente ${s.id} sin URL válida`);
  }
  const urls = new Map<string, string>();
  for (const s of SOURCES) {
    const prev = urls.get(s.url);
    if (prev) problems.push(`URL repetida en ${prev} y ${s.id}: ${s.url}`);
    urls.set(s.url, s.id);
  }
  for (const q of QUOTES) {
    if (!q.unverified && (!q.pdfUrl || !q.sessionRef)) problems.push(`cita ${q.id} verificada sin pdfUrl/sessionRef`);
    if (!q.text?.trim()) problems.push(`cita ${q.id} sin texto`);
  }
  for (const e of TIMELINE) if (!e.sourceIds?.length) problems.push(`evento ${e.id} sin fuentes`);
  for (const s of STATEMENTS) if (!s.sourceIds?.length) problems.push(`declaración ${s.id} sin fuentes`);
  for (const s of SERIES) if (!s.points?.length) problems.push(`serie ${s.id} sin puntos`);

  const verified = QUOTES.filter((q: { unverified?: boolean }) => !q.unverified).length;
  console.log(`Fuentes: ${SOURCES.length} · Eventos: ${TIMELINE.length} · Citas: ${QUOTES.length} (${verified} verificadas) · Declaraciones: ${STATEMENTS.length} · Series: ${SERIES.length}`);
  if (problems.length) {
    console.log(`\n${problems.length} problemas:`);
    for (const p of problems) console.log(` - ${p}`);
    process.exitCode = 1;
  } else {
    console.log("Sin problemas.");
  }
}
main();
