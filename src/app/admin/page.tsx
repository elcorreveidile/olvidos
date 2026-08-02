import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import {
  FileText,
  Users,
  TrendingUp,
  Calendar,
  ArrowRight,
} from "lucide-react";

export const dynamic = "force-dynamic";

const STATUS_LABELS: Record<string, string> = {
  DRAFT: "Borrador",
  REVIEW: "En revisión",
  PUBLISHED: "Publicado",
  ARCHIVED: "Archivado",
};

export default async function AdminDashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Estadísticas reales desde la base de datos.
  const [totalArticles, published, drafts, users, recentArticles] =
    await Promise.all([
      db.article.count(),
      db.article.count({ where: { status: "PUBLISHED" } }),
      db.article.count({ where: { status: "DRAFT" } }),
      db.user.count(),
      db.article.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, title: true, status: true, createdAt: true },
      }),
    ]);

  const stats = [
    {
      name: "Total artículos",
      value: totalArticles.toLocaleString("es-ES"),
      icon: FileText,
      href: "/admin/articulos",
      color: "bg-coral-100 text-coral-700",
    },
    {
      name: "Publicados",
      value: published.toLocaleString("es-ES"),
      icon: TrendingUp,
      href: "/admin/articulos?status=PUBLISHED",
      color: "bg-green-100 text-green-700",
    },
    {
      name: "Borradores",
      value: drafts.toLocaleString("es-ES"),
      icon: FileText,
      href: "/admin/articulos?status=DRAFT",
      color: "bg-gray-100 text-gray-700",
    },
    {
      name: "Usuarios",
      value: users.toLocaleString("es-ES"),
      icon: Users,
      href: "/admin/usuarios",
      color: "bg-blue-100 text-blue-700",
    },
  ];

  const dateFmt = new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const recentActivity = recentArticles.map((article) => ({
    id: article.id,
    title: article.title,
    description: STATUS_LABELS[article.status] ?? article.status,
    time: dateFmt.format(article.createdAt),
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-tinta">
          Panel de Administración
        </h1>
        <p className="text-gray-600 mt-2">
          Bienvenido, {session.user.name || "Usuario"}
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.name}
              href={stat.href}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.name}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-tinta mb-4">
            Actividad reciente
          </h2>
          {recentActivity.length > 0 ? (
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0"
                >
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Calendar className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {activity.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      {activity.description}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">
              No hay actividad reciente
            </p>
          )}
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-tinta mb-4">
            Acciones rápidas
          </h2>
          <div className="space-y-3">
            <Link
              href="/admin/articulos/nuevo"
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-coral-100 text-coral-700 rounded-lg">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    Crear nuevo artículo
                  </p>
                  <p className="text-sm text-gray-500">
                    Añadir contenido al sitio
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
