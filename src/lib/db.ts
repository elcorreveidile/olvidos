import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Mínimos del pool de conexiones por instancia. Con `connection_limit=1`
 * (recomendación antigua de .env.example) las revalidaciones de la Data Cache,
 * que lanzan varias consultas a la vez, se quedaban esperando más de los 10 s
 * por defecto y daban P2024 («Timed out fetching a new connection from the
 * connection pool») y la página caía en error.tsx. El pooler de Neon admite
 * de sobra 5 conexiones por instancia.
 */
const MIN_CONNECTION_LIMIT = 5;
const MIN_POOL_TIMEOUT = 20;

/** Devuelve DATABASE_URL con el pool al menos en los mínimos de arriba. */
export function datasourceUrlConPool(raw: string | undefined): string | undefined {
  if (!raw) return raw;
  try {
    const url = new URL(raw);
    const limit = Number(url.searchParams.get("connection_limit"));
    if (!Number.isFinite(limit) || limit < MIN_CONNECTION_LIMIT) {
      url.searchParams.set("connection_limit", String(MIN_CONNECTION_LIMIT));
    }
    const timeout = Number(url.searchParams.get("pool_timeout"));
    if (!Number.isFinite(timeout) || timeout < MIN_POOL_TIMEOUT) {
      url.searchParams.set("pool_timeout", String(MIN_POOL_TIMEOUT));
    }
    return url.toString();
  } catch {
    return raw;
  }
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl: datasourceUrlConPool(process.env.DATABASE_URL),
    log: process.env.NODE_ENV === "development" ? ["query"] : [],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
