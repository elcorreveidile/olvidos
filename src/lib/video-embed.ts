/**
 * Convierte un enlace de YouTube o Vimeo en la dirección para incrustarlo.
 * Devuelve null para cualquier otra cosa: solo se incrustan estos dos sitios,
 * así nadie puede meter un iframe a una dirección arbitraria en un artículo.
 * YouTube va por youtube-nocookie.com (sin cookies hasta que se pulsa play).
 */
export function videoEmbedUrl(input: string): string | null {
  let url: URL;
  try {
    url = new URL(input.trim());
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;
  const host = url.hostname.replace(/^www\./, "").replace(/^m\./, "");
  const id11 = /^[A-Za-z0-9_-]{11}$/;

  if (host === "youtu.be") {
    const id = url.pathname.split("/")[1] ?? "";
    return id11.test(id) ? `https://www.youtube-nocookie.com/embed/${id}` : null;
  }
  if (host === "youtube.com" || host === "youtube-nocookie.com") {
    const parts = url.pathname.split("/").filter(Boolean);
    let id = "";
    if (parts[0] === "watch") id = url.searchParams.get("v") ?? "";
    else if (["embed", "shorts", "live", "v"].includes(parts[0] ?? "")) id = parts[1] ?? "";
    return id11.test(id) ? `https://www.youtube-nocookie.com/embed/${id}` : null;
  }
  if (host === "vimeo.com" || host === "player.vimeo.com") {
    const parts = url.pathname.split("/").filter(Boolean);
    const id = parts.find((p) => /^\d+$/.test(p));
    if (!id) return null;
    // Vídeos privados: https://vimeo.com/<id>/<hash>
    const hash = parts[parts.indexOf(id) + 1];
    const h = hash && /^[a-f0-9]+$/i.test(hash) ? `?h=${hash}` : "";
    return `https://player.vimeo.com/video/${id}${h}`;
  }
  return null;
}
