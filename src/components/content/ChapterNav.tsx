"use client";

import { useEffect, useState } from "react";

export interface ChapterRef {
  n: number;
  id: string;
  title: string;
}

/**
 * Índice de capítulos del modo «leer seguido»: enlaces de ancla a cada paso
 * con resaltado del que está en pantalla (scroll-spy con IntersectionObserver).
 */
export function ChapterNav({ chapters, horizontal = false }: { chapters: ChapterRef[]; horizontal?: boolean }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const sections = chapters
      .map((c) => document.getElementById(c.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!sections.length) return;
    const visible = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.set(e.target.id, e.boundingClientRect.top);
          else visible.delete(e.target.id);
        }
        if (visible.size) {
          // El capítulo cuyo borde superior está más arriba de la banda de lectura.
          const first = Array.from(visible.entries()).sort((a, b) => a[1] - b[1])[0];
          setActive(first[0]);
        }
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
    );
    sections.forEach((s) => observer.observe(s));
    // Estado inicial a partir de la posición actual (p. ej. al entrar con #ancla).
    const hash = window.location.hash.replace(/^#/, "");
    if (hash && chapters.some((c) => c.id === hash)) setActive(hash);
    return () => observer.disconnect();
  }, [chapters]);

  if (horizontal) {
    return (
      <nav
        aria-label="Capítulos"
        className="mb-8 flex gap-2 overflow-x-auto border-y border-acero-light/40 py-3 lg:hidden"
      >
        {chapters.map((c) => {
          const isActive = c.id === active;
          return (
            <a
              key={c.id}
              href={`#${c.id}`}
              aria-current={isActive ? "location" : undefined}
              className={`shrink-0 rounded-sm px-3 py-1.5 text-sm font-bold transition-colors ${
                isActive ? "bg-coral text-white" : "text-tinta/70 hover:bg-coral/10 hover:text-coral"
              }`}
            >
              <span className="tabular-nums">{c.n}.</span> {c.title}
            </a>
          );
        })}
      </nav>
    );
  }

  return (
    <nav aria-label="Capítulos">
      <ol className="space-y-2">
        {chapters.map((c) => {
          const isActive = c.id === active;
          return (
            <li key={c.id}>
              <a
                href={`#${c.id}`}
                aria-current={isActive ? "location" : undefined}
                className={`flex gap-2 text-sm leading-snug transition-colors ${
                  isActive ? "font-bold text-coral" : "text-tinta hover:text-coral"
                }`}
              >
                <span className="tabular-nums text-acero-light">{c.n}.</span>
                <span>{c.title}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
