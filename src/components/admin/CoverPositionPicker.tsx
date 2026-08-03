"use client";

import { useEffect, useRef, useState } from "react";
import { COVER_FIT_CONTAIN, DEFAULT_COVER_POSITION } from "@/lib/cover-position";

/**
 * Selector de encuadre de la portada. Muestra la imagen recortada a la
 * proporción de las tarjetas (16/10) y permite **arrastrar la foto** para elegir
 * qué parte se ve; el encuadre se guarda como `object-position` en porcentajes
 * ("30% 65%"). Incluye modo "mostrar completa" (object-contain) y un botón para
 * centrar.
 *
 * `value`/`onChange` operan sobre el string de `Article.coverPosition`.
 */

const clamp = (n: number) => Math.max(0, Math.min(100, n));

// Convierte el valor guardado (porcentajes o palabra clave) a {x, y} en %.
function parseXY(value?: string): { x: number; y: number } {
  if (value) {
    const pct = value.match(/^(-?\d+(?:\.\d+)?)%\s+(-?\d+(?:\.\d+)?)%$/);
    if (pct) return { x: clamp(+pct[1]), y: clamp(+pct[2]) };
    const H: Record<string, number> = { left: 0, center: 50, right: 100 };
    const V: Record<string, number> = { top: 0, center: 50, bottom: 100 };
    const tokens = value.toLowerCase().split(/\s+/);
    let x = 50;
    let y = 50;
    for (const t of tokens) {
      if (t in H) x = H[t];
      if (t in V) y = V[t];
    }
    return { x, y };
  }
  return { x: 50, y: 50 };
}

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

  const frameRef = useRef<HTMLDivElement>(null);
  const natural = useRef<{ w: number; h: number } | null>(null);
  const last = useRef<{ x: number; y: number } | null>(null);
  const [xy, setXY] = useState(() => parseXY(value));

  // Sincroniza con el valor externo cuando cambia y no estamos arrastrando.
  useEffect(() => {
    if (!contain && !last.current) setXY(parseXY(value));
  }, [value, contain]);

  function startDrag(e: React.PointerEvent) {
    if (contain || !imageUrl) return;
    frameRef.current?.setPointerCapture(e.pointerId);
    last.current = { x: e.clientX, y: e.clientY };
  }

  function moveDrag(e: React.PointerEvent) {
    if (!last.current || !frameRef.current || !natural.current) return;
    const rect = frameRef.current.getBoundingClientRect();
    const { w: iw, h: ih } = natural.current;
    const s = Math.max(rect.width / iw, rect.height / ih); // escala "cover"
    const ox = iw * s - rect.width; // sobrante horizontal (px)
    const oy = ih * s - rect.height; // sobrante vertical (px)
    const dx = e.clientX - last.current.x;
    const dy = e.clientY - last.current.y;
    last.current = { x: e.clientX, y: e.clientY };

    setXY((prev) => {
      const next = {
        x: ox > 0 ? clamp(prev.x - (dx / ox) * 100) : prev.x,
        y: oy > 0 ? clamp(prev.y - (dy / oy) * 100) : prev.y,
      };
      onChange(`${Math.round(next.x)}% ${Math.round(next.y)}%`);
      return next;
    });
  }

  function endDrag(e: React.PointerEvent) {
    last.current = null;
    frameRef.current?.releasePointerCapture?.(e.pointerId);
  }

  const objectPosition = `${xy.x}% ${xy.y}%`;

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        Encaje de la portada
      </label>

      <div
        ref={frameRef}
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className={`relative aspect-[16/10] w-full max-w-sm select-none overflow-hidden rounded-lg border border-gray-300 bg-tinta/[0.04] ${
          contain || !imageUrl ? "" : "cursor-grab touch-none active:cursor-grabbing"
        }`}
      >
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt="Vista previa de la portada"
            draggable={false}
            onLoad={(e) => {
              const el = e.currentTarget;
              natural.current = { w: el.naturalWidth, h: el.naturalHeight };
            }}
            className={`pointer-events-none h-full w-full ${
              contain ? "object-contain" : "object-cover"
            }`}
            style={contain ? undefined : { objectPosition }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
            Pega una URL de portada para previsualizar
          </div>
        )}

        {/* Guías (regla de los tercios) solo al encuadrar */}
        {!contain && imageUrl && (
          <div className="pointer-events-none absolute inset-0 opacity-40">
            <div className="absolute inset-y-0 left-1/3 w-px bg-white/60" />
            <div className="absolute inset-y-0 left-2/3 w-px bg-white/60" />
            <div className="absolute inset-x-0 top-1/3 h-px bg-white/60" />
            <div className="absolute inset-x-0 top-2/3 h-px bg-white/60" />
          </div>
        )}
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
        {!contain && imageUrl && (
          <button
            type="button"
            onClick={() => {
              setXY({ x: 50, y: 50 });
              onChange(DEFAULT_COVER_POSITION);
            }}
            className="text-sm font-bold text-gray-600 hover:text-tinta"
          >
            Centrar
          </button>
        )}
        <button
          type="button"
          onClick={() =>
            onChange(contain ? `${xy.x}% ${xy.y}%` : COVER_FIT_CONTAIN)
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
          : "Arrastra la imagen para elegir qué parte se ve en las tarjetas."}
      </p>
    </div>
  );
}
