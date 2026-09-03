"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Logo } from "@/components/layout/Logo";

const NAV_ID = "panel-nav";

/**
 * Armazón común del panel de administración y del área de socios: barra
 * lateral fija en escritorio y, en móvil, la misma barra como panel deslizante
 * que se abre con el botón de menú de la cabecera y se cierra con la X,
 * tocando fuera, con Escape o al cambiar de página.
 *
 * Recibe los bloques ya renderizados por el layout (servidor): el nav, la
 * ficha del usuario y las acciones de la cabecera (rol, volver, cerrar sesión).
 */
export function PanelShell({
  home,
  badge,
  title,
  logoLabel,
  nav,
  user,
  actions,
  printHidden = false,
  mainClassName = "",
  children,
}: {
  home: string;
  badge: string;
  title: string;
  logoLabel: string;
  nav: ReactNode;
  user: ReactNode;
  actions: ReactNode;
  printHidden?: boolean;
  mainClassName?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const closeButton = useRef<HTMLButtonElement>(null);
  const openButton = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setOpen(false), []);

  // Al navegar, el panel se cierra solo (los enlaces no necesitan onClick).
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Mientras está abierto: foco en la X, Escape cierra y la página no se
  // desplaza por detrás. Al cerrar, el foco vuelve al botón de menú.
  useEffect(() => {
    if (!open) return;
    const opener = openButton.current;
    closeButton.current?.focus();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
      opener?.focus();
    };
  }, [open]);

  return (
    <div className="min-h-screen bg-white">
      {open && (
        <div
          className="fixed inset-0 z-40 bg-tinta/40 md:hidden"
          onClick={close}
          aria-hidden="true"
        />
      )}

      {/* Barra lateral: fija en escritorio, deslizante en móvil */}
      <aside
        id={NAV_ID}
        aria-label={title}
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-acero-light/50 bg-white transition-transform duration-200 motion-reduce:transition-none md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        } ${printHidden ? "print:hidden" : ""}`}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between border-b border-acero-light/50 px-6">
            <Link href={home} className="text-[1.4rem]" aria-label={logoLabel}>
              <Logo />
            </Link>
            <div className="flex items-center gap-2">
              <span className="rounded-sm bg-coral/10 px-2 py-1 text-xs font-bold uppercase tracking-wide text-coral">
                {badge}
              </span>
              <button
                ref={closeButton}
                type="button"
                onClick={close}
                className="-mr-2 p-2 text-acero transition-colors hover:text-coral md:hidden"
                aria-label="Cerrar menú"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {nav}

          {user}
        </div>
      </aside>

      <div className={`md:pl-64 ${printHidden ? "print:pl-0" : ""}`}>
        <header
          className={`sticky top-0 z-30 border-b border-acero-light/50 bg-white ${
            printHidden ? "print:hidden" : ""
          }`}
        >
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6 md:px-8">
            <button
              ref={openButton}
              type="button"
              onClick={() => setOpen(true)}
              className="-ml-2 p-2 text-tinta transition-colors hover:text-coral md:hidden"
              aria-label="Abrir menú"
              aria-expanded={open}
              aria-controls={NAV_ID}
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="min-w-0 flex-1 truncate text-lg font-black text-tinta">
              <span className="text-coral">[</span>
              {title}
            </h1>
            <div className="flex shrink-0 items-center gap-4">{actions}</div>
          </div>
        </header>

        <main className={mainClassName || undefined}>{children}</main>
      </div>
    </div>
  );
}
