"use client";

import {
  COVER_POSITIONS,
  COVER_FIT_CONTAIN,
  DEFAULT_COVER_POSITION,
} from "@/lib/cover-position";

/**
 * Selector focal para la portada de un artículo. Muestra una vista previa con
 * la misma proporción que las tarjetas (16/10) y una rejilla de 9 puntos para
 * elegir qué parte de la imagen se ve. Incluye un modo "mostrar completa"
 * (object-contain) para no recortar nada.
 *
 * `value` y `onChange` trabajan sobre el string que se guarda en
 * `Article.coverPosition` (un valor CSS `object-position`, o "contain").
 */
export function CoverPositionPicker({
  imageUrl,
  value,
  onChange,
}: {
  imageUrl?: string;
  value: string;
  onChange: (next: string) => void;
}) {
  const contain = value === COVER_FIT_CONTAIN;
  const current = value || DEFAULT_COVER_POSITION;

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        Encaje de la portada
      </label>

      <div className="relative aspect-[16/10] w-full max-w-sm overflow-hidden rounded-lg border border-gray-300 bg-tinta/[0.04]">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt="Vista previa de la portada"
            className={`h-full w-full ${
              contain ? "object-contain" : "object-cover"
            }`}
            style={contain ? undefined : { objectPosition: current }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
            Pega una URL de portada para previsualizar
          </div>
        )}

        {/* Rejilla focal (solo en modo recorte) */}
        {!contain && (
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
            {COVER_POSITIONS.map((p) => {
              const active = current === p.key;
              return (
                <button
                  key={p.key}
                  type="button"
                  title={p.label}
                  aria-label={p.label}
                  aria-pressed={active}
                  onClick={() => onChange(p.key)}
                  className="flex items-center justify-center transition-colors hover:bg-coral/20"
                >
                  <span
                    className={`h-3 w-3 rounded-full border-2 transition-colors ${
                      active
                        ? "border-white bg-coral shadow"
                        : "border-white/70 bg-white/30"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-2 flex items-center gap-3">
        <button
          type="button"
          onClick={() =>
            onChange(contain ? DEFAULT_COVER_POSITION : COVER_FIT_CONTAIN)
          }
          className="text-sm font-bold text-coral hover:text-coral-dark"
        >
          {contain
            ? "← Recortar para rellenar la caja"
            : "Mostrar imagen completa (sin recortar) →"}
        </button>
      </div>
      <p className="mt-1 text-xs text-gray-500">
        {contain
          ? "La imagen se verá entera; puede dejar bandas a los lados."
          : "Pulsa un punto para elegir qué parte de la imagen se ve en las tarjetas."}
      </p>
    </div>
  );
}
