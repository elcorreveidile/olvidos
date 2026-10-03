import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Slug para la URL de un artículo a partir de su título: sin tildes ni signos,
 * en minúsculas, con guiones, y como mucho `max` caracteres (cortando en un
 * guion para no dejar una palabra a medias).
 */
export function slugFromTitle(title: string, max = 80): string {
  const full = slugify(title);
  if (full.length <= max) return full;
  const cut = full.slice(0, max);
  const lastDash = cut.lastIndexOf("-");
  return (lastDash > max / 2 ? cut.slice(0, lastDash) : cut).replace(/-+$/, "");
}
