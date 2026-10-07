/**
 * Cookie-pista de sesión (NO es la sesión): la escribe el middleware cuando
 * detecta la cookie de sesión de Auth.js y la borra cuando desaparece. No es
 * HttpOnly para que la cabecera y el pie, renderizados como HTML cacheado e
 * igual para todo el mundo, puedan pintar «Mi cuenta» o «Hazte socio» en el
 * navegador sin consultar la sesión en el servidor (eso hacía dinámica toda
 * la web). Nunca da acceso a nada: las rutas protegidas siguen comprobando la
 * sesión real en el middleware y en sus layouts.
 */
export const SESSION_HINT_COOKIE = "olvidos_sesion";

/** Misma vida que la sesión JWT (30 días). */
export const SESSION_HINT_MAX_AGE = 30 * 24 * 60 * 60;

/** ¿La cadena `document.cookie` (o una cabecera Cookie) lleva la pista? */
export function readSessionHint(cookieString: string): boolean {
  return cookieString
    .split(";")
    .some((part) => part.trim() === `${SESSION_HINT_COOKIE}=1`);
}
