"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { createCategory } from "@/lib/actions/categories";
import { slugify } from "@/lib/utils";

export default function NewCategoryPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parentCategories, setParentCategories] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    parentId: "",
  });

  useEffect(() => {
    // Fetch parent categories
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setParentCategories(data.categories);
        }
      })
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name,
      slug: slugify(name),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await createCategory(formData);

      if (result.error) {
        setError(result.error);
        setIsLoading(false);
        return;
      }

      router.push("/admin/categorias");
      router.refresh();
    } catch (err) {
      setError("Error al crear la categoría");
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-6">
        <Link
          href="/admin/categorias"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a Categorías
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Nueva Categoría</h1>
        <p className="text-gray-600 mt-2">
          Crea una nueva categoría para organizar los artículos
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nombre */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Nombre <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleNameChange}
              required
              maxLength={100}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-transparent"
              placeholder="Ej: Historia de Granada"
            />
            <p className="mt-1 text-sm text-gray-500">
              Máximo 100 caracteres
            </p>
          </div>

          {/* Slug */}
          <div>
            <label
              htmlFor="slug"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Slug <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="slug"
              value={formData.slug}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, slug: e.target.value }))
              }
              required
              maxLength={100}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-transparent font-mono text-sm"
              placeholder="historia-de-granada"
            />
            <p className="mt-1 text-sm text-gray-500">
              Se genera automáticamente desde el nombre
            </p>
          </div>

          {/* Descripción */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Descripción
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              maxLength={500}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-transparent"
              placeholder="Descripción breve de la categoría..."
            />
            <p className="mt-1 text-sm text-gray-500">
              Máximo 500 caracteres (opcional)
            </p>
          </div>

          {/* Categoría Padre */}
          <div>
            <label
              htmlFor="parentId"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Categoría Padre
            </label>
            <select
              id="parentId"
              value={formData.parentId}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, parentId: e.target.value }))
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-transparent"
            >
              <option value="">Ninguna (categoría raíz)</option>
              {parentCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <p className="mt-1 text-sm text-gray-500">
              Si seleccionas una categoría padre, esta será una subcategoría
            </p>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <Link
              href="/admin/categorias"
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-6 py-2 bg-coral-600 text-white rounded-lg hover:bg-coral-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {isLoading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
