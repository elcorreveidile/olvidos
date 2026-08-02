"use client";

import { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { uploadDocumentAction } from "@/lib/actions/documents";
import {
  DOCUMENT_CATEGORY_LABELS,
  DOCUMENT_CATEGORY_ORDER,
} from "@/lib/document-categories";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-sm bg-coral px-6 py-2 font-bold text-white transition-colors hover:bg-coral-dark disabled:opacity-60"
    >
      {pending ? "Subiendo…" : "Subir documento"}
    </button>
  );
}

export function DocumentUploadForm() {
  const [state, action] = useFormState(uploadDocumentAction, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={action} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="title" className="mb-1 block text-sm font-medium text-gray-700">
            Título
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            minLength={2}
            placeholder="Ej: Estatutos de la asociación"
            className="w-full rounded-sm border border-gray-300 px-3 py-2 focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/30"
          />
        </div>
        <div>
          <label htmlFor="category" className="mb-1 block text-sm font-medium text-gray-700">
            Categoría
          </label>
          <select
            id="category"
            name="category"
            defaultValue="ESTATUTOS"
            className="h-[42px] w-full rounded-sm border border-gray-300 bg-white px-3 py-2 focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/30"
          >
            {DOCUMENT_CATEGORY_ORDER.map((cat) => (
              <option key={cat} value={cat}>
                {DOCUMENT_CATEGORY_LABELS[cat]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="file" className="mb-1 block text-sm font-medium text-gray-700">
          Archivo (PDF)
        </label>
        <input
          id="file"
          name="file"
          type="file"
          required
          accept="application/pdf,.pdf,.doc,.docx"
          className="block w-full text-sm text-gray-700 file:mr-4 file:rounded-sm file:border-0 file:bg-coral/10 file:px-4 file:py-2 file:font-bold file:text-coral hover:file:bg-coral/20"
        />
      </div>

      {state && !state.success && (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      )}
      {state?.success && (
        <p role="status" className="text-sm text-green-600">
          Documento subido correctamente.
        </p>
      )}

      <SubmitButton />
    </form>
  );
}
