"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteLedgerEntry } from "@/lib/actions/ledger";

export function DeleteLedgerEntryButton({
  id,
  concept,
}: {
  id: string;
  concept: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm(`¿Eliminar el apunte "${concept}"?`)) return;
    startTransition(async () => {
      const result = await deleteLedgerEntry(id);
      if (!result.success) {
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
      title="Eliminar apunte"
      className="rounded p-1.5 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
