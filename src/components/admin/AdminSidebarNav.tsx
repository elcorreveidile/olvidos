"use client";

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
import { SidebarNavLinks } from "@/components/layout/SidebarNavLinks";

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

export function AdminSidebarNav() {
  return <SidebarNavLinks items={NAV} root="/admin" />;
}
