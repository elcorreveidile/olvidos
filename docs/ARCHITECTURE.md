# Olvidos de Granada - Arquitectura del Nuevo Sitio Web

## 1. Visión General del Proyecto

**Objetivo**: Migrar la revista cultural "Olvidos de Granada" desde WordPress a una plataforma moderna con Next.js + PostgreSQL, añadiendo gestión avanzada de socios, actividades y publicaciones editoriales.

**Sitio actual**: https://olvidosdegranada.es (WordPress)
**Contenido a migrar**: ~100-500 artículos/entradas

### Principios de Diseño
- **Fidelidad visual**: Mantener el diseño limpio actual, colores corporativos y logotipo
- **Rendimiento**: Carga rápida con SSG/ISR para contenido público
- **Accesibilidad**: WCAG 2.1 AA
- **SEO**: Mantener URLs y posicionamiento existente
- **Escalabilidad**: Arquitectura modular para crecer

---

## 2. Stack Tecnológico

| Componente | Tecnología | Justificación |
|---|---|---|
| **Framework** | Next.js 14+ (App Router) | SSR/SSG/ISR, API Routes, middleware |
| **Lenguaje** | TypeScript | Tipado estático, mejor DX |
| **Base de datos** | PostgreSQL (Neon) | Serverless, branching, escalable |
| **ORM** | Prisma | Type-safe, migraciones, buena DX |
| **Autenticación** | NextAuth.js (Auth.js v5) | Multi-provider, sesiones, roles |
| **Pagos** | Stripe | Suscripciones recurrentes, portal de cliente |
| **Almacenamiento** | Cloudflare R2 o AWS S3 | Imágenes, PDFs de la revista, media |
| **Email** | Resend | Email transaccional (confirmaciones, newsletters) |
| **Estilos** | Tailwind CSS | Utility-first, coherente con diseño limpio |
| **UI Components** | shadcn/ui | Componentes accesibles, personalizables |
| **Hosting** | Vercel | Deploy automático, edge functions, preview deploys |
| **CMS Headless** | Panel admin propio (React) | Control total sobre la experiencia editorial |

---

## 3. Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────┐
│                    VERCEL (Edge)                     │
│  ┌───────────────────────────────────────────────┐  │
│  │              Next.js App Router                │  │
│  │                                                │  │
│  │  ┌──────────┐  ┌──────────┐  ┌─────────────┐ │  │
│  │  │  Público  │  │  Socios  │  │    Admin     │ │  │
│  │  │ (SSG/ISR) │  │ (SSR)    │  │   (SSR)     │ │  │
│  │  │          │  │          │  │             │ │  │
│  │  │ - Home   │  │ - Área   │  │ - Dashboard │ │  │
│  │  │ - Revista│  │   privada│  │ - Contenido │ │  │
│  │  │ - Blog   │  │ - Carnet │  │ - Socios    │ │  │
│  │  │ - Eventos│  │ - Pagos  │  │ - Eventos   │ │  │
│  │  │ - Quiénes│  │ - Exclu- │  │ - Pagos     │ │  │
│  │  │   somos  │  │   sivo   │  │ - Config    │ │  │
│  │  └──────────┘  └──────────┘  └─────────────┘ │  │
│  │                                                │  │
│  │  ┌──────────────────────────────────────────┐ │  │
│  │  │           API Routes (/api)               │ │  │
│  │  │  - /api/auth/*    (NextAuth)              │ │  │
│  │  │  - /api/members/* (gestión socios)        │ │  │
│  │  │  - /api/events/*  (actividades)           │ │  │
│  │  │  - /api/content/* (artículos/revista)     │ │  │
│  │  │  - /api/payments/*(Stripe webhooks)       │ │  │
│  │  │  - /api/admin/*   (panel administración)  │ │  │
│  │  └──────────────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────┘  │
└────────────┬──────────────┬──────────────┬──────────┘
             │              │              │
     ┌───────▼──────┐ ┌────▼─────┐ ┌──────▼──────┐
     │  PostgreSQL   │ │  Stripe  │ │ Cloudflare  │
     │  (Neon)       │ │  API     │ │ R2 / S3     │
     │               │ │          │ │             │
     │ - Usuarios    │ │ - Pagos  │ │ - Imágenes  │
     │ - Socios      │ │ - Suscr. │ │ - PDFs      │
     │ - Artículos   │ │ - Portal │ │ - Media     │
     │ - Eventos     │ │          │ │             │
     │ - Categorías  │ └──────────┘ └─────────────┘
     │ - Pagos log   │
     └───────────────┘
```

---

## 4. Estructura del Proyecto

```
olvidos/
├── docs/                          # Documentación
│   ├── ARCHITECTURE.md            # Este archivo
│   └── MIGRATION.md               # Plan de migración
├── prisma/
│   ├── schema.prisma              # Esquema de base de datos
│   ├── seed.ts                    # Datos iniciales
│   └── migrations/                # Migraciones DB
├── public/
│   ├── images/                    # Imágenes estáticas
│   ├── fonts/                     # Fuentes locales
│   └── logo/                      # Logotipo en varios formatos
├── src/
│   ├── app/                       # App Router (Next.js)
│   │   ├── (public)/              # Rutas públicas
│   │   │   ├── page.tsx           # Home
│   │   │   ├── revista/
│   │   │   │   ├── page.tsx       # Listado de números
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx   # Número específico
│   │   │   ├── articulos/
│   │   │   │   ├── page.tsx       # Blog/artículos
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx   # Artículo individual
│   │   │   ├── actividades/
│   │   │   │   ├── page.tsx       # Calendario de eventos
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx   # Evento individual
│   │   │   ├── memoria/
│   │   │   │   └── page.tsx       # Memoria de Olvidos (archivo histórico)
│   │   │   ├── sobre-nosotros/
│   │   │   │   └── page.tsx       # Quiénes somos
│   │   │   └── contacto/
│   │   │       └── page.tsx       # Formulario de contacto
│   │   ├── (auth)/                # Rutas de autenticación
│   │   │   ├── login/
│   │   │   ├── registro/
│   │   │   └── recuperar/
│   │   ├── socios/                # Área privada de socios (protegida)
│   │   │   ├── layout.tsx         # Layout con sidebar de socio
│   │   │   ├── page.tsx           # Dashboard del socio
│   │   │   ├── perfil/
│   │   │   │   └── page.tsx       # Editar perfil
│   │   │   ├── carnet/
│   │   │   │   └── page.tsx       # Carnet digital
│   │   │   ├── pagos/
│   │   │   │   └── page.tsx       # Historial de pagos y facturación
│   │   │   ├── contenido-exclusivo/
│   │   │   │   └── page.tsx       # Contenido solo para socios
│   │   │   └── directorio/
│   │   │       └── page.tsx       # Directorio de socios
│   │   ├── admin/                 # Panel de administración (protegido)
│   │   │   ├── layout.tsx         # Layout admin con sidebar
│   │   │   ├── page.tsx           # Dashboard general
│   │   │   ├── contenido/
│   │   │   │   ├── page.tsx       # Gestión de artículos
│   │   │   │   ├── nuevo/
│   │   │   │   └── [id]/
│   │   │   ├── revista/
│   │   │   │   ├── page.tsx       # Gestión de números
│   │   │   │   ├── nuevo/
│   │   │   │   └── [id]/
│   │   │   ├── actividades/
│   │   │   │   ├── page.tsx       # Gestión de eventos
│   │   │   │   ├── nuevo/
│   │   │   │   └── [id]/
│   │   │   ├── socios/
│   │   │   │   ├── page.tsx       # Listado y gestión de socios
│   │   │   │   └── [id]/
│   │   │   ├── pagos/
│   │   │   │   └── page.tsx       # Registro de pagos y cuotas
│   │   │   ├── usuarios/
│   │   │   │   └── page.tsx       # Gestión de roles del equipo
│   │   │   └── configuracion/
│   │   │       └── page.tsx       # Configuración del sitio
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │   │       └── route.ts   # NextAuth handler
│   │   │   ├── members/
│   │   │   │   └── route.ts       # CRUD socios
│   │   │   ├── events/
│   │   │   │   └── route.ts       # CRUD eventos
│   │   │   ├── content/
│   │   │   │   └── route.ts       # CRUD artículos
│   │   │   ├── payments/
│   │   │   │   ├── route.ts       # Crear sesión de pago
│   │   │   │   └── webhook/
│   │   │   │       └── route.ts   # Stripe webhooks
│   │   │   └── upload/
│   │   │       └── route.ts       # Subida de archivos
│   │   ├── layout.tsx             # Root layout
│   │   └── globals.css            # Estilos globales + tokens de diseño
│   ├── components/
│   │   ├── ui/                    # shadcn/ui components
│   │   ├── layout/
│   │   │   ├── Header.tsx         # Navegación principal
│   │   │   ├── Footer.tsx         # Pie de página
│   │   │   └── Sidebar.tsx        # Sidebar reutilizable
│   │   ├── content/
│   │   │   ├── ArticleCard.tsx    # Tarjeta de artículo
│   │   │   ├── MagazineIssue.tsx  # Portada de número
│   │   │   ├── EventCard.tsx      # Tarjeta de evento
│   │   │   └── RichTextEditor.tsx # Editor de contenido (admin)
│   │   ├── members/
│   │   │   ├── MemberCard.tsx     # Tarjeta de socio
│   │   │   ├── DigitalCard.tsx    # Carnet digital
│   │   │   └── PaymentHistory.tsx # Historial de pagos
│   │   └── shared/
│   │       ├── SearchBar.tsx
│   │       ├── Pagination.tsx
│   │       └── ImageUpload.tsx
│   ├── lib/
│   │   ├── db.ts                  # Cliente Prisma singleton
│   │   ├── auth.ts                # Configuración NextAuth
│   │   ├── stripe.ts              # Cliente y utilidades Stripe
│   │   ├── storage.ts             # Utilidades de almacenamiento (R2/S3)
│   │   ├── email.ts               # Utilidades de email (Resend)
│   │   ├── validators.ts          # Schemas Zod para validación
│   │   └── utils.ts               # Utilidades generales
│   ├── hooks/                     # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── usePagination.ts
│   │   └── useDebounce.ts
│   └── types/                     # Tipos TypeScript
│       ├── content.ts
│       ├── member.ts
│       └── event.ts
├── scripts/
│   └── migrate-wordpress.ts       # Script de migración desde WordPress
├── .env.example                   # Variables de entorno
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## 5. Modelo de Base de Datos

### Diagrama Entidad-Relación

```prisma
// ============================================
// USUARIOS Y AUTENTICACIÓN
// ============================================

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  password      String?   // null si login con provider externo
  image         String?
  role          Role      @default(USER)
  emailVerified DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relaciones
  accounts      Account[]
  sessions      Session[]
  member        Member?
  articles      Article[]       @relation("author")
  events        Event[]         @relation("organizer")
}

enum Role {
  USER          // Visitante registrado
  MEMBER        // Socio activo
  EDITOR        // Editor de contenido
  MEMBER_ADMIN  // Gestor de socios
  ADMIN         // Administrador general
}

// ============================================
// SOCIOS / MEMBRESÍA
// ============================================

model Member {
  id              String          @id @default(cuid())
  userId          String          @unique
  memberNumber    Int             @unique @default(autoincrement())
  membershipLevel MembershipLevel @default(STANDARD)
  status          MemberStatus    @default(PENDING)
  joinDate        DateTime        @default(now())
  renewalDate     DateTime?
  bio             String?
  phone           String?
  address         String?
  city            String?
  isPublic        Boolean         @default(false) // Visible en directorio
  cardImageUrl    String?         // Foto para carnet digital
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt

  // Relaciones
  user            User            @relation(fields: [userId], references: [id])
  payments        Payment[]
  eventAttendees  EventAttendee[]
}

enum MembershipLevel {
  STANDARD        // Socio estándar
  COLLABORATOR    // Socio colaborador (beneficios extra)
  HONORARY        // Socio honorario
  INSTITUTIONAL   // Instituciones
}

enum MemberStatus {
  PENDING         // Pendiente de aprobación/pago
  ACTIVE          // Socio activo (cuota al día)
  EXPIRED         // Cuota vencida
  SUSPENDED       // Suspendido
  CANCELLED       // Baja voluntaria
}

// ============================================
// PAGOS Y SUSCRIPCIONES
// ============================================

model Payment {
  id                String        @id @default(cuid())
  memberId          String
  amount            Decimal       @db.Decimal(10, 2)
  currency          String        @default("EUR")
  status            PaymentStatus
  type              PaymentType
  stripePaymentId   String?       @unique
  stripeInvoiceId   String?
  description       String?
  periodStart       DateTime?
  periodEnd         DateTime?
  paidAt            DateTime?
  createdAt         DateTime      @default(now())

  member            Member        @relation(fields: [memberId], references: [id])
}

enum PaymentStatus {
  PENDING
  COMPLETED
  FAILED
  REFUNDED
  CANCELLED
}

enum PaymentType {
  MEMBERSHIP_FEE    // Cuota anual/mensual
  EVENT_TICKET      // Entrada a evento
  DONATION          // Donación
  OTHER
}

// ============================================
// CONTENIDO EDITORIAL
// ============================================

model Article {
  id            String          @id @default(cuid())
  title         String
  slug          String          @unique
  excerpt       String?
  content       String          @db.Text
  coverImage    String?
  status        ContentStatus   @default(DRAFT)
  featured      Boolean         @default(false)
  membersOnly   Boolean         @default(false)  // Contenido exclusivo socios
  authorId      String
  issueId       String?         // Número de la revista (opcional)
  publishedAt   DateTime?
  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt

  // SEO
  metaTitle       String?
  metaDescription String?

  // WordPress migration
  wpId          Int?            @unique  // ID original de WordPress

  // Relaciones
  author        User            @relation("author", fields: [authorId], references: [id])
  issue         MagazineIssue?  @relation(fields: [issueId], references: [id])
  categories    CategoriesOnArticles[]
  tags          TagsOnArticles[]
  media         Media[]
}

enum ContentStatus {
  DRAFT
  REVIEW        // En revisión por editor
  PUBLISHED
  ARCHIVED
}

model MagazineIssue {
  id            String    @id @default(cuid())
  number        Int       @unique
  title         String
  slug          String    @unique
  description   String?   @db.Text
  coverImage    String?
  pdfUrl        String?   // PDF del número completo
  publishedAt   DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relaciones
  articles      Article[]
}

model Category {
  id          String    @id @default(cuid())
  name        String    @unique
  slug        String    @unique
  description String?
  parentId    String?

  parent      Category?  @relation("CategoryTree", fields: [parentId], references: [id])
  children    Category[] @relation("CategoryTree")
  articles    CategoriesOnArticles[]
}

model Tag {
  id       String  @id @default(cuid())
  name     String  @unique
  slug     String  @unique

  articles TagsOnArticles[]
}

model CategoriesOnArticles {
  articleId  String
  categoryId String
  article    Article  @relation(fields: [articleId], references: [id], onDelete: Cascade)
  category   Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  @@id([articleId, categoryId])
}

model TagsOnArticles {
  articleId String
  tagId     String
  article   Article @relation(fields: [articleId], references: [id], onDelete: Cascade)
  tag       Tag     @relation(fields: [tagId], references: [id], onDelete: Cascade)
  @@id([articleId, tagId])
}

// ============================================
// EVENTOS / ACTIVIDADES
// ============================================

model Event {
  id            String        @id @default(cuid())
  title         String
  slug          String        @unique
  description   String        @db.Text
  shortDesc     String?
  coverImage    String?
  location      String?
  address       String?
  eventType     EventType
  startDate     DateTime
  endDate       DateTime?
  capacity      Int?
  membersOnly   Boolean       @default(false)
  price         Decimal?      @db.Decimal(10, 2)
  status        EventStatus   @default(DRAFT)
  organizerId   String
  publishedAt   DateTime?
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt

  // Relaciones
  organizer     User          @relation("organizer", fields: [organizerId], references: [id])
  attendees     EventAttendee[]
  media         Media[]
}

enum EventType {
  BOOK_PRESENTATION  // Presentación de libro
  RECITAL            // Recital poético
  CONFERENCE         // Conferencia
  WORKSHOP           // Taller
  EXHIBITION         // Exposición
  SCREENING          // Proyección de cine
  CONCERT            // Concierto
  MEETING            // Reunión de socios
  OTHER
}

enum EventStatus {
  DRAFT
  PUBLISHED
  CANCELLED
  COMPLETED
}

model EventAttendee {
  id        String   @id @default(cuid())
  eventId   String
  memberId  String?
  name      String?  // Para asistentes no socios
  email     String?
  status    AttendeeStatus @default(REGISTERED)
  createdAt DateTime @default(now())

  event     Event    @relation(fields: [eventId], references: [id])
  member    Member?  @relation(fields: [memberId], references: [id])

  @@unique([eventId, memberId])
}

enum AttendeeStatus {
  REGISTERED
  CONFIRMED
  CANCELLED
  ATTENDED
}

// ============================================
// MEDIA / ARCHIVOS
// ============================================

model Media {
  id          String    @id @default(cuid())
  filename    String
  url         String
  mimeType    String
  size        Int
  alt         String?
  caption     String?
  articleId   String?
  eventId     String?
  createdAt   DateTime  @default(now())

  article     Article?  @relation(fields: [articleId], references: [id])
  event       Event?    @relation(fields: [eventId], references: [id])
}

// ============================================
// CONFIGURACIÓN DEL SITIO
// ============================================

model SiteConfig {
  id    String @id @default(cuid())
  key   String @unique
  value String @db.Text
}
```

---

## 6. Sistema de Autenticación y Roles

### Matriz de Permisos

| Funcionalidad | USER | MEMBER | EDITOR | MEMBER_ADMIN | ADMIN |
|---|:---:|:---:|:---:|:---:|:---:|
| Ver contenido público | x | x | x | x | x |
| Ver contenido exclusivo | - | x | x | x | x |
| Área privada de socio | - | x | - | x | x |
| Carnet digital | - | x | - | x | x |
| Directorio de socios | - | x | - | x | x |
| Crear/editar artículos | - | - | x | - | x |
| Publicar artículos | - | - | x | - | x |
| Crear/editar eventos | - | - | x | - | x |
| Gestionar números revista | - | - | x | - | x |
| Ver listado de socios | - | - | - | x | x |
| Aprobar/rechazar socios | - | - | - | x | x |
| Gestionar pagos | - | - | - | x | x |
| Gestionar usuarios/roles | - | - | - | - | x |
| Configuración del sitio | - | - | - | - | x |

### Flujo de Autenticación

```
Registro → Verificar email → Login → (Solicitar membresía) → Pago → Aprobación → Socio activo
                                  ↓
                          Área de usuario básica
```

---

## 7. Integración con Stripe

### Flujo de Pago de Cuotas

```
1. Socio selecciona nivel de membresía
2. Se crea Stripe Checkout Session con precio según nivel
3. Redirección a Stripe para pago seguro
4. Webhook recibe confirmación → actualiza estado en DB
5. Se envía email de confirmación
6. Para renovaciones: Stripe Billing Portal
```

### Productos Stripe

| Producto | Precio | Recurrencia |
|---|---|---|
| Socio Estándar | XX €/año | Anual |
| Socio Colaborador | XX €/año | Anual |
| Entrada evento (variable) | Variable | Único |
| Donación | Variable | Único |

---

## 8. Diseño Visual y Frontend

### Tokens de Diseño (a extraer del WordPress actual)

```css
:root {
  /* COLORES - A definir tras analizar style.css del tema WordPress */
  --color-primary: /* color principal de la marca */;
  --color-secondary: /* color secundario */;
  --color-accent: /* color de acento */;
  --color-background: /* fondo principal */;
  --color-surface: /* fondo de tarjetas/secciones */;
  --color-text: /* texto principal */;
  --color-text-muted: /* texto secundario */;

  /* TIPOGRAFÍA - A definir tras analizar fuentes actuales */
  --font-heading: /* fuente de títulos */;
  --font-body: /* fuente de cuerpo */;
  --font-mono: /* fuente monoespaciada (si aplica) */;

  /* ESPACIADO */
  --max-width: 1200px;
  --header-height: 80px;
}
```

> **PENDIENTE**: Extraer valores exactos del archivo `style.css` del tema WordPress activo y del logo proporcionado por el usuario.

### Páginas Principales

1. **Home**: Hero con último número + artículos destacados + próximos eventos + CTA para socios
2. **Revista**: Grid de portadas de todos los números con filtro por año
3. **Artículos**: Blog con filtros por categoría/tag, búsqueda y paginación
4. **Actividades**: Calendario visual + listado con filtro por tipo
5. **Memoria de Olvidos**: Archivo histórico de la revista original (1984+)
6. **Sobre nosotros**: Historia, equipo, información de la asociación
7. **Contacto**: Formulario + mapa + redes sociales
8. **Hazte socio**: Landing page con niveles y beneficios + CTA de pago

---

## 9. Plan de Migración desde WordPress

### Fase 1: Exportación de Datos

```
WordPress Admin → Herramientas → Exportar → Todo el contenido → XML
```

Archivos necesarios del WordPress actual:
- `export.xml` - Exportación completa de contenido
- `style.css` del tema activo - Para tokens de diseño
- `wp-content/uploads/` - Todas las imágenes y media
- Logo en formato vectorial (SVG) y rasterizado (PNG)

### Fase 2: Script de Migración (`scripts/migrate-wordpress.ts`)

El script realizará:

1. **Parsear XML** de exportación WordPress
2. **Mapear categorías y tags** → Crear en PostgreSQL
3. **Procesar artículos**:
   - Convertir contenido HTML → limpiar y normalizar
   - Generar slugs (mantener los originales para SEO)
   - Descargar y re-subir imágenes a Cloudflare R2
   - Actualizar URLs de imágenes en el contenido
   - Preservar fechas de publicación originales
   - Guardar `wpId` para trazabilidad
4. **Mapear autores** → Crear usuarios con rol EDITOR
5. **Generar redirects** de URLs antiguas a nuevas (next.config.ts)

### Fase 3: Verificación

- Comprobar que todos los artículos se migraron correctamente
- Verificar imágenes accesibles
- Validar redirects 301 de URLs antiguas
- Test de SEO (meta tags, Open Graph, structured data)

### Redirects para SEO

```typescript
// next.config.ts
const redirects = async () => [
  {
    source: '/index.php/:year/:month/:day/:slug',
    destination: '/articulos/:slug',
    permanent: true,
  },
  {
    source: '/index.php/category/:slug',
    destination: '/articulos?categoria=:slug',
    permanent: true,
  },
  {
    source: '/index.php/tag/:slug',
    destination: '/articulos?tag=:slug',
    permanent: true,
  },
  {
    source: '/index.php/about',
    destination: '/sobre-nosotros',
    permanent: true,
  },
];
```

---

## 10. Variables de Entorno

```env
# Base de datos
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="https://olvidosdegranada.es"
NEXTAUTH_SECRET="..."

# Stripe
STRIPE_SECRET_KEY="sk_..."
STRIPE_PUBLISHABLE_KEY="pk_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Almacenamiento (Cloudflare R2)
R2_ACCOUNT_ID="..."
R2_ACCESS_KEY_ID="..."
R2_SECRET_ACCESS_KEY="..."
R2_BUCKET_NAME="olvidos-media"

# Email (Resend)
RESEND_API_KEY="re_..."
EMAIL_FROM="info@olvidosdegranada.es"
```

---

## 11. Fases de Implementación

### Fase 1 - Fundación (Semanas 1-2)
- [ ] Setup del proyecto Next.js + TypeScript + Tailwind
- [ ] Configurar Prisma + PostgreSQL (Neon)
- [ ] Implementar esquema de base de datos
- [ ] Configurar NextAuth con roles
- [ ] Estructura de rutas y layouts
- [ ] Componentes base (Header, Footer, UI)
- [ ] Extraer tokens de diseño del WordPress actual

### Fase 2 - Contenido Público (Semanas 3-4)
- [ ] Home page con diseño fiel al actual
- [ ] Páginas de artículos (listado + detalle)
- [ ] Páginas de la revista (números + detalle)
- [ ] Sección "Memoria de Olvidos"
- [ ] Sobre nosotros y Contacto
- [ ] SEO: meta tags, sitemap, structured data
- [ ] Búsqueda de contenido

### Fase 3 - Panel de Administración (Semanas 5-7)
- [ ] Dashboard admin con estadísticas
- [ ] CRUD de artículos con editor rich text
- [ ] CRUD de números de la revista
- [ ] CRUD de eventos/actividades
- [ ] Gestión de categorías y tags
- [ ] Gestión de media/imágenes
- [ ] Gestión de usuarios y roles

### Fase 4 - Gestión de Socios (Semanas 8-10)
- [ ] Landing "Hazte socio" con niveles
- [ ] Integración Stripe: pagos y suscripciones
- [ ] Área privada del socio
- [ ] Carnet digital
- [ ] Directorio de socios
- [ ] Contenido exclusivo para socios
- [ ] Panel admin: gestión de socios y pagos
- [ ] Emails transaccionales (bienvenida, renovación, etc.)

### Fase 5 - Gestión de Actividades (Semanas 11-12)
- [ ] Calendario público de eventos
- [ ] Sistema de inscripción a eventos
- [ ] Gestión de asistentes
- [ ] Eventos solo para socios
- [ ] Notificaciones de próximos eventos

### Fase 6 - Migración y Lanzamiento (Semanas 13-14)
- [ ] Ejecutar script de migración de contenido
- [ ] Migrar imágenes a almacenamiento cloud
- [ ] Configurar redirects 301
- [ ] Testing completo (funcional, SEO, rendimiento)
- [ ] Configurar dominio y DNS en Vercel
- [ ] Monitorización (Vercel Analytics)
- [ ] Lanzamiento y desactivación de WordPress

---

## 12. Consideraciones Técnicas Adicionales

### Rendimiento
- **SSG** para páginas estáticas (sobre nosotros, contacto)
- **ISR** con revalidación para artículos y revista (revalidate: 3600)
- **SSR** para áreas protegidas (socios, admin)
- **Image Optimization** con next/image
- **Lazy loading** de componentes pesados

### SEO
- Sitemap XML dinámico
- Robots.txt
- Open Graph y Twitter Cards para compartir
- JSON-LD structured data (Article, Event, Organization)
- Canonical URLs y hreflang (si se necesita multiidioma)

### Seguridad
- CSRF protection (NextAuth built-in)
- Rate limiting en API routes
- Validación con Zod en todas las entradas
- Sanitización de HTML del editor
- Stripe webhooks verificados con firma
- Headers de seguridad (CSP, HSTS, etc.)

### Backup
- Neon: snapshots automáticos de PostgreSQL
- Media: versionado en R2/S3
- Código: Git con CI/CD en Vercel
