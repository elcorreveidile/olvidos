import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getArticle } from "@/lib/actions/articles";
import { PrintButton } from "@/components/admin/PrintButton";
import { CertificadoPublicacion } from "@/components/admin/CertificadoPublicacion";

export const dynamic = "force-dynamic";

/**
 * Certificado de publicación de un artículo, para autores que lo necesitan en
 * oposiciones o baremos (p. ej. acceso a cátedras de Secundaria). Solo quienes
 * publican (ADMIN y EDITOR) pueden expedirlo, y solo de artículos publicados.
 */
export default async function CertificadoArticuloPage({ params }: { params: { id: string } }) {
  const session = await auth();
  const role = session?.user?.role;
  if (role !== "ADMIN" && role !== "EDITOR") redirect("/admin");

  const result = await getArticle(params.id);
  const article = result.success ? result.article : null;

  const authors: string[] =
    article?.authors && article.authors.length > 0
      ? article.authors.map((a: any) => a.author.name as string)
      : article?.byline
        ? [article.byline]
        : [];
  const section = article?.categories?.[0]?.category?.name ?? article?.section ?? null;
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
          <p className="mb-6 text-sm text-acero print:hidden">
            Imprímelo o guárdalo en PDF, fírmalo y envíaselo al autor. El texto certifica que la revista figura en el
            Registro Internacional del ISSN; la revista no está en Dialnet ni en Latindex, así que no lo afirma.
          </p>
          <CertificadoPublicacion
            article={{
              title: article!.title,
              authors,
              publishedAt: new Date(article!.publishedAt!),
              section,
              slug: article!.slug,
              issue: article!.issue ? { number: article!.issue.number, title: article!.issue.title } : null,
            }}
          />
        </>
      )}
    </div>
  );
}
