import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { auth } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DECISION_LABEL, laBandaConfigurada, obtenerInforme } from "@/lib/la-banda";

export const dynamic = "force-dynamic";
export const metadata = { title: "Informe de redacción" };

const DECISION_COLOR: Record<string, string> = {
  publicable: "text-green-700",
  con_cambios: "text-amber-700",
  rechazado: "text-red-700",
};

export default async function InformeRedaccionPage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "EDITOR" && session.user.role !== "ADMIN") redirect("/admin");
  if (!laBandaConfigurada()) redirect("/admin/redaccion");

  const informe = await obtenerInforme(params.id);
  if (!informe) notFound();
  const v = informe.versions[informe.versions.length - 1];
  const report = v?.session?.finalReport ?? null;
  const enCurso = v?.session?.status === "open";
  const veredicto = report?.veredicto ?? v?.decision ?? null;
  const slug = informe.sourceName?.startsWith("articulo:") ? informe.sourceName.slice("articulo:".length) : null;

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/redaccion" className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-coral">
          <ArrowLeft className="h-4 w-4" /> Redacción
        </Link>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">{informe.title}</h1>
        <p className="mt-1 text-gray-600">
          {informe.byline ? `${informe.byline} · ` : ""}
          sección {informe.section} · v{v?.number ?? 1} · {v?.wordCount ?? 0} palabras
          {slug && (
            <>
              {" · "}
              <Link href={`/admin/articulos?search=${encodeURIComponent(informe.title)}`} className="underline hover:text-coral">
                ver artículo
              </Link>
            </>
          )}
        </p>
      </div>

      {enCurso && (
        <div className="rounded border border-blue-200 bg-blue-50 px-4 py-3 text-blue-800">
          Los agentes siguen trabajando. Recarga en un par de minutos.
        </div>
      )}
      {v?.session?.status === "failed" && <div className="rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700">La sesión se detuvo por un error del motor. Vuelve a enviar el texto.</div>}
      {v?.session?.status === "vetoed" && (
        <div className="rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          El proceso no pudo continuar: {report?.reason ?? "sin motivo"}.
        </div>
      )}

      {veredicto && (
        <Card>
          <CardHeader>
            <CardTitle className={DECISION_COLOR[veredicto] ?? ""}>{DECISION_LABEL[veredicto] ?? veredicto}</CardTitle>
            {report?.tesis && <CardDescription>Tesis: {report.tesis}</CardDescription>}
          </CardHeader>
          {report?.informe && (
            <CardContent>
              <p className="whitespace-pre-line font-editorial text-lg leading-snug text-gray-800">{report.informe}</p>
              <p className="mt-3 text-xs text-gray-500">
                {report.objecionesMayores ?? 0} objeciones mayores · {report.objecionesMenores ?? 0} menores · {report.devoluciones ?? 0} devoluciones de Lisboa
              </p>
            </CardContent>
          )}
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Objeciones ({v?.objections.length ?? 0})</CardTitle>
          <CardDescription>Numeradas por gravedad y párrafo. Señalan dónde y por qué; el autor decide.</CardDescription>
        </CardHeader>
        <CardContent>
          {!v || v.objections.length === 0 ? (
            <p className="py-6 text-center text-gray-500">{enCurso ? "Todavía sin objeciones registradas." : "Sin objeciones."}</p>
          ) : (
            <ol className="space-y-2">
              {v.objections.map((o) => (
                <li key={o.number} className="grid grid-cols-[2rem_5rem_6rem_1fr] gap-2 text-sm">
                  <span className="text-gray-500">{o.number}.</span>
                  <span className={`font-bold ${o.severity === "mayor" ? "text-red-700" : "text-amber-700"}`}>{o.severity}</span>
                  <span className="text-gray-700">{o.agent}</span>
                  <span>
                    {o.location && <span className="text-gray-500">{o.location} · </span>}
                    {o.text}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </CardContent>
      </Card>

      {informe.versions.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Versiones</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-gray-100 text-sm">
              {informe.versions.map((ver) => (
                <li key={ver.id} className="flex gap-4 py-2">
                  <span>v{ver.number}</span>
                  <span className="text-gray-500">{ver.wordCount} palabras</span>
                  <span className={DECISION_COLOR[ver.decision ?? ""] ?? "text-gray-500"}>{ver.decision ? DECISION_LABEL[ver.decision] ?? ver.decision : "—"}</span>
                  <span className="text-gray-500">{new Date(ver.createdAt).toLocaleString("es-ES", { hour12: false })}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
