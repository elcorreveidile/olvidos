import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LogOut, Newspaper } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { AdminSidebarNav } from "@/components/admin/AdminSidebarNav";

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
    <div className="min-h-screen bg-white">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 border-r border-acero-light/50 bg-white md:block print:hidden">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between border-b border-acero-light/50 px-6">
            <Link
              href="/admin"
              className="text-[1.4rem]"
              aria-label="Olvidos — administración"
            >
              <Logo />
            </Link>
            <span className="rounded-sm bg-coral/10 px-2 py-1 text-xs font-bold uppercase tracking-wide text-coral">
              Admin
            </span>
          </div>

          <AdminSidebarNav />

          {/* User info */}
          <div className="border-t border-acero-light/50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-coral font-bold text-white">
                {(userName?.charAt(0) || userEmail?.charAt(0) || "A").toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-tinta">
                  {userName || "Usuario"}
                </p>
                <p className="truncate text-xs text-acero">{userEmail}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="md:pl-64 print:pl-0">
        {/* Top bar */}
        <header className="sticky top-0 z-40 border-b border-acero-light/50 bg-white print:hidden">
          <div className="flex h-16 items-center justify-between px-6 md:px-8">
            <h1 className="text-lg font-black text-tinta">
              <span className="text-coral">[</span>Administración
            </h1>
            <div className="flex items-center gap-4">
              <span className="hidden text-sm text-acero sm:inline">
                Rol: <span className="font-bold text-tinta">{userRole}</span>
              </span>
              <Link
                href="/"
                className="flex items-center gap-2 text-sm font-bold text-acero transition-colors hover:text-coral"
              >
                <Newspaper className="h-4 w-4" />
                <span className="hidden sm:inline">Volver a la revista</span>
              </Link>
              <form action={handleSignOut}>
                <button
                  type="submit"
                  className="flex items-center gap-2 text-sm font-bold text-acero transition-colors hover:text-coral"
                >
                  <LogOut className="h-4 w-4" />
                  Cerrar sesión
                </button>
              </form>
            </div>
          </div>
          {/* Navegación horizontal en móvil (la sidebar se oculta) */}
          <div className="border-t border-acero-light/50 md:hidden">
            <AdminSidebarNav horizontal />
          </div>
        </header>

        {/* Page content */}
        <main>{children}</main>
      </div>
    </div>
  );
}
