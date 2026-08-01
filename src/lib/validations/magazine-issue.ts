import { z } from "zod";

const emptyToUndefined = (v: unknown) => (v === "" || v === null ? undefined : v);

export const magazineIssueSchema = z.object({
  number: z.coerce
    .number({ invalid_type_error: "El número es requerido" })
    .int("El número debe ser entero")
    .positive("El número debe ser mayor que 0"),
  title: z
    .string()
    .min(1, "El título es requerido")
    .max(200, "Máximo 200 caracteres"),
  slug: z
    .string()
    .min(1, "El slug es requerido")
    .max(200, "Máximo 200 caracteres")
    .regex(/^[a-z0-9-]+$/, "Solo minúsculas, números y guiones"),
  year: z.coerce
    .number({ invalid_type_error: "El año es requerido" })
    .int("El año debe ser entero")
    .min(1900, "Año no válido")
    .max(2100, "Año no válido"),
  month: z.preprocess(
    emptyToUndefined,
    z.coerce
      .number()
      .int()
      .min(1, "El mes debe estar entre 1 y 12")
      .max(12, "El mes debe estar entre 1 y 12")
      .optional()
  ),
  description: z.preprocess(
    emptyToUndefined,
    z.string().max(1000, "Máximo 1000 caracteres").optional()
  ),
  coverImage: z.preprocess(
    emptyToUndefined,
    z.string().url("URL de portada no válida").optional()
  ),
  pdfUrl: z.preprocess(
    emptyToUndefined,
    z.string().url("URL de PDF no válida").optional()
  ),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  publishedAt: z.preprocess(
    emptyToUndefined,
    z.string().optional()
  ),
});

export type MagazineIssueInput = z.infer<typeof magazineIssueSchema>;
