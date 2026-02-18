import { redirect } from "next/navigation";
import Link from "next/link";
import { getAllRegistrations, getEvents } from "@/lib/actions/events";
import { auth } from "@/lib/auth";

interface PageProps {
  searchParams: {
    eventId?: string;
    status?: string;
    search?: string;
    page?: string;
  };
}

const STATUS_LABELS: Record<string, string> = {
  REGISTERED: "Inscrito",
  CONFIRMED: "Confirmado",
  CANCELLED: "Cancelado",
  ATTENDED: "Asistió",
};

const STATUS_COLORS: Record<string, string> = {
  REGISTERED: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
  ATTENDED: "bg-blue-100 text-blue-800",
};

export default async function AdminRegistrationsPage({ searchParams }: PageProps) {
  const session = await auth();

  if (!session?.user || (session.user.role !== "EDITOR" && session.user.role !== "ADMIN")) {
    redirect("/login");
  }

  const eventId = searchParams.eventId || "all";
  const status = searchParams.status || "all";
  const searchQuery = searchParams.search || "";
  const page = parseInt(searchParams.page || "1");

  // Get registrations
  const result = await getAllRegistrations({
    eventId: eventId !== "all" ? eventId : undefined,
    status: status !== "all" ? status : undefined,
    search: searchQuery || undefined,
    page,
    limit: 25,
  });

  // Get all events for filter
  const eventsResult = await getEvents({
    status: "PUBLISHED",
    limit: 100,
    includeDraft: true,
  });

  const registrations = result.success ? result.registrations : [];
  const pagination = result.success ? result.pagination : null;
  const events = eventsResult.success ? eventsResult.events : [];

  return (
    <div className="min-h-screen bg-acero/10">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-azul">Inscripciones</h1>
          <p className="text-acero mt-1">Gestiona todas las inscripciones a eventos</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-sm shadow-card p-6 mb-8">
          <form className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                name="search"
                placeholder="Buscar por nombre o email..."
                defaultValue={searchQuery}
                className="w-full px-4 py-2 border border-acero-light rounded-sm focus:outline-none focus:ring-2 focus:ring-coral"
              />
            </div>

            {/* Event Filter */}
            <div>
              <select
                name="eventId"
                defaultValue={eventId}
                className="px-4 py-2 border border-acero-light rounded-sm focus:outline-none focus:ring-2 focus:ring-coral bg-white"
              >
                <option value="all">Todos los eventos</option>
                {events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.title} - {new Date(event.startDate).toLocaleDateString("es-ES")}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select
                name="status"
                defaultValue={status}
                className="px-4 py-2 border border-acero-light rounded-sm focus:outline-none focus:ring-2 focus:ring-coral bg-white"
              >
                <option value="all">Todos los estados</option>
                <option value="REGISTERED">Inscrito</option>
                <option value="CONFIRMED">Confirmado</option>
                <option value="CANCELLED">Cancelado</option>
                <option value="ATTENDED">Asistió</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="px-6 py-2 bg-azul text-white font-bold rounded-sm hover:bg-azul/90 transition-colors"
            >
              Filtrar
            </button>
          </form>
        </div>

        {/* Registrations Table */}
        <div className="bg-white rounded-sm shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-acero/5">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-azul uppercase tracking-wider">
                    Asistente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-azul uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-azul uppercase tracking-wider">
                    Evento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-azul uppercase tracking-wider">
                    Fecha Inscripción
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-azul uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-bold text-azul uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-acero-light">
                {registrations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-acero">
                      No se encontraron inscripciones
                    </td>
                  </tr>
                ) : (
                  registrations.map((registration: any) => (
                    <tr key={registration.id} className="hover:bg-acero/5">
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-semibold text-azul">
                            {registration.member?.user?.name || registration.name || "-"}
                          </p>
                          {registration.member && (
                            <p className="text-xs text-acero-light">
                              Socio #{registration.member.memberNumber}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-acero">
                        {registration.member?.user?.email || registration.email || "-"}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-semibold text-azul">
                            {registration.event.title}
                          </p>
                          <p className="text-xs text-acero-light">
                            {new Date(registration.event.startDate).toLocaleDateString("es-ES", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-acero">
                        {new Date(registration.createdAt).toLocaleDateString("es-ES")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`
                            px-2 py-1 text-xs font-bold rounded-sm
                            ${STATUS_COLORS[registration.status] || STATUS_COLORS.REGISTERED}
                          `}
                        >
                          {STATUS_LABELS[registration.status] || registration.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/actividades/${registration.event.id}`}
                            className="text-azul hover:text-azul/80"
                            title="Ver evento"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </Link>
                          <Link
                            href={`/actividades/${registration.event.slug}`}
                            target="_blank"
                            className="text-coral hover:text-coral/80"
                            title="Ver página pública"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="px-6 py-4 border-t border-acero-light flex items-center justify-between">
              <p className="text-sm text-acero">
                Mostrando {(page - 1) * pagination.limit + 1} a{" "}
                {Math.min(page * pagination.limit, pagination.total)} de {pagination.total} inscripciones
              </p>
              <div className="flex gap-2">
                {page > 1 && (
                  <Link
                    href={`/admin/inscripciones?eventId=${eventId}&status=${status}&search=${searchQuery}&page=${page - 1}`}
                    className="px-4 py-2 bg-white text-azul font-bold rounded-sm hover:bg-acero-light transition-colors"
                  >
                    Anterior
                  </Link>
                )}
                {page < pagination.totalPages && (
                  <Link
                    href={`/admin/inscripciones?eventId=${eventId}&status=${status}&search=${searchQuery}&page=${page + 1}`}
                    className="px-4 py-2 bg-white text-azul font-bold rounded-sm hover:bg-acero-light transition-colors"
                  >
                    Siguiente
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* Export Button */}
          {registrations.length > 0 && (
            <div className="px-6 py-4 border-t border-acero-light">
              <button
                onClick={() => {
                  // Export to CSV
                  const headers = ["Nombre", "Email", "Evento", "Fecha Inscripción", "Estado"];
                  const rows = registrations.map((r: any) => [
                    r.member?.user?.name || r.name || "",
                    r.member?.user?.email || r.email || "",
                    r.event.title,
                    new Date(r.createdAt).toLocaleDateString("es-ES"),
                    STATUS_LABELS[r.status] || r.status,
                  ]);

                  const csv = [
                    headers.join(","),
                    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
                  ].join("\n");

                  const blob = new Blob([csv], { type: "text/csv" });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `inscripciones-${new Date().toISOString().split("T")[0]}.csv`;
                  a.click();
                }}
                className="px-4 py-2 bg-green-600 text-white font-bold rounded-sm hover:bg-green-700 transition-colors text-sm"
              >
                Exportar a CSV
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
