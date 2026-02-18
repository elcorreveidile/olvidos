"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Pencil, Trash2, Plus, Search, TrendingUp } from "lucide-react";
import { deleteTag } from "@/lib/actions/tags";

interface Tag {
  id: string;
  name: string;
  slug: string;
  _count: {
    articles: number;
  };
}

export default function AdminTagsPage() {
  const router = useRouter();
  const [tags, setTags] = useState<Tag[]>([]);
  const [filteredTags, setFilteredTags] = useState<Tag[]>([]);
  const [search, setSearch] = useState("");
  const [popularTags, setPopularTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTags();
  }, []);

  useEffect(() => {
    if (search) {
      const filtered = tags.filter(
        (tag) =>
          tag.name.toLowerCase().includes(search.toLowerCase()) ||
          tag.slug.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredTags(filtered);
    } else {
      setFilteredTags(tags);
    }
  }, [search, tags]);

  const fetchTags = async () => {
    try {
      const response = await fetch("/api/tags");
      const data = await response.json();

      if (data.success) {
        setTags(data.tags);
        setFilteredTags(data.tags);

        // Get top 10 popular tags
        const sorted = [...data.tags].sort(
          (a: Tag, b: Tag) => b._count.articles - a._count.articles
        );
        setPopularTags(sorted.slice(0, 10));
      }
    } catch (error) {
      console.error("Error fetching tags:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar el tag "${name}"?`)) {
      return;
    }

    const result = await deleteTag(id);

    if (result.error) {
      alert(result.error);
      return;
    }

    // Refresh the list
    fetchTags();
  };

  const getArticleCountStyle = (count: number) => {
    if (count === 0) return "bg-gray-100 text-gray-600";
    if (count >= 10) return "bg-coral-100 text-coral-800";
    if (count >= 5) return "bg-blue-100 text-blue-800";
    return "bg-green-100 text-green-800";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Tags</h1>
        <p className="text-gray-600 mt-2">
          Gestiona los tags para etiquetar los artículos
        </p>
      </div>

      {/* Popular Tags Section */}
      {popularTags.length > 0 && popularTags[0]._count.articles > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-coral-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Tags Más Utilizados
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-coral-50 text-coral-700 border border-coral-200"
              >
                {tag.name}
                <span className="bg-coral-200 text-coral-800 rounded-full px-2 py-0.5 text-xs">
                  {tag._count.articles}
                </span>
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Listado de Tags
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Total: {filteredTags.length} tag(s)
              {search && ` (filtrados de ${tags.length} totales)`}
            </p>
          </div>
          <Link
            href="/admin/tags/nuevo"
            className="inline-flex items-center gap-2 px-4 py-2 bg-coral-600 text-white rounded-lg hover:bg-coral-700 transition-colors font-medium"
          >
            <Plus className="w-4 h-4" />
            Nuevo Tag
          </Link>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre o slug..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-transparent"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="p-12 text-center">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto"></div>
            </div>
          </div>
        ) : filteredTags.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {search ? "No se encontraron tags" : "No hay tags"}
            </h3>
            <p className="text-gray-600 mb-6">
              {search
                ? "Intenta con otra búsqueda"
                : "Crea tu primer tag para etiquetar los artículos"}
            </p>
            {!search && (
              <Link
                href="/admin/tags/nuevo"
                className="inline-flex items-center gap-2 px-6 py-3 bg-coral-600 text-white rounded-lg hover:bg-coral-700 transition-colors font-medium"
              >
                <Plus className="w-4 h-4" />
                Crear Tag
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            {/* Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
              <div className="col-span-4">Nombre</div>
              <div className="col-span-4">Slug</div>
              <div className="col-span-2">Artículos</div>
              <div className="col-span-2 text-right">Acciones</div>
            </div>

            {/* Tags List */}
            <div>
              {filteredTags.map((tag) => (
                <div
                  key={tag.id}
                  className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-200 hover:bg-gray-50 items-center transition-colors"
                >
                  <div className="col-span-4">
                    <span className="font-medium text-gray-900">
                      {tag.name}
                    </span>
                  </div>
                  <div className="col-span-4">
                    <code className="text-sm text-gray-600">{tag.slug}</code>
                  </div>
                  <div className="col-span-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getArticleCountStyle(
                        tag._count.articles
                      )}`}
                    >
                      {tag._count.articles}
                    </span>
                  </div>
                  <div className="col-span-2 flex justify-end gap-2">
                    <Link
                      href={`/admin/tags/${tag.id}/editar`}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(tag.id, tag.name)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar"
                      disabled={tag._count.articles > 0}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
