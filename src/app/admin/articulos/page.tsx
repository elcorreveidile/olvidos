import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getArticles } from "@/lib/actions/articles";
import { getAllCategories } from "@/lib/actions/categories";
import {
  FileText,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Calendar,
  User,
  FolderOpen,
  Layers,
} from "lucide-react";

async function ArticlesList({
  searchParams,
}: {
  searchParams: {
    status?: string;
    search?: string;
    categoria?: string;
    page?: string;
  };
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Check permissions
  const [result, categoriesResult] = await Promise.all([
    getArticles({
      status: searchParams.status,
      search: searchParams.search,
      category: searchParams.categoria,
      page: searchParams.page ? parseInt(searchParams.page) : 1,
      limit: 10,
    }),
    getAllCategories(),
  ]);

  const categories =
    "categories" in categoriesResult && categoriesResult.categories
      ? categoriesResult.categories
      : [];
  const activeCategory = searchParams.categoria;

  // Construye una query string conservando los filtros activos y cambiando
  // solo los que se pasen (útil para tarjetas, filtros de estado y paginación).
  const buildQuery = (overrides: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    const merged: Record<string, string | undefined> = {
      status: searchParams.status,
      search: searchParams.search,
      categoria: searchParams.categoria,
      ...overrides,
    };
    for (const [key, value] of Object.entries(merged)) {
      if (value && value !== "all") params.set(key, value);
    }
    const qs = params.toString();
    return qs ? `/admin/articulos?${qs}` : "/admin/articulos";
  };

  if (!result.success || !result.articles) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {result.error || "Error al cargar los artículos"}
      </div>
    );
  }

  const { articles, pagination } = result;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return "bg-green-100 text-green-800";
      case "DRAFT":
        return "bg-gray-100 text-gray-800";
      case "REVIEW":
        return "bg-yellow-100 text-yellow-800";
      case "ARCHIVED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return "Publicado";
      case "DRAFT":
        return "Borrador";
      case "REVIEW":
        return "En revisión";
      case "ARCHIVED":
        return "Archivado";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-tinta">Artículos</h1>
          <p className="text-gray-600 mt-1">
            Gestiona el contenido editorial de la revista
          </p>
        </div>
        <Link
          href="/admin/articulos/nuevo"
          className="inline-flex items-center gap-2 bg-coral-600 text-white px-4 py-2 rounded-lg hover:bg-coral-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nuevo artículo
        </Link>
      </div>

      {/* Category cards: clasificar el contenido por categoría. Al pulsar una
          tarjeta se listan todos los artículos de esa categoría. */}
      {categories.length > 0 && (
        <div>
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-500">
            <Layers className="w-4 h-4" />
            Clasificar por categoría
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {/* Todas */}
            <Link
              href={buildQuery({ categoria: undefined, page: undefined })}
              className={`flex items-center justify-between gap-2 rounded-lg border p-4 transition-colors ${
                !activeCategory
                  ? "border-coral bg-coral text-white shadow-sm"
                  : "border-gray-200 bg-white hover:border-coral hover:bg-coral-50"
              }`}
            >
              <span className="flex items-center gap-2 font-medium">
                <FolderOpen className="w-4 h-4 shrink-0" />
                Todas
              </span>
            </Link>
            {categories.map((category: any) => {
              const isActive = activeCategory === category.slug;
              return (
                <Link
                  key={category.id}
                  href={buildQuery({
                    // Volver a pulsar la categoría activa la deselecciona.
                    categoria: isActive ? undefined : category.slug,
                    page: undefined,
                  })}
                  className={`flex items-center justify-between gap-2 rounded-lg border p-4 transition-colors ${
                    isActive
                      ? "border-coral bg-coral text-white shadow-sm"
                      : "border-gray-200 bg-white hover:border-coral hover:bg-coral-50"
                  }`}
                  title={category.description ?? category.name}
                >
                  <span className="min-w-0 truncate font-medium">
                    {category.name}
                  </span>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {category._count?.articles ?? 0}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <form method="get" className="flex flex-1 gap-2">
            {searchParams.status && searchParams.status !== "all" && (
              <input type="hidden" name="status" value={searchParams.status} />
            )}
            {activeCategory && (
              <input type="hidden" name="categoria" value={activeCategory} />
            )}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                name="search"
                placeholder="Buscar en título, texto, firma o autor…"
                defaultValue={searchParams.search}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="rounded-lg bg-coral px-5 py-2 font-bold text-white transition-colors hover:bg-coral-dark"
            >
              Buscar
            </button>
          </form>

          {/* Status filter */}
          <div className="flex gap-2">
            <Link
              href={buildQuery({ status: undefined, page: undefined })}
              className={`px-4 py-2 rounded-lg transition-colors ${
                !searchParams.status || searchParams.status === "all"
                  ? "bg-coral text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Todos
            </Link>
            <Link
              href={buildQuery({ status: "PUBLISHED", page: undefined })}
              className={`px-4 py-2 rounded-lg transition-colors ${
                searchParams.status === "PUBLISHED"
                  ? "bg-coral text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Publicados
            </Link>
            <Link
              href={buildQuery({ status: "DRAFT", page: undefined })}
              className={`px-4 py-2 rounded-lg transition-colors ${
                searchParams.status === "DRAFT"
                  ? "bg-coral text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Borradores
            </Link>
            <Link
              href={buildQuery({ status: "REVIEW", page: undefined })}
              className={`px-4 py-2 rounded-lg transition-colors ${
                searchParams.status === "REVIEW"
                  ? "bg-coral text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Revisión
            </Link>
          </div>
        </div>
      </div>

      {/* Articles table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Título
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Autor
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {articles.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      {article.coverImage && (
                        <Image
                          src={article.coverImage}
                          alt=""
                          width={48}
                          height={48}
                          className="w-12 h-12 object-cover rounded"
                        />
                      )}
                      <div>
                        <div className="font-medium text-gray-900">
                          {article.title}
                          {article.featured && (
                            <span className="ml-2 text-xs bg-coral-100 text-coral-700 px-2 py-0.5 rounded">
                              Destacado
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {article.excerpt?.substring(0, 80)}
                          {article.excerpt && article.excerpt.length > 80 ? "..." : ""}
                        </div>
                        {(article as any).categories &&
                          (article as any).categories.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {(article as any).categories.map((c: any) => {
                                const cat = c.category;
                                const isActive = activeCategory === cat.slug;
                                return (
                                  <Link
                                    key={cat.id}
                                    href={buildQuery({
                                      categoria: cat.slug,
                                      page: undefined,
                                    })}
                                    className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium transition-colors ${
                                      isActive
                                        ? "bg-coral text-white"
                                        : "bg-gray-100 text-gray-600 hover:bg-coral-100 hover:text-coral-700"
                                    }`}
                                  >
                                    {cat.name}
                                  </Link>
                                );
                              })}
                            </div>
                          )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        article.status
                      )}`}
                    >
                      {getStatusLabel(article.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(article.publishedAt ?? article.createdAt).toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {article.authors && article.authors.length > 0
                        ? article.authors
                            .map((a: any) => a.author.name)
                            .join(" · ")
                        : article.byline ||
                          article.author?.name ||
                          article.author?.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      {article.status === "PUBLISHED" && (
                        <Link
                          href={`/articulos/${article.slug}`}
                          target="_blank"
                          className="text-gray-600 hover:text-gray-900 transition-colors"
                          title="Ver en el sitio"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      )}
                      <Link
                        href={`/admin/articulos/${article.id}/editar`}
                        className="text-coral hover:text-coral-dark transition-colors"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        className="text-red-600 hover:text-red-900 transition-colors"
                        title="Archivar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {articles.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No hay artículos para mostrar</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Mostrando {(pagination.page - 1) * pagination.limit + 1} a{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} de{" "}
            {pagination.total} artículos
          </div>
          <div className="flex gap-2">
            {pagination.page > 1 && (
              <Link
                href={buildQuery({ page: String(pagination.page - 1) })}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Anterior
              </Link>
            )}
            <span className="px-4 py-2 bg-coral text-white rounded-lg">
              {pagination.page}
            </span>
            {pagination.page < pagination.totalPages && (
              <Link
                href={buildQuery({ page: String(pagination.page + 1) })}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Siguiente
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminArticulosPage({
  searchParams,
}: {
  searchParams: {
    status?: string;
    search?: string;
    categoria?: string;
    page?: string;
  };
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<div>Cargando...</div>}>
        <ArticlesList searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
