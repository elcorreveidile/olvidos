# Olvidos de Granada — notas para Claude

Memoria del proyecto. Léela antes de tocar cuentas, roles, despliegues o el
especial «Con-textos».

## Personas y cuentas (¡importante!)

- **Javier Benítez Láinez** es el coordinador de la revista y el
  administrador de la web. Sus cuentas en la web son:
  - `informa@blablaele.com` (principal, rol ADMIN)
  - `benitezl@go.ugr.es` (alternativa, rol ADMIN)
- **La cuenta `javier@blablaele.com` YA NO EXISTE.** No la uses nunca como
  correo de Javier, ni en scripts, ni en consultas, ni al hablar con él. Si
  aparece en código antiguo, es un resto obsoleto.
- Equipo Olvidos (rol EDITOR, publican artículos):
  - Ildefonso «Alfonso» Salazar Mendías, `alfonso.olvidos@gmail.com` (también socio nº 3)
  - Ramón Repiso Ruiz, `ramonrepiso@gmail.com`
- El correo de sesión que ve Claude (`userEmail`) puede no coincidir con la
  cuenta de la web: lo que vale es la lista de arriba.

## Roles

Ver `docs/ROLES.md`. Resumen: solo `EDITOR` («Equipo Olvidos») y `ADMIN`
publican; `MEMBER_ADMIN` gestiona socios y pagos; los socios no publican. Los
roles se cambian en `/admin/usuarios` (solo ADMIN) o con
`scripts/set-user-role.ts`. La ficha de socio no debe pisar los roles del
equipo (`roleForMemberStatus` en `src/lib/roles.ts`).

## Base de datos y despliegue

- PostgreSQL en Neon; `DATABASE_URL` solo en `.env.local` (nunca en el chat)
  y en Vercel. Javier ejecuta los scripts en local desde su clon
  (`~/olvidos-web` en su Mac) con `npx tsx --env-file=.env.local …`.
- Producción se despliega desde `main` en Vercel. Los PR se fusionan con
  *squash*. El PR #5 (agosto de 2026) exigía `prisma db push` por dos
  columnas nuevas (`User.tokenVersion`, `VerificationToken.type`).
- **Qué proyecto de Vercel sirve la web:** el proyecto `olvidos` del equipo
  **olvidos-projects**. Dominios: `olvidos.es` redirige (308) a
  `www.olvidos.es`. El conector de Vercel de Claude solo ve el equipo
  «Javier's projects», así que los despliegues reales se miran en el panel de
  vercel.com con el ámbito olvidos-projects.
- **Duplicado desconectado (septiembre de 2026):** en «Javier's projects»
  había otro proyecto `olvidos` conectado al mismo repositorio desde el
  1-8-2026 que construía cada push sin servir ningún dominio (`olvidos.es` y
  `www.olvidos.es` figuraban en su lista de dominios sin asignar). Se
  desconectó del repositorio en Settings → Git. Si en un PR el bot de Vercel
  deja **dos** comentarios, es que ha vuelto a conectarse. Para saber qué
  build sirve el dominio: comparar el nombre del chunk `app/layout-*.js` en
  el HTML de `https://www.olvidos.es/login` con el del despliegue de
  producción; si no coinciden, el dominio no está en ese proyecto.

## Con-textos (especiales interactivos)

- Formato y flujo de trabajo: `docs/con-textos/README.md`.
- Primer especial: «Ceuta no empezó en julio. España y Marruecos, 1859-2026»
  (`ceuta-no-empezo-en-julio`), creado en borrador el 2-9-2026.
- **Actualizado el 3-9-2026 con la grabación del pleno extraordinario**
  (comparador apilado, bloque «nacionalistas», informe del CENIF, calle del
  2-9, agresiones a periodistas, citas del pleno verificadas por vídeo con
  minuto). Material en `docs/con-textos/espana-marruecos/bloques/07-*`.
- **Pasada del Diario hecha el 10-9-2026**: las 52 citas `q-pl194-*` llevan
  página del `DSCD-15-PL-201` y su texto oficial (cotejo en el bloque 07,
  §A.7). El Diario se publicó una semana después del pleno. Para sesiones
  posteriores (control del 9-9, sesión 195) se repite el método: grabación +
  prensa mientras no hay Diario, y pasada del Diario después.

## Convenciones

- Idioma del código, comentarios, commits y PR: español.
- Antes de subir: `npx tsc --noEmit` (los ~124 errores previos no son
  nuestros), `npx next lint --dir src`, `npm run build` (la exportación del
  sitemap falla sin `DATABASE_URL`; es normal).
- Tailwind solo escanea `src/app`, `src/components` y `src/pages`.
