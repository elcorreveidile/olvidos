import { getAllCategories } from "@/lib/actions/categories";
import { deleteCategory } from "@/lib/actions/categories";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Pencil, Trash2, Plus, FolderTree } from "lucide-react";

export default async function AdminCategoriesPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN" && session.user.role !== "EDITOR") {
    redirect("/");
  }

  const result = await getAllCategories();

  if (!result.success || !result.categories) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Categorías</h1>
        <p className="text-red-600">Error al cargar las categorías</p>
      </div>
    );
  }

  const categories = result.categories;

  // Build tree structure for display
  const buildTree = (parentId: string | null) => {
    return categories
      .filter((cat) => cat.parentId === parentId)
      .map((cat) => ({
        ...cat,
        children: buildTree(cat.id),
      }));
  };

  const tree = buildTree(null);

  // Function to render category row with indentation
  const renderCategoryRow = (
    category: any,
    level: number = 0,
    key: string = ""
  ) => {
    const paddingLeft = level * 24;
    const hasChildren = category.children && category.children.length > 0;

    return (
      <div key={key || category.id}>
        <div
          className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-200 hover:bg-gray-50 items-center transition-colors"
          style={{ paddingLeft: `${paddingLeft + 24}px` }}
        >
          <div className="col-span-3 flex items-center gap-2">
            {hasChildren && <FolderTree className="w-4 h-4 text-gray-400" />}
            <span className="font-medium text-gray-900">{category.name}</span>
          </div>
          <div className="col-span-2">
            <code className="text-sm text-gray-600">{category.slug}</code>
          </div>
          <div className="col-span-3">
            <p className="text-sm text-gray-600 truncate">
              {category.description || "-"}
            </p>
          </div>
          <div className="col-span-2">
            {category.parent ? (
              <span className="text-sm text-gray-600">
                {category.parent.name}
              </span>
            ) : (
              <span className="text-sm text-gray-400">-</span>
            )}
          </div>
          <div className="col-span-1">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-coral-100 text-coral-800">
              {category._count.articles}
            </span>
          </div>
          <div className="col-span-1 flex justify-end gap-2">
            <Link
              href={`/admin/categorias/${category.id}/editar`}
              className="p-2 text-gray-600 hover:text-coral hover:bg-coral/10 rounded-lg transition-colors"
              title="Editar"
            >
              <Pencil className="w-4 h-4" />
            </Link>
            <form action={async () => {
              "use server";
              const result = await deleteCategory(category.id);
              if (result.error) {
                // You might want to handle this error with a toast in the future
                console.error(result.error);
              }
            }}>
              <button
                type="submit"
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Eliminar"
                onClick={(e) => {
                  if (
                    !confirm(
                      "¿Estás seguro de que deseas eliminar esta categoría?"
                    )
                  ) {
                    e.preventDefault();
                  }
                }}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
        {hasChildren &&
          category.children.map((child: any) =>
            renderCategoryRow(child, level + 1, `${category.id}-${child.id}`)
          )}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Categorías</h1>
        <p className="text-gray-600 mt-2">
          Gestiona las categorías de artículos del blog
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Listado de Categorías
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Total: {categories.length} categoría(s)
            </p>
          </div>
          <Link
            href="/admin/categorias/nueva"
            className="inline-flex items-center gap-2 px-4 py-2 bg-coral-600 text-white rounded-lg hover:bg-coral-700 transition-colors font-medium"
          >
            <Plus className="w-4 h-4" />
            Nueva Categoría
          </Link>
        </div>

        {categories.length === 0 ? (
          <div className="p-12 text-center">
            <FolderTree className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No hay categorías
            </h3>
            <p className="text-gray-600 mb-6">
              Crea tu primera categoría para organizar los artículos
            </p>
            <Link
              href="/admin/categorias/nueva"
              className="inline-flex items-center gap-2 px-6 py-3 bg-coral-600 text-white rounded-lg hover:bg-coral-700 transition-colors font-medium"
            >
              <Plus className="w-4 h-4" />
              Crear Categoría
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {/* Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
              <div className="col-span-3">Nombre</div>
              <div className="col-span-2">Slug</div>
              <div className="col-span-3">Descripción</div>
              <div className="col-span-2">Padre</div>
              <div className="col-span-1">Artículos</div>
              <div className="col-span-1 text-right">Acciones</div>
            </div>

            {/* Tree view */}
            <div>
              {tree.map((category) => renderCategoryRow(category))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
