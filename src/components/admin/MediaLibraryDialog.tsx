"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, X } from "lucide-react";

type Item = { url: string; name: string; size: number; uploadedAt: string };

const STEP = 48;

/**
 * Ventana para elegir una imagen de la biblioteca (lo ya subido a Vercel Blob).
 * Se abre con `open`; al elegir llama a `onSelect(url)` y se cierra.
 */
export function MediaLibraryDialog({
  open,
  onClose,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
}) {
  const [items, setItems] = useState<Item[] | null>(null);
  const [truncated, setTruncated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [shown, setShown] = useState(STEP);

  // Se carga una vez, la primera vez que se abre.
  useEffect(() => {
    if (!open || items !== null) return;
    let cancelled = false;
    fetch("/api/admin/media")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "No se pudo cargar la biblioteca.");
        if (!cancelled) {
          setItems(data.items);
          setTruncated(Boolean(data.truncated));
        }
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message);
      });
    return () => {
      cancelled = true;
    };
  }, [open, items]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const filtered = useMemo(() => {
    if (!items) return [];
    const q = query.trim().toLowerCase();
    return q ? items.filter((i) => i.name.toLowerCase().includes(q)) : items;
  }, [items, query]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Biblioteca de imágenes"
        className="flex max-h-[85vh] w-full max-w-4xl flex-col rounded-lg bg-white shadow-xl"
      >
        <div className="flex items-center gap-3 border-b border-gray-200 px-4 py-3">
          <h2 className="text-lg font-semibold text-gray-900">Biblioteca de imágenes</h2>
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShown(STEP);
            }}
            placeholder="Buscar por nombre…"
            className="ml-auto w-56 rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-transparent focus:ring-2 focus:ring-coral"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="rounded p-1.5 text-gray-600 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-4">
          {error && <p className="text-sm text-red-600">{error}</p>}
          {!error && items === null && (
            <p className="flex items-center gap-2 text-sm text-gray-600">
              <Loader2 className="h-4 w-4 animate-spin" /> Cargando…
            </p>
          )}
          {items !== null && filtered.length === 0 && (
            <p className="text-sm text-gray-600">
              {query ? "Ninguna imagen coincide con la búsqueda." : "Aún no hay imágenes subidas."}
            </p>
          )}
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {filtered.slice(0, shown).map((item) => (
              <li key={item.url}>
                <button
                  type="button"
                  onClick={() => {
                    onSelect(item.url);
                    onClose();
                  }}
                  title={item.name}
                  className="group block w-full overflow-hidden rounded-lg border border-gray-200 text-left hover:border-coral focus:outline-none focus:ring-2 focus:ring-coral"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.url}
                    alt={item.name}
                    loading="lazy"
                    className="aspect-square w-full bg-gray-100 object-cover"
                  />
                  <span className="block truncate px-2 py-1 text-xs text-gray-600">
                    {item.name}
                  </span>
                </button>
              </li>
            ))}
          </ul>
          {filtered.length > shown && (
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setShown((n) => n + STEP)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Mostrar más ({filtered.length - shown} restantes)
              </button>
            </div>
          )}
          {truncated && (
            <p className="mt-3 text-xs text-gray-500">
              Se muestran las 3.000 imágenes más recientes de la biblioteca.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
