import { Logo } from "@/components/layout/Logo";
import { CERTIFICATE_SIGNER, ORGANIZATION, PUBLICATION_TITLE, SITE_URL } from "@/lib/site";

/**
 * Certificado de publicación de un artículo («informe del organismo emisor»),
 * pensado para imprimir o guardar en PDF desde el panel. Sigue el modelo que
 * piden los baremos de la Junta de Andalucía para publicaciones electrónicas:
 * base de datos bibliográfica, título, autores, año y URL.
 *
 * La base de datos que se certifica es el Registro Internacional del ISSN
 * (ISSN Portal), donde la revista tiene ficha confirmada. La revista NO está en
 * Dialnet ni en Latindex: no se afirma nada que no se pueda comprobar.
 */
export interface CertificadoArticulo {
  title: string;
  authors: string[];
  publishedAt: Date;
  section?: string | null;
  slug: string;
  /** Número de la revista impresa al que pertenece, si procede. */
  issue?: { number: number; title: string } | null;
}

const DATE_LONG = new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "long", year: "numeric" });

/** Nombres en texto: «A», «A y B», «A, B y C». */
function listaNombres(nombres: string[]) {
  if (nombres.length <= 1) return nombres[0] ?? "";
  return `${nombres.slice(0, -1).join(", ")} y ${nombres[nombres.length - 1]}`;
}

export function CertificadoPublicacion({
  article,
  issuedAt = new Date(),
}: {
  article: CertificadoArticulo;
  issuedAt?: Date;
}) {
  const url = `${SITE_URL}/articulos/${article.slug}`;
  const autores = listaNombres(article.authors);
  const plural = article.authors.length > 1;
  const year = article.publishedAt.getFullYear();

  return (
    <div className="mx-auto max-w-3xl bg-white font-editorial text-[11pt] leading-relaxed text-tinta print:max-w-none">
      {/* Membrete */}
      <header className="mb-6 flex items-end justify-between gap-6 border-b-2 border-tinta pb-3">
        <div>
          <div className="text-[2rem]">
            <Logo />
          </div>
          <p className="mt-1 font-sans text-xs text-acero">
            Olvidos de Granada · Revista de acciones culturales · ISSN {ORGANIZATION.issn}
          </p>
        </div>
        <address className="text-right font-sans text-[0.68rem] not-italic leading-snug text-acero">
          <strong className="text-tinta">{ORGANIZATION.name}</strong>
          <br />
          CIF {ORGANIZATION.cif} · {ORGANIZATION.registro}
          <br />
          {ORGANIZATION.address}
          <br />
          {ORGANIZATION.email} · www.olvidos.es
        </address>
      </header>

      <h1 className="font-sans text-xl font-black uppercase tracking-[0.12em] text-tinta">
        Certificado de publicación
      </h1>
      <p className="mb-5 font-sans text-xs uppercase tracking-wider text-acero">
        Informe del organismo emisor sobre publicación en formato electrónico
      </p>

      <p className="mb-3 text-justify">
        D. <strong>{CERTIFICATE_SIGNER.name}</strong>, coordinador de la revista <em>Olvidos de Granada</em> y
        vicepresidente de la <strong>{ORGANIZATION.name}</strong> (CIF {ORGANIZATION.cif}, inscrita en el{" "}
        {ORGANIZATION.registro}), entidad editora de la publicación,
      </p>

      <p className="my-3 font-sans font-bold tracking-[0.14em]">CERTIFICA:</p>

      <ol className="mb-4 space-y-2">
        <li className="flex gap-3 text-justify">
          <span className="w-7 shrink-0 font-bold text-coral">I.</span>
          <span>
            <em>{PUBLICATION_TITLE}</em> es una publicación periódica que se edita
            {article.issue ? " en formato electrónico" : " exclusivamente en formato electrónico"} en la
            dirección <strong>www.olvidos.es</strong>, con el <strong>ISSN {ORGANIZATION.issn}</strong>, asignado por
            el Centro Nacional Español del ISSN (Biblioteca Nacional de España). La publicación figura, con
            registro confirmado y título clave «Olvidos.es», en el <strong>Registro Internacional del ISSN</strong>{" "}
            (ISSN Portal, Centro Internacional del ISSN, París), consultable en{" "}
            <a href={ORGANIZATION.issnRegisterUrl} className="underline">
              {ORGANIZATION.issnRegisterUrl}
            </a>
            .
          </span>
        </li>
        <li className="flex gap-3 text-justify">
          <span className="w-7 shrink-0 font-bold text-coral">II.</span>
          <span>
            En dicha publicación apareció{article.section ? <>, en la sección <em>{article.section}</em>,</> : null} el
            artículo titulado <strong>«{article.title}»</strong>, {plural ? "cuyos autores son" : "cuyo autor es"}{" "}
            <strong>{autores}</strong>.
            {article.issue ? (
              <>
                {" "}
                El artículo forma parte del número {article.issue.number} de la revista ({article.issue.title}).
              </>
            ) : null}{" "}
            El artículo fue aceptado por el equipo editorial de la revista y publicado el{" "}
            <strong>{DATE_LONG.format(article.publishedAt)}</strong>, en acceso abierto, en la dirección permanente
            que se indica más abajo, donde continúa accesible.
          </span>
        </li>
        <li className="flex gap-3 text-justify">
          <span className="w-7 shrink-0 font-bold text-coral">III.</span>
          <span>
            {plural ? "Los autores del artículo no son editores" : "El autor del artículo no es editor"} de la
            publicación ni {plural ? "forman" : "forma"} parte del equipo de redacción de la revista.
          </span>
        </li>
      </ol>

      <table className="mb-4 w-full border-collapse font-sans text-[0.8rem]">
        <tbody>
          {[
            [
              "Base de datos",
              `Registro Internacional del ISSN (ISSN Portal) · registro ISSN ${ORGANIZATION.issn} · ${ORGANIZATION.issnRegisterUrl}`,
            ],
            ["Publicación", `${PUBLICATION_TITLE} (www.olvidos.es) · ISSN ${ORGANIZATION.issn} · edita ${ORGANIZATION.name}`],
            ["Título del artículo", article.title],
            [plural ? "Autores" : "Autor", article.authors.join("; ")],
            ["Año de publicación", `${year} (${DATE_LONG.format(article.publishedAt)})`],
            ["URL", url],
          ].map(([k, v]) => (
            <tr key={k} className="border-t border-acero-light/60 last:border-b">
              <th className="w-[30%] py-1.5 pr-3 text-left align-top text-[0.66rem] font-bold uppercase tracking-wider text-acero">
                {k}
              </th>
              <td className="break-all py-1.5 align-top">{v}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="mb-6 text-justify">
        Y para que conste, a petición {plural ? "de los interesados" : "del interesado"} y a los efectos que
        procedan, expido el presente certificado en Granada, a {DATE_LONG.format(issuedAt)}.
      </p>

      <div className="w-1/2">
        <div className="h-14 border-b border-tinta" />
        <p className="mt-1 font-bold">{CERTIFICATE_SIGNER.name}</p>
        <p className="font-sans text-xs leading-snug text-acero">
          {CERTIFICATE_SIGNER.roles.map((r) => (
            <span key={r} className="block">
              {r}
            </span>
          ))}
        </p>
      </div>

      <footer className="mt-8 border-t border-acero-light/60 pt-2 font-sans text-[0.62rem] leading-snug text-acero">
        {ORGANIZATION.name} · CIF {ORGANIZATION.cif} · {ORGANIZATION.address} · {ORGANIZATION.email} · www.olvidos.es ·
        ISSN {ORGANIZATION.issn}. Los datos del artículo pueden comprobarse en la URL indicada; los del registro
        ISSN, en el ISSN Portal.
      </footer>
    </div>
  );
}
