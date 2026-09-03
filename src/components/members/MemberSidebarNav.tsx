"use client";

import Link from "next/link";
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
import { SidebarNavLinks } from "@/components/layout/SidebarNavLinks";

const NAV = [
  { name: "Resumen", href: "/mi-cuenta", icon: LayoutDashboard },
  { name: "Objetivos", href: "/mi-cuenta/objetivos", icon: Target },
  { name: "Documentos", href: "/mi-cuenta/documentos", icon: FileText },
  { name: "Junta Directiva", href: "/mi-cuenta/junta-directiva", icon: Users },
  { name: "Mi perfil", href: "/mi-cuenta/perfil", icon: UserRound },
  { name: "Pagos", href: "/mi-cuenta/pagos", icon: CreditCard },
  { name: "Carné digital", href: "/mi-cuenta/carnet", icon: QrCode },
] as const;

export function MemberSidebarNav({ isAdmin }: { isAdmin: boolean }) {
  return (
    <SidebarNavLinks
      items={NAV}
      root="/mi-cuenta"
      extra={
        isAdmin ? (
          <Link
            href="/admin"
            className="mt-2 flex items-center gap-3 rounded-sm border border-coral/30 px-3 py-2 text-sm font-bold text-coral transition-colors hover:bg-coral/10"
          >
            <Shield className="h-5 w-5" />
            Panel de administración
          </Link>
        ) : null
      }
    />
  );
}
