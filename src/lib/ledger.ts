import { db } from "@/lib/db";
import type { Payment } from "@prisma/client";

/**
 * Libro de contabilidad de la asociación.
 *
 * Los ingresos de cuotas por Stripe se anotan automáticamente (helper
 * `recordPaymentInLedger`, llamado desde el webhook). Gastos y otros ingresos
 * se introducen a mano desde el panel admin.
 */

// Categorías predefinidas por tipo (para los formularios). Se guardan como
// texto libre en LedgerEntry.category, así que se pueden ampliar sin migración.
export const LEDGER_CATEGORIES: { INGRESO: string[]; GASTO: string[] } = {
  INGRESO: [
    "Cuotas de socios",
    "Donativos",
    "Subvenciones",
    "Venta de revistas",
    "Otros ingresos",
  ],
  GASTO: [
    "Imprenta y edición",
    "Web y hosting",
    "Actos y encuentros",
    "Correos y envíos",
    "Comisiones bancarias",
    "Material y oficina",
    "Otros gastos",
  ],
};

/** Categoría de ingreso deducida del tipo de pago de Stripe. */
function categoryForPayment(type: Payment["type"]): string {
  switch (type) {
    case "MEMBERSHIP_FEE":
      return "Cuotas de socios";
    case "DONATION":
      return "Donativos";
    default:
      return "Otros ingresos";
  }
}

/**
 * Anota un pago de Stripe (ya guardado como Payment) en el libro como INGRESO.
 * Idempotente: si ya hay un apunte para ese paymentId, no hace nada.
 */
export async function recordPaymentInLedger(payment: Payment): Promise<void> {
  const existing = await db.ledgerEntry.findUnique({
    where: { paymentId: payment.id },
    select: { id: true },
  });
  if (existing) return;

  await db.ledgerEntry.create({
    data: {
      date: payment.paidAt ?? payment.createdAt,
      kind: "INGRESO",
      category: categoryForPayment(payment.type),
      concept: payment.description ?? "Cuota de socio (Stripe)",
      amount: payment.amount,
      currency: payment.currency,
      source: "STRIPE",
      paymentId: payment.id,
      memberId: payment.memberId,
    },
  });
}
