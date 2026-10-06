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
  "online.flowpaper.com",
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

const GLOBAL_ATTRS = ["class", "id", "style", "title", "lang", "dir", "data-*"];

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
    a: ["href", "name", "target", "rel", "download", "hreflang"],
    img: ["src", "srcset", "sizes", "alt", "width", "height", "loading", "decoding"],
    source: ["src", "srcset", "sizes", "type", "media"],
    iframe: ["src", "width", "height", "allow", "allowfullscreen", "frameborder", "loading", "referrerpolicy", "scrolling"],
    video: ["src", "poster", "controls", "loop", "muted", "playsinline", "preload", "width", "height"],
    audio: ["src", "controls", "loop", "muted", "preload"],
    time: ["datetime"],
    td: ["colspan", "rowspan", "headers"],
    th: ["colspan", "rowspan", "headers", "scope", "abbr"],
    col: ["span"],
    colgroup: ["span"],
    ol: ["start", "reversed", "type"],
    li: ["value"],
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

/** HTML de un artículo (o de la descripción de una actividad) listo para guardar. */
export function sanitizeArticleHtml(html: string | null | undefined): string {
  if (!html) return "";
  return restoreMarkers(sanitizeHtml(protectMarkers(html), SANITIZE_OPTIONS));
}
