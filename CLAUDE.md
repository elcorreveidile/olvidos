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

## Con-textos (especiales interactivos)

- Formato y flujo de trabajo: `docs/con-textos/README.md`.
- Primer especial: «Ceuta no empezó en julio. España y Marruecos, 1859-2026»
  (`ceuta-no-empezo-en-julio`), creado en borrador el 2-9-2026.
- **Actualización pendiente (decidida el 3-9-2026), de una sola vez cuando el
  Congreso publique el Diario de Sesiones del pleno extraordinario del
  3-9-2026:** (a) estilo del comparador «Quién dijo qué»: apilar los bloques
  cuando estén descompensados en vez de columnas con huecos; (b) contenido:
  citas del pleno, el informe del CENIF y su filtración (1-2 sept), los
  incidentes de la extrema derecha de la noche del 2-3 sept y lo que vaya
  saliendo. El material recopilado hasta ahora está en
  `docs/con-textos/espana-marruecos/bloques/07-actualizacion-2026-09-03.md`.
  Detalle en el plan de sesión y en `docs/con-textos/README.md`.

## Convenciones

- Idioma del código, comentarios, commits y PR: español.
- Antes de subir: `npx tsc --noEmit` (los ~124 errores previos no son
  nuestros), `npx next lint --dir src`, `npm run build` (la exportación del
  sitemap falla sin `DATABASE_URL`; es normal).
- Tailwind solo escanea `src/app`, `src/components` y `src/pages`.
