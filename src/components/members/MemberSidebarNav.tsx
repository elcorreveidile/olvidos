"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Target,
  FileText,
  UserRound,
  CreditCard,
  QrCode,
  Users,
  Shield,
} from "lucide-react";

const NAV = [
  { name: "Resumen", href: "/mi-cuenta", icon: LayoutDashboard },
  { name: "Objetivos", href: "/mi-cuenta/objetivos", icon: Target },
  { name: "Documentos", href: "/mi-cuenta/documentos", icon: FileText },
  { name: "Junta Directiva", href: "/mi-cuenta/junta-directiva", icon: Users },
  { name: "Mi perfil", href: "/mi-cuenta/perfil", icon: UserRound },
  { name: "Pagos", href: "/mi-cuenta/pagos", icon: CreditCard },
  { name: "Carné digital", href: "/mi-cuenta/carnet", icon: QrCode },
] as const;

export function MemberSidebarNav({
  isAdmin,
  horizontal = false,
}: {
  isAdmin: boolean;
  horizontal?: boolean;
}) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/mi-cuenta" ? pathname === href : pathname.startsWith(href);

  const items = [
    ...NAV,
    ...(isAdmin
      ? [{ name: "Admin", href: "/admin", icon: Shield } as const]
      : []),
  ];

  if (horizontal) {
    return (
      <nav className="flex gap-1 overflow-x-auto px-4 py-2">
        {items.map((item) => {
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

      {isAdmin && (
        <Link
          href="/admin"
          className="mt-2 flex items-center gap-3 rounded-sm border border-coral/30 px-3 py-2 text-sm font-bold text-coral transition-colors hover:bg-coral/10"
        >
          <Shield className="h-5 w-5" />
          Panel de administración
        </Link>
      )}
    </nav>
  );
}
