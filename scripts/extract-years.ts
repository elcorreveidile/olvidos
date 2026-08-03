/**
 * Extrae años candidatos de cada número leyendo el texto (OCR) de las primeras
 * páginas de su PDF con `pdftotext`. NO escribe nada: solo propone, para que se
 * valide antes de poblar MagazineIssue.year.
 *   npx tsx scripts/extract-years.ts
 */
import { db } from "../src/lib/db";
import { execSync } from "node:child_process";
import { writeFileSync, rmSync } from "node:fs";

const TMP = "/tmp/oy-year.pdf";

async function main() {
  const issues = await db.magazineIssue.findMany({
    select: { number: true, title: true, pdfUrl: true },
    orderBy: { number: "asc" },
  });

  console.log("nº\tguess\tcandidatos (año×veces)\ttítulo");
  for (const it of issues) {
    if (!it.pdfUrl) {
      console.log(`#${it.number}\t—\tsin pdf\t${it.title}`);
      continue;
    }
    try {
      const res = await fetch(it.pdfUrl);
      writeFileSync(TMP, Buffer.from(await res.arrayBuffer()));
      let text = "";
      try {
        text = execSync(`pdftotext -f 1 -l 12 "${TMP}" - 2>/dev/null`, {
          maxBuffer: 32 * 1024 * 1024,
        }).toString();
      } catch {
        /* pdftotext puede fallar en algún PDF raro */
      }
      const years = text.match(/\b19(?:8\d|9[0-3])\b/g) || [];
      const counts = new Map<string, number>();
      for (const y of years) counts.set(y, (counts.get(y) || 0) + 1);
      const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
      const cand = sorted.map(([y, c]) => `${y}×${c}`).join(" ") || "—";
      console.log(`#${it.number}\t${sorted[0]?.[0] ?? "?"}\t${cand}\t${it.title.slice(0, 42)}`);
    } catch (e) {
      console.log(`#${it.number}\tERR\t${(e as Error).message}\t${it.title.slice(0, 42)}`);
    }
  }
  rmSync(TMP, { force: true });
}

main().finally(() => db.$disconnect());
