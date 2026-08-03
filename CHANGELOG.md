# Changelog — Olvidos de Granada

Generado automáticamente desde el historial de git (`scripts/gen-changelog.mjs`). No editar a mano.

La versión que se muestra en el footer es la fecha del último commit (`AAAA.M.D`) y la calcula `next.config.mjs`.

## 2026.8.3 — 2026-08-03

- Junta Directiva solo para socios + 'Volver a la revista' en paneles (22ad774)
- Página de Junta Directiva (presidencia, vicepresidencia, secretaría) (80fc23e)
- Sobre Olvidos: añadir sección Nuestros fines (art. 6 de los estatutos) (4c4b714)
- Carné: quitar ID/email del reverso y marcar socios fundadores (1ea8230)
- Contabilidad, Socio de Honor y verificación de carné por QR (c60b4ea)
- Carné: logo de la asociación + foto del socio subida por él (ba0be6f)
- Pasos de Piezas y Procesos + recuperación de imágenes + sharp (1a81b4d)

## 2026.8.2 — 2026-08-02

- Subida de imágenes, autor por artículo y slugs descriptivos (f134d56)
- Portadas automáticas desde el cuerpo + marcador dedicado Soneto500 (ed385b7)
- Imágenes re-alojadas en Blob + selector focal, reskin admin y arreglos varios (6d9ca6a)
- Favicon: corregir favicon.ico (salía en blanco por rasterizado de ImageMagick) (98746ea)
- Favicon: añadir favicon.ico (multi-tamaño) y apple-icon.png (f059c8b)
- Login social + enlace mágico, rediseño de socios, documentos y correos (3b45271)

## 2026.8.1 — 2026-08-01

- Añadir CRUD de admin para los números de la revista (afaadbd)
- Ampliar el esquema para la hemeroteca (03950ad)
- Añadir informe de estado inicial del repositorio (8e91670)
- Sincronizar package-lock tras npm install (acb7489)
- Eliminar páginas y endpoint de depuración de autenticación (e6267e9)
- Actualizar .env.example e ignorar la config local de Claude (4f1e761)
- Autoalojar las fuentes en lugar de cargarlas de Google (9a2ee1e)
- Recuperar animación de entrada del logo en la portada (ae31f52)
- Unificar recuperación de contraseña y registro sobre los arreglos de auth (e05722a)

## 2026.2.20 — 2026-02-20

- feat: add API endpoint to clear auth session (9fbf779)
- fix: make JWT callback fetch role from database when token has no role (47658c3)
- fix: return user object with correct role from GitHub signIn callback (b0142b2)
- fix: update GitHub sign in callback to use role from database (fc6fb04)
- fix: convert logout page to client component to avoid server errors (154b1e0)
- feat: add logout page to force session refresh (f1a5d64)
- fix: prevent redirect loop in middleware (ae968bd)
- feat: add test-auth page to debug session data (e67a3cf)
- fix: add environment logging to debug auth config issues (14132e0)
- fix: add comprehensive logging to all auth callbacks (8c97605)
- fix: add comprehensive logging to debug login issues (077b2f6)
- fix: update middleware matcher to protect all routes (5e515b9)
- fix: add detailed middleware logging to debug auth issues (2473032)
- fix: improve auth error handling and add defensive coding (a440d1b)
- fix: properly handle NEXT_REDIRECT error in login actions (9263e75)
- fix: add env validation and handle missing GitHub credentials (1c5a52f)
- fix: resolve 'headers called outside request scope' error (d41dc33)
- Revert "feat: add animated logo entrance on homepage" (20af0ec)
- chore: remove debug logs and clean up prisma schema (744ee00)
- fix: resolve production login issue by extracting server actions (be0b039)
- feat: add animated logo entrance on homepage (f16264a)

## 2026.2.19 — 2026-02-19

- fix: repair broken signout link in member area (5d4c510)
- fix: resolve React hydration errors by simplifying auth components (a180504)
- fix: resolve blank screen after admin login (35184d6)
- fix: resolve login redirect loop for non-member users (df2794c)
- feat: add member area link to header navigation (0109d20)
- fix: resolve login authentication error and add mobile viewport (9413e1f)
- fix: wrap useSearchParams in Suspense boundary to fix build error (11ff731)
- fix: resolve NextAuth serialization error and implement member registration flow (6fc13b0)
- feat: add error boundaries for better error handling (18202a0)
- fix: improve login error handling and add healthcheck endpoint (68a65e7)
- fix: improve login error handling and display (2bc26a3)
- Add working logout action to admin panel header (405786f)
- Route footer member area link to /mi-cuenta for signed-in users (6e1b534)
- Add admin users page to fix /admin/usuarios 404 (6623526)
- Allow admin users to access member dashboard (bb0e287)
- Add real admin site configuration with persisted settings (fec657a)
- fix: admin navigation and session persistence (1102a3f)
- feat: admin member creation, fix OAuth flow, legal pages (5ba80bb)
- fix: arreglar formulario de login con credenciales (9a20f1e)
- fix: arreglar flujo de login con GitHub OAuth (2d41245)
- fix: arreglar botón de GitHub OAuth que no se abría (3ec6c1b)
- feat: crear aviso legal y arreglar redirect de GitHub OAuth (440bfaf)

## 2026.2.18 — 2026-02-18

- feat: crear páginas legales (Términos y Política de Privacidad) (091771e)
- feat: crear página de registro de socio en 3 pasos (9b8bf92)
- feat: crear páginas faltantes y arreglar filtros (7604790)
- fix: agregar dynamic='force-dynamic' a rutas API con auth/headers (5e6d568)
- fix: arreglar páginas de categorías, etiquetas y revista (5128f03)
- fix: agregar funciones faltantes getPublishedArticles y getArticleBySlug (20c541a)
- feat: agregar páginas faltantes (articulos, memoria, sobre-nosotros) (d9342b1)
- fix: generar Prisma Client durante build (3d349c1)
- fix: desactivar ESLint y TypeScript durante build temporalmente (a33c3d3)
- fix: arreglar tipado de registrationStatus (62daedc)
- fix: arreglar error TypeScript en actividades/[slug] (7b5b9aa)
- fix: cambiar bcrypt por bcryptjs en seed (3df721e)
- fix: corregir todos los errores de ESLint (3ce1898)
- fix: corregir errores de sintaxis en Fase 4 (a430d21)
- feat: añadir guía de despliegue y seed de datos (c68507d)
- feat: completar Fase 4 - Gestión de Actividades/Eventos (cffdfcf)
- feat: completar Fase 3 - Gestión de Socios (ba2f72a)
- feat: completar Fase 2 - Contenido Editorial (866a439)
- feat: scaffold Phase 1 — Next.js project with Tailwind, Prisma, NextAuth (4501559)
- Inicializar proyecto: README, arquitectura y prompt de continuación (8db7450)
