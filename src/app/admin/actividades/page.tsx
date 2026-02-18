import { redirect } from "next/navigation";
import Link from "next/link";
import { getEvents, getEventStatistics } from "@/lib/actions/events";
import { auth } from "@/lib/auth";

interface PageProps {
  searchParams: {
    type?: string;
    status?: string;
    search?: string;
    page?: string;
  };
}

const EVENT_TYPE_LABELS: Record<string, string> = {
  BOOK_PRESENTATION: "Presentación",
  RECITAL: "Recital",
  CONFERENCE: "Conferencia",
  WORKSHOP: "Taller",
  EXHIBITION: "Exposición",
  SCREENING: "Proyección",
  CONCERT: "Concierto",
  MEETING: "Reunión",
  OTHER: "Otro",
};

const STATUS_LABELS: Record<string, string> = {
  DRAFT: "Borrador",
  PUBLISHED: "Publicado",
  CANCELLED: "Cancelado",
  COMPLETED: "Completado",
};

const STATUS_COLORS: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-800",
  PUBLISHED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
  COMPLETED: "bg-blue-100 text-blue-800",
};

export default async function AdminActivitiesPage({ searchParams }: PageProps) {
  const session = await auth();

  if (!session?.user || (session.user.role !== "EDITOR" && session.user.role !== "ADMIN")) {
    redirect("/login");
  }

  const eventType = searchParams.type || "all";
  const status = searchParams.status || "all";
  const searchQuery = searchParams.search || "";
  const page = parseInt(searchParams.page || "1");

  // Get statistics
  const statsResult = await getEventStatistics();

  // Get events
  const eventsResult = await getEvents({
    eventType,
    status,
    search: searchQuery,
    page,
    limit: 20,
    includeDraft: true,
  });

  const stats = statsResult.success ? statsResult.statistics : null;
  const events = eventsResult.success ? eventsResult.events : [];
  const pagination = eventsResult.success ? eventsResult.pagination : null;

  return (
    <div className="min-h-screen bg-acero/10">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-azul">Actividades y Eventos</h1>
            <p className="text-acero mt-1">Gestiona todos los eventos de la asociación</p>
          </div>
          <Link
            href="/admin/actividades/nuevo"
            className="mt-4 md:mt-0 inline-flex items-center gap-2 px-6 py-3 bg-coral text-white font-bold rounded-sm hover:bg-coral/90 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nuevo Evento
          </Link>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-sm shadow-card p-6">
              <p className="text-sm font-bold text-acero uppercase tracking-wide">Total</p>
              <p className="text-3xl font-black text-azul mt-2">{stats.total}</p>
            </div>
            <div className="bg-white rounded-sm shadow-card p-6">
              <p className="text-sm font-bold text-acero uppercase tracking-wide">Publicados</p>
              <p className="text-3xl font-black text-green-600 mt-2">{stats.published}</p>
            </div>
            <div className="bg-white rounded-sm shadow-card p-6">
              <p className="text-sm font-bold text-acero uppercase tracking-wide">Próximos</p>
              <p className="text-3xl font-black text-coral mt-2">{stats.upcoming}</p>
            </div>
            <div className="bg-white rounded-sm shadow-card p-6">
              <p className="text-sm font-bold text-acero uppercase tracking-wide">Completos</p>
              <p className="text-3xl font-black text-orange-600 mt-2">{stats.eventsFull}</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-sm shadow-card p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                name="search"
                placeholder="Buscar por título, descripción o ubicación..."
                defaultValue={searchQuery}
                className="w-full px-4 py-2 border border-acero-light rounded-sm focus:outline-none focus:ring-2 focus:ring-coral"
              />
            </div>

            {/* Type Filter */}
            <div>
              <select
                name="type"
                defaultValue={eventType}
                className="px-4 py-2 border border-acero-light rounded-sm focus:outline-none focus:ring-2 focus:ring-coral bg-white"
              >
                <option value="all">Todos los tipos</option>
                {Object.entries(EVENT_TYPE_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
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
                <option value="DRAFT">Borrador</option>
                <option value="PUBLISHED">Publicado</option>
                <option value="CANCELLED">Cancelado</option>
                <option value="COMPLETED">Completado</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="px-6 py-2 bg-azul text-white font-bold rounded-sm hover:bg-azul/90 transition-colors"
            >
              Filtrar
            </button>
          </div>
        </form>

        {/* Events Table */}
        <div className="bg-white rounded-sm shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-acero/5">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-azul uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-azul uppercase tracking-wider">
                    Evento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-azul uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-azul uppercase tracking-wider">
                    Ubicación
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-azul uppercase tracking-wider">
                    Asistentes
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
                {events.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-acero">
                      No se encontraron eventos
                    </td>
                  </tr>
                ) : (
                  events.map((event: any) => {
                    const date = new Date(event.startDate);
                    const isFull = event.capacity && event._count.attendees >= event.capacity;

                    return (
                      <tr key={event.id} className="hover:bg-acero/5">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <p className="text-sm font-semibold text-azul">
                              {date.toLocaleDateString("es-ES", { day: "numeric", month: "short" })}
                            </p>
                            <p className="text-xs text-acero-light">
                              {date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}h
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-semibold text-azul">{event.title}</p>
                            {event.shortDesc && (
                              <p className="text-xs text-acero line-clamp-1">{event.shortDesc}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-xs text-acero">
                            {EVENT_TYPE_LABELS[event.eventType] || event.eventType}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-acero">
                          {event.location || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-acero">
                              {event._count.attendees}
                              {event.capacity && ` / ${event.capacity}`}
                            </span>
                            {isFull && (
                              <span className="text-xs font-bold text-red-600">Completo</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`
                              px-2 py-1 text-xs font-bold rounded-sm
                              ${STATUS_COLORS[event.status] || STATUS_COLORS.DRAFT}
                            `}
                          >
                            {STATUS_LABELS[event.status] || event.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/admin/actividades/${event.id}`}
                              className="text-coral hover:text-coral/80"
                              title="Ver detalles"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </Link>
                            <Link
                              href={`/admin/actividades/${event.id}/editar`}
                              className="text-azul hover:text-azul/80"
                              title="Editar"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="px-6 py-4 border-t border-acero-light flex items-center justify-between">
              <p className="text-sm text-acero">
                Mostrando {(page - 1) * pagination.limit + 1} a{" "}
                {Math.min(page * pagination.limit, pagination.total)} de {pagination.total} eventos
              </p>
              <div className="flex gap-2">
                {page > 1 && (
                  <Link
                    href={`/admin/actividades?type=${eventType}&status=${status}&search=${searchQuery}&page=${page - 1}`}
                    className="px-4 py-2 bg-white text-azul font-bold rounded-sm hover:bg-acero-light transition-colors"
                  >
                    Anterior
                  </Link>
                )}
                {page < pagination.totalPages && (
                  <Link
                    href={`/admin/actividades?type=${eventType}&status=${status}&search=${searchQuery}&page=${page + 1}`}
                    className="px-4 py-2 bg-white text-azul font-bold rounded-sm hover:bg-acero-light transition-colors"
                  >
                    Siguiente
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
