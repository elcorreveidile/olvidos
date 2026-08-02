import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText, Download } from "lucide-react";
import { getDocuments } from "@/lib/actions/documents";
import {
  DOCUMENT_CATEGORY_LABELS,
  DOCUMENT_CATEGORY_ORDER,
} from "@/lib/document-categories";
import type { Document } from "@prisma/client";

export const metadata = {
  title: "Documentos",
};

function formatSize(size: number | null): string {
  if (!size) return "";
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function DocumentosPage() {
  const docs = await getDocuments();

  const grouped = docs.reduce<Record<string, Document[]>>((acc, doc) => {
    (acc[doc.category] ||= []).push(doc);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-black text-tinta">Documentos</h2>
        <p className="mt-1 font-editorial text-tinta/70">
          Estatutos, actas de las reuniones y libro de socios de la asociación.
        </p>
      </div>

      {docs.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-tinta/60">
            Aún no hay documentos publicados. La asociación irá subiendo aquí los
            estatutos, las actas de las reuniones y el libro de socios.
          </CardContent>
        </Card>
      ) : (
        DOCUMENT_CATEGORY_ORDER.filter((cat) => grouped[cat]?.length).map(
          (cat) => (
            <Card key={cat}>
              <CardHeader>
                <CardTitle>{DOCUMENT_CATEGORY_LABELS[cat]}</CardTitle>
              </CardHeader>
              <CardContent className="divide-y divide-acero-light/40 py-0">
                {grouped[cat].map((doc) => (
                  <a
                    key={doc.id}
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 py-3 text-tinta transition-colors hover:text-coral"
                  >
                    <FileText className="h-5 w-5 shrink-0 text-coral" />
                    <span className="flex-1 font-bold">{doc.title}</span>
                    <span className="text-xs text-tinta/50">
                      {formatSize(doc.size)}
                    </span>
                    <Download className="h-4 w-4 shrink-0 text-tinta/40 group-hover:text-coral" />
                  </a>
                ))}
              </CardContent>
            </Card>
          )
        )
      )}
    </div>
  );
}
