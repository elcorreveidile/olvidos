import Link from "next/link";
import { redirect } from "next/navigation";
import { ClipboardCheck } from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DECISION_LABEL, laBandaConfigurada, listarManuscritos, type ManuscritoResumen, type Seccion } from "@/lib/la-banda";
import { enviarArticuloARedaccion } from "@/lib/actions/redaccion";

export const dynamic = "force-dynamic";
export const metadata = { title: "Redacción" };

const ERRORES: Record<string, string> = {
  "faltan-datos": "Elige un artículo y una sección.",
  articulo: "No se encontró el artículo.",
  "texto-corto": "El artículo está vacío o es demasiado corto.",
  "la-banda": "La Banda no respondió. Inténtalo en un momento.",
};

const DECISION_COLOR: Record<string, string> = {
  publicable: "text-green-700",
  con_cambios: "text-amber-700",
  rechazado: "text-red-700",
};

export default async function AdminRedaccionPage({ searchParams }: { searchParams: { error?: string } }) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "EDITOR" && session.user.role !== "ADMIN") redirect("/admin");

  const configurada = laBandaConfigurada();
  let secciones: Seccion[] = [];
  let manuscritos: ManuscritoResumen[] = [];
  let fallo: string | null = null;
  if (configurada) {
    try {
      const r = await listarManuscritos();
      secciones = r.secciones;
      manuscritos = r.manuscritos;
    } catch (err) {
      fallo = err instanceof Error ? err.message : String(err);
    }
  }

  const articulos = await db.article.findMany({
    where: { status: { in: ["DRAFT", "REVIEW"] } },
    select: { id: true, title: true, status: true, byline: true },
    orderBy: { updatedAt: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Redacción</h1>
        <p className="mt-1 text-gray-600">
          Diez agentes leen el texto y devuelven un informe con objeciones numeradas y un veredicto. Señalan, no corrigen: nunca sale una versión reescrita.
        </p>
      </div>

      {!configurada && (
        <div className="rounded border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800">
          La Banda no está configurada: faltan <code>LA_BANDA_URL</code> y <code>LA_BANDA_API_KEY</code>.
        </div>
      )}
      {fallo && <div className="rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700">No se pudo hablar con La Banda: {fallo}</div>}
      {searchParams.error && <div className="rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700">{ERRORES[searchParams.error] ?? "Algo falló."}</div>}

      <Card>
        <CardHeader>
          <CardTitle>Enviar un artículo a redacción</CardTitle>
          <CardDescription>Solo borradores y artículos en revisión. Se envía el texto; el informe tarda unos minutos.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={enviarArticuloARedaccion} className="grid gap-3 sm:grid-cols-[1fr_16rem_auto]">
            <select name="articleId" required defaultValue="" className="rounded border border-gray-300 px-3 py-2" disabled={!configurada}>
              <option value="" disabled>
                Artículo
              </option>
              {articulos.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.title}
                  {a.byline ? ` — ${a.byline}` : ""} ({a.status === "DRAFT" ? "borrador" : "en revisión"})
                </option>
              ))}
            </select>
            <select name="section" required defaultValue="" className="rounded border border-gray-300 px-3 py-2" disabled={!configurada}>
              <option value="" disabled>
                Sección de destino
              </option>
              {secciones.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.name}
                </option>
              ))}
            </select>
            <button type="submit" disabled={!configurada} className="rounded bg-coral px-4 py-2 font-bold text-white hover:bg-coral/90 disabled:opacity-50">
              Enviar
            </button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informes ({manuscritos.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {manuscritos.length === 0 ? (
            <p className="py-6 text-center text-gray-500">Aún no se ha enviado ningún texto.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {manuscritos.map((m) => (
                <li key={m.id} className="flex items-center gap-3 py-3">
                  <ClipboardCheck className="h-5 w-5 shrink-0 text-coral" />
                  <div className="min-w-0 flex-1">
                    <Link href={`/admin/redaccion/${m.id}`} className="block truncate font-medium text-gray-900 hover:text-coral">
                      {m.title}
                    </Link>
                    <p className="truncate text-xs text-gray-500">
                      {m.byline ? `${m.byline} · ` : ""}
                      {secciones.find((s) => s.key === m.section)?.name ?? m.section} · v{m.version.number} · {m.version.wordCount} palabras ·{" "}
                      {new Date(m.createdAt).toLocaleString("es-ES", { hour12: false })}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500">{m.objections} objeciones</span>
                  <span className={`text-sm font-bold ${DECISION_COLOR[m.version.decision ?? ""] ?? "text-gray-500"}`}>
                    {m.version.decision ? DECISION_LABEL[m.version.decision] ?? m.version.decision : "en curso"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
