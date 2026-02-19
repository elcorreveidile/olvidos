import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  Settings,
  Users,
  LogOut,
  Menu,
  CreditCard,
} from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Check if user has admin or editor role
  const userRole = session.user.role;
  if (userRole !== "ADMIN" && userRole !== "EDITOR") {
    redirect("/");
  }

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Artículos", href: "/admin/articulos", icon: FileText },
    { name: "Socios", href: "/admin/socios", icon: Users },
    { name: "Pagos", href: "/admin/pagos", icon: CreditCard },
    { name: "Configuración", href: "/admin/configuracion", icon: Settings },
  ];

  async function handleSignOut() {
    "use server";
    await signOut({ redirectTo: "/" });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <Link href="/admin" className="text-xl font-bold text-blue-900">
              Olvidos de Granada
            </Link>
            <span className="text-xs bg-coral-100 text-coral-700 px-2 py-1 rounded">
              Admin
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
                <div className="w-10 h-10 bg-blue-900 text-white rounded-full flex items-center justify-center">
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
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Rol: <span className="font-medium">{userRole}</span>
              </span>
              <form action={handleSignOut}>
                <button
                  type="submit"
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar sesión
                </button>
              </form>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main>{children}</main>
      </div>
    </div>
  );
}
