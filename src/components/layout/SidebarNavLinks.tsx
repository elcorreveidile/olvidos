"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export type SidebarNavItem = {
  name: string;
  href: string;
  icon: LucideIcon;
};

/**
 * Lista vertical de enlaces de la barra lateral de los paneles (administración
 * y área de socios). El enlace activo se marca por ruta: la raíz (`root`) solo
 * cuando coincide exactamente; el resto, por prefijo.
 */
export function SidebarNavLinks({
  items,
  root,
  extra,
}: {
  items: readonly SidebarNavItem[];
  root: string;
  extra?: ReactNode;
}) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === root ? pathname === href : pathname.startsWith(href);

  return (
    <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-6">
      {items.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-3 rounded-sm px-3 py-2 text-sm font-bold tracking-wide transition-colors ${
              active
                ? "bg-coral text-white"
                : "text-tinta/70 hover:bg-coral/10 hover:text-coral"
            }`}
          >
            <Icon className="h-5 w-5" />
            {item.name}
          </Link>
        );
      })}
      {extra}
    </nav>
  );
}
