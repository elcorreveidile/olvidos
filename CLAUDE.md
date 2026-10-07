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

## Auditoría técnica (octubre de 2026)

- Auditoría externa del 6-10-2026 verificada punto por punto: correcta en lo
  esencial; tres cosas eran peores de lo dicho (las lecturas sin sesión
  devolvían el `User` completo con el hash de la contraseña; el canonical del
  layout raíz mandaba todas las páginas a la portada; 98 de los 124 errores de
  tsc están en `src/`). Plan completo y reparto en PR en
  `/root/.claude/plans` de la sesión; resumen aquí.
- **Hecho en el PR de seguridad (6-10-2026):** lecturas de `actions/*` cerradas
  (`getArticle`, `getArticles`, `getArticleBySlug` sin `publishedOnly`,
  `getEvent` → solo equipo; `getDocuments` → con sesión; `getMembers` sin
  correos para no administradores; `Article.author` siempre `select {id, name}`);
  OAuth solo con correo verificado (Google `email_verified`, GitHub
  `/user/emails`) y fallo cerrado; cabeceras de seguridad en `next.config.mjs`
  (CSP solo en modo informe); un único cliente Prisma (`prisma.ts` reexporta
  `db`); `SITE_URL` por defecto `https://www.olvidos.es` y canonical por página;
  `reply_to` en Resend; contraseñas nuevas de 8 caracteres (el login sigue
  aceptando las antiguas); `/buscar` fuera del índice; `not-found.tsx`.
- **Javier, en Vercel (proyecto de «Javier's projects»):** `NEXT_PUBLIC_SITE_URL=https://www.olvidos.es`;
  `DATABASE_URL` con la cadena *pooled* de Neon (host `…-pooler…`) y
  `?sslmode=require&pgbouncer=true&connection_limit=1`; y en Firewall → Rules
  dos reglas de *rate limit* por IP: `/api/auth/*`, `/api/users/register`,
  `/api/members/register` y `/contacto` a 10 peticiones/minuto (acción
  *challenge*); el resto sin cambios.
- **Fusionado el 7-10-2026 (PR #28 y #29; `prisma db push` hecho por Javier ese
  día):** dependencias con parches compatibles; login con contraseña y reset para
  cuentas OAuth; índices en `schema.prisma`; búsqueda paginada en SQL; caché (ver
  sección siguiente). Medido tras desplegar: portada 0,26 s con
  `x-vercel-cache: HIT`, `/articulos` 0,27 s, un artículo 0,24 s (antes 3–5 s).
- **También en el #29:** webhook de Stripe deduplicado por
  `event.id` (tabla `StripeEvent`; pago y apunte en
  una transacción; bienvenida solo al pasar a ACTIVE); HTML de artículos y
  actividades **sanitizado al guardar** (`src/lib/sanitize-html.ts`, lista
  blanca con iframes de visores y marcadores `<!--nextpage-->`/`isla`/`paso`
  protegidos; `scripts/sanitize-dry-run.ts` compara en seco contra la BD).
  **Dry-run en producción hecho el 7-10-2026** (385 textos): la primera lista
  perdía los iframes de **FlowPaper** (`flowpaper.com`, los números impresos) y
  **RTVE** (`secure-embed.rtve.es`), los atributos `role`/`tabindex`/`aria-*` y la
  presentación de tablas de WordPress; ya se admiten. Lo que sí se quita y está
  bien: los `<script>` de galerías Modula y del plugin de notas al pie (React no
  los ejecuta de todos modos), `onclick`/`onkeypress`, `crop`/`lightbox`/`seamless`
  y un `href` `file://`. Si el dry-run marca «texto distinto», comprobar primero
  que no sea una entidad (`&#8211;` → `–`) o un atributo vacío (`style=""` se
  emite como `style`): el script ya los normaliza. Subidas con lista blanca de MIME + extensión
  (`src/lib/uploads.ts`, sin SVG); mensajes de error de Prisma no se devuelven
  al navegador (`errorMessage` en `src/lib/action-errors.ts`); `loading.tsx` en
  los listados; `scripts/` ordenado en `legacy/` (escriben en BD) y
  `marketing/` (reels), con `scripts/README.md`.
- **Pendiente (PR por tema):** CI mínima y bajar los errores de tsc; split
  edge/node del middleware; CSP estricta; migrar a Next 15 (`next` 14 sin parche);
  registro mínimo (sin correos ni tokens) en `forgot-password`/`reset-password`.
- **GitHub Pages** está activado en el repo y falla en cada push a `main` (Jekyll
  no digiere `docs/con-textos/espana-marruecos/FUENTES.md`). La web no lo usa:
  hay que desactivarlo en Settings → Pages (Javier).
- Tras un despliegue, las pestañas abiertas del panel se quedan en la versión
  anterior: recargar antes de probar nada.
- **Imágenes «This image was hotlinked»** (visto el 7-10-2026 en el nº 13): la
  migración re-alojó los `src` en Blob pero dejó `srcset` apuntando a
  `olvidosdegranada.es` (con `uploads//`), y el navegador prefiere el `srcset`.
  Los originales ya no existen allí (404). Limpieza:
  `scripts/legacy/fix-srcset-legacy.ts` (primero sin `--aplicar`).

## Caché y tiempos de respuesta (PR 4, octubre de 2026)

- **Antes (medido el 6-10-2026 en `www.olvidos.es`, anónimo):** portada 3,3–4,2 s,
  `/articulos` 2,1 s, `/articulos?categoria=…` 3,2 s, un artículo 5,2 s,
  `/revista` 0,7 s, `/sobre-nosotros` 0,3 s; todo `no-store` y `x-vercel-cache:
  MISS`, y cada visita anónima recibía las cookies CSRF y callback de Auth.js.
  Causa: `auth()` en el layout raíz y en el pie (volvía dinámica toda la web),
  el middleware de Auth.js en todas las rutas, y cero caché de datos.
- **Qué hace ahora:**
  - El layout raíz y el pie **no leen la sesión**. La cabecera decide en el
    navegador con la **cookie-pista** `olvidos_sesion` (`src/lib/session-hint.ts`,
    hook `useSesionActiva`), que el middleware escribe/borra solo cuando cambia
    el estado (así las respuestas normales no llevan `Set-Cookie`). No da acceso
    a nada: es solo para pintar «Mi cuenta»/«Hazte socio». Cerrar sesión recarga
    la portada (`window.location`) para que se actualice.
  - El middleware ejecuta Auth.js **solo en `/admin`, `/mi-cuenta` y `/socios`**;
    en el resto no toca el JWT ni pone cookies.
  - **Data Cache** (`src/lib/cache.ts`, `cachedQuery`): todas las lecturas de
    `src/lib/queries.ts` y el artículo publicado por slug (`actions/articles.ts`)
    se guardan 5 min con etiquetas `articulos`, `revista`, `actividades`,
    `categorias`, `etiquetas`. Las acciones del panel (crear/editar/borrar
    artículos, números, actividades, categorías y etiquetas) llaman a
    `revalidatePublic(...)`, que invalida la etiqueta y la portada. Las fechas
    vuelven a `Date` con `reviveDates` (la caché serializa a JSON). La búsqueda
    (`searchArticles`) no se cachea.
  - **Portada** con `revalidate = 300` (HTML cacheado; `x-vercel-cache: HIT`).
  - Listados (`/articulos`, `/categoria`, `/etiqueta`, `/autor`, `/revista`) y el
    artículo (`?paso=`) siguen siendo **dinámicos por `searchParams`**, pero sin
    consultas a la base de datos en caliente (probado en local: 0 SQL en visitas
    repetidas). Se les quitó el `force-dynamic` redundante (la Data Cache funciona
    con y sin él: `/revista/[slug]` lo conserva y tampoco consulta la BD).
- **Lecciones (no repetir):** en Next 14 un segmento dinámico sin
  `generateStaticParams` no se cachea aunque tenga `revalidate`; y en una ruta
  ISR, llamar a `auth()`/`headers()` «solo a veces» (vista previa de borradores)
  no degrada a dinámico: da **500 `DYNAMIC_SERVER_USAGE`**. Por eso
  `/revista/[slug]` sigue `force-dynamic` (con datos cacheados). Si algún día se
  quiere ISR ahí, la vista previa debe ir por `draftMode()` o por otra ruta.
- **Scripts que escriben en la BD sin pasar por el panel:** lo publicado tarda
  hasta 5 min en verse (o se fuerza con un redeploy).
- **Probar en local con BD:** hay PostgreSQL 16 en el contenedor
  (`/usr/lib/postgresql/16/bin`); `initdb` + `pg_ctl` como usuario `postgres`,
  `CREATE EXTENSION unaccent`, `.env.local` con `DATABASE_URL` local y
  `AUTH_SECRET`, `prisma db push`, `npm run db:seed`, `npm run build`, `next start`.
  Con `log_statement=all` se cuentan las consultas por visita.

## Convenciones

- Idioma del código, comentarios, commits y PR: español.
- Antes de subir: `npx tsc --noEmit` (los ~124 errores previos no son
  nuestros), `npx next lint --dir src`, `npm run build` (la exportación del
  sitemap falla sin `DATABASE_URL`; es normal).
- Tailwind solo escanea `src/app`, `src/components` y `src/pages`.
