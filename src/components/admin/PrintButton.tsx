"use client";

import { Printer } from "lucide-react";

/** Botón que abre el diálogo de impresión (→ "Guardar como PDF"). */
export function PrintButton({ label = "Imprimir / Guardar PDF" }: { label?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 rounded-lg bg-coral px-5 py-2 font-bold text-white transition-colors hover:bg-coral-dark print:hidden"
    >
      <Printer className="h-4 w-4" />
      {label}
    </button>
  );
}
