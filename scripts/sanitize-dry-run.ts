/**
 * Comprueba EN SECO qué haría el sanitizador de HTML (`src/lib/sanitize-html.ts`)
 * con los artículos y actividades guardados. No escribe nada.
 *
 * Uso (desde el clon local, con la BD de producción en .env.local):
 *   npx tsx --env-file=.env.local scripts/sanitize-dry-run.ts            # resumen
 *   npx tsx --env-file=.env.local scripts/sanitize-dry-run.ts --detalle  # por artículo
 *   npx tsx --env-file=.env.local scripts/sanitize-dry-run.ts --slug <slug>  # uno, con diff
 *
 * Para cada texto compara el HTML original con el limpio: etiquetas que
 * desaparecen (y cuántas), hosts de iframes eliminados, atributos perdidos y si
 * el TEXTO visible cambia. Si todo sale a cero, el sanitizador no toca nada de
 * lo publicado; si algo desaparece, hay que decidir si ampliar la lista blanca.
 */
import { PrismaClient } from "@prisma/client";
import { decodeHTML } from "entities";
import { sanitizeArticleHtml } from "../src/lib/sanitize-html";

const prisma = new PrismaClient();
const args = process.argv.slice(2);
const detalle = args.includes("--detalle");
const slugIdx = args.indexOf("--slug");
const onlySlug = slugIdx >= 0 ? args[slugIdx + 1] : null;

function tagCounts(html: string): Map<string, number> {
  const counts = new Map<string, number>();
  for (const m of Array.from(html.matchAll(/<([a-zA-Z][a-zA-Z0-9-]*)\b/g))) {
    const t = m[1].toLowerCase();
    counts.set(t, (counts.get(t) ?? 0) + 1);
  }
  return counts;
}

function iframeHosts(html: string): string[] {
  const hosts: string[] = [];
  for (const m of Array.from(html.matchAll(/<iframe\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/gi))) {
    try {
      hosts.push(new URL(m[1], "https://www.olvidos.es").hostname);
    } catch {
      hosts.push(`(inválida) ${m[1].slice(0, 60)}`);
    }
  }
  return hosts;
}

function attrNames(html: string): Map<string, number> {
  const counts = new Map<string, number>();
  for (const m of Array.from(html.matchAll(/<[a-zA-Z][^>]*>/g))) {
    // Con o sin valor: sanitize-html emite `data-x=""` como `data-x`.
    for (const a of Array.from(m[0].matchAll(/\s([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?=[\s=/>])/g))) {
      const n = a[1].toLowerCase();
      counts.set(n, (counts.get(n) ?? 0) + 1);
    }
  }
  return counts;
}

function visibleText(html: string): string {
  return decodeHTML(
    html
      .replace(/<!--[\s\S]*?-->/g, "")
      // Lo que va dentro de <script>/<style>/<iframe> no se ve.
      .replace(/<(script|style|iframe)\b[^>]*>[\s\S]*?<\/\1>/gi, " ")
      .replace(/<[^>]*>/g, " ")
  )
    .replace(/\s+/g, " ")
    .trim();
}

function markers(html: string): number {
  return (html.match(/<!--\s*(?:nextpage|isla:|paso:)/gi) ?? []).length;
}

function diffCounts(a: Map<string, number>, b: Map<string, number>): string[] {
  const out: string[] = [];
  for (const [k, v] of Array.from(a.entries())) {
    const after = b.get(k) ?? 0;
    if (after < v) out.push(`${k} ${v}→${after}`);
  }
  return out;
}

type Row = { kind: string; slug: string; html: string };

async function main() {
  const rows: Row[] = [];
  const articles = await prisma.article.findMany({
    where: onlySlug ? { slug: onlySlug } : {},
    select: { slug: true, content: true },
    orderBy: { slug: "asc" },
  });
  for (const a of articles) rows.push({ kind: "artículo", slug: a.slug, html: a.content });
  if (!onlySlug) {
    const events = await prisma.event.findMany({ select: { slug: true, description: true } });
    for (const e of events) rows.push({ kind: "actividad", slug: e.slug, html: e.description ?? "" });
  }

  let touched = 0;
  const lostTags = new Map<string, number>();
  const lostAttrs = new Map<string, number>();
  const lostHosts = new Map<string, number>();
  let textChanged = 0;
  let markersLost = 0;

  for (const row of rows) {
    const clean = sanitizeArticleHtml(row.html);
    const tagDiff = diffCounts(tagCounts(row.html), tagCounts(clean));
    const attrDiff = diffCounts(attrNames(row.html), attrNames(clean));
    const hostsBefore = iframeHosts(row.html);
    const hostsAfter = new Set(iframeHosts(clean));
    const hostsLost = hostsBefore.filter((h) => !hostsAfter.has(h));
    const textDiff = visibleText(row.html) !== visibleText(clean);
    const markDiff = markers(row.html) !== markers(clean);

    const changed = tagDiff.length || attrDiff.length || hostsLost.length || textDiff || markDiff;
    if (!changed) continue;
    touched++;
    for (const t of tagDiff) lostTags.set(t.split(" ")[0], (lostTags.get(t.split(" ")[0]) ?? 0) + 1);
    for (const a of attrDiff) lostAttrs.set(a.split(" ")[0], (lostAttrs.get(a.split(" ")[0]) ?? 0) + 1);
    for (const h of hostsLost) lostHosts.set(h, (lostHosts.get(h) ?? 0) + 1);
    if (textDiff) textChanged++;
    if (markDiff) markersLost++;

    if (detalle || onlySlug) {
      console.log(`\n■ ${row.kind} ${row.slug}`);
      if (tagDiff.length) console.log("  etiquetas:", tagDiff.join(", "));
      if (attrDiff.length) console.log("  atributos:", attrDiff.join(", "));
      if (hostsLost.length) console.log("  iframes eliminados:", hostsLost.join(", "));
      if (markDiff) console.log("  ¡marcadores perdidos!");
      if (textDiff) {
        const a = visibleText(row.html);
        const b = visibleText(clean);
        let i = 0;
        while (i < a.length && i < b.length && a[i] === b[i]) i++;
        console.log("  texto distinto desde:", JSON.stringify(a.slice(Math.max(0, i - 40), i + 80)));
        console.log("                 queda:", JSON.stringify(b.slice(Math.max(0, i - 40), i + 80)));
      }
    }
  }

  console.log(`\n${rows.length} textos comprobados; ${touched} cambiarían.`);
  if (lostTags.size) console.log("Etiquetas que desaparecen (nº de textos):", Object.fromEntries(lostTags));
  if (lostAttrs.size) console.log("Atributos que desaparecen (nº de textos):", Object.fromEntries(lostAttrs));
  if (lostHosts.size) console.log("Hosts de iframe eliminados (nº de textos):", Object.fromEntries(lostHosts));
  console.log(`Textos cuyo contenido visible cambia: ${textChanged}. Marcadores perdidos: ${markersLost}.`);
  if (!touched) console.log("✔ El sanitizador no altera nada de lo guardado.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
