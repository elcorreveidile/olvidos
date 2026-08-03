import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LedgerEntryForm } from "@/components/admin/LedgerEntryForm";
import { DeleteLedgerEntryButton } from "@/components/admin/DeleteLedgerEntryButton";

export const dynamic = "force-dynamic";

const eur = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" });
const fmtDate = (d: Date) =>
  new Date(d).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });

export default async function ContabilidadPage({
  searchParams,
}: {
  searchParams?: { year?: string };
}) {
  const session = await auth();
  const role = session?.user?.role;
  if (role !== "ADMIN" && role !== "MEMBER_ADMIN") {
    redirect("/admin");
  }

  const entries = await db.ledgerEntry.findMany({
    orderBy: [{ date: "asc" }, { createdAt: "asc" }],
  });

  // Saldo acumulado (cronológico) por apunte.
  const saldoById = new Map<string, number>();
  let running = 0;
  for (const e of entries) {
    running += e.kind === "INGRESO" ? Number(e.amount) : -Number(e.amount);
    saldoById.set(e.id, running);
  }
  const saldoTotal = running;

  // Años disponibles + filtro.
  const years = Array.from(new Set(entries.map((e) => new Date(e.date).getFullYear()))).sort(
    (a, b) => b - a
  );
  const selectedYear = searchParams?.year && searchParams.year !== "all" ? Number(searchParams.year) : null;

  const inScope = selectedYear
    ? entries.filter((e) => new Date(e.date).getFullYear() === selectedYear)
    : entries;

  const ingresos = inScope
    .filter((e) => e.kind === "INGRESO")
    .reduce((s, e) => s + Number(e.amount), 0);
  const gastos = inScope
    .filter((e) => e.kind === "GASTO")
    .reduce((s, e) => s + Number(e.amount), 0);

  // Desglose por categoría (dentro del ámbito).
  const byCategory = new Map<string, { kind: string; total: number }>();
  for (const e of inScope) {
    const key = `${e.kind}·${e.category}`;
    const prev = byCategory.get(key)?.total ?? 0;
    byCategory.set(key, { kind: e.kind, total: prev + Number(e.amount) });
  }
  const categoryRows = Array.from(byCategory.entries())
    .map(([key, v]) => ({ label: key.split("·")[1], kind: v.kind, total: v.total }))
    .sort((a, b) => b.total - a.total);

  // Mostrar más recientes primero.
  const displayed = [...inScope].reverse();
  const today = new Date();
  const defaultDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(
    today.getDate()
  ).padStart(2, "0")}`;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-tinta">Contabilidad</h1>
        <p className="mt-1 font-editorial text-tinta/70">
          Libro de ingresos y gastos. Las cuotas cobradas por Stripe se anotan solas; los gastos y
          otros ingresos se introducen aquí.
        </p>
      </div>

      {/* Filtro por año */}
      <div className="flex flex-wrap items-center gap-2">
        <Link
          href="/admin/contabilidad"
          className={`rounded-sm px-3 py-1.5 text-sm font-bold transition-colors ${
            !selectedYear ? "bg-coral text-white" : "bg-coral/10 text-coral hover:bg-coral/20"
          }`}
        >
          Todo
        </Link>
        {years.map((y) => (
          <Link
            key={y}
            href={`/admin/contabilidad?year=${y}`}
            className={`rounded-sm px-3 py-1.5 text-sm font-bold transition-colors ${
              selectedYear === y ? "bg-coral text-white" : "bg-coral/10 text-coral hover:bg-coral/20"
            }`}
          >
            {y}
          </Link>
        ))}

        {/* Exportar (respeta el año seleccionado) */}
        <div className="ml-auto flex items-center gap-2">
          <a
            href={`/api/admin/contabilidad/export${selectedYear ? `?year=${selectedYear}` : ""}`}
            className="rounded-sm border border-acero-light/60 px-3 py-1.5 text-sm font-bold text-tinta transition-colors hover:border-coral hover:text-coral"
          >
            Exportar CSV
          </a>
          <a
            href={`/admin/contabilidad/imprimir${selectedYear ? `?year=${selectedYear}` : ""}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-sm border border-acero-light/60 px-3 py-1.5 text-sm font-bold text-tinta transition-colors hover:border-coral hover:text-coral"
          >
            PDF / imprimir
          </a>
        </div>
      </div>

      {/* Totales */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-acero-light/50 bg-white p-5">
          <p className="text-sm font-medium text-tinta/60">
            Ingresos {selectedYear ? selectedYear : "(total)"}
          </p>
          <p className="mt-1 text-2xl font-black text-green-700">{eur.format(ingresos)}</p>
        </div>
        <div className="rounded-lg border border-acero-light/50 bg-white p-5">
          <p className="text-sm font-medium text-tinta/60">
            Gastos {selectedYear ? selectedYear : "(total)"}
          </p>
          <p className="mt-1 text-2xl font-black text-red-700">{eur.format(gastos)}</p>
        </div>
        <div className="rounded-lg border border-acero-light/50 bg-white p-5">
          <p className="text-sm font-medium text-tinta/60">
            {selectedYear ? `Resultado ${selectedYear}` : "Saldo actual"}
          </p>
          <p
            className={`mt-1 text-2xl font-black ${
              (selectedYear ? ingresos - gastos : saldoTotal) >= 0 ? "text-tinta" : "text-red-700"
            }`}
          >
            {eur.format(selectedYear ? ingresos - gastos : saldoTotal)}
          </p>
          {selectedYear && (
            <p className="mt-1 text-xs text-tinta/50">Saldo global: {eur.format(saldoTotal)}</p>
          )}
        </div>
      </div>

      {/* Alta manual */}
      <section className="rounded-lg border border-acero-light/50 bg-white p-6">
        <h2 className="mb-4 text-lg font-black text-tinta">Nuevo apunte</h2>
        <LedgerEntryForm defaultDate={defaultDate} />
      </section>

      {/* Desglose por categoría */}
      {categoryRows.length > 0 && (
        <section className="rounded-lg border border-acero-light/50 bg-white p-6">
          <h2 className="mb-4 text-lg font-black text-tinta">
            Por categoría {selectedYear ? `· ${selectedYear}` : ""}
          </h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {categoryRows.map((c) => (
              <li
                key={`${c.kind}-${c.label}`}
                className="flex items-center justify-between border-b border-acero-light/30 py-1.5 text-sm"
              >
                <span className="text-tinta/80">
                  <span
                    className={`mr-2 inline-block h-2 w-2 rounded-full ${
                      c.kind === "INGRESO" ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                  {c.label}
                </span>
                <span className={`font-bold ${c.kind === "INGRESO" ? "text-green-700" : "text-red-700"}`}>
                  {c.kind === "INGRESO" ? "+" : "−"}
                  {eur.format(c.total)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Libro */}
      <section className="rounded-lg border border-acero-light/50 bg-white">
        <div className="border-b border-acero-light/50 px-6 py-4">
          <h2 className="text-lg font-black text-tinta">
            Libro {selectedYear ? `· ${selectedYear}` : "· completo"}{" "}
            <span className="font-normal text-tinta/50">({displayed.length})</span>
          </h2>
        </div>
        {displayed.length === 0 ? (
          <p className="px-6 py-10 text-center text-tinta/50">
            Aún no hay apuntes{selectedYear ? " en este año" : ""}.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-acero-light/50 text-left text-xs uppercase tracking-wide text-tinta/50">
                  <th className="px-4 py-2 font-medium">Fecha</th>
                  <th className="px-4 py-2 font-medium">Concepto</th>
                  <th className="px-4 py-2 font-medium">Categoría</th>
                  <th className="px-4 py-2 text-right font-medium">Importe</th>
                  <th className="px-4 py-2 text-right font-medium">Saldo</th>
                  <th className="px-4 py-2" />
                </tr>
              </thead>
              <tbody>
                {displayed.map((e) => (
                  <tr key={e.id} className="border-b border-acero-light/30 hover:bg-gray-50">
                    <td className="whitespace-nowrap px-4 py-2.5 text-tinta/70">{fmtDate(e.date)}</td>
                    <td className="px-4 py-2.5">
                      <span className="font-medium text-tinta">{e.concept}</span>
                      {e.source === "STRIPE" && (
                        <span className="ml-2 rounded-sm bg-[#635bff]/10 px-1.5 py-0.5 text-[10px] font-bold uppercase text-[#635bff]">
                          Stripe
                        </span>
                      )}
                      {e.notes && <p className="text-xs text-tinta/50">{e.notes}</p>}
                    </td>
                    <td className="px-4 py-2.5 text-tinta/70">{e.category}</td>
                    <td
                      className={`whitespace-nowrap px-4 py-2.5 text-right font-bold ${
                        e.kind === "INGRESO" ? "text-green-700" : "text-red-700"
                      }`}
                    >
                      {e.kind === "INGRESO" ? "+" : "−"}
                      {eur.format(Number(e.amount))}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2.5 text-right text-tinta/60">
                      {eur.format(saldoById.get(e.id) ?? 0)}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      {e.source === "MANUAL" && (
                        <DeleteLedgerEntryButton id={e.id} concept={e.concept} />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
