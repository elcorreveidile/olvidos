/**
 * Fusiona los bloques de investigación (docs/con-textos/<especial>/bloques/*.json)
 * en los ficheros de datos tipados de src/data/con-textos/<especial>/.
 *
 * Uso: npx tsx scripts/con-textos-merge.ts espana-marruecos
 *
 * - Deduplica por id (el último bloque gana) y avisa de colisiones.
 * - Ordena eventos, citas y declaraciones por fecha.
 * - Comprueba que cada sourceId referenciado existe.
 * - Genera ficheros .ts con `satisfies` para que `tsc` valide los literales.
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const especial = process.argv[2];
if (!especial) {
  console.error("Uso: npx tsx scripts/con-textos-merge.ts <especial>");
  process.exit(1);
}

const root = process.cwd();
const bloquesDir = join(root, "docs", "con-textos", especial, "bloques");
const outDir = join(root, "src", "data", "con-textos", especial);
mkdirSync(outDir, { recursive: true });

type Row = Record<string, unknown> & { id: string };
interface Block {
  sources?: Row[];
  events?: Row[];
  quotes?: Row[];
  statements?: Row[];
  series?: Row[];
  videos?: Row[];
  images?: Row[];
  geo?: Row[];
}

const keys = ["sources", "events", "quotes", "statements", "series", "videos", "images", "geo"] as const;
const merged: Record<(typeof keys)[number], Map<string, Row>> = Object.fromEntries(
  keys.map((k) => [k, new Map<string, Row>()])
) as never;

const files = readdirSync(bloquesDir).filter((f) => f.endsWith(".json")).sort();
let warnings = 0;
for (const f of files) {
  let block: Block;
  try {
    block = JSON.parse(readFileSync(join(bloquesDir, f), "utf8")) as Block;
  } catch (e) {
    console.error(`✖ ${f}: JSON inválido (${(e as Error).message})`);
    process.exit(1);
  }
  for (const k of keys) {
    for (const row of block[k] ?? []) {
      if (!row || typeof row.id !== "string") {
        console.warn(`! ${f}: ${k} sin id: ${JSON.stringify(row).slice(0, 80)}`);
        warnings++;
        continue;
      }
      if (merged[k].has(row.id)) {
        console.warn(`! ${f}: ${k} id duplicado "${row.id}" (se conserva el último)`);
        warnings++;
      }
      merged[k].set(row.id, row);
    }
  }
  console.log(`· ${f}: ${keys.map((k) => `${k}=${block[k]?.length ?? 0}`).join(" ")}`);
}

// Referencias cruzadas de fuentes
const sourceIds = new Set(merged.sources.keys());
for (const k of ["events", "quotes", "statements", "series", "videos"] as const) {
  for (const row of merged[k].values()) {
    for (const sid of (row.sourceIds as string[] | undefined) ?? []) {
      if (!sourceIds.has(sid)) {
        console.warn(`! ${k} "${row.id}" cita una fuente inexistente: ${sid}`);
        warnings++;
      }
    }
  }
}

const byDate = (a: Row, b: Row) => String(a.date ?? "").localeCompare(String(b.date ?? ""));
const sorted = (k: (typeof keys)[number], sort = false) => {
  const arr = [...merged[k].values()];
  return sort ? arr.sort(byDate) : arr;
};

const header = (what: string, type: string, importType: string) =>
  `// Generado por scripts/con-textos-merge.ts a partir de docs/con-textos/${especial}/bloques/*.json\n` +
  `// No editar a mano: corrige el bloque de origen y vuelve a ejecutar el script.\n` +
  `import type { ${importType} } from "@/lib/con-textos/types";\n\n` +
  `export const ${what} = `;

const emit = (file: string, what: string, importType: string, rows: Row[]) => {
  const body = JSON.stringify(rows, null, 2);
  writeFileSync(join(outDir, file), `${header(what, importType, importType)}${body} satisfies ${importType}[];\n`);
  console.log(`→ ${file}: ${rows.length}`);
};

emit("sources.ts", "SOURCES", "Source", sorted("sources"));
emit("timeline.ts", "TIMELINE", "TimelineEvent", sorted("events", true));
emit("quotes.ts", "QUOTES", "Quote", sorted("quotes", true));
emit("statements.ts", "STATEMENTS", "Statement", sorted("statements", true));
emit("series.ts", "SERIES", "Series", sorted("series"));
emit("videos.ts", "VIDEOS", "VideoEmbed", sorted("videos"));
emit("images.ts", "IMAGES", "ImageRef", sorted("images"));
if (merged.geo.size) {
  const rows = sorted("geo");
  writeFileSync(
    join(outDir, "geo.ts"),
    `// Generado por scripts/con-textos-merge.ts. No editar a mano.\n` +
      `export interface GeoPoint { id: string; label: string; lat: number; lon: number; era?: string; note?: string }\n\n` +
      `export const GEO = ${JSON.stringify(rows, null, 2)} satisfies GeoPoint[];\n`
  );
  console.log(`→ geo.ts: ${rows.length}`);
}
console.log(warnings ? `\n${warnings} avisos.` : "\nSin avisos.");
