/**
 * Contrato de datos de los especiales «Con-textos».
 *
 * Todos los datos de un especial viven en `src/data/con-textos/<slug>/` como
 * ficheros TypeScript tipados con estos tipos (`satisfies`), de modo que
 * `npx tsc --noEmit` valida literales, ids y referencias cruzadas básicas.
 */

/** Orientación del gobierno en el poder cuando ocurre el hecho. */
export type Government = "derecha" | "liberal" | "izquierda" | "dictadura";

/** Tipo de episodio (un hecho puede tener varios). */
export type EventKind =
  | "guerra"
  | "territorial"
  | "migratoria"
  | "diplomatica"
  | "monarquia"
  | "parlamentaria"
  | "judicial"
  | "militar"
  | "geopolitica"
  | "europea"
  | "informativa"
  | "politica"
  | "seguridad";

/** Cámara de origen de una cita parlamentaria. */
export type Chamber = "congreso" | "senado" | "cortes-franquistas" | "otro";

/** Bloque político al que se atribuye una declaración. */
export type Bloc = "derecha" | "izquierda" | "gobierno" | "nacionalistas" | "monarquia" | "marruecos" | "otro";

/** Etapa histórica (eje de filtros de la línea temporal y la hemeroteca). */
export type EraId =
  | "isabelina"
  | "sexenio"
  | "restauracion"
  | "dictadura-primo"
  | "republica"
  | "franquismo"
  | "transicion"
  | "democracia";

export interface Era {
  id: EraId;
  label: string;
  /** Año de inicio (inclusive). */
  from: number;
  /** Año de fin (inclusive). */
  to: number;
}

export type SourceKind = "oficial" | "parlamentaria" | "prensa" | "academica" | "dato" | "archivo" | "multimedia";

export interface Source {
  id: string;
  title: string;
  author?: string;
  /** Organismo o medio. */
  publisher: string;
  /** Fecha de publicación (ISO o año). */
  date?: string;
  url: string;
  kind: SourceKind;
  /** Fecha de consulta (ISO). */
  accessed?: string;
  /** Advertencias: muro de pago, OCR dudoso, cifra discutida… */
  note?: string;
}

export interface ImageRef {
  /** Identificador estable (obligatorio en el registro de imágenes). */
  id?: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Autor o colección. */
  credit: string;
  /** Licencia (p. ej. "Dominio público", "CC BY-SA 4.0"). */
  license: string;
  /** Página de la imagen en Wikimedia Commons u origen. */
  creditUrl?: string;
}

export interface TimelineEvent {
  id: string;
  /** Fecha ISO (YYYY, YYYY-MM o YYYY-MM-DD). */
  date: string;
  /** Fecha ya formateada para mostrar, p. ej. "22 de octubre de 1859". */
  dateLabel: string;
  title: string;
  summary: string;
  government: Government;
  /** Etiqueta literal, p. ej. "Gobierno de O'Donnell (Unión Liberal)". */
  governmentLabel: string;
  /** Jefe del Estado en ese momento. */
  headOfState?: string;
  /** Quién inicia el episodio: España, Marruecos, ambos, otros. */
  initiator?: "espana" | "marruecos" | "ambos" | "otros" | "indeterminado";
  kinds: EventKind[];
  era: EraId;
  image?: ImageRef;
  sourceIds: string[];
  mapLayerId?: string;
  /** Paso del artículo al que se enlaza. */
  pasoId?: string;
}

export interface Quote {
  id: string;
  /** Fecha ISO de la sesión. */
  date: string;
  dateLabel: string;
  chamber: Chamber;
  /** Legislatura o denominación de las Cortes. */
  legislature?: string;
  speaker: string;
  /** Partido, grupo o adscripción. */
  party: string;
  bloc: Bloc;
  role?: string;
  topics: string[];
  era: EraId;
  /** Texto literal. */
  text: string;
  /** Contexto en una línea. */
  context?: string;
  /** Referencia, p. ej. "DSC núm. 45, 21-11-1922, p. 1203". */
  sessionRef: string;
  /** URL del PDF oficial (con ancla #page=N si se conoce). */
  pdfUrl: string;
  videoUrl?: string;
  sourceIds?: string[];
  /** true si no se ha podido cotejar con el Diario de Sesiones. */
  unverified?: boolean;
  note?: string;
}

export interface Crisis {
  id: string;
  label: string;
  year: number;
}

export interface Statement {
  id: string;
  crisisId: string;
  bloc: Bloc;
  speaker: string;
  role: string;
  date: string;
  dateLabel: string;
  text: string;
  sourceIds: string[];
  /** Matiz: traducción, cifra discutida, contexto. */
  note?: string;
}

export interface SeriesPoint {
  x: string | number;
  y: number;
  group?: string;
  /** Nota puntual (p. ej. "cifra provisional"). */
  note?: string;
}

export interface Series {
  id: string;
  title: string;
  unit: string;
  kind: "bar" | "line" | "grouped";
  groups?: string[];
  points: SeriesPoint[];
  sourceIds: string[];
  note?: string;
}

export interface VideoEmbed {
  id: string;
  provider: "youtube" | "rtve" | "congreso" | "otro";
  /** URL de incrustación (youtube-nocookie.com/embed/…, rtve.es/play/…). */
  embedUrl: string;
  /** URL pública de respaldo. */
  pageUrl: string;
  title: string;
  /** Miniatura local en /public. */
  thumbnail?: string;
  date?: string;
  sourceIds?: string[];
}

export interface GovernmentPeriod {
  id: string;
  from: string;
  to: string;
  headOfGovernment: string;
  party: string;
  government: Government;
  headOfState: string;
  era: EraId;
}

/** GeoJSON mínimo para no depender de @types/geojson en la Fase 1. */
export interface GeoFeatureCollection {
  type: "FeatureCollection";
  features: Array<{
    type: "Feature";
    properties: Record<string, unknown>;
    geometry:
      | { type: "Point"; coordinates: [number, number] }
      | { type: "Polygon"; coordinates: number[][][] }
      | { type: "LineString"; coordinates: number[][] };
  }>;
}

export interface MapLayer {
  id: string;
  label: string;
  eras: EraId[];
  description: string;
  color: string;
  geojson: GeoFeatureCollection;
  sourceIds: string[];
}
