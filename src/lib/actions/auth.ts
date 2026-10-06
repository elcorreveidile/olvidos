"use server";

import { signOut } from "@/lib/auth";

/**
 * Cierra la sesión. No redirige desde el servidor: el cliente recarga la
 * portada entera (`window.location`) para que el middleware borre la
 * cookie-pista y la cabecera vuelva a «Hazte socio» sin estado viejo.
 */
export async function logout() {
  await signOut({ redirect: false });
}
