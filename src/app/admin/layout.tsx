import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LogOut, Newspaper } from "lucide-react";
import { AdminSidebarNav } from "@/components/admin/AdminSidebarNav";
import { PanelShell } from "@/components/layout/PanelShell";
import { roleLabel } from "@/lib/roles";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Extract only the primitive values we need
  const userName = session.user.name;
  const userEmail = session.user.email;
  const userRole = session.user.role;

  // MEMBER_ADMIN («Admin de socios») debe poder entrar al panel: las páginas de
  // socios, pagos y contabilidad (y sus server actions) le conceden acceso
  // explícitamente. Sin él aquí, quedaba bloqueado en la puerta y el rol era
  // inservible. Cada página aplica además su propia comprobación de rol.
  if (
    userRole !== "ADMIN" &&
    userRole !== "EDITOR" &&
    userRole !== "MEMBER_ADMIN"
  ) {
    redirect("/");
  }

  async function handleSignOut() {
    "use server";
    await signOut({ redirectTo: "/" });
  }

  return (
    <PanelShell
      home="/admin"
      badge="Admin"
      title="Administración"
      logoLabel="Olvidos — administración"
      printHidden
      nav={<AdminSidebarNav />}
      user={
        <div className="border-t border-acero-light/50 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-coral font-bold text-white">
              {(userName?.charAt(0) || userEmail?.charAt(0) || "A").toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-tinta">
                {userName || "Usuario"}
              </p>
              <p className="truncate text-xs text-acero">{userEmail}</p>
              <p className="truncate text-xs text-acero">
                Rol: <span className="font-bold text-tinta">{roleLabel(userRole)}</span>
              </p>
            </div>
          </div>
        </div>
      }
      actions={
        <>
          <span className="hidden text-sm text-acero sm:inline">
            Rol: <span className="font-bold text-tinta">{roleLabel(userRole)}</span>
          </span>
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-bold text-acero transition-colors hover:text-coral"
            aria-label="Volver a la revista"
          >
            <Newspaper className="h-4 w-4" />
            <span className="hidden sm:inline">Volver a la revista</span>
          </Link>
          <form action={handleSignOut}>
            <button
              type="submit"
              className="flex items-center gap-2 text-sm font-bold text-acero transition-colors hover:text-coral"
              aria-label="Cerrar sesión"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Cerrar sesión</span>
            </button>
          </form>
        </>
      }
    >
      {children}
    </PanelShell>
  );
}
