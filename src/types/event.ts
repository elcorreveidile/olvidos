export type EventType =
  | "BOOK_PRESENTATION"
  | "RECITAL"
  | "CONFERENCE"
  | "WORKSHOP"
  | "EXHIBITION"
  | "SCREENING"
  | "CONCERT"
  | "MEETING"
  | "OTHER";

export type EventStatus = "DRAFT" | "PUBLISHED" | "CANCELLED" | "COMPLETED";

export interface EventSummary {
  id: string;
  title: string;
  slug: string;
  shortDesc: string | null;
  coverImage: string | null;
  location: string | null;
  eventType: EventType;
  startDate: string;
  endDate: string | null;
  membersOnly: boolean;
  price: number | null;
}

export interface EventFull extends EventSummary {
  description: string;
  address: string | null;
  capacity: number | null;
  organizer: {
    name: string | null;
  };
  _count: {
    attendees: number;
  };
}

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  BOOK_PRESENTATION: "Presentación de libro",
  RECITAL: "Recital poético",
  CONFERENCE: "Conferencia",
  WORKSHOP: "Taller",
  EXHIBITION: "Exposición",
  SCREENING: "Proyección",
  CONCERT: "Concierto",
  MEETING: "Reunión de socios",
  OTHER: "Otro",
};
