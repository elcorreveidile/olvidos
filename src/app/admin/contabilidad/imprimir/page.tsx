import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PrintButton } from "@/components/admin/PrintButton";

export const dynamic = "force-dynamic";

const eur = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" });
const fmtDate = (d: Date) =>
  new Date(d).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });

export default async function ContabilidadImprimirPage({
  searchParams,
}: {
  searchParams?: { year?: string };
}) {
  const session = await auth();
  const role = session?.user?.role;
  if (role !== "ADMIN" && role !== "MEMBER_ADMIN") redirect("/admin");

  const entries = await db.ledgerEntry.findMany({
    orderBy: [{ date: "asc" }, { createdAt: "asc" }],
  });

  const saldoById = new Map<string, number>();
  let running = 0;
  for (const e of entries) {
    running += e.kind === "INGRESO" ? Number(e.amount) : -Number(e.amount);
    saldoById.set(e.id, running);
  }

  const year =
    searchParams?.year && searchParams.year !== "all" ? Number(searchParams.year) : null;
  const rows = year
    ? entries.filter((e) => new Date(e.date).getFullYear() === year)
    : entries;

  const ingresos = rows
    .filter((e) => e.kind === "INGRESO")
    .reduce((s, e) => s + Number(e.amount), 0);
  const gastos = rows
    .filter((e) => e.kind === "GASTO")
    .reduce((s, e) => s + Number(e.amount), 0);

  return (
    <div className="mx-auto max-w-4xl p-8 print:p-0">
      {/* Barra de acciones (no se imprime) */}
      <div className="mb-6 flex items-center justify-between print:hidden">
        <Link
          href={`/admin/contabilidad${year ? `?year=${year}` : ""}`}
          className="text-sm font-bold text-coral hover:text-coral-dark"
        >
          ← Volver a contabilidad
        </Link>
        <PrintButton />
      </div>

      {/* Cabecera del documento */}
      <header className="mb-6 border-b-2 border-tinta pb-4">
        <h1 className="text-2xl font-black text-tinta">
          Libro de contabilidad{year ? ` · ${year}` : " · completo"}
        </h1>
        <p className="text-sm text-tinta/60">
          Asociación Cultural Olvidos de Granada · CIF G-19648625
        </p>
      </header>

      {/* Totales */}
      <div className="mb-6 grid grid-cols-3 gap-4 text-center">
        <div className="rounded border border-gray-300 p-3">
          <p className="text-xs uppercase text-tinta/50">Ingresos</p>
          <p className="text-lg font-black text-green-700">{eur.format(ingresos)}</p>
        </div>
        <div className="rounded border border-gray-300 p-3">
          <p className="text-xs uppercase text-tinta/50">Gastos</p>
          <p className="text-lg font-black text-red-700">{eur.format(gastos)}</p>
        </div>
        <div className="rounded border border-gray-300 p-3">
          <p className="text-xs uppercase text-tinta/50">
            {year ? "Resultado" : "Saldo"}
          </p>
          <p className="text-lg font-black text-tinta">
            {eur.format(year ? ingresos - gastos : running)}
          </p>
        </div>
      </div>

      {/* Tabla */}
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b-2 border-tinta text-left">
            <th className="py-1 pr-2 font-bold">Fecha</th>
            <th className="py-1 pr-2 font-bold">Concepto</th>
            <th className="py-1 pr-2 font-bold">Categoría</th>
            <th className="py-1 pr-2 text-right font-bold">Importe</th>
            <th className="py-1 text-right font-bold">Saldo</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((e) => (
            <tr key={e.id} className="border-b border-gray-200">
              <td className="whitespace-nowrap py-1 pr-2">{fmtDate(e.date)}</td>
              <td className="py-1 pr-2">
                {e.concept}
                {e.source === "STRIPE" && (
                  <span className="ml-1 text-xs text-tinta/40">(Stripe)</span>
                )}
              </td>
              <td className="py-1 pr-2 text-tinta/70">{e.category}</td>
              <td
                className={`whitespace-nowrap py-1 pr-2 text-right font-medium ${
                  e.kind === "INGRESO" ? "text-green-700" : "text-red-700"
                }`}
              >
                {e.kind === "INGRESO" ? "+" : "−"}
                {eur.format(Number(e.amount))}
              </td>
              <td className="whitespace-nowrap py-1 text-right text-tinta/70">
                {eur.format(saldoById.get(e.id) ?? 0)}
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={5} className="py-6 text-center text-tinta/50">
                Sin apuntes.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <p className="mt-8 text-xs text-tinta/40">
        Generado desde olvidos.es · {fmtDate(new Date())}
      </p>
    </div>
  );
}
