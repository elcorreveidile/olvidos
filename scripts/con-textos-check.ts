/**
 * Comprobaciones de calidad de los datos de un especial Con-textos.
 * Uso: npx tsx scripts/con-textos-check.ts espana-marruecos [--pendientes]
 *   --pendientes  lista las citas verificadas solo por vídeo (sin Diario).
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
  // Una cita parlamentaria verificada lleva el Diario de Sesiones (pdfUrl) o,
  // mientras el Diario no se publica, el vídeo oficial del Congreso con el
  // minuto en sessionRef. Estas últimas quedan «pendientes de Diario».
  const videoOnly: string[] = [];
  for (const q of QUOTES) {
    const parliamentary = q.chamber !== "otro";
    if (parliamentary && !q.unverified) {
      if (!q.sessionRef) problems.push(`cita parlamentaria ${q.id} verificada sin sessionRef`);
      if (!q.pdfUrl && !q.videoUrl) problems.push(`cita parlamentaria ${q.id} verificada sin pdfUrl ni videoUrl`);
      if (!q.pdfUrl && q.videoUrl) {
        videoOnly.push(q.id);
        if (!/min\. \d{1,3}:\d{2}/.test(q.sessionRef)) problems.push(`cita ${q.id} verificada solo por vídeo sin «min. m:ss» en sessionRef`);
        if (!/^https:\/\/app\.congreso\.es\//.test(q.videoUrl)) problems.push(`cita ${q.id} verificada solo por vídeo con videoUrl que no es del Congreso`);
      }
    }
    for (const u of [q.pdfUrl, q.videoUrl]) if (u && !/^https?:\/\//.test(u)) problems.push(`cita ${q.id} con URL inválida: ${u}`);
    if (!parliamentary && !q.sourceIds?.length) problems.push(`cita no parlamentaria ${q.id} sin fuentes`);
    if (!q.text?.trim()) problems.push(`cita ${q.id} sin texto`);
  }
  for (const e of TIMELINE) if (!e.sourceIds?.length) problems.push(`evento ${e.id} sin fuentes`);
  for (const s of STATEMENTS) if (!s.sourceIds?.length) problems.push(`declaración ${s.id} sin fuentes`);
  for (const s of SERIES) if (!s.points?.length) problems.push(`serie ${s.id} sin puntos`);

  const verified = QUOTES.filter((q: { unverified?: boolean }) => !q.unverified).length;
  console.log(`Fuentes: ${SOURCES.length} · Eventos: ${TIMELINE.length} · Citas: ${QUOTES.length} (${verified} verificadas, ${videoOnly.length} solo por vídeo, pendientes de Diario) · Declaraciones: ${STATEMENTS.length} · Series: ${SERIES.length}`);
  if (process.argv.includes("--pendientes")) for (const id of videoOnly) console.log(` · ${id}`);
  if (problems.length) {
    console.log(`\n${problems.length} problemas:`);
    for (const p of problems) console.log(` - ${p}`);
    process.exitCode = 1;
  } else {
    console.log("Sin problemas.");
  }
}
main();
