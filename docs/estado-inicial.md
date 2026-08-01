# Estado inicial del repositorio

_Puesta en orden del repositorio antes de empezar a programar. Fecha: 2026-08-01._

## Resumen

El repositorio queda unificado en una sola línea de trabajo, con el proyecto
compilando y arrancando en local, las fuentes autoalojadas y el entorno
rescatado. La rama `main` (a partir de `work`) es la que debe pasar a ser la
rama por defecto en GitHub.

## 1. Rama actual

- Trabajo unificado sobre **`work`**, que era el tronco real (contenía los 20
  arreglos de autenticación: bucles de redirección, rol en el JWT, callbacks de
  GitHub, matcher del middleware, extracción de server actions del login).
- Sobre ese tronco se ha creado la rama **`main`**, que es la definitiva.

## 2. Qué se ha unificado

Las dos ramas divergían en `f16264a`. La rama por defecto anterior
(`claude/plan-magazine-website-redesign-GmiqK`) aportaba de contenido un único
commit real, `11dc2d8` (el otro, `441653c`, era solo su merge). Ese commit se ha
traído sobre `work` resolviendo a mano los tres choques, que caían justo en los
ficheros de autenticación:

| Fichero | Resolución |
|---|---|
| `src/lib/auth.ts` | Se conserva `work` entero (validación de env, rol desde BD en el JWT, callbacks de GitHub). El PR solo eliminaba `console.log`. |
| `src/app/layout.tsx` | Base de `work` (layout `async` + `auth()` + `isAuthenticated` al Header); se retira `next/font/google`. |
| `src/app/login/page.tsx` | Arquitectura de `work` (server actions extraídos a `./actions`) + UI del PR (mensaje de registro, enlace a recuperar contraseña, enlace a registro, `<Link>`). El redirect tras login pasa a `/post-login` (enrutado por rol). |

Del PR se incorporan sin conflicto: recuperación de contraseña
(`/recuperar-contrasena`, `/restablecer-contrasena` y sus endpoints), registro
de usuario (`/registro` + endpoint), enrutado por rol (`/post-login`), robustez
del correo (`email.ts`) y del webhook de Stripe, y un documento de code review.

Commits añadidos sobre `origin/work`:

```
Unificar recuperación de contraseña y registro sobre los arreglos de auth
Recuperar animación de entrada del logo en la portada
Autoalojar las fuentes en lugar de cargarlas de Google
Actualizar .env.example e ignorar la config local de Claude
Eliminar páginas y endpoint de depuración de autenticación
Sincronizar package-lock tras npm install
```

### Decisiones tomadas

- **Animación del logo:** se recupera. `work` la había revertido (`20af0ec`); se
  reaplica `f16264a` (componente `Hero` + keyframes CSS, sin imágenes; se
  reproduce una vez por usuario vía `localStorage`).
- **Política de fuentes:** autoalojado real. Lo que el PR llamaba "sin
  dependencia en build" en realidad cargaba las fuentes de Google por `@import`
  en runtime. En su lugar, las fuentes (Libre Franklin y Crimson Text, licencia
  OFL) se descargan a `public/fonts/` y se sirven con `@font-face` locales
  (`src/app/fonts.css`), sin dependencia de Google ni en build ni en runtime.

## 3. Qué se ha rescatado

- **`public/`:** no estaba en ninguna rama (nunca se subió) y la copia del
  Escritorio estaba **vacía** (ni logo, ni imágenes, ni fuentes). El código no
  referencia ningún asset estático de `public/` (las portadas vienen de la base
  de datos). El único `public/` que existe ahora es `public/fonts/`, creado al
  autoalojar las fuentes. **No había nada más que rescatar.**
- **`.env` y `.env.local`:** copiados desde la carpeta del Escritorio. Están
  fuera de git (ignorados por `.gitignore`). **No se suben nunca.**
- Ningún fichero del Escritorio estaba vaciado por iCloud (`Blocks: 0`) ni había
  placeholders `.icloud`.
- **`.env.example`:** actualizado. Usaba `NEXTAUTH_URL`/`NEXTAUTH_SECRET`, pero
  el código usa `AUTH_SECRET`, `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET` (NextAuth
  v5). Se añaden esas variables y `RESEND_FROM_EMAIL`.

## 4. ¿Arranca?

Sí. Verificado en local:

- `npm install` — OK.
- `npx prisma generate` — OK (solo aviso de que hay una versión mayor
  disponible, no error).
- `npm run build` — **compila sin errores**. Aparecen las rutas nuevas y ya no
  están las de depuración.
- `npm run dev` — arranca en `http://localhost:3000`. La home responde `200` y
  renderiza artículos y eventos reales desde la base de datos. `/login`,
  `/registro` y `/recuperar-contrasena` responden `200`. Las fuentes locales se
  sirven correctamente (`/fonts/*.woff2` → `200 font/woff2`).

- **Base de datos:** `DATABASE_URL` apunta a
  `...eu-central-1.aws.neon.tech` (Neon sobre **AWS Fráncfort**, `eu-central-1`).
  Correcto: no está en Estados Unidos.

## 5. Limpieza

- Eliminadas las páginas y el endpoint de depuración de autenticación:
  `/test-auth` (volcaba la sesión y exponía si había secretos), `/logout`
  (borrado manual de cookies) y `/api/clear-session`. Estaban huérfanos; el
  cierre de sesión real se hace con `signOut()` de NextAuth.
- `.claude/`: se ignora `settings.local.json` (config personal). No existe
  todavía un `settings.json` compartido que versionar; cuando se cree, quedará
  versionado por defecto.

## 6. Pendiente

- **Rama por defecto en GitHub:** falta marcar `main` como rama por defecto (ver
  instrucciones que acompañan a esta entrega). No se ha tocado la configuración
  de GitHub.
- **Sistema de identificación → Magic link:** decisión de producto pendiente de
  implementar. El login actual es por credenciales (email + contraseña) y
  GitHub OAuth. Migrar a enlaces mágicos implica añadir el proveedor Email de
  NextAuth/Auth.js, adaptar el flujo de `/login` y `/post-login`, y decidir qué
  pasa con el registro por contraseña. **No implementado**: aún no se escribe
  código de aplicación.
- **Primera fase de programación:** arreglar el esquema para la hemeroteca.
- Prisma 5 → 7 disponible (opcional, no urgente).
