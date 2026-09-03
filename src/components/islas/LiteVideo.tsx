"use client";

import { useState } from "react";
import type { VideoData } from "@/lib/con-textos/islas-def";

const PROVIDER_LABEL: Record<string, string> = {
  youtube: "YouTube",
  rtve: "RTVE Play",
  congreso: "Congreso de los Diputados",
  otro: "vídeo externo",
};

/**
 * Isla «video»: no se pide nada a YouTube/RTVE hasta que el lector pulsa
 * «Ver el vídeo» (privacidad y peso). Siempre hay enlace a la web original;
 * si no hay URL de incrustación, la isla es una tarjeta-enlace.
 */
export function LiteVideo({ data }: { data: VideoData }) {
  const [playing, setPlaying] = useState(false);
  const provider = PROVIDER_LABEL[data.provider] ?? data.provider;
  const canEmbed = Boolean(data.embedUrl);
  const embedSrc = canEmbed ? `${data.embedUrl}${data.embedUrl.includes("?") ? "&" : "?"}autoplay=1` : "";

  return (
    <figure className="isla-video">
      <div className="relative aspect-video w-full overflow-hidden rounded-sm bg-tinta text-white">
        {playing && canEmbed ? (
          <iframe
            src={embedSrc}
            title={data.title}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            className="absolute inset-0 h-full w-full border-0"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-start justify-end gap-3 p-5">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" aria-hidden="true" />
            <p className="relative text-xs font-bold uppercase tracking-wide text-white/70">
              {provider}
              {data.date ? ` · ${data.date}` : ""}
            </p>
            <p className="relative text-lg font-bold leading-snug">{data.title}</p>
            <div className="relative flex flex-wrap gap-2">
              {canEmbed ? (
                <button
                  type="button"
                  onClick={() => setPlaying(true)}
                  className="inline-flex items-center gap-2 rounded-sm bg-coral px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-coral-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                    <path d="M3 2l9 5-9 5z" fill="currentColor" />
                  </svg>
                  Ver el vídeo
                </button>
              ) : null}
              <a
                href={data.pageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-sm border border-white/60 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-white hover:text-tinta"
              >
                Ver en la web original
              </a>
            </div>
            {canEmbed && (
              <p className="relative text-[11px] leading-snug text-white/60">
                Al reproducirlo se cargará contenido de {provider}, que puede instalar sus propias cookies.
              </p>
            )}
          </div>
        )}
      </div>
      <figcaption className="mt-2 text-xs leading-snug text-acero">
        {data.title}
        {data.sources.length > 0 && (
          <>
            {" · "}
            {data.sources.map((s, i) => (
              <span key={s.id}>
                {i > 0 && "; "}
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="underline decoration-acero-light hover:text-coral">
                  {s.publisher || s.title}
                </a>
              </span>
            ))}
          </>
        )}
      </figcaption>
    </figure>
  );
}
