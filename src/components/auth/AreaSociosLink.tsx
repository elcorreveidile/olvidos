"use client";

import Link from "next/link";
import { useSesionActiva } from "./useSesionActiva";

/** Enlace «Área de socios»: a la cuenta si hay sesión, al login si no. */
export function AreaSociosLink({ className }: { className?: string }) {
  const activa = useSesionActiva();
  return (
    <Link href={activa ? "/mi-cuenta" : "/login"} className={className}>
      Área de socios
    </Link>
  );
}
