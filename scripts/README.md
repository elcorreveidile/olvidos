# scripts/

Herramientas de línea de comandos. Se ejecutan desde el clon local con
`npx tsx --env-file=.env.local scripts/<nombre>.ts` (las `.ts`) o
`node scripts/marketing/<nombre>.mjs` (las `.mjs`). **Ninguna se ejecuta en
Vercel** salvo `gen-version.mjs` y `gen-changelog.mjs` (en `prebuild`).

## En uso (raíz)

| Script | Qué hace |
| --- | --- |
| `gen-version.mjs`, `gen-changelog.mjs` | Generan `src/lib/version.ts` y el changelog en `prebuild`/`predev`. |
| `set-user-role.ts` | Cambia el rol de una cuenta (`ADMIN`, `EDITOR`, `MEMBER_ADMIN`, `MEMBER`, `USER`). Ver `docs/ROLES.md`. |
| `sanitize-dry-run.ts` | Comprueba en seco qué cambiaría el sanitizador de HTML (`src/lib/sanitize-html.ts`) en los artículos y actividades guardados. No escribe. |
| `con-textos-merge.ts`, `con-textos-check.ts`, `con-textos-fuentes.ts`, `con-textos-espana-marruecos.ts`, `con-textos-transcribir.py`, `con-textos-html/` | Flujo de los especiales Con-textos (`docs/con-textos/README.md`). `con-textos-espana-marruecos.ts` escribe el artículo del especial en la BD. |
| `test-email.ts`, `test-contact-send.ts` | Pruebas de envío con Resend. |

## `legacy/` — migración y arreglos puntuales (ESCRIBEN en la base de datos)

Scripts de la migración desde WordPress y de las correcciones del archivo
(`migrate-wordpress`, `rehost-*`, `recover*`, `n9-*`, `import-bylines`,
`seed-archive`, `set-issue-years`, `promote-covers`, `clean-placeholders`,
`update-admins`, `upload-estatutos`, `backfill-ledger`, `scrape-pasos-titles`,
`check-*`, `extract-years`, `poc-*`, `fix-srcset-legacy`). Ya cumplieron su función: no ejecutarlos
contra producción sin leerlos antes y, si tienen `--dry`, probar primero con él.
Al escribir directamente en la BD no pasan por la caché del panel: lo que
cambien tarda hasta 5 minutos en verse en la web.

`fix-srcset-legacy.ts` (7-10-2026) quita los `srcset`/`sizes` de las imágenes
que aún apuntan a `olvidosdegranada.es` (la migración re-alojó los `src` pero no
los `srcset`, y el navegador prefería el `srcset`: cartel «This image was
hotlinked»). Sin `--aplicar` solo informa; también lista los `src`, enlaces y
PDF que sigan en el dominio antiguo.

## `marketing/` — reels y carruseles

Plantillas HTML (`reel-*.template.html`, `carousel-*.template.html`), escenas
(`scenes-*.json`) y los `.mjs` que las capturan y montan con Playwright/ffmpeg
para redes sociales. No tocan la base de datos. `ROOT` está escrito a mano en
cada `.mjs`: ajústalo a la ruta del clon antes de usarlos.
