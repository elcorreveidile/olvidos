// Genera src/lib/version.ts con la versión 1.0.<nº de commits>, calculada desde
// el historial COMPLETO de git en local. Se ejecuta en predev/prebuild.
// En Vercel (clon superficial) NO se regenera: se usa el fichero ya versionado,
// para que el número sea el mismo en local y en producción. Nunca falla el build.
import { execSync } from "node:child_process";
import { writeFileSync } from "node:fs";

const run = (c) => execSync(c, { stdio: ["ignore", "pipe", "ignore"] }).toString().trim();

try {
  if (process.env.VERCEL) process.exit(0);
  if (run("git rev-parse --is-shallow-repository") === "true") process.exit(0);

  const count = parseInt(run("git rev-list --count HEAD"), 10) || 0;
  const commit = run("git rev-parse --short HEAD");
  const date = run("git log -1 --format=%cs");
  const version = count ? `1.0.${count}` : "1.0";

  const body = `// Versión de la web — GENERADO por scripts/gen-version.mjs. No editar a mano.
// Se regenera en predev/prebuild desde el historial de git (1.0.<nº de commits>).
export const APP_VERSION = "${version}";
export const APP_COMMIT = "${commit}";
export const APP_VERSION_DATE = "${date}";
`;
  writeFileSync("src/lib/version.ts", body);
  console.log("[version]", version, commit);
} catch (e) {
  console.warn("[version] omitido:", e?.message || e);
}
process.exit(0);
