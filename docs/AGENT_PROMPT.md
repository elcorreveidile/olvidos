# Prompt de continuación del proyecto Olvidos de Granada

Usa este prompt para que otro agente IA (Claude, Cursor, etc.) retome el desarrollo del proyecto.

---

## Prompt

```
Eres un desarrollador senior full-stack especializado en Next.js y TypeScript. Tu tarea es implementar la nueva web de "Olvidos de Granada", una revista cultural y literaria de Granada (España).

## Contexto del proyecto

- El proyecto está en el repositorio `olvidos/`
- Lee `docs/ARCHITECTURE.md` para entender la arquitectura completa, el modelo de datos y las fases de implementación
- Lee `README.md` para una visión general
- El sitio actual es WordPress (https://olvidosdegranada.es) y se va a migrar completamente

## Requisitos críticos de diseño

El diseño debe ser IDÉNTICO al sitio actual. Estos son los tokens no negociables:

### Colores
- Primary (coral): #ff6261
- Primary light: #fc9292
- Dark blue (títulos): #013559
- Steel (menú secciones): #617685
- Steel light (bordes): #a1b6c4
- Fondo: #ffffff

### Tipografía
- Títulos/UI: "Libre Franklin", sans-serif (pesos 600-900)
- Cuerpo editorial: "Crimson Text", serif (peso 400)
- Párrafos: text-align justify, text-indent 2em, line-height 1.35em, max-width 695px, hyphens auto
- H1 artículo: 90px, line-height 73px, letter-spacing -1px
- H2: 41px, color #013559, letter-spacing -1px

### Logo
- Texto: `[olvidos` (corchete abierto en coral + "olvidos" en minúsculas, Libre Franklin bold)
- Subtítulo: "Revista de acciones culturales"

### Patrones visuales clave
- Categorías se muestran como `[NombreCategoria` (corchete en coral)
- Tags se muestran como `(NombreTag)` (paréntesis en coral)
- Las tarjetas de artículos tienen fondo coral #ff6261 con título en azul oscuro #013559
- Hover en tarjetas: fondo coral, texto blanco, scale(1.01) + box-shadow
- Bordes con box-shadow: 0px 0px 0px 1px rgba(161,182,196,0.5)
- Selección de texto: fondo #ff6261, color blanco

### Navegación (dos niveles)
- Principal: "SOBRE OLVIDOS", "MEMORIA" (dropdown), "ENCUENTROS", icono búsqueda, hamburguesa
- Secciones: "Editoriales", "Palabras", "Piezas y Procesos", "Soneto500" (en #617685, Libre Franklin 700)

## Stack tecnológico (ya decidido, no cambiar)

- Next.js 14+ con App Router (RSC + Server Actions)
- TypeScript estricto
- Tailwind CSS con custom design tokens
- shadcn/ui personalizado con los tokens de Olvidos
- Prisma como ORM
- PostgreSQL en Neon Serverless
- NextAuth.js v5 (Auth.js) para autenticación
- Stripe para pagos de membresías
- Tiptap como editor rich-text
- Vercel Blob o Cloudinary para imágenes
- Resend para email transaccional
- Deploy en Vercel

## Fases de implementación

Sigue estas fases en orden:

### Fase 1: Fundación (prioridad alta)
1. `npx create-next-app@latest` con TypeScript, Tailwind, App Router
2. Configurar `tailwind.config.ts` con todos los design tokens (colores, fuentes, spacing)
3. Self-host fonts: descargar Libre Franklin (600,700,800,900) y Crimson Text (400,400i) de Google Fonts, colocar en `public/fonts/`
4. Configurar `globals.css` con CSS custom properties
5. Configurar Prisma: crear `prisma/schema.prisma` con TODO el modelo de datos (ver ARCHITECTURE.md sección 5)
6. Configurar NextAuth.js con credenciales email/password
7. Crear layout raíz con Header (logo + nav dos niveles) y Footer
8. Crear componente Sidebar (categorías, posts recientes, buscador)

### Fase 2: Contenido Editorial
1. Componentes: ArticleCard (tarjeta coral), ArticleGrid (grid responsive), ArticleFull (vista lectura)
2. Páginas: Home (grid artículos), /articulo/[slug], /categoria/[slug], /etiqueta/[slug], /buscar
3. Editor Tiptap en admin con extensiones (pullquotes, footnotes, galerías)
4. CRUD artículos, categorías, tags, números de revista en /admin

### Fase 3: Gestión de Socios
1. Registro de socios con formulario multi-step
2. Stripe: crear productos/precios para cada nivel de membresía (Standard, Benefactor, Honorary)
3. Webhook Stripe en /api/stripe/webhook para sincronizar pagos
4. Dashboard socio: /mi-cuenta (perfil, pagos, carnet digital con QR)
5. Directorio público de socios (opt-in)
6. Middleware para contenido exclusivo
7. Panel admin de socios: listado, filtros, alta manual, cambiar nivel/estado

### Fase 4: Actividades
1. CRUD eventos en admin (tipos: presentación, recital, conferencia, taller, exposición, encuentro)
2. Vista pública: listado + calendario + detalle
3. Inscripción para socios
4. Emails de confirmación con Resend

### Fase 5: Migración WordPress
1. Script `scripts/migrate-wordpress.ts` que parsea XML export de WordPress
2. Convertir HTML → Tiptap JSON
3. Migrar imágenes a storage
4. Redirects 301 en next.config.ts: /index.php/YYYY/MM/DD/slug → /articulo/slug

### Fase 6: Pulido
1. SEO: meta tags, Open Graph, structured data (Article, Organization)
2. Sitemap.xml dinámico
3. next/image para todas las imágenes
4. ISR para artículos publicados
5. Responsive (breakpoints: 768px, 840px)
6. Accesibilidad WCAG 2.1 AA

## Modelo de datos

El schema Prisma completo está en `docs/ARCHITECTURE.md` sección 5. Incluye:
- User (con roles: ADMIN, EDITOR, AUTHOR, MEMBER_MANAGER, SUBSCRIBER)
- Article (con status: DRAFT, REVIEW, PUBLISHED, ARCHIVED)
- Category (jerárquica con parent/children)
- Tag
- MagazineIssue
- Event (con tipos y status)
- EventRegistration
- Member (con niveles: STANDARD, BENEFACTOR, HONORARY)
- Payment (integrado con Stripe)
- Page (páginas estáticas)

## Reglas de desarrollo

1. Usa Server Components por defecto. Solo usa "use client" cuando sea necesario (interactividad, hooks del navegador)
2. Usa Server Actions para mutaciones de datos (no API routes cuando no sea necesario)
3. Validación con Zod en server actions y formularios
4. Componentes shadcn/ui como base, personalizados con los tokens de Olvidos
5. Todas las consultas a DB a través de Prisma
6. Nunca hardcodear textos de UI — usa constantes o config
7. Imágenes siempre con next/image
8. Código en inglés, contenido/UI en español
9. Commits descriptivos en español

## Empieza por

Si el proyecto está vacío, empieza por la Fase 1 (Fundación). Si ya hay código, lee lo existente y continúa desde donde se dejó.
```
