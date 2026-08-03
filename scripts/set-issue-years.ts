/**
 * Puebla MagazineIssue.year (y ajusta publishedAt) con la propuesta validada.
 * Los 0 = año desconocido (separatas sueltas, pendientes de confirmar).
 *   npx tsx scripts/set-issue-years.ts
 */
import { db } from "../src/lib/db";

// número → año propuesto (0 = desconocido).
const YEAR: Record<number, number> = {
  [-2]: 1981, // Preolvidos I
  [-1]: 1982, // Preolvidos II
  1: 1984,
  2: 1985, 3: 1985, 4: 1985, 5: 1985, 6: 1985, 7: 1985, // (7 = "7-8")
  9: 1986, 10: 1986, 11: 1986, 12: 1986, 13: 1986,
  14: 1987, 15: 1987, 16: 1987, 17: 1987,
  // Separatas ligadas a un número
  101: 1986, // Fragmentos 1 (n.º 10)
  102: 1986, // Fragmentos 2 (n.º 11)
  103: 1986, // Fragmentos 3 (n.º 12)
  104: 1987, // Fragmentos 4 (n.º 14)
  106: 1987, // Fragmentos 6 (n.º 16)
  107: 1987, // Suena una música (n.º 14)
  // 105 (Inéditos del 50), 108 (Te golpearé sin cólera), 109 (Presença) → desconocido
};

async function main() {
  const issues = await db.magazineIssue.findMany({
    select: { id: true, number: true, title: true },
    orderBy: { number: "asc" },
  });

  let set = 0;
  const unknown: string[] = [];
  for (const it of issues) {
    const year = YEAR[it.number];
    if (year) {
      await db.magazineIssue.update({
        where: { id: it.id },
        data: { year, publishedAt: new Date(`${year}-01-01T00:00:00Z`) },
      });
      set++;
      console.log(`✓ #${it.number} → ${year}`);
    } else {
      unknown.push(`#${it.number} ${it.title}`);
    }
  }
  console.log(`\nAños asignados: ${set}`);
  if (unknown.length) {
    console.log(`Sin año (desconocido): ${unknown.length}`);
    unknown.forEach((u) => console.log("  -", u));
  }
}

main().finally(() => db.$disconnect());
