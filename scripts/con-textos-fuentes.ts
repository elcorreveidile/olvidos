/**
 * Genera docs/con-textos/<especial>/FUENTES.md a partir de sources.ts.
 * Uso: npx tsx scripts/con-textos-fuentes.ts espana-marruecos
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";

const especial = process.argv[2] ?? "espana-marruecos";
const KIND_LABEL: Record<string, string> = {
  parlamentaria: "Diarios de Sesiones y publicaciones parlamentarias",
  oficial: "Fuentes oficiales (BOE, ministerios, UE, ONU, tribunales)",
  dato: "Datos y estadísticas",
  academica: "Bibliografía académica",
  archivo: "Archivos y hemerotecas",
  multimedia: "Vídeo, audio e imágenes",
  prensa: "Prensa",
};
const ORDER = ["parlamentaria", "oficial", "dato", "academica", "archivo", "multimedia", "prensa"];

async function main() {
  const { SOURCES } = await import(join(process.cwd(), "src", "data", "con-textos", especial, "sources.ts"));
  const groups = new Map<string, typeof SOURCES>();
  for (const s of SOURCES) {
    const k = ORDER.includes(s.kind) ? s.kind : "prensa";
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k)!.push(s);
  }
  let out = `# Fuentes del especial «España y Marruecos, 1859-2026»\n\nGenerado por \`scripts/con-textos-fuentes.ts\` a partir de \`src/data/con-textos/${especial}/sources.ts\` (${SOURCES.length} fuentes). Fecha de consulta: la indicada en cada entrada (por defecto, 2 de septiembre de 2026). Las notas señalan muros de pago, accesos denegados o cifras discutidas.\n\n`;
  for (const k of ORDER) {
    const rows = (groups.get(k) ?? []).sort((a: { date?: string; title: string }, b: { date?: string; title: string }) =>
      (a.date ?? "").localeCompare(b.date ?? "") || a.title.localeCompare(b.title));
    if (!rows.length) continue;
    out += `## ${KIND_LABEL[k]} (${rows.length})\n\n`;
    for (const s of rows) {
      const who = [s.author, s.publisher].filter(Boolean).join(", ");
      out += `- ${s.date ? `**${s.date}** · ` : ""}${who ? `${who}: ` : ""}[${s.title}](${s.url})${s.note ? ` — _${s.note}_` : ""} \`${s.id}\`\n`;
    }
    out += "\n";
  }
  writeFileSync(join(process.cwd(), "docs", "con-textos", especial, "FUENTES.md"), out);
  console.log(`FUENTES.md: ${SOURCES.length} fuentes`);
}
main();
