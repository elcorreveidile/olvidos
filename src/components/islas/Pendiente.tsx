/**
 * Marcador de posición para islas cuya interfaz aún no está implementada.
 * Muestra el nombre de la isla de forma discreta; nunca rompe la página.
 */
export function Pendiente({ name }: { name: string; data?: unknown }) {
  return (
    <div className="rounded-sm border border-dashed border-acero-light/70 px-4 py-6 text-center text-xs text-acero">
      Isla «{name}» en preparación.
    </div>
  );
}
