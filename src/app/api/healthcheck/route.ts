import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const checks = {
    timestamp: new Date().toISOString(),
    database: "unknown",
    envVars: {
      databaseUrl: !!process.env.DATABASE_URL,
      nextAuthSecret: !!process.env.NEXTAUTH_SECRET,
      githubId: !!process.env.AUTH_GITHUB_ID,
      githubSecret: !!process.env.AUTH_GITHUB_SECRET,
      stripeKey: !!process.env.STRIPE_SECRET_KEY,
    },
  };

  // Test database connection
  try {
    await db.$queryRaw`SELECT 1`;
    checks.database = "connected";
  } catch (error) {
    checks.database = "error";
    console.error("Database connection failed:", error);
  }

  return NextResponse.json(checks);
}
