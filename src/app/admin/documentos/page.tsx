import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText, Trash2 } from "lucide-react";
import { getDocuments, deleteDocument } from "@/lib/actions/documents";
import { DocumentUploadForm } from "@/components/admin/DocumentUploadForm";
import { DOCUMENT_CATEGORY_LABELS } from "@/lib/document-categories";

export const metadata = { title: "Documentos" };

export default async function AdminDocumentosPage() {
  const docs = await getDocuments();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Documentos</h1>
        <p className="mt-1 text-gray-600">
          Estatutos, actas de reuniones y libro de socios. Lo que subas aquí
          aparece en el área de socios.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subir documento</CardTitle>
          <CardDescription>
            El archivo se guarda en Vercel Blob y queda disponible para los
            socios al instante.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DocumentUploadForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Documentos publicados ({docs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {docs.length === 0 ? (
            <p className="py-6 text-center text-gray-500">
              Aún no hay documentos.
            </p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {docs.map((doc) => (
                <li key={doc.id} className="flex items-center gap-3 py-3">
                  <FileText className="h-5 w-5 shrink-0 text-coral" />
                  <div className="min-w-0 flex-1">
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block truncate font-medium text-gray-900 hover:text-coral"
                    >
                      {doc.title}
                    </a>
                    <p className="truncate text-xs text-gray-500">
                      {DOCUMENT_CATEGORY_LABELS[doc.category]} · {doc.fileName}
                    </p>
                  </div>
                  <form
                    action={async () => {
                      "use server";
                      await deleteDocument(doc.id);
                    }}
                  >
                    <button
                      type="submit"
                      className="rounded p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                      aria-label={`Borrar ${doc.title}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
