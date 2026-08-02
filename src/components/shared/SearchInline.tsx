/**
 * Buscador en línea para las páginas de listado. Envía `q` (y `categoria` si
 * procede) a /articulos, que muestra los resultados. Es un formulario GET, sin
 * JS: si hay categoría, busca dentro de ella; si no, en toda la web.
 */
export function SearchInline({
  categoria,
  defaultValue,
  scopeLabel,
}: {
  categoria?: string;
  defaultValue?: string;
  scopeLabel?: string;
}) {
  return (
    <form
      action="/articulos"
      method="get"
      role="search"
      className="mx-auto flex w-full max-w-md gap-2"
    >
      {categoria && <input type="hidden" name="categoria" value={categoria} />}
      <input
        type="search"
        name="q"
        defaultValue={defaultValue}
        placeholder={
          scopeLabel ? `Buscar en ${scopeLabel}…` : "Buscar en Olvidos…"
        }
        aria-label={scopeLabel ? `Buscar en ${scopeLabel}` : "Buscar"}
        className="flex-1 rounded-sm border border-acero-light px-4 py-2 text-sm focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/30"
      />
      <button
        type="submit"
        className="rounded-sm bg-coral px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-coral-dark"
      >
        Buscar
      </button>
    </form>
  );
}
