import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  // Endpoint público de liveness: NO expone qué variables de entorno /
  // integraciones están configuradas (eso era información útil para un
  // atacante). Solo indica si el servicio y la BD responden.
  const checks = {
    timestamp: new Date().toISOString(),
    status: "ok",
    database: "unknown",
  };

  // Test database connection
  try {
    await db.$queryRaw`SELECT 1`;
    checks.database = "connected";
  } catch (error) {
    checks.database = "error";
    checks.status = "error";
    console.error("Database connection failed:", error);
  }

  return NextResponse.json(checks, {
    status: checks.status === "ok" ? 200 : 503,
  });
}
