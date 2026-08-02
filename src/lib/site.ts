/** Configuración central del sitio para SEO, sitemap, Open Graph, etc. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://olvidos.es"
).replace(/\/$/, "");

export const SITE_NAME = "Olvidos de Granada";
export const SITE_TAGLINE = "Revista de acciones culturales";
export const SITE_DESCRIPTION =
  "Olvidos de Granada, revista de acciones culturales editada por la Asociación Cultural Olvidos de Granada. Literatura, pensamiento y memoria cultural granadina desde 1981.";

/** Datos de la organización para JSON-LD. */
export const ORGANIZATION = {
  name: "Asociación Cultural Olvidos de Granada",
  url: SITE_URL,
  email: "olvidosdegranada@gmail.com",
  address: "C/ Carmen, 51, 18198 Granada, España",
  issn: "2605-4515",
};
