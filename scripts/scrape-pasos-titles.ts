/**
 * Rasca los títulos REALES de cada "paso" de las piezas de Piezas y Procesos
 * desde la web original (el menú "pasos"/TOC del plugin mpp SÍ está en el HTML
 * server-side, aunque la REST no lo expone), y los guarda en
 * src/data/pasos-titles.json  ({ slug: ["Introducción", ..., "Agradecimientos"] }).
 *
 * Uso:
 *   export $(grep '^DATABASE_URL=' .env.local | xargs)
 *   npx tsx scripts/scrape-pasos-titles.ts
 */
import { PrismaClient } from "@prisma/client";
import { splitPasos } from "../src/lib/pasos";
import fs from "fs";
import path from "path";

const db = new PrismaClient();
const NEXTPAGE = /<!--\s*nextpage\s*-->/i;
const fetchT = (u: string, ms = 20000) =>
  fetch(u, {
    signal: AbortSignal.timeout(ms),
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
    },
  });

function parseToc(html: string): string[] {
  // El TOC real es un <div class="mpp-toc-container ..."> (el otro match es CSS).
  const idx = html.search(/class="[^"]*mpp-toc-container/i);
  const region = idx >= 0 ? html.slice(idx, idx + 5000) : "";
  const items = Array.from(region.matchAll(/<li[^>]*>\s*(\d+)\.\s*([\s\S]*?)<\/li>/gi)).map((m) => ({
    n: Number(m[1]),
    title: m[2].replace(/<[^>]+>/g, "").replace(/&#?\w+;/g, " ").replace(/\s+/g, " ").trim(),
  }));
  const map = new Map<number, string>();
  for (const it of items) if (!map.has(it.n) && it.title) map.set(it.n, it.title);
  return Array.from(map.entries()).sort((a, b) => a[0] - b[0]).map((e) => e[1]);
}

async function main() {
  const arts = await db.article.findMany({
    where: { categories: { some: { category: { slug: "piezas-procesos" } } } },
    select: { slug: true, wpId: true, content: true },
  });
  const piezas = arts.filter((a) => NEXTPAGE.test(a.content || ""));
  console.log("Piezas con pasos:", piezas.length);

  const out: Record<string, string[]> = {};
  let ok = 0, mismatch = 0, fail = 0;
  const problems: string[] = [];

  for (const a of piezas) {
    const expected = splitPasos(a.content).length;
    let html = "";
    for (let i = 0; i < 3 && !html; i++) {
      try {
        const r = await fetchT(`https://olvidosdegranada.es/?p=${a.wpId}`);
        if (r.ok) html = await r.text();
      } catch {}
    }
    if (!html) { fail++; problems.push(`${a.slug} (sin HTML)`); continue; }
    const titles = parseToc(html);
    if (titles.length === expected && expected > 1) {
      out[a.slug] = titles; ok++;
    } else {
      mismatch++; problems.push(`${a.slug} (toc:${titles.length} vs pasos:${expected})`);
    }
  }

  const dir = path.join(process.cwd(), "src", "data");
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "pasos-titles.json"), JSON.stringify(out, null, 2) + "\n");
  console.log(`Guardados: ${ok} · desajuste: ${mismatch} · sin HTML: ${fail}`);
  if (problems.length) console.log("Problemas:", JSON.stringify(problems.slice(0, 40)));
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => db.$disconnect());
