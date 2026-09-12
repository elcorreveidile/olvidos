/**
 * Cliente de La Banda (motor de agentes, repo la-banda): la redacción de
 * Olvidos vive allí; aquí solo se envían textos y se muestran informes.
 * Se llama SOLO desde el servidor con LA_BANDA_API_KEY.
 */

export interface ManuscritoResumen {
  id: string;
  title: string;
  byline: string | null;
  section: string;
  sourceName: string | null;
  createdAt: string;
  version: { id: string; number: number; wordCount: number; sessionId: string | null; decision: string | null };
  objections: number;
}

export interface Seccion {
  key: string;
  name: string;
  minWords: number | null;
  maxWords: number | null;
  minLines: number | null;
  maxLines: number | null;
}

export interface Objecion {
  number: number;
  agent: string;
  severity: "mayor" | "menor";
  location: string | null;
  text: string;
}

export interface InformeVersion {
  id: string;
  number: number;
  wordCount: number;
  decision: string | null;
  createdAt: string;
  session: {
    id: string;
    status: "open" | "closed" | "vetoed" | "failed";
    startedAt: string;
    closedAt: string | null;
    finalReport: {
      veredicto?: string;
      tesis?: string;
      objecionesMayores?: number;
      objecionesMenores?: number;
      condicionesIncumplidas?: unknown;
      informe?: string;
      devoluciones?: number;
      vetoedBy?: string;
      reason?: string;
    } | null;
  } | null;
  objections: Objecion[];
}

export interface Informe {
  id: string;
  title: string;
  byline: string | null;
  section: string;
  sourceName: string | null;
  createdAt: string;
  versions: InformeVersion[];
}

export const DECISION_LABEL: Record<string, string> = {
  publicable: "Publicable",
  con_cambios: "Con cambios",
  rechazado: "Rechazado",
};

function config() {
  const url = process.env.LA_BANDA_URL?.trim().replace(/\/$/, "");
  const key = process.env.LA_BANDA_API_KEY?.trim();
  if (!url || !key) return null;
  return { url, key };
}

export function laBandaConfigurada(): boolean {
  return config() !== null;
}

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  const c = config();
  if (!c) throw new Error("La Banda no está configurada (LA_BANDA_URL / LA_BANDA_API_KEY)");
  const res = await fetch(`${c.url}${path}`, {
    ...init,
    headers: { ...(init?.headers ?? {}), authorization: `Bearer ${c.key}`, "content-type": "application/json" },
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`La Banda ${res.status}: ${body.slice(0, 200)}`);
  }
  return (await res.json()) as T;
}

export async function listarManuscritos(): Promise<{ secciones: Seccion[]; manuscritos: ManuscritoResumen[] }> {
  return call("/api/v1/olvidos/manuscritos");
}

export async function obtenerInforme(id: string): Promise<Informe | null> {
  try {
    return await call<Informe>(`/api/v1/olvidos/manuscritos/${encodeURIComponent(id)}`);
  } catch (err) {
    if (err instanceof Error && err.message.includes(" 404")) return null;
    throw err;
  }
}

export async function enviarManuscrito(input: {
  title: string;
  byline: string | null;
  section: string;
  text: string;
  sourceName: string | null;
  createdBy: string;
}): Promise<{ manuscriptId: string; versionId: string; sessionId: string; wordCount: number }> {
  return call("/api/v1/olvidos/manuscritos", { method: "POST", body: JSON.stringify(input) });
}

/** HTML de Tiptap → texto con párrafos (los agentes citan por párrafo, [¶n]). */
export function htmlATexto(html: string): string {
  return html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|h[1-6]|blockquote|li|figure|figcaption|div|tr)>/gi, "\n\n")
    .replace(/<(h[1-6])[^>]*>/gi, "\n\n# ")
    .replace(/<\/?(em|i)>/gi, "*")
    .replace(/<\/?(strong|b)>/gi, "**")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&laquo;/g, "«")
    .replace(/&raquo;/g, "»")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
