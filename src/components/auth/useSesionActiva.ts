"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { readSessionHint } from "@/lib/session-hint";

/**
 * ¿Hay sesión iniciada? Lee la cookie-pista que mantiene el middleware
 * (ver `src/lib/session-hint.ts`). Se evalúa en el navegador tras montar y
 * en cada cambio de ruta, así el HTML del servidor es igual para todos (y
 * cacheable) y la cabecera se ajusta al instante sin ninguna petición.
 */
export function useSesionActiva(): boolean {
  const pathname = usePathname();
  const [activa, setActiva] = useState(false);

  useEffect(() => {
    setActiva(readSessionHint(document.cookie));
  }, [pathname]);

  return activa;
}
