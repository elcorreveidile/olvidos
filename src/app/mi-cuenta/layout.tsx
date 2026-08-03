import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LogOut, Newspaper } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { MemberSidebarNav } from "@/components/members/MemberSidebarNav";

export default async function MemberLayout({
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

  // Check if user is a member
  const isMember = userRole === "MEMBER" ||
                   userRole === "ADMIN" ||
                   userRole === "MEMBER_ADMIN" ||
                   userRole === "EDITOR";

  if (!isMember) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-4">
        <div className="w-full max-w-md text-center">
          <div className="mb-6 text-[1.6rem]">
            <Logo />
          </div>
          <h1 className="mb-4 text-2xl font-black text-tinta">
            <span className="text-coral">[</span>Área de socios
          </h1>
          <p className="mb-6 font-editorial text-tinta/70">
            Esta área es exclusiva para socios de Olvidos de Granada. Si aún no lo
            eres, puedes hacerte socio ahora.
          </p>
          <div className="space-y-3">
            <a
              href="/hazte-socio"
              className="block w-full rounded-sm bg-coral px-6 py-3 font-bold text-white transition-colors hover:bg-coral-dark"
            >
              Hazte socio
            </a>
            <a
              href="/"
              className="block w-full rounded-sm border border-tinta px-6 py-3 font-bold text-tinta transition-colors hover:bg-tinta hover:text-white"
            >
              Volver al inicio
            </a>
          </div>
          <p className="mt-6 text-sm text-acero">
            ¿Ya eres socio y no puedes entrar? Escríbenos a{" "}
            <a
              href="mailto:olvidosdegranada@gmail.com"
              className="text-coral hover:text-coral/80"
            >
              olvidosdegranada@gmail.com
            </a>
          </p>
        </div>
      </div>
    );
  }

  const isAdmin = userRole === "ADMIN" || userRole === "MEMBER_ADMIN";

  async function handleSignOut() {
    "use server";
    await signOut({ redirectTo: "/" });
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 border-r border-acero-light/50 bg-white md:block">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between border-b border-acero-light/50 px-6">
            <Link
              href="/mi-cuenta"
              className="text-[1.4rem]"
              aria-label="Olvidos — mi cuenta"
            >
              <Logo />
            </Link>
            <span className="rounded-sm bg-coral/10 px-2 py-1 text-xs font-bold uppercase tracking-wide text-coral">
              Socio
            </span>
          </div>

          <MemberSidebarNav isAdmin={isAdmin} />

          {/* User info */}
          <div className="border-t border-acero-light/50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-coral font-bold text-white">
                {(userName?.charAt(0) || userEmail?.charAt(0) || "S").toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-tinta">
                  {userName || "Socio"}
                </p>
                <p className="truncate text-xs text-acero">{userEmail}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="md:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-40 border-b border-acero-light/50 bg-white">
          <div className="flex h-16 items-center justify-between px-6 md:px-8">
            <h1 className="text-lg font-black text-tinta">
              <span className="text-coral">[</span>Área de socios
            </h1>
            <div className="flex items-center gap-5">
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
            <MemberSidebarNav isAdmin={isAdmin} horizontal />
          </div>
        </header>

        {/* Page content */}
        <main className="p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
