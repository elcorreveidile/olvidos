"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { getArticle, updateArticle, getCategories, getMagazineIssues } from "@/lib/actions/articles";
import {
  ArrowLeft,
  Save,
  Send,
  Eye,
  Loader2,
} from "lucide-react";

const articleSchema = z.object({
  title: z.string().min(1, "El título es obligatorio"),
  slug: z.string().min(1, "El slug es obligatorio"),
  excerpt: z.string().optional(),
  content: z.string().min(1, "El contenido es obligatorio"),
  coverImage: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  status: z.enum(["DRAFT", "REVIEW", "PUBLISHED"]),
  featured: z.boolean().default(false),
  membersOnly: z.boolean().default(false),
  issueId: z.string().optional(),
  categoryIds: z.array(z.string()).optional(),
  tags: z.string().optional(),
});

type ArticleFormData = z.infer<typeof articleSchema>;

export default function EditarArticuloPage() {
  const router = useRouter();
  const params = useParams();
  const articleId = params.id as string;

  const [categories, setCategories] = useState<any[]>([]);
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [content, setContent] = useState("");
  const [initialLoading, setInitialLoading] = useState(true);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
  });

  useEffect(() => {
    async function loadArticle() {
      try {
        const result = await getArticle(articleId);

        if (result.success && result.article) {
          const article = result.article;

          // Set form values
          reset({
            title: article.title,
            slug: article.slug,
            excerpt: article.excerpt || "",
            content: article.content,
            coverImage: article.coverImage || "",
            metaTitle: article.metaTitle || "",
            metaDescription: article.metaDescription || "",
            status: article.status as any,
            featured: article.featured,
            membersOnly: article.membersOnly,
            issueId: article.issueId || "",
          });

          setContent(article.content);

          // Set categories
          const categoryIds = article.categories.map((c: any) => c.categoryId);
          setSelectedCategories(categoryIds);

          // Set tags
          const tagNames = article.tags.map((t: any) => t.tag.name);
          setValue("tags", tagNames.join(", "));
        } else {
          setError(result.error || "Error al cargar el artículo");
        }
      } catch (err) {
        setError("Error al cargar el artículo");
        console.error(err);
      } finally {
        setInitialLoading(false);
      }
    }

    loadArticle();
  }, [articleId, reset, setValue]);

  useEffect(() => {
    async function loadData() {
      try {
        const [categoriesResult, issuesResult] = await Promise.all([
          getCategories(),
          getMagazineIssues(),
        ]);

        if (categoriesResult.success && categoriesResult.categories) {
          setCategories(categoriesResult.categories);
        }

        if (issuesResult.success && issuesResult.issues) {
          setIssues(issuesResult.issues);
        }
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const onSubmit = async (data: ArticleFormData, publishStatus?: string) => {
    setSubmitting(true);
    setError(null);

    try {
      const tagNames = data.tags
        ? data.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
        : [];

      const result = await updateArticle(articleId, {
        ...data,
        status: (publishStatus || data.status) as any,
        categoryIds: selectedCategories.length > 0 ? selectedCategories : undefined,
        tagNames: tagNames.length > 0 ? tagNames : undefined,
      });

      if (result.success) {
        router.push("/admin/articulos");
        router.refresh();
      } else {
        setError(result.error || "Error al actualizar el artículo");
      }
    } catch (err) {
      setError("Error al actualizar el artículo");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  if (initialLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-coral-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/articulos"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a artículos
        </Link>
        <h1 className="text-3xl font-bold text-blue-900">Editar artículo</h1>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        {/* Basic info */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">
            Información básica
          </h2>

          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register("title")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="El título del artículo"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slug <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register("slug")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="url-del-articulo"
              />
              {errors.slug && (
                <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>
              )}
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Extracto
              </label>
              <textarea
                {...register("excerpt")}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Breve descripción del artículo..."
              />
            </div>

            {/* Cover image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Imagen de portada
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  {...register("coverImage")}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>
              {watch("coverImage") && (
                <div className="mt-2">
                  <img
                    src={watch("coverImage")}
                    alt="Vista previa"
                    className="w-32 h-32 object-cover rounded"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">Contenido</h2>

          <RichTextEditor
            value={content}
            onChange={setContent}
            placeholder="Escribe el contenido del artículo..."
          />

          <input
            type="hidden"
            {...register("content")}
            value={content}
          />
          {errors.content && (
            <p className="mt-2 text-sm text-red-600">{errors.content.message}</p>
          )}
        </div>

        {/* Categories and tags */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">
            Categorías y etiquetas
          </h2>

          <div className="space-y-4">
            {/* Categories */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categorías
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => toggleCategory(category.id)}
                    className={`px-3 py-1.5 rounded-lg border transition-colors ${
                      selectedCategories.includes(category.id)
                        ? "bg-blue-900 text-white border-blue-900"
                        : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Etiquetas
              </label>
              <input
                type="text"
                {...register("tags")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="etiqueta1, etiqueta2, etiqueta3"
              />
              <p className="mt-1 text-sm text-gray-500">
                Separa las etiquetas con comas
              </p>
            </div>
          </div>
        </div>

        {/* Publication settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">
            Configuración de publicación
          </h2>

          <div className="space-y-4">
            {/* Magazine issue */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de revista
              </label>
              <select
                {...register("issueId")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Sin número</option>
                {issues.map((issue) => (
                  <option key={issue.id} value={issue.id}>
                    #{issue.number} - {issue.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Checkboxes */}
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  {...register("featured")}
                  className="w-4 h-4 text-blue-900 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Artículo destacado</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  {...register("membersOnly")}
                  className="w-4 h-4 text-blue-900 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Solo para socios</span>
              </label>
            </div>

            {/* SEO */}
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">SEO</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Título SEO (máx. 60 caracteres)
                  </label>
                  <input
                    type="text"
                    {...register("metaTitle")}
                    maxLength={60}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Título para motores de búsqueda"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Descripción SEO (máx. 160 caracteres)
                  </label>
                  <textarea
                    {...register("metaDescription")}
                    rows={2}
                    maxLength={160}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Descripción para motores de búsqueda"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 sticky bottom-0 bg-white border-t border-gray-200 p-4 rounded-lg shadow-lg">
          <Link
            href="/admin/articulos"
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </Link>
          <button
            onClick={handleSubmit((data) => onSubmit(data, "DRAFT"))}
            disabled={submitting}
            className="inline-flex items-center gap-2 px-6 py-2 border border-blue-900 text-blue-900 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Guardar borrador
          </button>
          <button
            onClick={handleSubmit((data) => onSubmit(data, "REVIEW"))}
            disabled={submitting}
            className="inline-flex items-center gap-2 px-6 py-2 border border-yellow-600 text-yellow-700 rounded-lg hover:bg-yellow-50 transition-colors disabled:opacity-50"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
            Enviar a revisión
          </button>
          <button
            onClick={handleSubmit((data) => onSubmit(data, "PUBLISHED"))}
            disabled={submitting}
            className="inline-flex items-center gap-2 px-6 py-2 bg-coral-600 text-white rounded-lg hover:bg-coral-700 transition-colors disabled:opacity-50"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            Publicar
          </button>
        </div>
      </form>
    </div>
  );
}
