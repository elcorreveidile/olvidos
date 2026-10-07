import { Prisma } from "@prisma/client";
import { ZodError } from "zod";

/**
 * Mensaje de error para devolver al navegador desde una acción de servidor.
 *
 * Los errores que lanzamos nosotros (`throw new Error("No autorizado")`) y los
 * de validación (Zod) se muestran tal cual. Los de Prisma **no**: llevan SQL,
 * nombres de columnas o, en los de conexión, la cadena de la base de datos.
 * Para esos se devuelve `fallback` (el detalle queda en `console.error`).
 */
export function errorMessage(error: unknown, fallback: string): string {
  if (error instanceof ZodError) {
    return error.errors[0]?.message || fallback;
  }
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") return "Ya existe un registro con ese valor (debe ser único).";
    if (error.code === "P2025") return "El registro ya no existe.";
    return fallback;
  }
  if (
    error instanceof Prisma.PrismaClientUnknownRequestError ||
    error instanceof Prisma.PrismaClientValidationError ||
    error instanceof Prisma.PrismaClientInitializationError ||
    error instanceof Prisma.PrismaClientRustPanicError
  ) {
    return fallback;
  }
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}
