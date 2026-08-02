"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Menu, X } from "lucide-react";
import { MemberAreaLinks } from "./MemberAreaLinks";
import { Logo } from "./Logo";

const NAV_MAIN = [
  { label: "SOBRE OLVIDOS", href: "/sobre-nosotros" },
  {
    label: "MEMORIA",
    href: "/revista",
    children: [
      { label: "Archivo (revista impresa)", href: "/revista" },
      { label: "Memoria de Olvidos", href: "/articulos?categoria=memoria-de-olvidos" },
      { label: "Memoria de Granada", href: "/articulos?categoria=memoria-de-granada" },
    ],
  },
  { label: "ENCUENTROS", href: "/actividades" },
] as const;

const NAV_SECTIONS = [
  { label: "Editoriales", href: "/articulos?categoria=editorial" },
  { label: "Palabras", href: "/articulos?categoria=palabras" },
  { label: "Piezas y Procesos", href: "/articulos?categoria=piezas-procesos" },
  { label: "Apostillas", href: "/articulos?categoria=apostillas" },
  { label: "Soneto500", href: "/articulos?categoria=sonetos" },
] as const;

interface HeaderProps {
  isAuthenticated: boolean;
}

export function Header({ isAuthenticated }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white">
      {/* Barra principal */}
      <div className="border-b border-acero-light/50">
        <div className="max-w-content mx-auto px-4 h-header flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group text-[1.7rem]" aria-label="Olvidos — inicio">
            <Logo />
          </Link>

          {/* Navegación principal (desktop) */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_MAIN.map((item) => (
              <div key={item.href} className="relative group">
                <Link
                  href={item.href}
                  className="text-sm font-bold tracking-wide text-azul hover:text-coral transition-colors"
                >
                  {item.label}
                </Link>
                {"children" in item && item.children && (
                  <div className="absolute top-full left-0 pt-2 hidden group-hover:block">
                    <div className="bg-white shadow-card-hover rounded-sm py-2 min-w-[200px]">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-4 py-2 text-sm text-azul hover:bg-coral hover:text-white transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <MemberAreaLinks variant="desktop" className="text-sm font-bold tracking-wide text-azul hover:text-coral transition-colors" isAuthenticated={isAuthenticated} />
          </nav>

          {/* Acciones */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-azul hover:text-coral transition-colors"
              aria-label="Buscar"
            >
              <Search size={20} />
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-azul hover:text-coral transition-colors"
              aria-label="Menú"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Barra de secciones */}
      <div className="hidden md:block border-b border-acero-light/30">
        <div className="max-w-content mx-auto px-4">
          <nav className="flex items-center gap-8 h-12">
            {NAV_SECTIONS.map((section) => (
              <Link
                key={section.href}
                href={section.href}
                className="text-sm font-bold text-acero hover:text-coral transition-colors"
              >
                {section.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Barra de búsqueda */}
      {searchOpen && (
        <div className="border-b border-acero-light/30 bg-white">
          <div className="max-w-content mx-auto px-4 py-4">
            <form action="/articulos" method="get" className="flex gap-2">
              <input
                type="search"
                name="q"
                placeholder="Buscar artículos, autores, secciones..."
                className="flex-1 px-4 py-2 border border-acero-light rounded-sm text-sm focus:outline-none focus:border-coral"
                autoFocus
              />
              <button
                type="submit"
                className="px-6 py-2 bg-coral text-white text-sm font-bold rounded-sm hover:bg-coral-dark transition-colors"
              >
                Buscar
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Menú móvil */}
      {mobileOpen && (
        <div className="md:hidden border-b border-acero-light/30 bg-white">
          <nav className="max-w-content mx-auto px-4 py-4 space-y-1">
            {NAV_MAIN.map((item) => (
              <div key={item.href}>
                <Link
                  href={item.href}
                  className="block py-2 text-sm font-bold text-azul hover:text-coral transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
                {"children" in item &&
                  item.children?.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block py-2 pl-4 text-sm text-acero hover:text-coral transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      {child.label}
                    </Link>
                  ))}
              </div>
            ))}
            <div className="border-t border-acero-light/30 pt-2 mt-2">
              {NAV_SECTIONS.map((section) => (
                <Link
                  key={section.href}
                  href={section.href}
                  className="block py-2 text-sm font-bold text-acero hover:text-coral transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {section.label}
                </Link>
              ))}
              <MemberAreaLinks
                variant="mobile"
                className="block py-2 text-sm font-bold text-acero hover:text-coral transition-colors"
                onClose={() => setMobileOpen(false)}
                isAuthenticated={isAuthenticated}
              />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
