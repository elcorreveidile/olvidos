/**
 * Registro de especiales «Con-textos»: enlaza el slug del artículo en la web
 * con sus datos tipados (src/data/con-textos/<especial>/). Solo se importa en
 * servidor: los datos completos nunca viajan al cliente.
 */
import type {
  Crisis,
  GovernmentPeriod,
  ImageRef,
  Quote,
  Series,
  Source,
  Statement,
  TimelineEvent,
  VideoEmbed,
} from "./types";
import type { GeoPoint } from "@/data/con-textos/espana-marruecos/geo";
import type { PasoDef } from "./pasos-def";

export interface EspecialData {
  id: string;
  SOURCES: Source[];
  TIMELINE: TimelineEvent[];
  QUOTES: Quote[];
  STATEMENTS: Statement[];
  SERIES: Series[];
  VIDEOS: VideoEmbed[];
  IMAGES: ImageRef[];
  GEO: GeoPoint[];
  GOBIERNOS: GovernmentPeriod[];
  CRISES: Crisis[];
  PASOS: PasoDef[];
}

export interface EspecialEntry {
  /** Identificador interno (carpeta de datos). */
  id: string;
  /** Slug del artículo en /articulos/<slug>. */
  slug: string;
  data: () => EspecialData;
}

import { SOURCES } from "@/data/con-textos/espana-marruecos/sources";
import { TIMELINE } from "@/data/con-textos/espana-marruecos/timeline";
import { QUOTES } from "@/data/con-textos/espana-marruecos/quotes";
import { STATEMENTS } from "@/data/con-textos/espana-marruecos/statements";
import { SERIES } from "@/data/con-textos/espana-marruecos/series";
import { VIDEOS } from "@/data/con-textos/espana-marruecos/videos";
import { IMAGES } from "@/data/con-textos/espana-marruecos/images";
import { GEO } from "@/data/con-textos/espana-marruecos/geo";
import { GOBIERNOS } from "@/data/con-textos/espana-marruecos/gobiernos";
import { CRISES } from "@/data/con-textos/espana-marruecos/crises";
import { PASOS } from "./espana-marruecos/pasos";

function espanaMarruecos(): EspecialData {
  return {
    id: "espana-marruecos",
    SOURCES, TIMELINE, QUOTES, STATEMENTS, SERIES, VIDEOS, IMAGES, GEO, GOBIERNOS, CRISES, PASOS,
  };
}

export const ESPECIALES: Record<string, EspecialEntry> = {
  "espana-marruecos": {
    id: "espana-marruecos",
    slug: "ceuta-no-empezo-en-julio",
    data: espanaMarruecos,
  },
};

/** Id del especial al que pertenece un artículo, si es uno de ellos. */
export function getEspecialBySlug(articleSlug: string): string | undefined {
  return Object.values(ESPECIALES).find((e) => e.slug === articleSlug)?.id;
}
