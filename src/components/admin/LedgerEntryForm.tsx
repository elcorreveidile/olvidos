"use client";

import { useEffect, useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { createLedgerEntryAction } from "@/lib/actions/ledger";
import { LEDGER_CATEGORIES } from "@/lib/ledger";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-sm bg-coral px-6 py-2 font-bold text-white transition-colors hover:bg-coral-dark disabled:opacity-60"
    >
      {pending ? "Guardando…" : "Añadir apunte"}
    </button>
  );
}

export function LedgerEntryForm({ defaultDate }: { defaultDate: string }) {
  const [state, action] = useFormState(createLedgerEntryAction, null);
  const [kind, setKind] = useState<"INGRESO" | "GASTO">("GASTO");
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
      setKind("GASTO");
    }
  }, [state]);

  const inputCls =
    "w-full rounded-sm border border-gray-300 px-3 py-2 focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/30";

  return (
    <form ref={formRef} action={action} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label htmlFor="kind" className="mb-1 block text-sm font-medium text-gray-700">
            Tipo
          </label>
          <select
            id="kind"
            name="kind"
            value={kind}
            onChange={(e) => setKind(e.target.value as "INGRESO" | "GASTO")}
            className={`h-[42px] bg-white ${inputCls}`}
          >
            <option value="GASTO">Gasto</option>
            <option value="INGRESO">Ingreso</option>
          </select>
        </div>
        <div>
          <label htmlFor="category" className="mb-1 block text-sm font-medium text-gray-700">
            Categoría
          </label>
          <select
            id="category"
            name="category"
            key={kind}
            className={`h-[42px] bg-white ${inputCls}`}
          >
            {LEDGER_CATEGORIES[kind].map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="date" className="mb-1 block text-sm font-medium text-gray-700">
            Fecha
          </label>
          <input
            id="date"
            name="date"
            type="date"
            required
            defaultValue={defaultDate}
            className={`h-[42px] ${inputCls}`}
          />
        </div>
        <div>
          <label htmlFor="amount" className="mb-1 block text-sm font-medium text-gray-700">
            Importe (€)
          </label>
          <input
            id="amount"
            name="amount"
            type="text"
            inputMode="decimal"
            required
            placeholder="120,00"
            className={inputCls}
          />
        </div>
      </div>

      <div>
        <label htmlFor="concept" className="mb-1 block text-sm font-medium text-gray-700">
          Concepto
        </label>
        <input
          id="concept"
          name="concept"
          type="text"
          required
          minLength={2}
          placeholder="Ej: Imprenta del nº 18"
          className={inputCls}
        />
      </div>

      <div>
        <label htmlFor="notes" className="mb-1 block text-sm font-medium text-gray-700">
          Notas <span className="font-normal text-gray-400">(opcional)</span>
        </label>
        <input id="notes" name="notes" type="text" className={inputCls} />
      </div>

      {state && !state.success && (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      )}
      {state?.success && (
        <p role="status" className="text-sm text-green-600">
          Apunte añadido al libro.
        </p>
      )}

      <SubmitButton />
    </form>
  );
}
