"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Si vale "1", el usuario ha elegido no volver a ver la intro. */
const STORAGE_KEY = "olvidos-curtain-skip";
/** Duración total de la secuencia (coincide con curtainFadeOut en globals.css). */
const SEQUENCE_MS = 5200;
/** Duración reducida cuando el usuario prefiere menos movimiento. */
const REDUCED_MS = 350;

type Phase = "checking" | "playing" | "done";

/**
 * Telón de teatro que se abre AL ENTRAR en el sitio.
 * Por defecto se muestra en cada visita; el usuario puede pulsar
 * "No mostrar la próxima vez" para desactivarlo (flag en localStorage).
 */
export function CurtainIntro() {
  const [phase, setPhase] = useState<Phase>("checking");
  const skipRef = useRef<HTMLButtonElement>(null);

  /** Cierra el telón solo esta vez (no guarda preferencia). */
  const close = useCallback(() => setPhase("done"), []);

  /** Cierra el telón y recuerda no volver a mostrarlo. */
  const dontShowAgain = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* localStorage puede fallar en modo privado: ignoramos */
    }
    setPhase("done");
  }, []);

  useEffect(() => {
    let skip = false;
    try {
      skip = localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      skip = false;
    }

    if (skip) {
      setPhase("done");
      return;
    }

    setPhase("playing");

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const timer = window.setTimeout(close, reduced ? REDUCED_MS : SEQUENCE_MS);
    return () => window.clearTimeout(timer);
  }, [close]);

  // Bloquea el scroll y permite cerrar con Escape mientras se muestra el telón.
  useEffect(() => {
    if (phase !== "playing") return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    skipRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [phase, close]);

  if (phase !== "playing") return null;

  return (
    <div
      role="dialog"
      aria-label="Bienvenida a Olvidos de Granada"
      className="curtain-overlay-anim fixed inset-0 z-[9999] overflow-hidden"
    >
      {/* Logo centrado, por encima del telón cerrado */}
      <div className="curtain-logo pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center text-center">
        <span className="text-6xl font-black leading-none text-white sm:text-8xl">
          <span className="text-coral">[</span>olvidos
        </span>
        <span className="mt-4 font-editorial text-lg text-white/90 sm:text-xl">
          Revista de acciones culturales
        </span>
      </div>

      {/* Paño izquierdo */}
      <div className="curtain-panel-left curtain-velvet absolute inset-y-0 left-0 z-10 w-1/2">
        <div className="absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-black/50 to-transparent" />
      </div>

      {/* Paño derecho */}
      <div className="curtain-panel-right curtain-velvet absolute inset-y-0 right-0 z-10 w-1/2">
        <div className="absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-black/50 to-transparent" />
      </div>

      {/* Control único: cerrar y recordar no volver a mostrar la intro */}
      <div className="absolute bottom-6 right-6 z-30">
        <button
          ref={skipRef}
          type="button"
          onClick={dontShowAgain}
          className="rounded-sm border border-white/40 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white/90 transition-colors hover:bg-white hover:text-teatro"
        >
          No mostrar la próxima vez
        </button>
      </div>
    </div>
  );
}
