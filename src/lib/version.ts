// Versión de la web — AUTOMÁTICA. No se edita a mano.
// Los valores los calcula next.config.mjs desde git (último commit) en cada
// build y se inyectan como variables de entorno. El changelog se genera solo
// con `scripts/gen-changelog.mjs` (se ejecuta en predev/prebuild).
export const APP_VERSION = process.env.APP_VERSION || "dev";
export const APP_COMMIT = process.env.APP_COMMIT || "";
export const APP_VERSION_DATE = process.env.APP_DATE || "";
