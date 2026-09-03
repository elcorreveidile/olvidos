import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LogOut, Newspaper } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { MemberSidebarNav } from "@/components/members/MemberSidebarNav";
import { PanelShell } from "@/components/layout/PanelShell";

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
    <PanelShell
      home="/mi-cuenta"
      badge="Socio"
      title="Área de socios"
      logoLabel="Olvidos — mi cuenta"
      mainClassName="p-6 md:p-8"
      nav={<MemberSidebarNav isAdmin={isAdmin} />}
      user={
        <div className="border-t border-acero-light/50 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-coral font-bold text-white">
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
      }
      actions={
        <>
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
