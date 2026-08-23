"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteArticle } from "@/lib/actions/articles";

export function ArchiveArticleButton({
  id,
  label,
}: {
  id: string;
  label: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleArchive = () => {
    if (
      !confirm(
        `¿Archivar el artículo "${label}"? Dejará de estar publicado y podrás recuperarlo cambiando su estado.`
      )
    ) {
      return;
    }
    startTransition(async () => {
      const result = await deleteArticle(id);
      if (!result?.success) {
        setError(result?.error ?? "Error al archivar el artículo");
        alert(result?.error ?? "Error al archivar el artículo");
        return;
      }
      router.refresh();
    });
  };

  return (
    <button
      type="button"
      onClick={handleArchive}
      disabled={isPending}
      title={error ?? "Archivar"}
      className="text-red-600 hover:text-red-900 transition-colors disabled:opacity-50"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
