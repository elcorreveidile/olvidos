/**
 * Vuelca al libro de contabilidad los pagos de Stripe ya existentes (Payment)
 * que aún no tengan apunte. Idempotente. Uso:
 *   npx tsx scripts/backfill-ledger.ts
 */
import { db } from "../src/lib/db";
import { recordPaymentInLedger } from "../src/lib/ledger";

async function main() {
  const payments = await db.payment.findMany({
    where: { status: "COMPLETED", ledgerEntry: null },
  });
  console.log(`Pagos COMPLETED sin apunte: ${payments.length}`);
  for (const p of payments) {
    await recordPaymentInLedger(p);
    console.log(`✓ ${p.id} · ${p.amount} ${p.currency} · ${p.type}`);
  }
  console.log("Hecho.");
}

main().finally(() => db.$disconnect());
