/**
 * Composición del especial «Ceuta no empezó en julio»: lee los diez ficheros
 * HTML de src/content/con-textos/espana-marruecos, resuelve las llamadas a
 * fuentes ([[cite:id]]), valida cada marcador de isla contra los datos y
 * devuelve el HTML final (pasos separados por <!--nextpage-->) listo para la
 * base de datos o para la vista previa.
 *
 * Solo se ejecuta en servidor o en Node (usa el sistema de ficheros).
 */
import fs from "node:fs";
import path from "node:path";
import { extractCited, splitIslas } from "@/lib/islas";
import {
  IslaError,
  loadIsla,
  MAX_BYTES_PER_ISLA,
  MAX_BYTES_PER_PASO,
  WARN_BYTES_PER_ISLA,
  type IslaContext,
} from "../islas-def";
import { ESPECIALES, type EspecialData } from "../especiales";
import { PASOS } from "./pasos";

export const ESPECIAL_ID = "espana-marruecos";

/** Metadatos del artículo tal como se guardan en la base de datos. */
export const ESPECIAL_META = {
  id: ESPECIAL_ID,
  slug: "ceuta-no-empezo-en-julio",
  title: "Ceuta no empezó en julio. España y Marruecos, 1859-2026",
  excerpt:
    "Un siglo y medio de guerras, tratados, vallas y discursos leídos en los Diarios de Sesiones: qué dijo cada Gobierno, cada oposición y cada rey cuando Marruecos fue el problema. Con línea temporal, hemeroteca parlamentaria, mapas y cifras contrastadas.",
  byline: "Javier Benítez Láinez",
  metaTitle: "Ceuta no empezó en julio: España y Marruecos, 1859-2026",
  metaDescription:
    "Especial interactivo: de la guerra de África a la crisis de Ceuta de 2026. Diarios de Sesiones, cifras contrastadas, mapas y vídeos para entender un conflicto de 167 años.",
  coverImageId: "img-valla-ceuta-2012",
  category: {
    name: "Con-textos",
    slug: "con-textos",
    description:
      "Especiales de actualidad con contexto histórico: datos contrastados, fuentes primarias y Diarios de Sesiones. Contra el bulo, contexto.",
  },
  tags: ["Marruecos", "Ceuta", "Melilla", "Sáhara Occidental", "Monarquía", "Congreso de los Diputados"],
  contentDir: path.join("src", "content", "con-textos", ESPECIAL_ID),
};

export interface ComposeWarning {
  level: "error" | "warn";
  paso?: string;
  message: string;
}

export interface ComposedPaso {
  n: number;
  id: string;
  title: string;
  /** HTML del paso sin el marcador <!--paso:…--> (como lo pinta la web). */
  html: string;
  cited: string[];
  islas: string[];
  bytes: number;
}

export interface Composed {
  meta: typeof ESPECIAL_META;
  pasos: ComposedPaso[];
  /** HTML completo para Article.content (con <!--paso:…--> y <!--nextpage-->). */
  html: string;
  titles: string[];
  warnings: ComposeWarning[];
}

const CITE_RE = /\[\[cite:([A-Za-z0-9_.-]+)\]\]/g;

/** Sustituye [[cite:id]] por llamadas numeradas; numeración por paso, en orden de aparición. */
export function renderCiteRefs(html: string, data: EspecialData, onMissing: (id: string) => void): string {
  const order: string[] = [];
  return html.replace(CITE_RE, (_m, id: string) => {
    const src = data.SOURCES.find((s) => s.id === id);
    if (!src) {
      onMissing(id);
      return "";
    }
    let n = order.indexOf(id);
    if (n < 0) {
      order.push(id);
      n = order.length - 1;
    }
    const title = src.title.replace(/"/g, "&quot;");
    return `<a class="cite-ref" href="#f-${n + 1}" data-src="${id}" title="${title}"><sup>${n + 1}</sup></a>`;
  });
}

export function contentPath(file: string): string {
  return path.join(process.cwd(), ESPECIAL_META.contentDir, file);
}

export function compose(opts: { strict?: boolean } = {}): Composed {
  const data = ESPECIALES[ESPECIAL_ID].data();
  const warnings: ComposeWarning[] = [];
  const warn = (message: string, paso?: string) => warnings.push({ level: "warn", message, paso });
  const error = (message: string, paso?: string) => warnings.push({ level: "error", message, paso });

  // Identificadores de paso únicos.
  const ids = PASOS.map((p) => p.id);
  if (new Set(ids).size !== ids.length) error("hay identificadores de paso repetidos en PASOS");

  // Ids de imágenes repetidos (aviso: el primero gana en las islas).
  const imgIds = data.IMAGES.map((i) => i.id).filter(Boolean);
  const dupImgs = imgIds.filter((id, i) => imgIds.indexOf(id) !== i);
  if (dupImgs.length) warn(`ids de imagen repetidos: ${Array.from(new Set(dupImgs)).join(", ")}`);

  const refs = PASOS.map((p, i) => ({ n: i + 1, id: p.id, title: p.title }));
  const pasos: ComposedPaso[] = [];

  PASOS.forEach((def, i) => {
    const n = i + 1;
    const file = contentPath(def.file);
    if (!fs.existsSync(file)) {
      error(`falta el fichero ${def.file}`, def.id);
      pasos.push({ n, id: def.id, title: def.title, html: `<h2>${def.title}</h2>`, cited: [], islas: [], bytes: 0 });
      return;
    }
    let raw = fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n").trim();
    if (/^<!--\s*paso:/i.test(raw)) {
      warn(`${def.file} empieza por <!--paso:…-->; ese marcador lo añade la composición`, def.id);
      raw = raw.replace(/^<!--\s*paso:[^>]*-->\s*/i, "");
    }
    if (/<!--\s*nextpage\s*-->/i.test(raw)) error(`${def.file} contiene <!--nextpage-->; cada paso va en su fichero`, def.id);
    if (/href="[^"]*[?&]author=/i.test(raw)) error(`${def.file} enlaza con un parámetro «author» (el middleware lo bloquea)`, def.id);

    const html = renderCiteRefs(raw, data, (id) => error(`fuente citada desconocida «${id}»`, def.id));
    const cited = extractCited(html);
    const ctx: IslaContext = {
      especial: ESPECIAL_ID,
      slug: ESPECIAL_META.slug,
      basePath: `/articulos/${ESPECIAL_META.slug}`,
      mode: "paso",
      pasoN: n,
      pasoId: def.id,
      pasos: refs,
      cited,
    };
    const islas: string[] = [];
    let bytes = 0;
    for (const b of splitIslas(html)) {
      if (b.type !== "isla") continue;
      islas.push(b.name);
      try {
        const { data: d } = loadIsla(b.name, b.props, data, ctx);
        const size = JSON.stringify(d).length;
        bytes += size;
        if (size > MAX_BYTES_PER_ISLA) error(`${b.raw}: ${size} bytes (máximo ${MAX_BYTES_PER_ISLA})`, def.id);
        else if (size > WARN_BYTES_PER_ISLA) warn(`${b.raw}: ${size} bytes (aviso a partir de ${WARN_BYTES_PER_ISLA})`, def.id);
        if (b.name === "fuentes" && (d as { sources: unknown[] }).sources.length > 80) warn(`${b.raw}: más de 80 fuentes`, def.id);
      } catch (e) {
        error(e instanceof IslaError ? `${b.raw}: ${e.message}` : `${b.raw}: ${(e as Error).message}`, def.id);
      }
    }
    if (bytes > MAX_BYTES_PER_PASO) error(`el paso suma ${bytes} bytes de datos de islas (máximo ${MAX_BYTES_PER_PASO})`, def.id);
    if (!/^\s*<h2[\s>]/i.test(html)) warn(`${def.file} no empieza por <h2>`, def.id);
    pasos.push({ n, id: def.id, title: def.title, html, cited, islas, bytes });
  });

  const full = pasos.map((p) => `<!--paso:${p.id}-->\n${p.html}`).join("\n<!--nextpage-->\n");
  const titles = PASOS.map((p) => p.title);

  if (opts.strict && warnings.some((w) => w.level === "error")) {
    const msg = warnings
      .filter((w) => w.level === "error")
      .map((w) => `${w.paso ? `[${w.paso}] ` : ""}${w.message}`)
      .join("\n");
    throw new Error(`La composición del especial tiene errores:\n${msg}`);
  }
  return { meta: ESPECIAL_META, pasos, html: full, titles, warnings };
}
