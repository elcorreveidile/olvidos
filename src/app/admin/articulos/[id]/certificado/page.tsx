import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getArticle } from "@/lib/actions/articles";
import { hasPasos, splitPasos } from "@/lib/pasos";
import pasosTitles from "@/data/pasos-titles.json";
import { PrintButton } from "@/components/admin/PrintButton";
import { CertificadoPublicacion } from "@/components/admin/CertificadoPublicacion";

export const dynamic = "force-dynamic";

/**
 * Certificado de publicación de un artículo, para autores que lo necesitan en
 * oposiciones o baremos (p. ej. acceso a cátedras de Secundaria). Solo quienes
 * publican (ADMIN y EDITOR) pueden expedirlo, y solo de artículos publicados.
 *
 * En las piezas por pasos (números digitales de Memoria de Olvidos, Piezas y
 * Procesos) cada paso suele ser el texto de una persona distinta: el
 * formulario permite elegir el paso y a nombre de quién se expide
 * (`?paso=N&autor=Nombre completo&firma=Nombre en la web`).
 */
export default async function CertificadoArticuloPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: { paso?: string; autor?: string; firma?: string };
}) {
  const session = await auth();
  const role = session?.user?.role;
  if (role !== "ADMIN" && role !== "EDITOR") redirect("/admin");

  const result = await getArticle(params.id);
  const article = result.success ? result.article : null;

  const articleAuthors: string[] =
    article?.authors && article.authors.length > 0
      ? article.authors.map((a: any) => a.author.name as string)
      : article?.byline
        ? [article.byline]
        : [];
  const section = article?.categories?.[0]?.category?.name ?? article?.section ?? null;

  // Pasos de la pieza (si los hay) y el elegido en el formulario.
  const pieza = article ? hasPasos(article) : false;
  const pasos = pieza
    ? splitPasos(article!.content, (pasosTitles as Record<string, string[]>)[article!.slug])
    : [];
  const pasoN = pieza ? Number(searchParams?.paso) || 0 : 0;
  const paso = pasoN >= 1 && pasoN <= pasos.length ? pasos[pasoN - 1] : null;

  // A nombre de quién: nombre completo escrito a mano, o la firma elegida.
  const firma = (searchParams?.firma ?? "").trim();
  const autorLibre = (searchParams?.autor ?? "").trim();
  const authors = autorLibre ? [autorLibre] : firma ? [firma] : articleAuthors;

  const certificable = Boolean(article && article.status === "PUBLISHED" && article.publishedAt && authors.length > 0);

  return (
    <div className="mx-auto max-w-4xl p-8 print:p-0">
      <div className="mb-6 flex items-center justify-between gap-4 print:hidden">
        <Link href="/admin/articulos" className="text-sm font-bold text-coral hover:text-coral-dark">
          ← Volver a artículos
        </Link>
        {certificable && <PrintButton />}
      </div>

      {!article ? (
        <p className="rounded-sm border border-acero-light/50 p-4 text-sm text-acero">Artículo no encontrado.</p>
      ) : !certificable ? (
        <div className="rounded-sm border border-coral/30 bg-coral/10 p-4 text-sm text-tinta">
          <p className="font-bold">No se puede expedir el certificado de «{article.title}».</p>
          <p className="mt-1">
            Solo se certifican artículos <strong>publicados</strong>, con fecha de publicación y con al menos un
            autor (en «Autores» o en la firma del artículo).{" "}
            <Link href={`/admin/articulos/${article.id}/editar`} className="font-bold text-coral underline">
              Editar el artículo
            </Link>
            .
          </p>
        </div>
      ) : (
        <>
          <div className="mb-6 space-y-4 text-sm text-acero print:hidden">
            <p>
              Imprímelo o guárdalo en PDF, fírmalo y envíaselo a quien lo pide. El texto certifica que la revista
              figura en el Registro Internacional del ISSN; la revista no está en Dialnet ni en Latindex, así que no
              lo afirma.
            </p>

            {pieza && (
              <form
                method="get"
                className="grid grid-cols-1 gap-3 rounded-sm border border-acero-light/50 bg-tinta/[0.02] p-4 sm:grid-cols-2"
              >
                <label className="block sm:col-span-2">
                  <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-acero">Paso</span>
                  <select
                    name="paso"
                    defaultValue={paso ? String(pasoN) : ""}
                    className="w-full rounded-sm border border-acero-light/60 px-3 py-2 text-tinta"
                  >
                    <option value="">Toda la pieza ({pasos.length} pasos)</option>
                    {pasos.map((p, i) => (
                      <option key={p.id} value={i + 1}>
                        {i + 1}. {p.title}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-acero">
                    Firma en la web
                  </span>
                  <select
                    name="firma"
                    defaultValue={firma}
                    className="w-full rounded-sm border border-acero-light/60 px-3 py-2 text-tinta"
                  >
                    <option value="">Todas las firmas de la pieza</option>
                    {articleAuthors.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-acero">
                    Nombre completo (como debe constar)
                  </span>
                  <input
                    type="text"
                    name="autor"
                    defaultValue={autorLibre}
                    placeholder="Si se deja vacío, se usa la firma"
                    className="w-full rounded-sm border border-acero-light/60 px-3 py-2 text-tinta"
                  />
                </label>
                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    className="rounded-sm border border-coral px-4 py-2 text-sm font-bold text-coral transition-colors hover:bg-coral/10"
                  >
                    Generar certificado
                  </button>
                </div>
              </form>
            )}
          </div>

          <CertificadoPublicacion
            article={{
              title: paso ? paso.title : article!.title,
              authors,
              signedAs: autorLibre && firma ? firma : null,
              publishedAt: new Date(article!.publishedAt!),
              section,
              slug: article!.slug,
              issue: article!.issue ? { number: article!.issue.number, title: article!.issue.title } : null,
              parent: paso ? { title: article!.title, paso: pasoN } : null,
            }}
          />
        </>
      )}
    </div>
  );
}
