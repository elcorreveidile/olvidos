import { redirect } from "next/navigation";
import Link from "next/link";
import { Pencil, Plus, BookOpen } from "lucide-react";
import { auth } from "@/lib/auth";
import { getMagazineIssuesList } from "@/lib/actions/magazine-issues";
import { DeleteIssueButton } from "@/components/admin/DeleteIssueButton";

const MESES = [
  "", "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

const STATUS_LABEL: Record<string, string> = {
  DRAFT: "Borrador",
  PUBLISHED: "Publicado",
  ARCHIVED: "Archivado",
  REVIEW: "En revisión",
};

const STATUS_CLASS: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-700",
  PUBLISHED: "bg-green-100 text-green-800",
  ARCHIVED: "bg-yellow-100 text-yellow-800",
  REVIEW: "bg-blue-100 text-blue-800",
};

export default async function AdminRevistaPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN" && session.user.role !== "EDITOR") {
    redirect("/");
  }

  const result = await getMagazineIssuesList();

  if (!result.success || !result.issues) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Números de la revista</h1>
        <p className="text-red-600">Error al cargar los números</p>
      </div>
    );
  }

  const issues = result.issues;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Números de la revista
        </h1>
        <p className="text-gray-600 mt-2">
          Gestiona la hemeroteca: ejemplares, portadas y PDFs
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Listado de Números
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Total: {issues.length} número(s)
            </p>
          </div>
          <Link
            href="/admin/revista/nuevo"
            className="inline-flex items-center gap-2 px-4 py-2 bg-coral-600 text-white rounded-lg hover:bg-coral-700 transition-colors font-medium"
          >
            <Plus className="w-4 h-4" />
            Nuevo Número
          </Link>
        </div>

        {issues.length === 0 ? (
          <div className="p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No hay números
            </h3>
            <p className="text-gray-600 mb-6">
              Añade el primer ejemplar de la hemeroteca
            </p>
            <Link
              href="/admin/revista/nuevo"
              className="inline-flex items-center gap-2 px-6 py-3 bg-coral-600 text-white rounded-lg hover:bg-coral-700 transition-colors font-medium"
            >
              <Plus className="w-4 h-4" />
              Crear Número
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {/* Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
              <div className="col-span-1">Nº</div>
              <div className="col-span-4">Título</div>
              <div className="col-span-2">Fecha</div>
              <div className="col-span-2">Estado</div>
              <div className="col-span-2">Artículos</div>
              <div className="col-span-1 text-right">Acciones</div>
            </div>

            {issues.map((issue) => (
              <div
                key={issue.id}
                className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-200 hover:bg-gray-50 items-center transition-colors"
              >
                <div className="col-span-1">
                  <span className="font-bold text-coral-600">{issue.number}</span>
                </div>
                <div className="col-span-4">
                  <p className="font-medium text-gray-900 truncate">
                    {issue.title}
                  </p>
                  <code className="text-xs text-gray-500">{issue.slug}</code>
                </div>
                <div className="col-span-2 text-sm text-gray-600">
                  {issue.year
                    ? `${issue.month ? `${MESES[issue.month]} ` : ""}${issue.year}`
                    : "—"}
                </div>
                <div className="col-span-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      STATUS_CLASS[issue.status] ?? "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {STATUS_LABEL[issue.status] ?? issue.status}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-coral-100 text-coral-800">
                    {issue._count.articles}
                  </span>
                </div>
                <div className="col-span-1 flex justify-end gap-2">
                  <Link
                    href={`/admin/revista/${issue.id}/editar`}
                    className="p-2 text-gray-600 hover:text-coral hover:bg-coral/10 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Pencil className="w-4 h-4" />
                  </Link>
                  <DeleteIssueButton
                    id={issue.id}
                    label={`Nº ${issue.number} · ${issue.title}`}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
