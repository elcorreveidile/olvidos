"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { MapData } from "@/lib/con-textos/islas-def";

// Leaflet solo existe en el navegador y pesa: se carga en un chunk aparte y
// únicamente cuando el mapa entra en pantalla o el lector lo pide.
const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => <p className="p-4 text-xs text-acero">Cargando el mapa…</p>,
});

/**
 * Isla «mapa»: marco con título y lista de lugares (accesible sin JS ni
 * teselas) que se convierte en un mapa Leaflet + OpenStreetMap al entrar en
 * el viewport. Sin estado en la URL.
 */
export function InteractiveMap({ data }: { data: MapData }) {
  const [load, setLoad] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (load || !ref.current || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setLoad(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [load]);

  return (
    <figure className="isla-mapa" ref={ref}>
      {data.title && (
        <figcaption className="mb-2 text-sm font-bold text-tinta">
          <span className="text-coral">[</span>
          {data.title}
        </figcaption>
      )}
      <div className="overflow-hidden rounded-sm border border-acero-light/50 bg-[#eef2f4]" style={{ minHeight: data.height }}>
        {load ? (
          <LeafletMap data={data} />
        ) : (
          <div className="flex h-full flex-col items-start justify-center gap-3 p-4" style={{ minHeight: data.height }}>
            <button
              type="button"
              onClick={() => setLoad(true)}
              className="rounded-sm bg-tinta px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-coral"
            >
              Cargar el mapa
            </button>
            <p className="text-xs text-acero">Mapa de OpenStreetMap. Se carga al desplazarse hasta aquí.</p>
          </div>
        )}
      </div>
      <details className="mt-2 text-xs text-tinta/80">
        <summary className="cursor-pointer font-bold text-acero hover:text-coral">Lugares del mapa</summary>
        <ul className="mt-1 space-y-0.5">
          {data.points.map((p) => (
            <li key={p.id}>
              <strong>{p.label}</strong>
              {p.note ? ` — ${p.note}` : ""}
            </li>
          ))}
          {data.boxes.map((b) => (
            <li key={b.id}>
              <strong>{b.label}</strong>
              {b.note ? ` — ${b.note}` : ""}
            </li>
          ))}
        </ul>
      </details>
    </figure>
  );
}
