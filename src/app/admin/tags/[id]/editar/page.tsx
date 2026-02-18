"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { updateTag, getTag } from "@/lib/actions/tags";
import { slugify } from "@/lib/utils";

export default function EditTagPage() {
  const router = useRouter();
  const params = useParams();
  const tagId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [articleCount, setArticleCount] = useState(0);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch tag data
        const tagResponse = await fetch(`/api/tags/${tagId}`);
        const tagData = await tagResponse.json();

        if (!tagData.success) {
          setError("Tag no encontrado");
          setIsLoading(false);
          return;
        }

        const tag = tagData.tag;
        setFormData({
          name: tag.name,
          slug: tag.slug,
        });
        setArticleCount(tag._count.articles);

        setIsLoading(false);
      } catch (err) {
        setError("Error al cargar el tag");
        setIsLoading(false);
      }
    };

    loadData();
  }, [tagId]);

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
    setIsSaving(true);
    setError(null);

    try {
      const result = await updateTag(tagId, formData);

      if (result.error) {
        setError(result.error);
        setIsSaving(false);
        return;
      }

      router.push("/admin/tags");
      router.refresh();
    } catch (err) {
      setError("Error al actualizar el tag");
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="space-y-6">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-6">
        <Link
          href="/admin/tags"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a Tags
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Editar Tag</h1>
        <p className="text-gray-600 mt-2">Actualiza la información del tag</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {articleCount > 0 && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Atención:</strong> Este tag tiene {articleCount} artículo(s)
              asociado(s). Si cambias el slug, asegúrate de que no coincida con
              ningún otro tag existente.
            </p>
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
              maxLength={50}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-transparent"
              placeholder="Ej: Literatura"
            />
            <p className="mt-1 text-sm text-gray-500">Máximo 50 caracteres</p>
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
              maxLength={50}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-transparent font-mono text-sm"
              placeholder="literatura"
            />
            <p className="mt-1 text-sm text-gray-500">
              Se genera automáticamente desde el nombre
            </p>
          </div>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Artículos asociados:</strong> {articleCount} artículo(s)
            </p>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <Link
              href="/admin/tags"
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-6 py-2 bg-coral-600 text-white rounded-lg hover:bg-coral-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {isSaving ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
