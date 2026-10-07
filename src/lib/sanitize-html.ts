import sanitizeHtml from "sanitize-html";

/**
 * Limpieza del HTML que llega del editor (Tiptap) o de contenido importado
 * antes de guardarlo en la base de datos. Se pinta con
 * `dangerouslySetInnerHTML`, así que todo lo que no esté en esta lista blanca
 * se descarta: scripts, manejadores `on*`, URL `javascript:`, formularios…
 *
 * Conserva lo que usan los artículos: encabezados, listas, citas, tablas,
 * `figure`/`figcaption`, imágenes, vídeo y audio, iframes de los visores
 * (YouTube, Vimeo, FlowPaper, Maps…) y los **marcadores en comentario** de
 * las piezas y los especiales Con-textos (`<!--nextpage-->`, `<!--isla:…-->`,
 * `<!--paso:…-->`), que el sanitizador borraría: se protegen antes y se
 * restauran después.
 *
 * `scripts/sanitize-dry-run.ts` compara el resultado con lo guardado sin
 * escribir nada; úsalo antes de cambiar esta lista.
 */

const MARKER_RE = /<!--\s*(?:nextpage|isla:|paso:)[\s\S]*?-->/gi;
const MARKER_TAG = "olv-marker";
const MARKER_ATTR = "data-olv";

/** Hosts desde los que se admiten iframes (visores embebidos). */
export const ALLOWED_IFRAME_HOSTS = [
  "www.youtube.com",
  "youtube.com",
  "www.youtube-nocookie.com",
  "player.vimeo.com",
  "flowpaper.com",
  "www.flowpaper.com",
  "online.flowpaper.com",
  "secure-embed.rtve.es",
  "www.google.com",
  "maps.google.com",
  "open.spotify.com",
  "w.soundcloud.com",
  "archive.org",
  "www.ivoox.com",
  "e.issuu.com",
  "www.olvidos.es",
  "olvidos.es",
  "29n.olvidos.es",
];

// `role`, `tabindex` y `aria-*` vienen de las galerías y notas importadas de
// WordPress; `width`/`height`/`align` de la maquetación de los números antiguos.
const GLOBAL_ATTRS = [
  "class", "id", "style", "title", "lang", "dir", "data-*",
  "role", "tabindex", "aria-*", "width", "height", "align",
];

export const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "h1", "h2", "h3", "h4", "h5", "h6",
    "p", "br", "hr", "wbr",
    "blockquote", "q", "cite", "pre", "code", "kbd", "samp", "var",
    "strong", "em", "b", "i", "u", "s", "del", "ins", "mark", "small", "sup", "sub",
    "abbr", "dfn", "time", "address", "span",
    "a",
    "ul", "ol", "li", "dl", "dt", "dd",
    "table", "caption", "colgroup", "col", "thead", "tbody", "tfoot", "tr", "th", "td",
    "img", "picture", "source", "figure", "figcaption",
    "video", "audio", "iframe",
    "div", "section", "aside", "article", "header", "footer", "nav", "main",
    "details", "summary",
    MARKER_TAG,
  ],
  allowedAttributes: {
    "*": GLOBAL_ATTRS,
    a: ["href", "name", "target", "rel", "download", "hreflang", "type"],
    img: ["src", "srcset", "sizes", "alt", "width", "height", "loading", "decoding", "border"],
    source: ["src", "srcset", "sizes", "type", "media"],
    iframe: ["src", "name", "width", "height", "allow", "allowfullscreen", "frameborder", "border", "loading", "referrerpolicy", "scrolling"],
    video: ["src", "poster", "controls", "loop", "muted", "playsinline", "preload", "width", "height"],
    audio: ["src", "controls", "loop", "muted", "preload"],
    time: ["datetime"],
    table: ["border", "cellpadding", "cellspacing", "bgcolor", "summary"],
    tr: ["valign", "bgcolor"],
    td: ["colspan", "rowspan", "headers", "valign", "bgcolor", "nowrap"],
    th: ["colspan", "rowspan", "headers", "scope", "abbr", "valign", "bgcolor", "nowrap"],
    col: ["span"],
    colgroup: ["span"],
    ol: ["start", "reversed", "type"],
    ul: ["type"],
    li: ["value", "type"],
    details: ["open"],
    blockquote: ["cite"],
    q: ["cite"],
    [MARKER_TAG]: [MARKER_ATTR],
  },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  allowedSchemesByTag: {
    img: ["http", "https", "data"],
    source: ["http", "https", "data"],
  },
  allowedSchemesAppliedToAttributes: ["href", "src", "srcset", "poster", "cite"],
  allowProtocolRelative: true,
  allowedIframeHostnames: ALLOWED_IFRAME_HOSTS,
  allowIframeRelativeUrls: false,
  // Un iframe de un host no permitido se queda sin `src`; lo quitamos entero.
  exclusiveFilter: (frame) => frame.tag === "iframe" && !frame.attribs.src,
  // Un enlace con target=_blank sin rel permite «tabnabbing»; lo añadimos.
  transformTags: {
    a: (tagName, attribs) => {
      if (attribs.target === "_blank") {
        const rel = new Set((attribs.rel ?? "").split(/\s+/).filter(Boolean));
        rel.add("noopener");
        rel.add("noreferrer");
        attribs.rel = Array.from(rel).join(" ");
      }
      return { tagName, attribs };
    },
  },
};

function protectMarkers(html: string): string {
  return html.replace(MARKER_RE, (m) => {
    const encoded = Buffer.from(m, "utf8").toString("base64");
    return `<${MARKER_TAG} ${MARKER_ATTR}="${encoded}"></${MARKER_TAG}>`;
  });
}

function restoreMarkers(html: string): string {
  const re = new RegExp(
    `<${MARKER_TAG}\\s+${MARKER_ATTR}="([A-Za-z0-9+/=]*)"\\s*>\\s*</${MARKER_TAG}>`,
    "g"
  );
  return html.replace(re, (_m, encoded: string) =>
    Buffer.from(encoded, "base64").toString("utf8")
  );
}

/**
 * Vacía el contenido de respaldo de los iframes («Your browser does not seem to
 * support iframes. <a>Click here</a>», típico de FlowPaper): los navegadores lo
 * ignoran y el sanitizador lo convertiría en texto escapado visible.
 */
function stripIframeFallback(html: string): string {
  return html.replace(/(<iframe\b[^>]*>)[\s\S]*?(<\/iframe\s*>)/gi, "$1$2");
}

/** HTML de un artículo (o de la descripción de una actividad) listo para guardar. */
export function sanitizeArticleHtml(html: string | null | undefined): string {
  if (!html) return "";
  return restoreMarkers(
    sanitizeHtml(protectMarkers(stripIframeFallback(html)), SANITIZE_OPTIONS)
  );
}
