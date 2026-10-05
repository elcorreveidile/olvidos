/**
 * «Con-textos 29N»: app aparte (repo `elcorreveidile/sondeo-29n`) con cuenta
 * atrás hasta las elecciones generales del 29-nov-2026, entregas diarias
 * verificadas y un sondeo ciudadano. Aquí solo se enlaza.
 *
 * Se sirve bajo `olvidos.es/contexto/sondeo` (rewrite de `next.config.mjs` al
 * despliegue de la app). Única fuente de la ruta: todo enlace sale de aquí.
 */
export const CONTEXTOS_29N_URL = "/contexto/sondeo";

/**
 * Origen del despliegue de la app (`https://<proyecto>.vercel.app`). Sin esta
 * variable no hay rewrite y la tarjeta no se muestra: así fusionar este cambio
 * no publica nada hasta que Javier dé el OK y se ponga la variable.
 */
export function contextos29nOrigin(): string | null {
  const v = process.env.CONTEXTOS_29N_ORIGIN?.trim();
  if (!v) return null;
  try {
    const u = new URL(v);
    return u.protocol === "https:" || u.hostname === "localhost" ? u.origin : null;
  } catch {
    return null;
  }
}

export const CONTEXTOS_29N_TITLE = "Con-textos 29N";

export const CONTEXTOS_29N_DESCRIPTION =
  "Cuenta atrás, entregas verificadas y sondeo ciudadano hacia las elecciones del 29 de noviembre";
