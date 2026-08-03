"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  Users,
  Files,
  CreditCard,
  BookMarked,
  Settings,
} from "lucide-react";

const NAV = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Artículos", href: "/admin/articulos", icon: FileText },
  { name: "Revista", href: "/admin/revista", icon: BookOpen },
  { name: "Socios", href: "/admin/socios", icon: Users },
  { name: "Documentos", href: "/admin/documentos", icon: Files },
  { name: "Pagos", href: "/admin/pagos", icon: CreditCard },
  { name: "Contabilidad", href: "/admin/contabilidad", icon: BookMarked },
  { name: "Configuración", href: "/admin/configuracion", icon: Settings },
] as const;

export function AdminSidebarNav({
  horizontal = false,
}: {
  horizontal?: boolean;
}) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/admin" ? pathname === href : pathname.startsWith(href);

  if (horizontal) {
    return (
      <nav className="flex gap-1 overflow-x-auto px-4 py-2">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex shrink-0 items-center gap-2 rounded-sm px-3 py-2 text-sm font-bold transition-colors ${
                active
                  ? "bg-coral text-white"
                  : "text-tinta/70 hover:bg-coral/10 hover:text-coral"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-6">
      {NAV.map((item) => {
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
    </nav>
  );
}
