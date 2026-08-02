"use server";

import { signOut } from "@/lib/auth";

/** Cierra la sesión y vuelve al inicio. Se usa desde el header. */
export async function logout() {
  await signOut({ redirectTo: "/" });
}
