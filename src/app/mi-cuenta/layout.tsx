import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  User,
  CreditCard,
  Settings,
  LogOut,
  Menu,
} from "lucide-react";

export default async function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Check if user is a member
  const isMember = session.user.role === "MEMBER" ||
                   session.user.role === "ADMIN" ||
                   session.user.role === "MEMBER_ADMIN" ||
                   session.user.role === "EDITOR";

  if (!isMember) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full px-4">
          <div className="bg-white rounded-sm shadow-card p-8 text-center">
            <h1 className="text-2xl font-bold text-azul mb-4">
              Área de Socios
            </h1>
            <p className="text-acero mb-6">
              Esta área es exclusiva para socios de Olvidos de Granada.
              Si ya eres socio, contacta con la administración. Si aún no lo eres,
              puedes hacerte socio ahora.
            </p>
            <div className="space-y-3">
              <a
                href="/hazte-socio"
                className="block w-full px-6 py-3 bg-coral text-white font-bold rounded-sm hover:bg-coral-dark transition-colors"
              >
                Hazte Socio
              </a>
              <a
                href="/"
                className="block w-full px-6 py-3 border border-azul text-azul font-bold rounded-sm hover:bg-azul hover:text-white transition-colors"
              >
                Volver al Inicio
              </a>
            </div>
            <p className="text-sm text-acero-light mt-6">
              ¿Ya eres socio? Envía un email a{" "}
              <a href="mailto:info@olvidosdegranada.es" className="text-coral hover:text-coral/80">
                info@olvidosdegranada.es
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  const navigation = [
    { name: "Dashboard", href: "/mi-cuenta", icon: User },
    { name: "Mi Perfil", href: "/mi-cuenta/perfil", icon: Settings },
    { name: "Pagos", href: "/mi-cuenta/pagos", icon: CreditCard },
    { name: "Carnet Digital", href: "/mi-cuenta/carnet", icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <Link href="/mi-cuenta" className="text-xl font-bold text-azul">
              Olvidos de Granada
            </Link>
            <span className="text-xs bg-coral-100 text-coral-700 px-2 py-1 rounded">
              Socio
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User info */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-azul text-white rounded-full flex items-center justify-center">
                  {session.user.name?.charAt(0) || session.user.email?.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {session.user.name || "Usuario"}
                  </p>
                  <p className="text-xs text-gray-500">{session.user.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-8">
            <div className="flex items-center gap-4">
              <button className="lg:hidden">
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                Área de Socios
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/api/auth/signout"
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
              >
                <LogOut className="w-4 h-4" />
                Cerrar sesión
              </Link>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
