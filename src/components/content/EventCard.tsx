import Link from "next/link";

const EVENT_TYPE_LABELS: Record<string, string> = {
  BOOK_PRESENTATION: "Presentación",
  RECITAL: "Recital",
  CONFERENCE: "Conferencia",
  WORKSHOP: "Taller",
  EXHIBITION: "Exposición",
  SCREENING: "Proyección",
  CONCERT: "Concierto",
  MEETING: "Reunión",
  OTHER: "Evento",
};

interface EventCardProps {
  title: string;
  slug: string;
  shortDesc?: string | null;
  location?: string | null;
  eventType: string;
  startDate: Date | string;
  membersOnly?: boolean;
}

export function EventCard({
  title,
  slug,
  shortDesc,
  location,
  eventType,
  startDate,
  membersOnly,
}: EventCardProps) {
  const date = new Date(startDate);
  const day = date.getDate();
  const month = date.toLocaleDateString("es-ES", { month: "short" });

  return (
    <Link
      href={`/actividades/${slug}`}
      className="block shadow-card rounded-sm p-6 hover:shadow-card-hover transition-all"
    >
      <div className="flex gap-4">
        <div className="text-center min-w-[60px]">
          <span className="block text-2xl font-black text-coral">{day}</span>
          <span className="block text-xs font-bold text-acero uppercase">{month}</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-coral tag-paren">
              {EVENT_TYPE_LABELS[eventType] || eventType}
            </span>
            {membersOnly && (
              <span className="text-xs font-bold text-white bg-azul px-2 py-0.5 rounded-sm">
                Socios
              </span>
            )}
          </div>
          <h3 className="mt-1 text-lg font-bold text-azul leading-tight">{title}</h3>
          {shortDesc && (
            <p className="mt-1 text-sm text-acero line-clamp-2">{shortDesc}</p>
          )}
          {location && (
            <p className="mt-2 text-xs text-acero-light">{location}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
