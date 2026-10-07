import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";

/**
 * Caché de datos de las páginas públicas (Data Cache de Next/Vercel).
 *
 * Las consultas de lectura de `src/lib/queries.ts` (y la del artículo
 * publicado por slug) se guardan 5 minutos con una etiqueta por tipo de
 * contenido. Las acciones del panel que crean, editan o borran contenido
 * llaman a `revalidatePublic(...)` con la etiqueta correspondiente, así que
 * lo publicado se ve al momento; el plazo de 5 minutos solo cubre lo que se
 * escribe fuera del panel (scripts).
 */
export const CACHE_TAGS = {
  articulos: "articulos",
  revista: "revista",
  actividades: "actividades",
  categorias: "categorias",
  etiquetas: "etiquetas",
} as const;

export type CacheTag = keyof typeof CACHE_TAGS;

/** Segundos que vive una entrada antes de refrescarse en segundo plano. */
export const CACHE_REVALIDATE = 300;

const ISO_DATE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/;

/**
 * La caché serializa a JSON, así que las fechas de Prisma vuelven como texto
 * ISO. Esto las devuelve a `Date` recorriendo el resultado (listas y objetos
 * planos), para que las páginas reciban lo mismo con y sin caché.
 */
export function reviveDates<T>(value: T): T {
  if (typeof value === "string") {
    return (ISO_DATE.test(value) ? new Date(value) : value) as T;
  }
  if (Array.isArray(value)) {
    return value.map(reviveDates) as T;
  }
  if (value && typeof value === "object") {
    const proto = Object.getPrototypeOf(value);
    if (proto === Object.prototype || proto === null) {
      const out: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
        out[k] = reviveDates(v);
      }
      return out as T;
    }
  }
  return value;
}

type AsyncFn = (...args: any[]) => Promise<any>;

/**
 * Envuelve una consulta de lectura en `unstable_cache`. La clave incluye el
 * nombre y los argumentos; las etiquetas permiten invalidarla desde las
 * acciones del panel.
 */
export function cachedQuery<F extends AsyncFn>(
  name: string,
  fn: F,
  tags: CacheTag[]
): F {
  const cached = unstable_cache(fn, ["olvidos", name], {
    tags: tags.map((t) => CACHE_TAGS[t]),
    revalidate: CACHE_REVALIDATE,
  });
  return (async (...args: Parameters<F>) =>
    reviveDates(await cached(...args))) as F;
}

/**
 * Invalida las consultas con esas etiquetas y la portada (que las muestra y
 * se sirve como HTML cacheado). Para llamar desde las acciones de escritura.
 */
export function revalidatePublic(...tags: CacheTag[]): void {
  for (const tag of tags) revalidateTag(CACHE_TAGS[tag]);
  revalidatePath("/");
}
