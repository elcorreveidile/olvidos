/**
 * Definición de las islas: para cada nombre de marcador, cómo se interpretan
 * sus atributos (`parse`) y qué subconjunto de datos, ya filtrado y aligerado,
 * recibe el componente (`load`). TypeScript puro: lo usan el renderizado del
 * artículo (ArticleBody) y el script que compone y valida el contenido.
 *
 * Reglas editoriales que aplican todos los loaders:
 *  - Nada marcado `unverified` llega a una isla.
 *  - Las fuentes se resuelven a {id, title, publisher, url, date} (máx. 3).
 *  - Ninguna isla escribe en la query de la URL: el middleware devuelve 403 a
 *    cualquier petición con un parámetro llamado `author`; el estado de los
 *    filtros vive en el componente y los enlaces profundos usan anclas `#`.
 */
import { boolProp, listProp, numberProp, rangeProp, type IslaProps } from "@/lib/islas";
import type { EspecialData } from "./especiales";
import { ERAS } from "./eras";
import { pasoForEvent, yearOfDate } from "./pasos-def";
import { commonsThumb } from "./images";
import { normKey } from "./text";
import type { Bloc, EraId, EventKind, Government, Source } from "./types";

export const ISLA_NAMES = [
  "linea-temporal",
  "hemeroteca",
  "comparador",
  "grafico",
  "mapa",
  "video",
  "figura",
  "fuentes",
] as const;
export type IslaName = (typeof ISLA_NAMES)[number];

export const WARN_BYTES_PER_ISLA = 120_000;
export const MAX_BYTES_PER_ISLA = 300_000;
export const MAX_BYTES_PER_PASO = 400_000;

export interface PasoRef {
  n: number;
  id: string;
  title: string;
}

export interface IslaContext {
  especial: string;
  slug: string;
  /** "/articulos/<slug>" o la ruta de vista previa. */
  basePath: string;
  mode: "paso" | "todo";
  pasoN: number;
  pasoId: string;
  pasos: PasoRef[];
  /** Ids de fuentes citadas con [[cite:…]] en este paso, en orden. */
  cited: string[];
}

export class IslaError extends Error {
  constructor(name: string, message: string) {
    super(`isla «${name}»: ${message}`);
    this.name = "IslaError";
  }
}

export interface SlimSource {
  id: string;
  title: string;
  publisher: string;
  url: string;
  date?: string;
  kind?: Source["kind"];
  note?: string;
}

export function slimSource(s: Source): SlimSource {
  const out: SlimSource = { id: s.id, title: s.title, publisher: s.publisher, url: s.url, kind: s.kind };
  if (s.date) out.date = s.date;
  if (s.note) out.note = s.note;
  return out;
}

function resolveSources(ids: string[] | undefined, data: EspecialData, max = 3): SlimSource[] {
  if (!ids?.length) return [];
  const out: SlimSource[] = [];
  for (const id of ids) {
    const s = data.SOURCES.find((x) => x.id === id);
    if (s) out.push(slimSource(s));
    if (out.length >= max) break;
  }
  return out;
}

/** Enlace a un paso según el modo de lectura. */
export function hrefPaso(ctx: IslaContext, pasoId: string): string | undefined {
  const p = ctx.pasos.find((x) => x.id === pasoId);
  if (!p) return undefined;
  return ctx.mode === "todo" ? `#${p.id}` : `${ctx.basePath}?paso=${p.n}`;
}

function assertKnownProps(name: string, props: IslaProps, allowed: string[]) {
  for (const k of Object.keys(props)) {
    if (!allowed.includes(k)) throw new IslaError(name, `atributo desconocido «${k}» (admite: ${allowed.join(", ")})`);
  }
}

function assertEras(name: string, eras: string[]): EraId[] {
  const valid = ERAS.map((e) => e.id as string);
  for (const e of eras) if (!valid.includes(e)) throw new IslaError(name, `época desconocida «${e}»`);
  return eras as EraId[];
}

/* ------------------------------------------------------------------ */
/* Línea temporal                                                      */
/* ------------------------------------------------------------------ */

export interface TimelineParams {
  years?: [number, number];
  eras: EraId[];
  kinds: EventKind[];
  governments: Government[];
  compact: boolean;
}

export interface TimelineItem {
  id: string;
  date: string;
  dateLabel: string;
  title: string;
  summary: string;
  government: Government;
  governmentLabel: string;
  headOfState?: string;
  initiator?: string;
  kinds: EventKind[];
  era: EraId;
  pasoHref?: string;
  pasoTitle?: string;
  sources: SlimSource[];
}

export interface TimelineData {
  events: TimelineItem[];
  periods: Array<{ id: string; from: number; to: number; government: Government; label: string }>;
  range: [number, number];
  eras: Array<{ id: EraId; label: string; from: number; to: number }>;
  compact: boolean;
}

const GOVERNMENTS: Government[] = ["derecha", "liberal", "izquierda", "dictadura"];

/* ------------------------------------------------------------------ */
/* Hemeroteca                                                          */
/* ------------------------------------------------------------------ */

export interface HemerotecaParams {
  eras: EraId[];
  topics: string[];
  chambers: string[];
  blocs: Bloc[];
  years?: [number, number];
  limit: number;
  complete: boolean;
}

export interface QuoteItem {
  id: string;
  date: string;
  dateLabel: string;
  chamber: string;
  speaker: string;
  party: string;
  partyKey: string;
  bloc: Bloc;
  role?: string;
  topics: string[];
  era: EraId;
  text: string;
  context?: string;
  sessionRef: string;
  pdfUrl: string;
  videoUrl?: string;
}

export interface HemerotecaData {
  quotes: QuoteItem[];
  facets: {
    eras: Array<{ id: EraId; label: string; n: number }>;
    chambers: Array<{ id: string; n: number }>;
    parties: Array<{ key: string; label: string; n: number }>;
    blocs: Array<{ id: Bloc; n: number }>;
    topics: Array<{ id: string; n: number }>;
  };
  limit: number;
  total: number;
}

/* ------------------------------------------------------------------ */
/* Comparador                                                          */
/* ------------------------------------------------------------------ */

export interface StatementItem {
  id: string;
  speaker: string;
  role: string;
  dateLabel: string;
  text: string;
  note?: string;
  /** Ids del diccionario `ComparadorData.sources` (máx. 2). */
  sourceIds: string[];
}

/** Disposición de los bloques: columnas en paralelo o apilados uno bajo otro. */
export type ComparadorLayout = "columnas" | "apilada";

export interface ComparadorData {
  crises: Array<{ id: string; label: string; year: number }>;
  blocs: Bloc[];
  byCrisis: Record<string, Partial<Record<Bloc, StatementItem[]>>>;
  /** Disposición por crisis (decidida en servidor). */
  layout: Record<string, ComparadorLayout>;
  /** Fuentes de todas las declaraciones, una sola vez por isla. */
  sources: Record<string, SlimSource>;
}

export const BLOC_ORDER: Bloc[] = ["gobierno", "derecha", "izquierda", "nacionalistas", "marruecos", "monarquia", "otro"];

const STACK_MIN_TOTAL = 16; // a partir de aquí las columnas son un muro
const STACK_MAX_BLOCS = 4; // con cinco o más bloques la rejilla siempre deja huecos
const STACK_RATIO = 2; // el bloque mayor dobla al menor…
const STACK_MIN_MAX = 6; // …y además tiene entidad (3 frente a 1 no justifica apilar)

export interface ComparadorParams {
  crises: string[];
  blocs: Bloc[];
  order: "cronologico" | "reciente";
  layout: "auto" | ComparadorLayout;
}

/**
 * Decide si los bloques de una crisis se muestran en columnas (equilibrados)
 * o apilados («fuente / caja, fuente / caja»), según sus recuentos.
 */
export function comparadorLayout(counts: number[]): ComparadorLayout {
  const filled = counts.filter((n) => n > 0);
  if (filled.length <= 1) return "columnas";
  const total = filled.reduce((a, b) => a + b, 0);
  const max = Math.max(...filled);
  const min = Math.min(...filled);
  if (total >= STACK_MIN_TOTAL || filled.length > STACK_MAX_BLOCS) return "apilada";
  if (max >= STACK_MIN_MAX && max > STACK_RATIO * min) return "apilada";
  return "columnas";
}

/* ------------------------------------------------------------------ */
/* Gráfico                                                             */
/* ------------------------------------------------------------------ */

export interface ChartData {
  id: string;
  title: string;
  unit: string;
  kind: "bar" | "line" | "grouped";
  groups: string[];
  points: Array<{ x: string | number; y: number; group?: string; note?: string }>;
  note?: string;
  sources: SlimSource[];
  height?: number;
}

/* ------------------------------------------------------------------ */
/* Mapa                                                                */
/* ------------------------------------------------------------------ */

export interface MapData {
  title?: string;
  points: Array<{ id: string; label: string; lat: number; lon: number; note?: string; era?: string }>;
  boxes: Array<{ id: string; label: string; bbox: [[number, number], [number, number]]; note?: string; era?: string }>;
  center: [number, number];
  zoom: number;
  height: number;
}

/* ------------------------------------------------------------------ */
/* Vídeo, figura, fuentes                                              */
/* ------------------------------------------------------------------ */

export interface VideoData {
  id: string;
  provider: string;
  embedUrl: string;
  pageUrl: string;
  title: string;
  date?: string;
  sources: SlimSource[];
}

export interface FigureData {
  id: string;
  src: string;
  original: string;
  width: number;
  height: number;
  alt: string;
  credit: string;
  license: string;
  creditUrl?: string;
  caption?: string;
  wide: boolean;
}

export interface SourcesData {
  title?: string;
  grouped: boolean;
  sources: Array<SlimSource & { n: number }>;
}

/* ------------------------------------------------------------------ */

export interface IslaDef<P, D> {
  client: boolean;
  allowed: string[];
  parse(props: IslaProps, ctx: IslaContext): P;
  load(p: P, data: EspecialData, ctx: IslaContext): D;
}

function normalizeEmbed(url: string): string {
  return url.replace(/^https:\/\/(www\.)?youtube\.com\/embed\//, "https://www.youtube-nocookie.com/embed/");
}

export const ISLAS = {
  "linea-temporal": {
    client: true,
    allowed: ["anios", "eras", "tipos", "gobiernos", "compacta"],
    parse(props, _ctx): TimelineParams {
      assertKnownProps("linea-temporal", props, this.allowed);
      const governments = listProp(props, "gobiernos") as Government[];
      for (const g of governments) if (!GOVERNMENTS.includes(g)) throw new IslaError("linea-temporal", `gobierno desconocido «${g}»`);
      return {
        years: rangeProp(props, "anios"),
        eras: assertEras("linea-temporal", listProp(props, "eras")),
        kinds: listProp(props, "tipos") as EventKind[],
        governments,
        compact: boolProp(props, "compacta"),
      };
    },
    load(p, data, ctx): TimelineData {
      const events = data.TIMELINE.filter((ev) => {
        const y = yearOfDate(ev.date);
        if (p.years && (y < p.years[0] || y > p.years[1])) return false;
        if (p.eras.length && !p.eras.includes(ev.era)) return false;
        if (p.kinds.length && !ev.kinds.some((k) => p.kinds.includes(k))) return false;
        if (p.governments.length && !p.governments.includes(ev.government)) return false;
        return true;
      });
      const years = events.map((e) => yearOfDate(e.date));
      const range: [number, number] = p.years ?? [
        Math.min(1859, ...years),
        Math.max(2026, ...years),
      ];
      const items: TimelineItem[] = events.map((ev) => {
        const paso = pasoForEvent(ev, data.PASOS);
        const href = paso ? hrefPaso(ctx, paso.id) : undefined;
        const item: TimelineItem = {
          id: ev.id,
          date: ev.date,
          dateLabel: ev.dateLabel,
          title: ev.title,
          summary: ev.summary,
          government: ev.government,
          governmentLabel: ev.governmentLabel,
          kinds: ev.kinds,
          era: ev.era,
          sources: resolveSources(ev.sourceIds, data, 2),
        };
        if (ev.headOfState) item.headOfState = ev.headOfState;
        if (ev.initiator) item.initiator = ev.initiator;
        if (href && paso && paso.id !== ctx.pasoId) {
          item.pasoHref = href;
          item.pasoTitle = paso.title;
        }
        return item;
      });
      const periods = data.GOBIERNOS.filter((g) => yearOfDate(g.to) >= range[0] && yearOfDate(g.from) <= range[1]).map((g) => ({
        id: g.id,
        from: Math.max(range[0], yearOfDate(g.from)),
        to: Math.min(range[1] + 1, yearOfDate(g.to) + (g.to.endsWith("-12-31") ? 1 : 0)),
        government: g.government,
        label: `${g.headOfGovernment} (${g.party})`,
      }));
      return {
        events: items,
        periods,
        range,
        eras: ERAS.filter((e) => e.to >= range[0] && e.from <= range[1]).map((e) => ({ id: e.id, label: e.label, from: e.from, to: e.to })),
        compact: p.compact,
      };
    },
  } satisfies IslaDef<TimelineParams, TimelineData>,

  hemeroteca: {
    client: true,
    allowed: ["eras", "temas", "camaras", "bloques", "anios", "limite", "completa"],
    parse(props, _ctx): HemerotecaParams {
      assertKnownProps("hemeroteca", props, this.allowed);
      return {
        eras: assertEras("hemeroteca", listProp(props, "eras")),
        topics: listProp(props, "temas").map(normKey),
        chambers: listProp(props, "camaras"),
        blocs: listProp(props, "bloques") as Bloc[],
        years: rangeProp(props, "anios"),
        limit: numberProp(props, "limite") ?? 10,
        complete: boolProp(props, "completa"),
      };
    },
    load(p, data, _ctx): HemerotecaData {
      const rows = data.QUOTES.filter((q) => {
        if (q.unverified) return false;
        if (p.eras.length && !p.eras.includes(q.era)) return false;
        if (p.chambers.length && !p.chambers.includes(q.chamber)) return false;
        if (p.blocs.length && !p.blocs.includes(q.bloc)) return false;
        if (p.years) {
          const y = yearOfDate(q.date);
          if (y < p.years[0] || y > p.years[1]) return false;
        }
        if (p.topics.length && !q.topics.map(normKey).some((t) => p.topics.includes(t))) return false;
        return true;
      });
      const count = <T extends string>(vals: T[]) => {
        const m = new Map<T, number>();
        for (const v of vals) m.set(v, (m.get(v) ?? 0) + 1);
        return m;
      };
      const quotes: QuoteItem[] = rows.map((q) => {
        const party = q.party?.trim() || "Sin adscripción";
        const item: QuoteItem = {
          id: q.id,
          date: q.date,
          dateLabel: q.dateLabel,
          chamber: q.chamber,
          speaker: q.speaker,
          party,
          partyKey: normKey(party),
          bloc: q.bloc,
          topics: q.topics,
          era: q.era,
          text: q.text,
          sessionRef: q.sessionRef,
          pdfUrl: q.pdfUrl,
        };
        if (q.role) item.role = q.role;
        if (q.context) item.context = q.context;
        if (q.videoUrl) item.videoUrl = q.videoUrl;
        return item;
      });
      const eraCounts = count(quotes.map((q) => q.era));
      const partyLabels = new Map<string, string>();
      for (const q of quotes) if (!partyLabels.has(q.partyKey)) partyLabels.set(q.partyKey, q.party);
      const partyCounts = count(quotes.map((q) => q.partyKey));
      return {
        quotes,
        facets: {
          eras: ERAS.filter((e) => eraCounts.has(e.id)).map((e) => ({ id: e.id, label: e.label, n: eraCounts.get(e.id) ?? 0 })),
          chambers: Array.from(count(quotes.map((q) => q.chamber)).entries()).map(([id, n]) => ({ id, n })),
          parties: Array.from(partyCounts.entries())
            .sort((a, b) => b[1] - a[1])
            .map(([key, n]) => ({ key, label: partyLabels.get(key) ?? key, n })),
          blocs: Array.from(count(quotes.map((q) => q.bloc)).entries()).map(([id, n]) => ({ id, n })),
          topics: Array.from(count(quotes.flatMap((q) => q.topics)).entries())
            .sort((a, b) => b[1] - a[1])
            .map(([id, n]) => ({ id, n })),
        },
        limit: p.complete ? quotes.length : p.limit,
        total: quotes.length,
      };
    },
  } satisfies IslaDef<HemerotecaParams, HemerotecaData>,

  comparador: {
    client: true,
    allowed: ["crisis", "bloques", "orden", "disposicion"],
    parse(props, _ctx): ComparadorParams {
      assertKnownProps("comparador", props, this.allowed);
      const crises = listProp(props, "crisis");
      if (!crises.length) throw new IslaError("comparador", "falta el atributo crisis");
      const blocs = listProp(props, "bloques") as Bloc[];
      for (const b of blocs) if (!BLOC_ORDER.includes(b)) throw new IslaError("comparador", `bloque desconocido «${b}»`);
      const order = (props.orden ?? "cronologico").trim();
      if (order !== "cronologico" && order !== "reciente") throw new IslaError("comparador", `orden desconocido «${order}» (admite: cronologico, reciente)`);
      const layout = (props.disposicion ?? "auto").trim();
      if (layout !== "auto" && layout !== "apilada" && layout !== "columnas") {
        throw new IslaError("comparador", `disposición desconocida «${layout}» (admite: auto, apilada, columnas)`);
      }
      return { crises, blocs: blocs.length ? blocs : BLOC_ORDER, order, layout };
    },
    load(p, data, _ctx): ComparadorData {
      const crises = p.crises.map((id) => {
        const c = data.CRISES.find((x) => x.id === id);
        if (!c) throw new IslaError("comparador", `crisis desconocida «${id}»`);
        return c;
      });
      const byCrisis: ComparadorData["byCrisis"] = {};
      const layout: ComparadorData["layout"] = {};
      const sources: ComparadorData["sources"] = {};
      for (const c of crises) {
        const rows = data.STATEMENTS.filter((s) => s.crisisId === c.id).sort((a, b) => a.date.localeCompare(b.date));
        if (p.order === "reciente") rows.reverse();
        const groups: Partial<Record<Bloc, StatementItem[]>> = {};
        for (const s of rows) {
          if (!p.blocs.includes(s.bloc)) continue;
          const item: StatementItem = {
            id: s.id,
            speaker: s.speaker,
            role: s.role,
            dateLabel: s.dateLabel,
            text: s.text,
            sourceIds: [],
          };
          for (const src of resolveSources(s.sourceIds, data, 2)) {
            sources[src.id] ??= src;
            item.sourceIds.push(src.id);
          }
          if (s.note) item.note = s.note;
          (groups[s.bloc] ??= []).push(item);
        }
        byCrisis[c.id] = groups;
        layout[c.id] = p.layout === "auto" ? comparadorLayout(p.blocs.map((b) => groups[b]?.length ?? 0)) : p.layout;
      }
      return { crises: crises.map((c) => ({ id: c.id, label: c.label, year: c.year })), blocs: p.blocs, byCrisis, layout, sources };
    },
  } satisfies IslaDef<ComparadorParams, ComparadorData>,

  grafico: {
    client: false,
    allowed: ["serie", "tipo", "grupos", "titulo", "alto"],
    parse(props, _ctx): { serie: string; kind?: "bar" | "line" | "grouped"; groups: string[]; title?: string; height?: number } {
      assertKnownProps("grafico", props, this.allowed);
      const serie = props.serie;
      if (!serie) throw new IslaError("grafico", "falta el atributo serie");
      const kind = props.tipo as "bar" | "line" | "grouped" | undefined;
      if (kind && !["bar", "line", "grouped"].includes(kind)) throw new IslaError("grafico", `tipo desconocido «${kind}»`);
      return { serie, kind, groups: listProp(props, "grupos", "|"), title: props.titulo, height: numberProp(props, "alto") };
    },
    load(p, data, _ctx): ChartData {
      const s = data.SERIES.find((x) => x.id === p.serie);
      if (!s) throw new IslaError("grafico", `serie desconocida «${p.serie}»`);
      const allGroups = s.groups?.length ? s.groups : Array.from(new Set(s.points.map((pt) => pt.group).filter((g): g is string => Boolean(g))));
      const groups = p.groups.length ? p.groups : allGroups;
      for (const g of p.groups) if (!allGroups.includes(g)) throw new IslaError("grafico", `grupo desconocido «${g}» en ${s.id}`);
      const kind = p.kind ?? s.kind;
      // En barras simples el «grupo» es la fuente de cada cifra (una barra por
      // punto); el límite de series solo rige en líneas y barras agrupadas.
      if (kind !== "bar" && groups.length > 6) throw new IslaError("grafico", `la serie ${s.id} tiene ${groups.length} grupos; elige hasta 6 con grupos="A|B"`);
      const points = s.points
        .filter((pt) => !pt.group || groups.includes(pt.group))
        .filter((pt) => !/no verificad/i.test(pt.note ?? ""))
        .map((pt) => {
          const o: ChartData["points"][number] = { x: pt.x, y: pt.y };
          if (pt.group) o.group = pt.group;
          if (pt.note) o.note = pt.note;
          return o;
        });
      const out: ChartData = {
        id: s.id,
        title: p.title || s.title,
        unit: s.unit,
        kind,
        groups,
        points,
        sources: resolveSources(s.sourceIds, data, 4),
      };
      if (s.note) out.note = s.note;
      if (p.height) out.height = p.height;
      return out;
    },
  } satisfies IslaDef<{ serie: string; kind?: "bar" | "line" | "grouped"; groups: string[]; title?: string; height?: number }, ChartData>,

  mapa: {
    client: true,
    allowed: ["puntos", "recuadros", "eras", "zoom", "centro", "titulo", "alto"],
    parse(props, _ctx) {
      assertKnownProps("mapa", props, this.allowed);
      const centro = props.centro?.split(",").map((v) => Number(v.trim()));
      return {
        points: listProp(props, "puntos"),
        boxes: listProp(props, "recuadros"),
        eras: listProp(props, "eras"),
        zoom: numberProp(props, "zoom"),
        center: centro && centro.length === 2 && centro.every(Number.isFinite) ? ([centro[0], centro[1]] as [number, number]) : undefined,
        title: props.titulo,
        height: numberProp(props, "alto") ?? 360,
      };
    },
    load(p, data, _ctx): MapData {
      const find = (id: string) => {
        const g = data.GEO.find((x) => x.id === id);
        if (!g) throw new IslaError("mapa", `punto desconocido «${id}»`);
        return g;
      };
      const pointRows = p.points.length ? p.points.map(find) : data.GEO.filter((g) => !g.bbox && (!p.eras.length || (g.era && p.eras.includes(g.era))));
      const boxRows = p.boxes.map(find);
      const points: MapData["points"] = pointRows
        .filter((g) => typeof g.lat === "number" && typeof g.lon === "number")
        .map((g) => {
          const o: MapData["points"][number] = { id: g.id, label: g.label, lat: g.lat as number, lon: g.lon as number };
          if (g.note) o.note = g.note;
          if (g.era) o.era = g.era;
          return o;
        });
      const boxes: MapData["boxes"] = boxRows
        .filter((g) => Array.isArray(g.bbox))
        .map((g) => {
          const o: MapData["boxes"][number] = { id: g.id, label: g.label, bbox: g.bbox as [[number, number], [number, number]] };
          if (g.note) o.note = g.note;
          if (g.era) o.era = g.era;
          return o;
        });
      const lats = [...points.map((x) => x.lat), ...boxes.flatMap((b) => [b.bbox[0][0], b.bbox[1][0]])];
      const lons = [...points.map((x) => x.lon), ...boxes.flatMap((b) => [b.bbox[0][1], b.bbox[1][1]])];
      const center: [number, number] = p.center ?? [
        lats.length ? (Math.min(...lats) + Math.max(...lats)) / 2 : 35.9,
        lons.length ? (Math.min(...lons) + Math.max(...lons)) / 2 : -5.3,
      ];
      const spread = lats.length ? Math.max(Math.max(...lats) - Math.min(...lats), Math.max(...lons) - Math.min(...lons)) : 0;
      const zoom = p.zoom ?? (spread > 8 ? 5 : spread > 3 ? 6 : spread > 1 ? 8 : spread > 0.2 ? 10 : 12);
      const out: MapData = { points, boxes, center, zoom, height: p.height };
      if (p.title) out.title = p.title;
      return out;
    },
  } satisfies IslaDef<{ points: string[]; boxes: string[]; eras: string[]; zoom?: number; center?: [number, number]; title?: string; height: number }, MapData>,

  video: {
    client: true,
    allowed: ["id", "titulo"],
    parse(props, _ctx): { id: string; title?: string } {
      assertKnownProps("video", props, this.allowed);
      if (!props.id) throw new IslaError("video", "falta el atributo id");
      return { id: props.id, title: props.titulo };
    },
    load(p, data, _ctx): VideoData {
      const v = data.VIDEOS.find((x) => x.id === p.id);
      if (!v) throw new IslaError("video", `vídeo desconocido «${p.id}»`);
      const out: VideoData = {
        id: v.id,
        provider: v.provider,
        embedUrl: normalizeEmbed(v.embedUrl || ""),
        pageUrl: v.pageUrl,
        title: p.title || v.title,
        sources: resolveSources(v.sourceIds, data, 2),
      };
      if (v.date) out.date = v.date;
      return out;
    },
  } satisfies IslaDef<{ id: string; title?: string }, VideoData>,

  figura: {
    client: false,
    allowed: ["id", "ancho", "pie"],
    parse(props, _ctx): { id: string; wide: boolean; caption?: string } {
      assertKnownProps("figura", props, this.allowed);
      if (!props.id) throw new IslaError("figura", "falta el atributo id");
      const ancho = props.ancho ?? "texto";
      if (!["texto", "completo"].includes(ancho)) throw new IslaError("figura", `ancho desconocido «${ancho}»`);
      return { id: props.id, wide: ancho === "completo", caption: props.pie };
    },
    load(p, data, _ctx): FigureData {
      const img = data.IMAGES.find((x) => x.id === p.id);
      if (!img) throw new IslaError("figura", `imagen desconocida «${p.id}»`);
      const out: FigureData = {
        id: p.id,
        src: commonsThumb(img.src, p.wide ? 1920 : 1280),
        original: img.src,
        width: img.width,
        height: img.height,
        alt: img.alt,
        credit: img.credit,
        license: img.license,
        wide: p.wide,
      };
      if (img.creditUrl) out.creditUrl = img.creditUrl;
      if (p.caption) out.caption = p.caption;
      return out;
    },
  } satisfies IslaDef<{ id: string; wide: boolean; caption?: string }, FigureData>,

  fuentes: {
    client: false,
    allowed: ["ids", "titulo", "agrupar"],
    parse(props, _ctx): { ids: string[]; title?: string; grouped: boolean } {
      assertKnownProps("fuentes", props, this.allowed);
      return { ids: listProp(props, "ids"), title: props.titulo, grouped: boolProp(props, "agrupar") };
    },
    load(p, data, ctx): SourcesData {
      const ids = Array.from(new Set([...ctx.cited, ...p.ids]));
      const sources = ids.map((id, i) => {
        const s = data.SOURCES.find((x) => x.id === id);
        if (!s) throw new IslaError("fuentes", `fuente desconocida «${id}»`);
        return { ...slimSource(s), n: i + 1 };
      });
      const out: SourcesData = { grouped: p.grouped, sources };
      if (p.title) out.title = p.title;
      return out;
    },
  } satisfies IslaDef<{ ids: string[]; title?: string; grouped: boolean }, SourcesData>,
};

export type IslaDataOf<K extends IslaName> = ReturnType<(typeof ISLAS)[K]["load"]>;

/** Ejecuta parse + load de un marcador y devuelve los datos para el componente. */
export function loadIsla(name: string, props: IslaProps, data: EspecialData, ctx: IslaContext): { name: IslaName; data: unknown } {
  if (!(ISLA_NAMES as readonly string[]).includes(name)) throw new IslaError(name, "isla desconocida");
  const def = ISLAS[name as IslaName] as IslaDef<unknown, unknown>;
  const params = def.parse(props, ctx);
  return { name: name as IslaName, data: def.load(params, data, ctx) };
}
