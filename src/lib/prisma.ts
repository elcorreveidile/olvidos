/**
 * Alias histórico del cliente Prisma. Hay UN solo cliente (`db`): dos
 * instancias por proceso duplicaban las conexiones a Neon (límite de 5).
 */
export { db as prisma } from "./db";
