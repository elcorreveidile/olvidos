import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getEventBySlug, getEvents } from "@/lib/actions/events";
import { auth } from "@/lib/auth";
import { SITE_URL } from "@/lib/site";
import { RegisterButton } from "./RegisterButton";
import { ShareButtons } from "./ShareButtons";

interface PageProps {
  params: {
    slug: string;
  };
}

const EVENT_TYPE_LABELS: Record<string, string> = {
  BOOK_PRESENTATION: "Presentación de Libro",
  RECITAL: "Recital",
  CONFERENCE: "Conferencia",
  WORKSHOP: "Taller",
  EXHIBITION: "Exposición",
  SCREENING: "Proyección",
  CONCERT: "Concierto",
  MEETING: "Reunión",
  OTHER: "Evento",
};

export default async function EventPage({ params }: PageProps) {
  const result = await getEventBySlug(params.slug, true);

  if (!result.success || !result.event) {
    notFound();
  }

  const event = result.event as any;
  const session = await auth();

  // Check if user is registered
  let isRegistered = false;
  let registrationStatus = null;
  let member = null;

  if (session?.user) {
    member = await (await import("@/lib/db")).db.member.findFirst({
      where: {
        userId: session.user.id,
        status: "ACTIVE",
      },
    });

    if (member) {
      const registration = await (await import("@/lib/db")).db.eventAttendee.findUnique({
        where: {
          eventId_memberId: {
            eventId: event.id,
            memberId: member.id,
          },
        },
      });

      isRegistered = !!registration;
      registrationStatus = registration?.status ?? null;
    }
  }

  // Check if event is full
  const isFull = event.capacity
    ? (event.attendeeCount || 0) >= event.capacity
    : false;

  // Format date
  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get related events
  const relatedResult = await getEvents({
    eventType: event.eventType,
    status: "PUBLISHED",
    limit: 3,
  });

  const relatedEvents = relatedResult.success && relatedResult.events
    ? relatedResult.events.filter((e) => e.id !== event.id).slice(0, 3)
    : [];

  return (
    <div className="min-h-screen">
      {/* Cover Image */}
      {event.coverImage && (
        <div className="relative h-[400px] overflow-hidden">
          <Image
            src={event.coverImage}
            alt={event.title}
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      )}

      {/* Header */}
      <div className={`bg-azul text-white py-12 ${!event.coverImage ? "mt-16" : ""}`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-coral text-white text-sm font-bold rounded-sm">
              {EVENT_TYPE_LABELS[event.eventType] || event.eventType}
            </span>
            {event.membersOnly && (
              <span className="px-3 py-1 bg-white/20 text-white text-sm font-bold rounded-sm">
                Solo Socios
              </span>
            )}
            {event.price && event.price > 0 && (
              <span className="px-3 py-1 bg-green-500 text-white text-sm font-bold rounded-sm">
                {event.price}€
              </span>
            )}
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">{event.title}</h1>
          {event.shortDesc && (
            <p className="text-xl opacity-90 max-w-3xl">{event.shortDesc}</p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Event Details */}
            <div className="bg-white rounded-sm shadow-card p-6 mb-8">
              <h2 className="text-2xl font-bold text-azul mb-4">Detalles del Evento</h2>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-coral mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="font-bold text-azul">Fecha</p>
                    <p className="text-acero">{formatDate(event.startDate)}</p>
                    {event.endDate && new Date(event.endDate).getTime() !== new Date(event.startDate).getTime() && (
                      <p className="text-acero">hasta {formatDate(event.endDate)}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-coral mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="font-bold text-azul">Hora</p>
                    <p className="text-acero">{formatTime(event.startDate)}h</p>
                  </div>
                </div>

                {event.location && (
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-coral mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <p className="font-bold text-azul">Ubicación</p>
                      <p className="text-acero">{event.location}</p>
                      {event.address && (
                        <p className="text-sm text-acero-light">{event.address}</p>
                      )}
                    </div>
                  </div>
                )}

                {event.capacity && (
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-coral mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <div>
                      <p className="font-bold text-azul">Aforo</p>
                      <p className="text-acero">
                        {event.attendeeCount || 0} / {event.capacity} asistentes
                      </p>
                      {isFull && (
                        <p className="text-sm font-bold text-red-600 mt-1">Evento completo</p>
                      )}
                    </div>
                  </div>
                )}

                {event.price && event.price > 0 ? (
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-coral mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="font-bold text-azul">Precio</p>
                      <p className="text-acero">{event.price}€</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="font-bold text-azul">Entrada</p>
                      <p className="text-acero">Gratuita</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-sm shadow-card p-6 mb-8">
              <h2 className="text-2xl font-bold text-azul mb-4">Descripción</h2>
              <div
                className="prose prose-lg max-w-none text-acero"
                dangerouslySetInnerHTML={{ __html: event.description }}
              />
            </div>

            {/* Attendees (if public or member) */}
            {event.attendees && event.attendees.length > 0 && (
              <div className="bg-white rounded-sm shadow-card p-6">
                <h2 className="text-2xl font-bold text-azul mb-4">
                  Asistentes ({event.attendees.filter((a: any) => a.status !== "CANCELLED").length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {event.attendees
                    .filter((a: any) => a.status !== "CANCELLED")
                    .slice(0, 10)
                    .map((attendee: any) => (
                      <div key={attendee.id} className="flex items-center gap-3 p-3 bg-acero/5 rounded-sm">
                        <div className="w-10 h-10 bg-coral rounded-full flex items-center justify-center text-white font-bold">
                          {attendee.member?.user?.name?.charAt(0) || "?"}
                        </div>
                        <div>
                          <p className="font-semibold text-azul">
                            {attendee.name || attendee.member?.user?.name || "Asistente"}
                          </p>
                          <p className="text-xs text-acero-light">
                            {attendee.status === "CONFIRMED" ? "Confirmado" : "Inscrito"}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
                {event.attendees.filter((a: any) => a.status !== "CANCELLED").length > 10 && (
                  <p className="mt-4 text-sm text-acero-light">
                    Y {event.attendees.filter((a: any) => a.status !== "CANCELLED").length - 10} más...
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Registration Card */}
            <div className="bg-white rounded-sm shadow-card p-6 sticky top-4">
              <RegisterButton
                eventId={event.id}
                isFull={isFull}
                isRegistered={isRegistered}
                registrationStatus={registrationStatus}
                member={member}
                // Solo campos serializables: event.price es un Decimal de Prisma
                // (instancia de clase) y rompe la serialización RSC si se pasa
                // el objeto entero a un Client Component.
                event={{
                  price: event.price != null ? Number(event.price) : null,
                  membersOnly: event.membersOnly,
                }}
              />

              {/* Organizer */}
              {event.organizer && (
                <div className="mt-6 pt-6 border-t border-acero-light">
                  <p className="text-sm font-bold text-azul mb-2">Organizado por</p>
                  <p className="text-acero">{event.organizer.name}</p>
                </div>
              )}

              {/* Share */}
              <div className="mt-6 pt-6 border-t border-acero-light">
                <p className="text-sm font-bold text-azul mb-3">Compartir</p>
                <ShareButtons
                  url={`${SITE_URL}/actividades/${event.slug}`}
                  title={event.title}
                />
              </div>
            </div>

            {/* Related Events */}
            {relatedEvents.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-bold text-azul mb-4">Eventos Relacionados</h3>
                <div className="space-y-4">
                  {relatedEvents.map((relatedEvent) => (
                    <Link
                      key={relatedEvent.id}
                      href={`/actividades/${relatedEvent.slug}`}
                      className="block bg-white rounded-sm shadow-card p-4 hover:shadow-card-hover transition-all"
                    >
                      <p className="text-sm font-bold text-coral mb-1">
                        {EVENT_TYPE_LABELS[relatedEvent.eventType] || relatedEvent.eventType}
                      </p>
                      <h4 className="font-bold text-azul leading-tight">{relatedEvent.title}</h4>
                      {relatedEvent.shortDesc && (
                        <p className="text-sm text-acero line-clamp-2 mt-1">{relatedEvent.shortDesc}</p>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
