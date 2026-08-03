/**
 * POC: transcribe UN artículo del nº9 (págs 12-14, "Jaime Gil de Biedma", de
 * J. Ramón Ripoll) a un Article BORRADOR enlazado al número, para medir el
 * esfuerzo. Usa /tmp/olv9.pdf (ya descargado). NO publica nada (status DRAFT).
 *   npx tsx scripts/poc-transcribe.ts
 */
import { execSync } from "node:child_process";
import { db } from "../src/lib/db";

const PDF = "/tmp/olv9.pdf";

function clean(raw: string): string {
  const lines = raw
    .split("\n")
    .map((l) => l.replace(/\s+$/g, ""))
    // Quita las cabecerillas de página tipo "}2  OLVIDOS" / "OLVIDOS   l3".
    .filter(
      (l) =>
        !/^\s*[}l|]?\s*\d{0,2}\s*OLVIDOS\b/i.test(l) &&
        !/\bOLVIDOS\s+[}l|]?\d{1,2}\s*$/i.test(l)
    );
  return lines
    .join("\n")
    .replace(/-\n\s*/g, "") // une palabras cortadas a final de línea
    .replace(/[ \t]{2,}/g, " ") // colapsa espacios de columnas
    .replace(/\n{2,}/g, "\n\n")
    .trim();
}

function toHtml(text: string): string {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\n/g, " ").trim())
    .filter((p) => p.length > 0)
    .map((p) => `<p>${p}</p>`)
    .join("\n");
}

async function main() {
  const raw = execSync(`pdftotext -layout -f 12 -l 14 "${PDF}" -`, {
    maxBuffer: 16 * 1024 * 1024,
  }).toString();
  const text = clean(raw);
  const html = toHtml(text);

  console.log("=== PREVIEW (primeros 700 caracteres del texto limpio) ===");
  console.log(text.slice(0, 700));
  console.log(`\n=== longitud: ${text.length} car · ${html.split("<p>").length - 1} párrafos ===`);

  const issue = await db.magazineIssue.findFirst({
    where: { number: 9 },
    select: { id: true },
  });
  if (!issue) throw new Error("No existe el nº9");

  const author = await db.user.findFirst({ where: { role: "ADMIN" }, select: { id: true } });

  const slug = "poc-jaime-gil-de-biedma-n9";
  await db.article.upsert({
    where: { slug },
    update: { content: html },
    create: {
      title: "Jaime Gil de Biedma: el verbo y las personas",
      slug,
      excerpt: "Transcripción automática (POC) del nº 9. Pendiente de revisar.",
      content: html,
      byline: "J. Ramón Ripoll",
      status: "DRAFT",
      issueId: issue.id,
      authorId: author?.id ?? "",
      pages: "12–14",
    },
  });
  console.log(`\n✓ Artículo BORRADOR creado/actualizado (slug: ${slug}, nº9, DRAFT).`);
}

main().finally(() => db.$disconnect());
