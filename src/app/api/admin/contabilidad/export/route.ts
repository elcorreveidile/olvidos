import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const fmt = (n: number) => n.toFixed(2).replace(".", ",");
const fmtDate = (d: Date) =>
  new Date(d).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });

// Escapa un campo para CSV (delimitador ; para Excel en español).
function cell(v: string | number): string {
  const s = String(v);
  return /[";\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/**
 * Descarga el libro de contabilidad en CSV (se abre en Excel). Solo admin.
 * Opcional ?year=YYYY para un año concreto. Incluye saldo acumulado y totales.
 */
export async function GET(req: Request) {
  const session = await auth();
  const role = session?.user?.role;
  if (role !== "ADMIN" && role !== "MEMBER_ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const url = new URL(req.url);
  const yearParam = url.searchParams.get("year");
  const year = yearParam && yearParam !== "all" ? Number(yearParam) : null;

  const entries = await db.ledgerEntry.findMany({
    orderBy: [{ date: "asc" }, { createdAt: "asc" }],
  });

  // Saldo acumulado sobre TODO el libro (cronológico).
  const saldoById = new Map<string, number>();
  let running = 0;
  for (const e of entries) {
    running += e.kind === "INGRESO" ? Number(e.amount) : -Number(e.amount);
    saldoById.set(e.id, running);
  }

  const rows = year
    ? entries.filter((e) => new Date(e.date).getFullYear() === year)
    : entries;

  const header = [
    "Fecha",
    "Tipo",
    "Categoría",
    "Concepto",
    "Importe (€)",
    "Origen",
    "Saldo (€)",
    "Notas",
  ];

  const lines: string[] = [header.map(cell).join(";")];
  let ingresos = 0;
  let gastos = 0;
  for (const e of rows) {
    const amount = Number(e.amount);
    const signed = e.kind === "INGRESO" ? amount : -amount;
    if (e.kind === "INGRESO") ingresos += amount;
    else gastos += amount;
    lines.push(
      [
        fmtDate(e.date),
        e.kind === "INGRESO" ? "Ingreso" : "Gasto",
        e.category,
        e.concept,
        fmt(signed),
        e.source === "STRIPE" ? "Stripe" : "Manual",
        fmt(saldoById.get(e.id) ?? 0),
        e.notes ?? "",
      ]
        .map(cell)
        .join(";")
    );
  }

  // Totales.
  lines.push("");
  lines.push([cell("TOTAL INGRESOS"), "", "", "", cell(fmt(ingresos))].join(";"));
  lines.push([cell("TOTAL GASTOS"), "", "", "", cell(fmt(-gastos))].join(";"));
  lines.push([cell("RESULTADO"), "", "", "", cell(fmt(ingresos - gastos))].join(";"));
  if (!year) {
    lines.push([cell("SALDO ACTUAL"), "", "", "", cell(fmt(running))].join(";"));
  }

  // BOM para que Excel muestre bien los acentos.
  const csv = "﻿" + lines.join("\r\n");
  const filename = `contabilidad-olvidos${year ? `-${year}` : ""}.csv`;

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="${filename}"`,
      "cache-control": "no-store",
    },
  });
}
