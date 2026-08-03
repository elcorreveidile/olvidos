// Genera CHANGELOG.md automáticamente a partir del historial de git.
// Se ejecuta solo en predev/prebuild (ver package.json). No requiere
// mantenimiento manual. Nunca hace fallar el build (siempre sale con 0).
import { execSync } from "node:child_process";
import { writeFileSync } from "node:fs";

function run(cmd) {
  return execSync(cmd, { stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
}

try {
  // En Vercel el clon es superficial (poco historial): saltamos y dejamos el
  // CHANGELOG que ya venga en el repo (generado en local, con historial completo).
  if (process.env.VERCEL) process.exit(0);
  if (run("git rev-parse --is-shallow-repository") === "true") process.exit(0);

  const raw = run("git log --no-merges --date=short --pretty=format:%cd%x09%h%x09%s");
  const commits = raw
    .split("\n")
    .filter(Boolean)
    .map((l) => {
      const [date, hash, ...rest] = l.split("\t");
      return { date, hash, subject: rest.join("\t") };
    })
    // Ignoramos los commits que solo regeneran metadatos.
    .filter((c) => !/^(chore: )?(changelog|version)\b/i.test(c.subject));

  // Agrupar por fecha (el log ya viene de más reciente a más antiguo).
  const byDate = new Map();
  for (const c of commits) {
    if (!byDate.has(c.date)) byDate.set(c.date, []);
    byDate.get(c.date).push(c);
  }

  let out =
    "# Changelog — Olvidos de Granada\n\n" +
    "Generado automáticamente desde el historial de git " +
    "(`scripts/gen-changelog.mjs`). No editar a mano.\n\n" +
    "La versión del footer es `1.0.<nº de commits>` y la calcula " +
    "`next.config.mjs`.\n";

  for (const [date, list] of byDate) {
    out += `\n## ${date}\n\n`;
    for (const c of list) out += `- ${c.subject} (${c.hash})\n`;
  }

  writeFileSync("CHANGELOG.md", out);
  console.log(`[changelog] ${commits.length} commits, ${byDate.size} fechas.`);
} catch (e) {
  console.warn("[changelog] omitido:", e?.message || e);
}
process.exit(0);
