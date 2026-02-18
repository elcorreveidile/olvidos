import { z } from "zod";

export const articleSchema = z.object({
  title: z.string().min(1, "El título es obligatorio").max(200),
  slug: z.string().min(1).max(200),
  excerpt: z.string().max(500).optional(),
  content: z.string().min(1, "El contenido es obligatorio"),
  coverImage: z.string().url().optional(),
  status: z.enum(["DRAFT", "REVIEW", "PUBLISHED", "ARCHIVED"]),
  featured: z.boolean().default(false),
  membersOnly: z.boolean().default(false),
  categoryIds: z.array(z.string()).optional(),
  tagIds: z.array(z.string()).optional(),
  issueId: z.string().optional(),
  metaTitle: z.string().max(70).optional(),
  metaDescription: z.string().max(160).optional(),
});

export const eventSchema = z.object({
  title: z.string().min(1, "El título es obligatorio").max(200),
  slug: z.string().min(1).max(200),
  description: z.string().min(1, "La descripción es obligatoria"),
  shortDesc: z.string().max(300).optional(),
  coverImage: z.string().url().optional(),
  location: z.string().optional(),
  address: z.string().optional(),
  eventType: z.enum([
    "BOOK_PRESENTATION",
    "RECITAL",
    "CONFERENCE",
    "WORKSHOP",
    "EXHIBITION",
    "SCREENING",
    "CONCERT",
    "MEETING",
    "OTHER",
  ]),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  capacity: z.number().int().positive().optional(),
  membersOnly: z.boolean().default(false),
  price: z.number().positive().optional(),
});

export const memberRegistrationSchema = z.object({
  name: z.string().min(2, "El nombre es obligatorio"),
  email: z.string().email("Email no válido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  membershipLevel: z.enum(["STANDARD", "COLLABORATOR"]).default("STANDARD"),
});

export const contactSchema = z.object({
  name: z.string().min(2, "El nombre es obligatorio"),
  email: z.string().email("Email no válido"),
  subject: z.string().min(5, "El asunto es obligatorio"),
  message: z.string().min(10, "El mensaje debe tener al menos 10 caracteres"),
});
