"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const EventSchema = z.object({
  title: z.string().min(1, "El título es obligatorio").max(200, "El título no puede exceder 200 caracteres"),
  slug: z.string().min(1, "El slug es obligatorio").regex(/^[a-z0-9-]+$/, "El slug solo puede contener letras minúsculas, números y guiones"),
  description: z.string().min(1, "La descripción es obligatoria"),
  shortDesc: z.string().max(300, "La descripción corta no puede exceder 300 caracteres").optional(),
  coverImage: z.string().url().optional().or(z.literal("")),
  location: z.string().optional(),
  address: z.string().optional(),
  eventType: z.enum(["BOOK_PRESENTATION", "RECITAL", "CONFERENCE", "WORKSHOP", "EXHIBITION", "SCREENING", "CONCERT", "MEETING", "OTHER"]),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()).optional().or(z.literal("")),
  capacity: z.number().int().positive().optional(),
  membersOnly: z.boolean().default(false),
  price: z.number().min(0).optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "CANCELLED", "COMPLETED"]).default("DRAFT"),
});

export type EventInput = z.infer<typeof EventSchema>;

// Check if user has permission (EDITOR or ADMIN)
async function checkPermission() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("No autenticado");
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (!user || (user.role !== "EDITOR" && user.role !== "ADMIN")) {
    throw new Error("No tienes permiso para realizar esta acción");
  }

  return session.user.id;
}

// Check if user is a member (for registration)
async function checkMemberAccess() {
  const session = await auth();
  if (!session?.user) {
    return null;
  }

  const member = await db.member.findFirst({
    where: {
      userId: session.user.id,
      status: "ACTIVE",
    },
    include: {
      user: {
        select: {
          email: true,
          name: true,
        },
      },
    },
  });

  return member;
}

// Generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// Format date for datetime-local input
function formatDateForInput(date: Date): string {
  return date.toISOString().slice(0, 16);
}

// Create event
export async function createEvent(data: EventInput) {
  try {
    const userId = await checkPermission();

    // Validate data
    const validatedData = EventSchema.parse(data);

    // Check if slug already exists
    const existingEvent = await db.event.findUnique({
      where: { slug: validatedData.slug },
    });

    if (existingEvent) {
      throw new Error("Ya existe un evento con ese slug");
    }

    // Parse dates
    const startDate = typeof validatedData.startDate === 'string'
      ? new Date(validatedData.startDate)
      : validatedData.startDate;

    const endDate = validatedData.endDate
      ? (typeof validatedData.endDate === 'string'
          ? (validatedData.endDate ? new Date(validatedData.endDate) : null)
          : validatedData.endDate)
      : null;

    // Create event
    const event = await db.event.create({
      data: {
        title: validatedData.title,
        slug: validatedData.slug,
        description: validatedData.description,
        shortDesc: validatedData.shortDesc,
        coverImage: validatedData.coverImage || null,
        location: validatedData.location,
        address: validatedData.address,
        eventType: validatedData.eventType,
        startDate,
        endDate,
        capacity: validatedData.capacity,
        membersOnly: validatedData.membersOnly,
        price: validatedData.price || 0,
        status: validatedData.status,
        organizerId: userId,
        publishedAt: validatedData.status === "PUBLISHED" ? new Date() : null,
      },
      include: {
        organizer: true,
      },
    });

    revalidatePath("/admin/actividades");
    revalidatePath("/actividades");
    revalidatePath(`/actividades/${event.slug}`);

    return { success: true, event };
  } catch (error) {
    console.error("Error creating event:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al crear el evento",
    };
  }
}

// Update event
export async function updateEvent(id: string, data: EventInput) {
  try {
    const userId = await checkPermission();

    // Validate data
    const validatedData = EventSchema.parse(data);

    // Check if event exists
    const existingEvent = await db.event.findUnique({
      where: { id },
    });

    if (!existingEvent) {
      throw new Error("El evento no existe");
    }

    // Check if slug changed and if it's already in use
    if (validatedData.slug !== existingEvent.slug) {
      const slugExists = await db.event.findUnique({
        where: { slug: validatedData.slug },
      });
      if (slugExists) {
        throw new Error("Ya existe un evento con ese slug");
      }
    }

    // Parse dates
    const startDate = typeof validatedData.startDate === 'string'
      ? new Date(validatedData.startDate)
      : validatedData.startDate;

    const endDate = validatedData.endDate
      ? (typeof validatedData.endDate === 'string'
          ? (validatedData.endDate ? new Date(validatedData.endDate) : null)
          : validatedData.endDate)
      : null;

    // Update publishedAt if status changed to PUBLISHED
    const publishedAt =
      validatedData.status === "PUBLISHED" && existingEvent.status !== "PUBLISHED"
        ? new Date()
        : existingEvent.publishedAt;

    // Update event
    const event = await db.event.update({
      where: { id },
      data: {
        title: validatedData.title,
        slug: validatedData.slug,
        description: validatedData.description,
        shortDesc: validatedData.shortDesc,
        coverImage: validatedData.coverImage || null,
        location: validatedData.location,
        address: validatedData.address,
        eventType: validatedData.eventType,
        startDate,
        endDate,
        capacity: validatedData.capacity,
        membersOnly: validatedData.membersOnly,
        price: validatedData.price || 0,
        status: validatedData.status,
        publishedAt,
      },
      include: {
        organizer: true,
      },
    });

    revalidatePath("/admin/actividades");
    revalidatePath("/actividades");
    revalidatePath(`/actividades/${event.slug}`);
    revalidatePath(`/admin/actividades/${id}/editar`);

    return { success: true, event };
  } catch (error) {
    console.error("Error updating event:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al actualizar el evento",
    };
  }
}

// Delete event (soft delete - change status to CANCELLED)
export async function deleteEvent(id: string) {
  try {
    const userId = await checkPermission();

    // Check if event exists
    const existingEvent = await db.event.findUnique({
      where: { id },
    });

    if (!existingEvent) {
      throw new Error("El evento no existe");
    }

    // Soft delete by changing status to CANCELLED
    await db.event.update({
      where: { id },
      data: {
        status: "CANCELLED",
      },
    });

    revalidatePath("/admin/actividades");
    revalidatePath("/actividades");

    return { success: true };
  } catch (error) {
    console.error("Error deleting event:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al eliminar el evento",
    };
  }
}

// Get event by ID
export async function getEvent(id: string) {
  try {
    const event = await db.event.findUnique({
      where: { id },
      include: {
        organizer: true,
        attendees: {
          include: {
            member: {
              include: {
                user: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!event) {
      throw new Error("Evento no encontrado");
    }

    return { success: true, event };
  } catch (error) {
    console.error("Error fetching event:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al obtener el evento",
    };
  }
}

// Get event by slug
export async function getEventBySlug(slug: string, includeAttendees = false) {
  try {
    const event = await db.event.findUnique({
      where: { slug },
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        ...(includeAttendees && {
          attendees: {
            include: {
              member: {
                include: {
                  user: true,
                },
              },
            },
            orderBy: {
              createdAt: "asc",
            },
          },
        }),
      },
    });

    if (!event) {
      throw new Error("Evento no encontrado");
    }

    // Count attendees
    const attendeeCount = await db.eventAttendee.count({
      where: {
        eventId: event.id,
        status: {
          in: ["REGISTERED", "CONFIRMED", "ATTENDED"],
        },
      },
    });

    return { success: true, event: { ...event, attendeeCount } };
  } catch (error) {
    console.error("Error fetching event:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al obtener el evento",
    };
  }
}

// Get all events with filters
export async function getEvents(filters?: {
  eventType?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  limit?: number;
  includeDraft?: boolean;
}) {
  try {
    const eventType = filters?.eventType;
    const status = filters?.status || "PUBLISHED";
    const search = filters?.search;
    const page = filters?.page || 1;
    const limit = filters?.limit || 12;
    const skip = (page - 1) * limit;
    const includeDraft = filters?.includeDraft || false;

    const where: any = {};

    // Only show PUBLISHED events by default, unless includeDraft is true
    if (!includeDraft && status !== "all") {
      where.status = status;
    } else if (status !== "all") {
      where.status = status;
    }

    if (eventType && eventType !== "all") {
      where.eventType = eventType;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { shortDesc: { contains: search, mode: "insensitive" } },
        { location: { contains: search, mode: "insensitive" } },
      ];
    }

    // Filter by date range
    if (filters?.startDate) {
      where.startDate = {
        ...where.startDate,
        gte: new Date(filters.startDate),
      };
    }

    if (filters?.endDate) {
      where.startDate = {
        ...where.startDate,
        lte: new Date(filters.endDate),
      };
    }

    const [events, total] = await Promise.all([
      db.event.findMany({
        where,
        include: {
          organizer: {
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: {
              attendees: {
                where: {
                  status: {
                    in: ["REGISTERED", "CONFIRMED", "ATTENDED"],
                  },
                },
              },
            },
          },
        },
        orderBy: {
          startDate: "asc",
        },
        skip,
        take: limit,
      }),
      db.event.count({ where }),
    ]);

    return {
      success: true,
      events,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error("Error fetching events:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al obtener los eventos",
    };
  }
}

// Get upcoming public events
export async function getUpcomingEvents(limit = 6) {
  try {
    const now = new Date();

    const events = await db.event.findMany({
      where: {
        status: "PUBLISHED",
        startDate: {
          gte: now,
        },
      },
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            attendees: {
              where: {
                status: {
                  in: ["REGISTERED", "CONFIRMED", "ATTENDED"],
                },
              },
            },
          },
        },
      },
      orderBy: {
        startDate: "asc",
      },
      take: limit,
    });

    return { success: true, events };
  } catch (error) {
    console.error("Error fetching upcoming events:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al obtener los próximos eventos",
    };
  }
}

// Get past events
export async function getPastEvents(page = 1, limit = 12) {
  try {
    const now = new Date();
    const skip = (page - 1) * limit;

    const [events, total] = await Promise.all([
      db.event.findMany({
        where: {
          status: "PUBLISHED",
          startDate: {
            lt: now,
          },
        },
        include: {
          organizer: {
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: {
              attendees: true,
            },
          },
        },
        orderBy: {
          startDate: "desc",
        },
        skip,
        take: limit,
      }),
      db.event.count({
        where: {
          status: "PUBLISHED",
          startDate: {
            lt: now,
          },
        },
      }),
    ]);

    return {
      success: true,
      events,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error("Error fetching past events:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al obtener los eventos pasados",
    };
  }
}

// Register for event
export async function registerForEvent(eventId: string) {
  try {
    const session = await auth();
    if (!session?.user) {
      throw new Error("Debes iniciar sesión para inscribirte en un evento");
    }

    // Get event
    const eventResult = await getEvent(eventId);
    if (!eventResult.success) {
      throw new Error("Evento no encontrado");
    }

    const event = eventResult.event;

    // Check if event is published
    if (event.status !== "PUBLISHED") {
      throw new Error("Este evento no está disponible para inscripción");
    }

    // Check if event is cancelled
    if (event.status === "CANCELLED") {
      throw new Error("Este evento ha sido cancelado");
    }

    // Check if members only and user is not a member
    if (event.membersOnly) {
      const member = await checkMemberAccess();
      if (!member) {
        throw new Error("Este evento es exclusivo para socios. Debes estar registrado como socio para inscribirte.");
      }
    }

    // Get member info
    const member = await db.member.findFirst({
      where: {
        userId: session.user.id,
        status: "ACTIVE",
      },
      include: {
        user: true,
      },
    });

    if (!member) {
      throw new Error("No se encontró información de socio");
    }

    // Check if already registered
    const existingRegistration = await db.eventAttendee.findUnique({
      where: {
        eventId_memberId: {
          eventId,
          memberId: member.id,
        },
      },
    });

    if (existingRegistration) {
      if (existingRegistration.status === "CANCELLED") {
        // Reactivate cancelled registration
        await db.eventAttendee.update({
          where: { id: existingRegistration.id },
          data: { status: "REGISTERED" },
        });
      } else {
        throw new Error("Ya estás inscrito en este evento");
      }
    } else {
      // Check capacity
      if (event.capacity) {
        const currentAttendees = await db.eventAttendee.count({
          where: {
            eventId,
            status: {
              in: ["REGISTERED", "CONFIRMED", "ATTENDED"],
            },
          },
        });

        if (currentAttendees >= event.capacity) {
          throw new Error("El evento está completo. No hay cupo disponible.");
        }
      }

      // For paid events, we would create a payment session here
      // For now, we'll register directly
      await db.eventAttendee.create({
        data: {
          eventId,
          memberId: member.id,
          name: member.user.name || null,
          email: member.user.email || null,
          status: event.price && event.price > 0 ? "REGISTERED" : "CONFIRMED",
        },
      });
    }

    revalidatePath("/actividades");
    revalidatePath(`/actividades/${event.slug}`);
    revalidatePath("/admin/inscripciones");

    return { success: true, message: "Inscripción completada con éxito" };
  } catch (error) {
    console.error("Error registering for event:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al inscribirse en el evento",
    };
  }
}

// Unregister from event
export async function unregisterFromEvent(eventId: string) {
  try {
    const session = await auth();
    if (!session?.user) {
      throw new Error("No autenticado");
    }

    // Get member
    const member = await db.member.findFirst({
      where: {
        userId: session.user.id,
        status: "ACTIVE",
      },
    });

    if (!member) {
      throw new Error("No se encontró información de socio");
    }

    // Get registration
    const registration = await db.eventAttendee.findUnique({
      where: {
        eventId_memberId: {
          eventId,
          memberId: member.id,
        },
      },
    });

    if (!registration) {
      throw new Error("No estás inscrito en este evento");
    }

    // Update status to CANCELLED
    await db.eventAttendee.update({
      where: { id: registration.id },
      data: { status: "CANCELLED" },
    });

    // Get event for revalidation
    const event = await db.event.findUnique({
      where: { id: eventId },
      select: { slug: true },
    });

    if (event) {
      revalidatePath("/actividades");
      revalidatePath(`/actividades/${event.slug}`);
    }

    revalidatePath("/admin/inscripciones");

    return { success: true, message: "Inscripción cancelada con éxito" };
  } catch (error) {
    console.error("Error unregistering from event:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al cancelar la inscripción",
    };
  }
}

// Get event attendees (admin only)
export async function getEventAttendees(eventId: string) {
  try {
    const userId = await checkPermission();

    const attendees = await db.eventAttendee.findMany({
      where: {
        eventId,
        status: {
          in: ["REGISTERED", "CONFIRMED", "ATTENDED"],
        },
      },
      include: {
        member: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return { success: true, attendees };
  } catch (error) {
    console.error("Error fetching event attendees:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al obtener los asistentes",
    };
  }
}

// Confirm attendee (admin only)
export async function confirmAttendee(eventId: string, memberId: string) {
  try {
    const userId = await checkPermission();

    const registration = await db.eventAttendee.findUnique({
      where: {
        eventId_memberId: {
          eventId,
          memberId,
        },
      },
    });

    if (!registration) {
      throw new Error("Inscripción no encontrada");
    }

    await db.eventAttendee.update({
      where: { id: registration.id },
      data: { status: "CONFIRMED" },
    });

    revalidatePath("/admin/actividades");
    revalidatePath("/admin/inscripciones");

    return { success: true, message: "Asistencia confirmada" };
  } catch (error) {
    console.error("Error confirming attendee:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al confirmar la asistencia",
    };
  }
}

// Cancel attendee registration (admin only)
export async function cancelAttendeeRegistration(eventId: string, memberId: string) {
  try {
    const userId = await checkPermission();

    const registration = await db.eventAttendee.findUnique({
      where: {
        eventId_memberId: {
          eventId,
          memberId,
        },
      },
    });

    if (!registration) {
      throw new Error("Inscripción no encontrada");
    }

    await db.eventAttendee.update({
      where: { id: registration.id },
      data: { status: "CANCELLED" },
    });

    revalidatePath("/admin/actividades");
    revalidatePath("/admin/inscripciones");

    return { success: true, message: "Inscripción cancelada" };
  } catch (error) {
    console.error("Error canceling registration:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al cancelar la inscripción",
    };
  }
}

// Mark attendee as attended (admin only)
export async function markAttendeeAttended(eventId: string, memberId: string) {
  try {
    const userId = await checkPermission();

    const registration = await db.eventAttendee.findUnique({
      where: {
        eventId_memberId: {
          eventId,
          memberId,
        },
      },
    });

    if (!registration) {
      throw new Error("Inscripción no encontrada");
    }

    await db.eventAttendee.update({
      where: { id: registration.id },
      data: { status: "ATTENDED" },
    });

    revalidatePath("/admin/actividades");
    revalidatePath("/admin/inscripciones");

    return { success: true, message: "Asistencia registrada" };
  } catch (error) {
    console.error("Error marking attendance:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al registrar la asistencia",
    };
  }
}

// Get all registrations (admin)
export async function getAllRegistrations(filters?: {
  eventId?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  try {
    const userId = await checkPermission();

    const eventId = filters?.eventId;
    const status = filters?.status;
    const search = filters?.search;
    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (eventId && eventId !== "all") {
      where.eventId = eventId;
    }

    if (status && status !== "all") {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    const [registrations, total] = await Promise.all([
      db.eventAttendee.findMany({
        where,
        include: {
          event: {
            select: {
              id: true,
              title: true,
              slug: true,
              startDate: true,
              eventType: true,
            },
          },
          member: {
            include: {
              user: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      db.eventAttendee.count({ where }),
    ]);

    return {
      success: true,
      registrations,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error("Error fetching registrations:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al obtener las inscripciones",
    };
  }
}

// Get events for calendar view
export async function getEventsForCalendar(year: number, month: number) {
  try {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const events = await db.event.findMany({
      where: {
        status: "PUBLISHED",
        startDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        id: true,
        title: true,
        slug: true,
        startDate: true,
        endDate: true,
        eventType: true,
        location: true,
      },
      orderBy: {
        startDate: "asc",
      },
    });

    return { success: true, events };
  } catch (error) {
    console.error("Error fetching events for calendar:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al obtener los eventos para el calendario",
    };
  }
}

// Get event statistics (admin)
export async function getEventStatistics() {
  try {
    const userId = await checkPermission();

    const [total, published, upcoming, completed, withCapacity] = await Promise.all([
      db.event.count(),
      db.event.count({ where: { status: "PUBLISHED" } }),
      db.event.count({
        where: {
          status: "PUBLISHED",
          startDate: {
            gte: new Date(),
          },
        },
      }),
      db.event.count({ where: { status: "COMPLETED" } }),
      db.event.count({
        where: {
          NOT: {
            capacity: null,
          },
        },
      }),
    ]);

    // Get events with full capacity
    const fullEvents = await db.event.findMany({
      where: {
        NOT: {
          capacity: null,
        },
        status: "PUBLISHED",
        startDate: {
          gte: new Date(),
        },
      },
      select: {
        id: true,
        capacity: true,
        attendees: {
          where: {
            status: {
              in: ["REGISTERED", "CONFIRMED", "ATTENDED"],
            },
          },
        },
      },
    });

    const eventsFull = fullEvents.filter(
      (event) => event.attendees.length >= (event.capacity || 0)
    ).length;

    return {
      success: true,
      statistics: {
        total,
        published,
        upcoming,
        completed,
        withCapacity,
        eventsFull,
      },
    };
  } catch (error) {
    console.error("Error fetching event statistics:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al obtener las estadísticas",
    };
  }
}
