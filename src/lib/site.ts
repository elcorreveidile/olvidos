/** Configuración central del sitio para SEO, sitemap, Open Graph, etc. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.olvidos.es"
).replace(/\/$/, "");

export const SITE_NAME = "Olvidos de Granada";
export const SITE_TAGLINE = "Revista de acciones culturales";
export const SITE_DESCRIPTION =
  "Olvidos de Granada, revista de acciones culturales editada por la Asociación Cultural Olvidos de Granada. Literatura, pensamiento y memoria cultural granadina desde 1981.";

/** Título completo de la publicación, tal como se cita bibliográficamente. */
export const PUBLICATION_TITLE = "Olvidos de Granada. Revista de acciones culturales";

/** Datos de la organización para JSON-LD, certificados y pies legales. */
export const ORGANIZATION = {
  name: "Asociación Cultural Olvidos de Granada",
  url: SITE_URL,
  email: "olvidosdegranada@gmail.com",
  address: "C/ Carmen, 51, 18198 Granada, España",
  cif: "G-19648625",
  registro: "Registro de Asociaciones de Andalucía, nº 10241, Secc. 1",
  issn: "2605-4515",
  /** Ficha de la revista en el Registro Internacional del ISSN (ISSN Portal). */
  issnRegisterUrl: "https://portal.issn.org/resource/ISSN/2605-4515",
};

/** Quién firma los certificados de publicación (/admin/articulos/[id]/certificado). */
export const CERTIFICATE_SIGNER = {
  name: "Javier Benítez Láinez",
  roles: [
    "Coordinador de Olvidos de Granada",
    "Vicepresidente de la Asociación Cultural Olvidos de Granada",
  ],
};
