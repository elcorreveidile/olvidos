/**
 * Titular de categoría/listado al estilo de marca: corchete alto (nuestra
 * aportación de diseño) + la palabra, todo en coral y centrado. Al cargar,
 * el corchete entra desde la izquierda y la palabra desde la derecha,
 * convergiendo en el centro (animación CSS, respeta prefers-reduced-motion).
 */
export function CategoryHeading({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="flex items-baseline justify-center overflow-hidden py-[0.4em] text-5xl leading-none text-coral sm:text-7xl">
      <svg
        viewBox="0 0 22 64"
        className="cat-heading-bracket mr-[0.14em] h-[1.3em] w-auto shrink-0"
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
      <span className="cat-heading-word font-extrabold tracking-tight">
        {children}
      </span>
    </h1>
  );
}
