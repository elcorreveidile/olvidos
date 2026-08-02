/**
 * Logotipo de Olvidos recreado como vector (nítido a cualquier tamaño).
 * Reproduce el original: corchete alto que sobresale de la palabra, todo en
 * coral, y "olvidos" en Libre Franklin pesada. El color se hereda de
 * `currentColor` (por defecto coral), así que se puede recolorear con text-*.
 *
 * El tamaño se controla con la font-size del contenedor (unidades em).
 */
export function Logo({
  className = "",
  word = "olvidos",
}: {
  className?: string;
  word?: string;
}) {
  return (
    <span
      className={`inline-flex items-center leading-none text-coral ${className}`}
    >
      {/* Corchete alto vectorial */}
      <svg
        viewBox="0 0 22 64"
        className="mr-[0.05em] h-[1.24em] w-auto shrink-0 translate-y-[0.09em]"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M20 3 H7 V61 H20"
          stroke="currentColor"
          strokeWidth="5.5"
          strokeLinecap="square"
        />
      </svg>
      <span className="font-extrabold lowercase tracking-tight">{word}</span>
      <span className="sr-only">Olvidos — Revista de acciones culturales</span>
    </span>
  );
}
