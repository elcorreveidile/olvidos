"use client";

import { useEffect, useState } from "react";

/** Guiño de "WordNext": frases que rotan al azar al pasar el ratón. */
const FRASES = [
  "Hecho con más ilusión que presupuesto.",
  "Programado a base de café y cabezonería.",
  "Si funciona, no preguntes cómo.",
  "Sin dependencias raras… ni emocionales.",
  "Optimizado para cargar antes que tu paciencia.",
  "Los bugs vienen de serie, sin recargo.",
  "Made in Granada, a fuego lento.",
  "Menos es más, y aquí somos muy de menos.",
  "Funcionaba en mi ordenador, lo juro.",
  "Cero reuniones, todo código.",
  "De WordPress a Next.js, sin perder una coma.",
  "Con mimo artesanal y algún atajo.",
];

export function DesarrolloCredit({
  placement = "bottom",
  className = "",
}: {
  placement?: "top" | "bottom";
  className?: string;
}) {
  const [hover, setHover] = useState(false);
  // Índice inicial fijo para no romper la hidratación; se aleatoriza al hover.
  const [i, setI] = useState(0);

  useEffect(() => {
    if (!hover) return;
    const random = () => setI(Math.floor(Math.random() * FRASES.length));
    random();
    const id = setInterval(random, 1800);
    return () => clearInterval(id);
  }, [hover]);

  return (
    <span
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <a
        href="https://wordnext.tech"
        target="_blank"
        rel="noopener noreferrer"
        className="font-bold text-coral underline decoration-coral-light underline-offset-2 transition-colors hover:text-coral-dark"
      >
        WordNext
      </a>
      {hover && (
        <span
          role="status"
          className={`pointer-events-none absolute left-1/2 z-20 w-max max-w-[240px] -translate-x-1/2 rounded-sm border border-acero-light/60 bg-white px-3 py-2 text-center text-xs font-normal leading-snug text-tinta shadow-card-hover ${
            placement === "top" ? "bottom-full mb-2" : "top-full mt-2"
          }`}
        >
          {FRASES[i]}
        </span>
      )}
    </span>
  );
}
