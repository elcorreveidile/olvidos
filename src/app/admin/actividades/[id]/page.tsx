import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getEvent, confirmAttendee, cancelAttendeeRegistration, markAttendeeAttended } from "@/lib/actions/events";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

interface PageProps {
  params: {
    id: string;
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

const EVENT_TYPE_LABELS: Record<string, string> = {
  BOOK_PRESENTATION: "Presentación de Libro",
  RECITAL: "Recital",
  CONFERENCE: "Conferencia",
  WORKSHOP: "Taller",
  EXHIBITION: "Exposición",
  SCREENING: "Proyección",
  CONCERT: "Concierto",
  MEETING: "Reunión",
  OTHER: "Otro",
};

export default async function AdminEventDetailPage({ params }: PageProps) {
  const session = await auth();

  if (!session?.user || (session.user.role !== "EDITOR" && session.user.role !== "ADMIN")) {
    redirect("/login");
  }

  const result = await getEvent(params.id);

  if (!result.success || !result.event) {
    notFound();
  }

  const event = result.event as any;
  const attendees = event.attendees || [];
  const activeAttendees = attendees.filter((a: any) => a.status !== "CANCELLED");

  // Calculate statistics
  const confirmedCount = attendees.filter((a: any) => a.status === "CONFIRMED").length;
  const attendedCount = attendees.filter((a: any) => a.status === "ATTENDED").length;
  const registeredCount = attendees.filter((a: any) => a.status === "REGISTERED").length;
  const isFull = event.capacity ? activeAttendees.length >= event.capacity : false;

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

  return (
    <div className="min-h-screen bg-acero/10">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-acero mb-2">
            <Link href="/admin/actividades" className="hover:text-azul">
              Actividades
            </Link>
            <span>/</span>
            <span className="text-azul">{event.title}</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-azul">{event.title}</h1>
              <p className="text-acero mt-1">
                {EVENT_TYPE_LABELS[event.eventType]} • {formatDate(event.startDate)}
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/actividades/${event.slug}`}
                target="_blank"
                className="px-4 py-2 bg-acero text-azul font-bold rounded-sm hover:bg-acero/80 transition-colors"
              >
                Ver Público
              </Link>
              <Link
                href={`/admin/actividades/${event.id}/editar`}
                className="px-4 py-2 bg-azul text-white font-bold rounded-sm hover:bg-azul/90 transition-colors"
              >
                Editar
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Statistics */}
            <div className="bg-white rounded-sm shadow-card p-6">
              <h2 className="text-xl font-bold text-azul mb-4">Estadísticas</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-acero/5 rounded-sm">
                  <p className="text-2xl font-black text-azul">{activeAttendees.length}</p>
                  <p className="text-xs text-acero uppercase mt-1">Inscritos</p>
                  {event.capacity && (
                    <p className="text-xs text-acero-light">de {event.capacity}</p>
                  )}
                </div>
                <div className="text-center p-4 bg-green-50 rounded-sm">
                  <p className="text-2xl font-black text-green-600">{confirmedCount}</p>
                  <p className="text-xs text-acero uppercase mt-1">Confirmados</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-sm">
                  <p className="text-2xl font-black text-yellow-600">{registeredCount}</p>
                  <p className="text-xs text-acero uppercase mt-1">Pendientes</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-sm">
                  <p className="text-2xl font-black text-blue-600">{attendedCount}</p>
                  <p className="text-xs text-acero uppercase mt-1">Asistieron</p>
                </div>
              </div>
              {isFull && (
                <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-sm text-sm font-bold">
                  Evento completo
                </div>
              )}
            </div>

            {/* Event Details */}
            <div className="bg-white rounded-sm shadow-card p-6">
              <h2 className="text-xl font-bold text-azul mb-4">Detalles del Evento</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-bold text-acero">Fecha y Hora</p>
                  <p className="text-azul">
                    {formatDate(event.startDate)} a las {formatTime(event.startDate)}h
                  </p>
                  {event.endDate && new Date(event.endDate).getTime() !== new Date(event.startDate).getTime() && (
                    <p className="text-acero text-sm">
                      hasta {formatDate(event.endDate)} a las {formatTime(event.endDate)}h
                    </p>
                  )}
                </div>
                {event.location && (
                  <div>
                    <p className="text-sm font-bold text-acero">Ubicación</p>
                    <p className="text-azul">{event.location}</p>
                    {event.address && <p className="text-sm text-acero-light">{event.address}</p>}
                  </div>
                )}
                {event.price && event.price > 0 ? (
                  <div>
                    <p className="text-sm font-bold text-acero">Precio</p>
                    <p className="text-azul">{event.price}€</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-bold text-acero">Precio</p>
                    <p className="text-green-600 font-bold">Gratuito</p>
                  </div>
                )}
                {event.capacity && (
                  <div>
                    <p className="text-sm font-bold text-acero">Aforo</p>
                    <p className="text-azul">{event.capacity} personas</p>
                  </div>
                )}
                {event.membersOnly && (
                  <div>
                    <p className="text-sm font-bold text-acero">Restricción</p>
                    <p className="text-coral font-bold">Solo para socios</p>
                  </div>
                )}
                {event.shortDesc && (
                  <div>
                    <p className="text-sm font-bold text-acero">Descripción Corta</p>
                    <p className="text-azul">{event.shortDesc}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Attendees */}
            <div className="bg-white rounded-sm shadow-card p-6">
              <h2 className="text-xl font-bold text-azul mb-4">
                Lista de Asistentes ({activeAttendees.length})
              </h2>

              {attendees.length === 0 ? (
                <p className="text-center text-acero py-8">
                  No hay inscripciones todavía
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-acero-light">
                        <th className="text-left py-3 text-sm font-bold text-azul">Asistente</th>
                        <th className="text-left py-3 text-sm font-bold text-azul">Email</th>
                        <th className="text-left py-3 text-sm font-bold text-azul">Fecha Inscripción</th>
                        <th className="text-left py-3 text-sm font-bold text-azul">Estado</th>
                        <th className="text-right py-3 text-sm font-bold text-azul">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendees.map((attendee: any) => (
                        <tr key={attendee.id} className="border-b border-acero-light hover:bg-acero/5">
                          <td className="py-3">
                            <p className="font-semibold text-azul">
                              {attendee.member?.user?.name || attendee.name || "-"}
                            </p>
                            {attendee.member && (
                              <p className="text-xs text-acero-light">
                                Socio #{attendee.member.memberNumber}
                              </p>
                            )}
                          </td>
                          <td className="py-3 text-sm text-acero">
                            {attendee.member?.user?.email || attendee.email || "-"}
                          </td>
                          <td className="py-3 text-sm text-acero">
                            {new Date(attendee.createdAt).toLocaleDateString("es-ES")}
                          </td>
                          <td className="py-3">
                            <span
                              className={`
                                px-2 py-1 text-xs font-bold rounded-sm
                                ${STATUS_COLORS[attendee.status] || STATUS_COLORS.REGISTERED}
                              `}
                            >
                              {STATUS_LABELS[attendee.status] || attendee.status}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {attendee.status === "REGISTERED" && (
                                <>
                                  <form
                                    action={async () => {
                                      "use server";
                                      if (attendee.member) {
                                        await confirmAttendee(event.id, attendee.member.id);
                                        revalidatePath(`/admin/actividades/${event.id}`);
                                      }
                                    }}
                                  >
                                    <button
                                      type="submit"
                                      className="text-green-600 hover:text-green-800 text-xs font-bold"
                                      title="Confirmar"
                                    >
                                      Confirmar
                                    </button>
                                  </form>
                                  <form
                                    action={async () => {
                                      "use server";
                                      if (attendee.member) {
                                        await cancelAttendeeRegistration(event.id, attendee.member.id);
                                        revalidatePath(`/admin/actividades/${event.id}`);
                                      }
                                    }}
                                  >
                                    <button
                                      type="submit"
                                      className="text-red-600 hover:text-red-800 text-xs font-bold"
                                      title="Cancelar"
                                    >
                                      Cancelar
                                    </button>
                                  </form>
                                </>
                              )}
                              {attendee.status === "CONFIRMED" && (
                                <>
                                  <form
                                    action={async () => {
                                      "use server";
                                      if (attendee.member) {
                                        await markAttendeeAttended(event.id, attendee.member.id);
                                        revalidatePath(`/admin/actividades/${event.id}`);
                                      }
                                    }}
                                  >
                                    <button
                                      type="submit"
                                      className="text-coral hover:text-coral-dark text-xs font-bold"
                                      title="Marcar como asistido"
                                    >
                                      Asistió
                                    </button>
                                  </form>
                                  <form
                                    action={async () => {
                                      "use server";
                                      if (attendee.member) {
                                        await cancelAttendeeRegistration(event.id, attendee.member.id);
                                        revalidatePath(`/admin/actividades/${event.id}`);
                                      }
                                    }}
                                  >
                                    <button
                                      type="submit"
                                      className="text-red-600 hover:text-red-800 text-xs font-bold"
                                      title="Cancelar"
                                    >
                                      Cancelar
                                    </button>
                                  </form>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Status Card */}
            <div className="bg-white rounded-sm shadow-card p-6 sticky top-4">
              <h3 className="text-lg font-bold text-azul mb-4">Estado del Evento</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-bold text-acero">Estado Actual</p>
                  <p className="font-bold text-azul">{event.status}</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-acero">Organizador</p>
                  <p className="text-azul">{event.organizer?.name || "-"}</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-acero">Creado</p>
                  <p className="text-sm text-acero">
                    {new Date(event.createdAt).toLocaleDateString("es-ES")}
                  </p>
                </div>
                {event.publishedAt && (
                  <div>
                    <p className="text-sm font-bold text-acero">Publicado</p>
                    <p className="text-sm text-acero">
                      {new Date(event.publishedAt).toLocaleDateString("es-ES")}
                    </p>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="mt-6 pt-6 border-t border-acero-light space-y-2">
                <Link
                  href={`/admin/inscripciones?eventId=${event.id}`}
                  className="block w-full text-center px-4 py-2 bg-acero text-azul font-bold rounded-sm hover:bg-acero/80 transition-colors text-sm"
                >
                  Ver Todas las Inscripciones
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
