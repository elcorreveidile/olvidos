"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteMagazineIssue } from "@/lib/actions/magazine-issues";

export function DeleteIssueButton({
  id,
  label,
}: {
  id: string;
  label: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleDelete = () => {
    if (!confirm(`¿Eliminar el número "${label}"? Esta acción no se puede deshacer.`)) {
      return;
    }
    startTransition(async () => {
      const result = await deleteMagazineIssue(id);
      if (result?.error) {
        setError(result.error);
        alert(result.error);
        return;
      }
      router.refresh();
    });
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      title={error ?? "Eliminar"}
      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
