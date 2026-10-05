/**
 * «Con-textos 29N»: app aparte (repo `elcorreveidile/sondeo-29n`) con cuenta
 * atrás hasta las elecciones generales del 29-nov-2026, entregas diarias
 * verificadas y un sondeo ciudadano. Aquí solo se enlaza.
 *
 * Única fuente de la URL: todo enlace a la app sale de esta constante.
 * Se puede sobreescribir con `NEXT_PUBLIC_CONTEXTOS_29N_URL`.
 */
export const CONTEXTOS_29N_URL =
  process.env.NEXT_PUBLIC_CONTEXTOS_29N_URL || "https://29n.olvidos.es";

export const CONTEXTOS_29N_TITLE = "Con-textos 29N";

export const CONTEXTOS_29N_DESCRIPTION =
  "Cuenta atrás, entregas verificadas y sondeo ciudadano hacia las elecciones del 29 de noviembre";
