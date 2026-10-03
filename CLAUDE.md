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
  **«Javier's projects»** (`vercel.com/javiers-projects-cc8068ed/olvidos`,
  id `prj_YLcM6RI5xRLiyjxTFTCs6CLbKpSy`). Dominios: `olvidos.es` redirige (308) a
  `www.olvidos.es`. **No existe ningún equipo «olvidos-projects»** (nota errónea
  hasta el 3-10-2026) y tampoco hay un proyecto duplicado: en ese equipo solo hay
  un proyecto `olvidos`. Si en un PR el bot de Vercel deja **dos** comentarios,
  es que se ha conectado un segundo proyecto al repositorio.
- **Conector de Vercel de Claude:** para que Claude vea el proyecto hay que
  autorizar el conector eligiendo el equipo «Javier's projects» **y el proyecto
  `olvidos`** (o todos). Si no, el conector ve el equipo pero lista 0 proyectos y
  da 403 al pedir despliegues (pasó el 3-10-2026). Se arregla en
  claude.ai/customize/connectors → Vercel → desconectar y volver a conectar. Con
  acceso: `list_deployments`, `get_runtime_errors`, `list_project_domains`.
- **Repositorio público:** no se suben textos sin publicar (columnas, borradores)
  ni datos de personas; los borradores viven en el panel o fuera del repositorio.

## Formularios del panel con Tiptap (no repetir el fallo del 3-10-2026)

- **Nunca** enlazar el texto del editor con `<input type="hidden" {...register("content")} value={content} />`.
  `react-hook-form` solo recoge valores por sus propios eventos: ignora los
  cambios de valor que hace React y envía el contenido anterior (vacío en
  `/admin/articulos/nuevo`; el original en `/editar`, con lo que se perdían las
  ediciones del cuerpo). Síntomas: «El contenido es obligatorio» con el texto
  a la vista y botones que «no hacen nada». El patrón correcto:
  `onChange={(html) => { setContent(html); setValue("content", html, { shouldValidate: true, shouldDirty: true }); }}`
  y `defaultValues: { content: "" }`, sin campo oculto.
- Los botones de envío deben pasar un segundo argumento a `handleSubmit`
  (`onInvalid`) que muestre el aviso arriba y suba la página; si no, el error
  de validación queda debajo del editor, fuera de la vista.
- Tiptap devuelve `<p></p>` con el editor vacío: usar `hasVisibleContent`
  (`src/lib/article-content.ts`) en el esquema de cliente y en
  `src/lib/actions/articles.ts`. Acepta texto, imágenes/vídeo/tablas y los
  marcadores `<!--isla:…-->`/`<!--paso:…-->` de Con-textos.
- Reproducción con las mismas versiones (`react-hook-form` 7.71.1, `zod` 3.25):
  el patrón roto falla también con la 7.51; el arreglado envía el texto en los
  casos nuevo, editar y vaciar. Probado en simulación (jsdom), no en el panel real.

## Estado de producción (3-10-2026)

- Último despliegue de producción: `READY`, commit `752c713` (#17), 14-9-2026.
  El commit #20 (solo documentación) no generó despliegue de producción.
- Errores de runtime de los 7 días anteriores (ninguno en `/admin/articulos`):
  «Artículo no encontrado» en `/articulos/[slug]` (220, 42 usuarios: enlaces
  antiguos o inexistentes); `PrismaClient is not configured to run in Edge Runtime`
  en el middleware (56; `src/lib/auth.ts` lo captura y conserva la sesión, es
  ruido de registro); pool de conexiones agotado en la portada (4; límite 5,
  espera 10 s); «Failed to find Server Action» en `/contacto` (4; pestañas
  abiertas antes de un despliegue); un fallo PKCE en el login con Google.

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
