/** Esqueleto de carga para los listados públicos (cabecera + rejilla de tarjetas). */
export function ListadoSkeleton({ cards = 9 }: { cards?: number }) {
  return (
    <div className="max-w-content mx-auto px-4 py-12" aria-busy="true" aria-label="Cargando">
      <div className="mb-12 border-b-2 border-tinta/20 pb-8 text-center">
        <div className="mx-auto mb-4 h-3 w-32 animate-pulse rounded bg-gray-200" />
        <div className="mx-auto h-10 w-72 animate-pulse rounded bg-gray-200" />
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: cards }).map((_, i) => (
          <div key={i} className="rounded-sm shadow-card">
            <div className="aspect-[16/10] w-full animate-pulse rounded-t-sm bg-gray-200" />
            <div className="space-y-3 p-5">
              <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
              <div className="h-5 w-5/6 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-gray-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
