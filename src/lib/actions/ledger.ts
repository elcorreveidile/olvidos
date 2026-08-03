"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import type { LedgerKind } from "@prisma/client";
import { LEDGER_CATEGORIES } from "@/lib/ledger";

type ActionResult = { success: true } | { success: false; error: string };

async function requireAdmin() {
  const session = await auth();
  const role = session?.user?.role;
  if (role === "ADMIN" || role === "MEMBER_ADMIN") {
    return session!.user;
  }
  return null;
}

/** Convierte "1.234,56" / "1234.56" / "120" a número. null si no es válido. */
function parseAmount(raw: string): number | null {
  const cleaned = raw
    .trim()
    .replace(/\s|€/g, "")
    .replace(/\.(?=\d{3}(\D|$))/g, "") // separador de miles
    .replace(",", ".");
  const n = Number(cleaned);
  if (!Number.isFinite(n) || n <= 0) return null;
  return Math.round(n * 100) / 100;
}

function isValidCategory(kind: LedgerKind, category: string): boolean {
  return LEDGER_CATEGORIES[kind].includes(category) || category === "Otros";
}

/** Crea un apunte manual (gasto u otro ingreso). Solo admin. */
export async function createLedgerEntry(formData: FormData): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!admin) return { success: false, error: "No autorizado." };

  const kind = String(formData.get("kind") ?? "") as LedgerKind;
  const category = String(formData.get("category") ?? "").trim();
  const concept = String(formData.get("concept") ?? "").trim();
  const dateRaw = String(formData.get("date") ?? "").trim();
  const amountRaw = String(formData.get("amount") ?? "");
  const notes = String(formData.get("notes") ?? "").trim();

  if (kind !== "INGRESO" && kind !== "GASTO") {
    return { success: false, error: "Tipo no válido." };
  }
  if (!isValidCategory(kind, category)) {
    return { success: false, error: "Categoría no válida." };
  }
  if (concept.length < 2) return { success: false, error: "Indica un concepto." };
  const date = dateRaw ? new Date(dateRaw + "T00:00:00") : null;
  if (!date || Number.isNaN(date.getTime())) {
    return { success: false, error: "Fecha no válida." };
  }
  const amount = parseAmount(amountRaw);
  if (amount === null) return { success: false, error: "Importe no válido." };

  try {
    await db.ledgerEntry.create({
      data: {
        date,
        kind,
        category,
        concept,
        amount,
        source: "MANUAL",
        notes: notes || null,
        createdById: admin.id,
      },
    });
    revalidatePath("/admin/contabilidad");
    return { success: true };
  } catch (error) {
    console.error("[ledger] create error:", error);
    return { success: false, error: "No se pudo guardar el apunte." };
  }
}

/** Variante para useFormState. */
export async function createLedgerEntryAction(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  return createLedgerEntry(formData);
}

/** Borra un apunte MANUAL (los automáticos de Stripe no se borran aquí). */
export async function deleteLedgerEntry(id: string): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!admin) return { success: false, error: "No autorizado." };

  const entry = await db.ledgerEntry.findUnique({ where: { id } });
  if (!entry) return { success: false, error: "Apunte no encontrado." };
  if (entry.source === "STRIPE") {
    return {
      success: false,
      error: "Los ingresos automáticos de Stripe no se borran desde el libro.",
    };
  }

  try {
    await db.ledgerEntry.delete({ where: { id } });
    revalidatePath("/admin/contabilidad");
    return { success: true };
  } catch (error) {
    console.error("[ledger] delete error:", error);
    return { success: false, error: "No se pudo borrar el apunte." };
  }
}
