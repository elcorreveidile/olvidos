import { Suspense } from "react";
import { getEvents, getPastEvents, getEventsForCalendar } from "@/lib/actions/events";
import { EventCard } from "@/components/content/EventCard";
import { Calendar } from "@/components/shared/Calendar";

interface PageProps {
  searchParams: {
    view?: "list" | "calendar";
    type?: string;
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

export default async function ActivitiesPage({ searchParams }: PageProps) {
  const view = searchParams.view || "list";
  const eventType = searchParams.type || "all";
  const page = parseInt(searchParams.page || "1");
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-azul text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-black mb-4">Actividades y Eventos</h1>
          <p className="text-xl max-w-2xl">
            Descubre todas las actividades culturales que organizamos: presentaciones de libros,
            recitales, conferencias, talleres y mucho más.
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        {/* View Toggle */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-8">
          {/* Tabs */}
          <div className="flex gap-2">
            <a
              href="/actividades?view=list"
              className={`
                px-4 py-2 font-bold text-sm rounded-sm transition-colors
                ${view === "list"
                  ? "bg-coral text-white"
                  : "bg-white text-azul hover:bg-acero-light"
                }
              `}
            >
              Lista
            </a>
            <a
              href="/actividades?view=calendar"
              className={`
                px-4 py-2 font-bold text-sm rounded-sm transition-colors
                ${view === "calendar"
                  ? "bg-coral text-white"
                  : "bg-white text-azul hover:bg-acero-light"
                }
              `}
            >
              Calendario
            </a>
          </div>

          {/* Type Filter (only for list view) */}
          {view === "list" && (
            <div className="flex flex-wrap gap-2">
              <a
                href="/actividades?view=list&type=all"
                className={`px-3 py-1 text-xs font-bold rounded-sm transition-colors ${
                  eventType === "all"
                    ? "bg-azul text-white"
                    : "bg-white text-azul border border-acero-light hover:border-azul"
                }`}
              >
                Todos
              </a>
              {Object.entries(EVENT_TYPE_LABELS).map(([key, label]) => (
                <a
                  key={key}
                  href={`/actividades?view=list&type=${key}`}
                  className={`px-3 py-1 text-xs font-bold rounded-sm transition-colors ${
                    eventType === key
                      ? "bg-azul text-white"
                      : "bg-white text-azul border border-acero-light hover:border-azul"
                  }`}
                >
                  {label}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <Suspense fallback={<div>Cargando...</div>}>
          {view === "list" ? (
            <ListView eventType={eventType} page={page} />
          ) : (
            <CalendarView year={currentYear} month={currentMonth} />
          )}
        </Suspense>
      </div>
    </div>
  );
}

// List View Component
async function ListView({ eventType, page }: { eventType: string; page: number }) {
  const result = await getEvents({
    eventType,
    status: "PUBLISHED",
    page,
    limit: 12,
  });

  if (!result.success || !result.events) {
    return (
      <div className="text-center py-12">
        <p className="text-acero">{result.error || "Error al cargar los eventos"}</p>
      </div>
    );
  }

  const { events, pagination } = result;

  // Split events into upcoming and past
  const now = new Date();
  const upcomingEvents = events.filter((event) => new Date(event.startDate) >= now);
  const pastEvents = events.filter((event) => new Date(event.startDate) < now);

  return (
    <div>
      {/* Upcoming Events */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-azul mb-6">Próximos Eventos</h2>

        {upcomingEvents.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-sm shadow-card">
            <p className="text-acero">No hay próximos eventos programados</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <EventCard
                key={event.id}
                title={event.title}
                slug={event.slug}
                shortDesc={event.shortDesc}
                location={event.location}
                eventType={event.eventType}
                startDate={event.startDate}
                membersOnly={event.membersOnly}
              />
            ))}
          </div>
        )}
      </section>

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-azul mb-6">Eventos Pasados</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastEvents.map((event) => (
              <EventCard
                key={event.id}
                title={event.title}
                slug={event.slug}
                shortDesc={event.shortDesc}
                location={event.location}
                eventType={event.eventType}
                startDate={event.startDate}
                membersOnly={event.membersOnly}
              />
            ))}
          </div>
        </section>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-12">
          {page > 1 && (
            <a
              href={`/actividades?view=list&type=${eventType}&page=${page - 1}`}
              className="px-4 py-2 bg-white text-azul font-bold rounded-sm hover:bg-acero-light transition-colors"
            >
              Anterior
            </a>
          )}

          <span className="px-4 py-2 bg-azul text-white font-bold rounded-sm">
            Página {page} de {pagination.totalPages}
          </span>

          {page < pagination.totalPages && (
            <a
              href={`/actividades?view=list&type=${eventType}&page=${page + 1}`}
              className="px-4 py-2 bg-white text-azul font-bold rounded-sm hover:bg-acero-light transition-colors"
            >
              Siguiente
            </a>
          )}
        </div>
      )}
    </div>
  );
}

// Calendar View Component
async function CalendarView({ year, month }: { year: number; month: number }) {
  const result = await getEventsForCalendar(year, month);

  if (!result.success || !result.events) {
    return (
      <div className="text-center py-12">
        <p className="text-acero">{result.error || "Error al cargar el calendario"}</p>
      </div>
    );
  }

  const events = result.events.map((event) => ({
    ...event,
    startDate: new Date(event.startDate),
    endDate: event.endDate ? new Date(event.endDate) : null,
  }));

  return (
    <div className="max-w-4xl mx-auto">
      <Calendar
        events={events}
        year={year}
        month={month}
        onMonthChange={(newYear, newMonth) => {
          // This will be handled by client-side navigation
          const url = `/actividades?view=calendar`;
          window.location.href = url;
        }}
      />
    </div>
  );
}
