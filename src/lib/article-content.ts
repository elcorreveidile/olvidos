/**
 * ¿Tiene el HTML del editor algo que mostrar?
 *
 * Tiptap devuelve `<p></p>` cuando no hay texto, así que comprobar solo que la
 * cadena no esté vacía deja pasar artículos en blanco. Se considera contenido:
 * texto visible, una imagen/vídeo/tabla/regla o los marcadores de los especiales
 * «Con-textos» (`<!--isla:…-->`, `<!--paso:…-->`).
 */
export function hasVisibleContent(html: string | null | undefined): boolean {
  if (!html) return false;
  if (/<!--\s*(isla|paso):/i.test(html)) return true;
  if (/<(img|iframe|video|audio|hr|table)\b/i.test(html)) return true;
  const text = html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/\s+/g, "");
  return text.length > 0;
}

export const CONTENT_REQUIRED_MESSAGE = "El contenido es obligatorio";
