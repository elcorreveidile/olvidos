import { redirect } from "next/navigation";

/**
 * La búsqueda se unificó en /articulos (permite buscar en toda la web o dentro
 * de una categoría). Mantenemos /buscar como redirección para enlaces antiguos.
 */
export default function BuscarPage({
  searchParams,
}: {
  searchParams: { q?: string; page?: string };
}) {
  const params = new URLSearchParams();
  if (searchParams.q) params.set("q", searchParams.q);
  if (searchParams.page) params.set("page", searchParams.page);
  const qs = params.toString();
  redirect(qs ? `/articulos?${qs}` : "/articulos");
}
