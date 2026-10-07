/**
 * Tipos de archivo admitidos en las subidas (lista blanca por MIME y por
 * extensión). Sin SVG: puede llevar scripts y se serviría desde nuestro
 * almacenamiento. El servidor comprueba el tipo que declara el navegador y la
 * extensión del nombre; no es una inspección del contenido, pero cierra las
 * subidas de HTML, scripts o ejecutables con un `Content-Type` cualquiera.
 */

export const IMAGE_TYPES: Record<string, string[]> = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "image/gif": [".gif"],
  "image/avif": [".avif"],
};

export const DOCUMENT_TYPES: Record<string, string[]> = {
  ...IMAGE_TYPES,
  "application/pdf": [".pdf"],
  "application/msword": [".doc"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
  "application/vnd.oasis.opendocument.text": [".odt"],
  "application/vnd.ms-excel": [".xls"],
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
  "application/vnd.oasis.opendocument.spreadsheet": [".ods"],
  "application/vnd.ms-powerpoint": [".ppt"],
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": [".pptx"],
  "application/vnd.oasis.opendocument.presentation": [".odp"],
  "text/csv": [".csv"],
  "text/plain": [".txt", ".md"],
  "application/zip": [".zip"],
  "application/x-zip-compressed": [".zip"],
};

export const IMAGE_ACCEPT = Object.values(IMAGE_TYPES).flat().join(",");
export const DOCUMENT_ACCEPT = Object.values(DOCUMENT_TYPES).flat().join(",");

function extensionOf(name: string): string {
  const i = name.lastIndexOf(".");
  return i >= 0 ? name.slice(i).toLowerCase() : "";
}

/** ¿El archivo (tipo declarado + extensión) está en la lista blanca? */
export function isAllowedFile(
  file: { type: string; name: string },
  allowed: Record<string, string[]>
): boolean {
  const type = (file.type || "").toLowerCase().split(";")[0].trim();
  const exts = allowed[type];
  if (!exts) return false;
  return exts.includes(extensionOf(file.name));
}

export const IMAGE_REJECTED_MESSAGE =
  "El archivo debe ser una imagen JPG, PNG, WebP, GIF o AVIF (no se admiten SVG).";
export const DOCUMENT_REJECTED_MESSAGE =
  "Tipo de archivo no admitido. Se aceptan PDF, documentos de Office/LibreOffice, CSV, TXT, ZIP e imágenes.";
