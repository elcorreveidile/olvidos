"use client";

import Link from "next/link";
import { logout } from "@/lib/actions/auth";

interface MemberAreaLinksProps {
  variant: "desktop" | "mobile";
  className?: string;
  onClose?: () => void;
  isAuthenticated: boolean;
}

export function MemberAreaLinks({
  variant,
  className,
  onClose,
  isAuthenticated,
}: MemberAreaLinksProps) {
  // Autenticado: acceso a la cuenta + cerrar sesión.
  if (isAuthenticated) {
    if (variant === "desktop") {
      // "Mi cuenta" con desplegable al pasar el cursor (mi cuenta + salir).
      return (
        <div className="relative group">
          <Link href="/mi-cuenta" className={className}>
            Mi cuenta
          </Link>
          <div className="absolute right-0 top-full hidden pt-2 group-hover:block">
            <div className="min-w-[190px] rounded-sm bg-white py-2 shadow-card-hover">
              <Link
                href="/mi-cuenta"
                className="block px-4 py-2 text-sm text-tinta transition-colors hover:bg-coral hover:text-white"
              >
                Mi cuenta
              </Link>
              <form action={logout}>
                <button
                  type="submit"
                  className="block w-full px-4 py-2 text-left text-sm text-tinta transition-colors hover:bg-coral hover:text-white"
                >
                  Cerrar sesión
                </button>
              </form>
            </div>
          </div>
        </div>
      );
    }

    // Móvil: ambos visibles.
    return (
      <>
        <Link href="/mi-cuenta" className={className} onClick={onClose}>
          Mi cuenta
        </Link>
        {/* Sin onClose: cerraría el menú y desmontaría el form antes de que se
            dispare la server action. Al cerrar sesión se redirige al inicio. */}
        <form action={logout}>
          <button
            type="submit"
            className={`${className ?? ""} w-full text-left`}
          >
            Cerrar sesión
          </button>
        </form>
      </>
    );
  }

  if (variant === "desktop") {
    // Etiqueta visible "Hazte socio"; al pasar el cursor se despliega el acceso.
    return (
      <div className="relative group">
        <Link href="/hazte-socio" className={className}>
          Hazte socio
        </Link>
        <div className="absolute left-0 top-full hidden pt-2 group-hover:block">
          <div className="min-w-[190px] rounded-sm bg-white py-2 shadow-card-hover">
            <Link
              href="/hazte-socio"
              className="block px-4 py-2 text-sm text-tinta transition-colors hover:bg-coral hover:text-white"
            >
              Hazte socio
            </Link>
            <Link
              href="/login"
              className="block px-4 py-2 text-sm text-tinta transition-colors hover:bg-coral hover:text-white"
            >
              Área de socios
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Móvil: los dos enlaces visibles.
  return (
    <>
      <Link href="/hazte-socio" className={className} onClick={onClose}>
        Hazte socio
      </Link>
      <Link href="/login" className={className} onClick={onClose}>
        Área de socios
      </Link>
    </>
  );
}
