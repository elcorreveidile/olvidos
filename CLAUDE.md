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
- **Dónde está la web en Vercel (comprobado el 3-10-2026; hay DOS equipos con un
  proyecto `olvidos` y la nota anterior de este fichero se equivocaba a medias):**
  - **«Javier's projects»** (`vercel.com/javiers-projects-cc8068ed/olvidos`,
    `prj_YLcM6RI5xRLiyjxTFTCs6CLbKpSy`): tiene `www.olvidos.es` y `olvidos.es` en su
    lista de dominios (verificados; `olvidos.es` redirige con 308) y **es el que
    sirve hoy la web**, pero con el despliegue `dpl_64yYgm4ch8Tiavnytve7YTEDQgqh`
    del 3-9-2026 (commit `a0e3226`, PR #6): el HTML de `https://www.olvidos.es/login`
    lleva `?dpl=dpl_64yY…`. Sus despliegues de producción posteriores (#14–#17, #19 y
    el redeploy del 14-9) **no tienen los dominios asignados** (solo los alias
    `*.vercel.app`): no están publicados.
  - **`olvidos-projects`** (existe: `vercel.com/olvidos-projects/olvidos`,
    `prj_Sedw5XTMR83BbmQlwpLW1tV5h8gt`): es el proyecto que construye hoy las vistas
    previas de los PR (comentario del bot de Vercel). El conector de Claude no lo ve
    (403: hay que autorizar ese ámbito).
  - **Pendiente de decidir y documentar:** qué proyecto debe ser el de producción y
    cómo se asigna `www.olvidos.es` a los despliegues nuevos (conectar Git en el
    primero, mover el dominio al segundo o promover a mano). Mientras no se decida,
    fusionar un PR **no garantiza** que el cambio llegue a `www.olvidos.es`.
  - Para saber qué build sirve el dominio: buscar `?dpl=dpl_…` en el HTML de
    `https://www.olvidos.es/login` y comparar con los despliegues del proyecto.
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

## Estado de producción (actualizado el 5-10-2026)

- **Corrección**: `www.olvidos.es` YA sirve el último despliegue de producción de «Javier's projects»
  (`dpl_FaL7w7sdm3eBL83TZgwjwxE6Muai`, 3-10-2026, commit `cde2f0f`, PR #21), comprobado por `?dpl=` en el HTML
  y con `list_deployments`. Lo que se describe abajo del 3-10 (dominio atascado en el despliegue del 3-9) ya no es así.
- La sección **Con-textos existe y está publicada** (`/articulos?categoria=con-textos`, con su descripción), pero muestra
  «0 artículos»: el especial «Ceuta no empezó en julio» sigue en **borrador** (por eso `/articulos/ceuta-no-empezo-en-julio`
  da 404 en público). Se publica desde `/admin/articulos`; hasta entonces la categoría aparece vacía.

### Nota anterior (3-10-2026, superada)

- `www.olvidos.es` sirve el despliegue del **3-9-2026** (commit `a0e3226`, PR #6).
  Nada de lo fusionado después (#14, #15, #16 menú móvil de los paneles, #17, #19
  redacción con La Banda, #20) está publicado en el dominio, aunque existan
  despliegues `READY` de producción en «Javier's projects» sin dominio asignado.
- Errores de runtime de los 7 días anteriores (proyecto de «Javier's projects», que
  es el que atiende el tráfico; ninguno en `/admin/articulos`): «Artículo no
  encontrado» en `/articulos/[slug]` (220, 42 usuarios: enlaces antiguos o
  inexistentes); `PrismaClient is not configured to run in Edge Runtime` en el
  middleware (56; `src/lib/auth.ts` lo captura y conserva la sesión, es ruido de
  registro); pool de conexiones agotado en la portada (4; límite 5, espera 10 s);
  «Failed to find Server Action» en `/contacto` (4; pestañas abiertas antes de un
  despliegue); un fallo PKCE en el login con Google.

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

- **Con-textos 29N**: app aparte (repo `elcorreveidile/sondeo-29n`) con cuenta
  atrás hasta las elecciones generales del 29-nov-2026, entregas diarias
  verificadas y sondeo ciudadano. Aquí solo se enlaza: tarjeta destacada
  (`Contextos29nCard`) arriba del listado `/articulos?categoria=con-textos`.
  Toda URL sale de `CONTEXTOS_29N_URL` (`src/lib/con-textos/contextos-29n.ts`,
  por defecto `https://29n.olvidos.es`; se sobreescribe con
  `NEXT_PUBLIC_CONTEXTOS_29N_URL`). El menú no tiene desplegable para las
  secciones, así que no se ha tocado.

## Certificados de publicación (oposiciones y baremos)

- Los autores piden «un informe del organismo emisor que certifique que la
  publicación aparece en la correspondiente base de datos bibliográfica, con
  la base de datos, el título, los autores, el año y la URL» (baremo de acceso
  a cátedras de Secundaria de la Junta de Andalucía, apartado 3.2.1,
  publicaciones solo electrónicas). Se expide desde
  `/admin/articulos/[id]/certificado` (ADMIN y EDITOR; icono de insignia en la
  lista de artículos; imprimir → guardar PDF; firma Javier como coordinador y
  vicepresidente, `CERTIFICATE_SIGNER` en `src/lib/site.ts`).
- **Qué se certifica**: que la revista figura en el **Registro Internacional
  del ISSN** (ISSN Portal, `https://portal.issn.org/resource/ISSN/2605-4515`,
  título clave «Olvidos.es», en línea). La revista **no** está en Dialnet ni en
  Latindex (comprobado el 6-10-2026), así que no se afirma; se avisa al autor
  de que la valoración depende del tribunal. Los artículos llevan etiquetas
  `citation_*` (Google Scholar) e `isPartOf` con el ISSN en el JSON-LD desde
  octubre de 2026.
- Primer certificado: Juan José Fernández Morales, «La historia social de las
  mentalidades. Releyendo a Maravall» (26-11-2025), expedido el 6-10-2026.

## Convenciones

- Idioma del código, comentarios, commits y PR: español.
- Antes de subir: `npx tsc --noEmit` (los ~124 errores previos no son
  nuestros), `npx next lint --dir src`, `npm run build` (la exportación del
  sitemap falla sin `DATABASE_URL`; es normal).
- Tailwind solo escanea `src/app`, `src/components` y `src/pages`.
