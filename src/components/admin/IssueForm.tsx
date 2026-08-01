"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import {
  createMagazineIssue,
  updateMagazineIssue,
} from "@/lib/actions/magazine-issues";
import type { MagazineIssueInput } from "@/lib/validations/magazine-issue";
import { slugify } from "@/lib/utils";

type Status = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface IssueFormValues {
  id?: string;
  number: number;
  title: string;
  slug: string;
  year: number;
  month: number | null;
  description: string | null;
  coverImage: string | null;
  pdfUrl: string | null;
  status: string;
  publishedAt: Date | string | null;
}

function toDateInput(value: Date | string | null): string {
  if (!value) return "";
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

export function IssueForm({ issue }: { issue?: IssueFormValues }) {
  const router = useRouter();
  const isEdit = Boolean(issue?.id);

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    number: issue?.number ? String(issue.number) : "",
    title: issue?.title ?? "",
    slug: issue?.slug ?? "",
    year: issue?.year ? String(issue.year) : String(new Date().getFullYear()),
    month: issue?.month ? String(issue.month) : "",
    status: (issue?.status as Status) ?? "DRAFT",
    description: issue?.description ?? "",
    coverImage: issue?.coverImage ?? "",
    pdfUrl: issue?.pdfUrl ?? "",
    publishedAt: toDateInput(issue?.publishedAt ?? null),
  });

  const set = (field: keyof typeof formData, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      // Solo autogenera el slug si el usuario no lo ha tocado (o al crear)
      slug: !isEdit && (prev.slug === "" || prev.slug === slugify(prev.title))
        ? slugify(title)
        : prev.slug,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    const payload: MagazineIssueInput = {
      number: Number(formData.number),
      title: formData.title,
      slug: formData.slug,
      year: Number(formData.year),
      month: formData.month === "" ? undefined : Number(formData.month),
      status: formData.status,
      description: formData.description || undefined,
      coverImage: formData.coverImage || undefined,
      pdfUrl: formData.pdfUrl || undefined,
      publishedAt: formData.publishedAt || undefined,
    };

    try {
      const result = isEdit
        ? await updateMagazineIssue(issue!.id!, payload)
        : await createMagazineIssue(payload);

      if (result.error) {
        setError(result.error);
        setIsSaving(false);
        return;
      }

      router.push("/admin/revista");
      router.refresh();
    } catch {
      setError("Error al guardar el número");
      setIsSaving(false);
    }
  };

  const inputClass =
    "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-transparent";

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-6">
        <Link
          href="/admin/revista"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a Números
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">
          {isEdit ? "Editar Número" : "Nuevo Número"}
        </h1>
        <p className="text-gray-600 mt-2">
          {isEdit
            ? "Actualiza los datos de este número de la revista"
            : "Añade un número a la hemeroteca"}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Número y Título */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-2">
                Número <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="number"
                min={1}
                value={formData.number}
                onChange={(e) => set("number", e.target.value)}
                required
                className={inputClass}
                placeholder="Ej: 12"
              />
            </div>
            <div className="sm:col-span-3">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Título <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={handleTitleChange}
                required
                maxLength={200}
                className={inputClass}
                placeholder="Ej: Primavera del 85"
              />
            </div>
          </div>

          {/* Slug */}
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
              Slug <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="slug"
              value={formData.slug}
              onChange={(e) => set("slug", e.target.value)}
              required
              maxLength={200}
              className={`${inputClass} font-mono text-sm`}
              placeholder="numero-12"
            />
            <p className="mt-1 text-sm text-gray-500">
              Se genera automáticamente desde el título
            </p>
          </div>

          {/* Año, Mes, Estado */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
                Año <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="year"
                min={1900}
                max={2100}
                value={formData.year}
                onChange={(e) => set("year", e.target.value)}
                required
                className={inputClass}
                placeholder="Ej: 1985"
              />
            </div>
            <div>
              <label htmlFor="month" className="block text-sm font-medium text-gray-700 mb-2">
                Mes
              </label>
              <input
                type="number"
                id="month"
                min={1}
                max={12}
                value={formData.month}
                onChange={(e) => set("month", e.target.value)}
                className={inputClass}
                placeholder="1-12 (opcional)"
              />
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Estado <span className="text-red-500">*</span>
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => set("status", e.target.value)}
                className={inputClass}
              >
                <option value="DRAFT">Borrador</option>
                <option value="PUBLISHED">Publicado</option>
                <option value="ARCHIVED">Archivado</option>
              </select>
            </div>
          </div>

          {/* Fecha exacta de publicación */}
          <div>
            <label htmlFor="publishedAt" className="block text-sm font-medium text-gray-700 mb-2">
              Fecha de publicación
            </label>
            <input
              type="date"
              id="publishedAt"
              value={formData.publishedAt}
              onChange={(e) => set("publishedAt", e.target.value)}
              className={inputClass}
            />
            <p className="mt-1 text-sm text-gray-500">
              Opcional. Si se marca como publicado y se deja vacía, se usará la fecha actual.
            </p>
          </div>

          {/* Descripción */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => set("description", e.target.value)}
              maxLength={1000}
              rows={4}
              className={inputClass}
              placeholder="Sumario o descripción del número..."
            />
          </div>

          {/* Portada y PDF */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 mb-2">
                URL de la portada
              </label>
              <input
                type="url"
                id="coverImage"
                value={formData.coverImage}
                onChange={(e) => set("coverImage", e.target.value)}
                className={inputClass}
                placeholder="https://..."
              />
            </div>
            <div>
              <label htmlFor="pdfUrl" className="block text-sm font-medium text-gray-700 mb-2">
                URL del PDF
              </label>
              <input
                type="url"
                id="pdfUrl"
                value={formData.pdfUrl}
                onChange={(e) => set("pdfUrl", e.target.value)}
                className={inputClass}
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <Link
              href="/admin/revista"
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
