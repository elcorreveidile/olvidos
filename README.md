# [olvidos

**Olvidos de Granada** — Revista de acciones culturales

Nueva plataforma web para la revista cultural y literaria *Olvidos de Granada* (ISSN 2605-4515), editada por la Asociaci&oacute;n Cultural Olvidos de Granada.

## Sobre el proyecto

Migración completa del sitio actual (WordPress) a una plataforma moderna con:

- **Frontend editorial** fiel al diseño actual (colores corporativos, tipografía, logo)
- **Gestión de socios** con registro, pagos online (Stripe), carnet digital con QR, niveles de membresía
- **Gestión editorial** de artículos, números de revista y convocatorias literarias
- **Gestión de actividades** culturales (presentaciones, recitales, talleres, conferencias)
- **Panel de administración** con roles (Admin, Editor, Autor, Gestor de Socios)

## Stack tecnológico

| Componente | Tecnología |
|---|---|
| Framework | Next.js 14+ (App Router, RSC, Server Actions) |
| Estilos | Tailwind CSS + design tokens personalizados |
| Componentes UI | shadcn/ui |
| Base de datos | PostgreSQL (Neon Serverless) |
| ORM | Prisma |
| Autenticación | NextAuth.js v5 (Auth.js) |
| Pagos | Stripe |
| Editor | Tiptap |
| Imágenes | Vercel Blob / Cloudinary |
| Email | Resend |
| Hosting | Vercel + Neon |

## Diseño

El diseño replica fielmente el sitio actual:

- **Paleta**: coral `#ff6261`, azul oscuro `#013559`, acero `#617685`
- **Tipografía**: Libre Franklin (títulos/UI) + Crimson Text (cuerpo editorial)
- **Logo**: `[olvidos` — corchete coral + texto en Libre Franklin bold
- **Patrones**: corchetes decorativos `[Categoría`, paréntesis `(Tag)`, hover coral en tarjetas

## Estructura del proyecto

```
olvidos/
├── docs/                      # Documentación del proyecto
│   └── ARCHITECTURE.md        # Arquitectura detallada
├── prisma/                    # Schema y migraciones
├── public/                    # Fonts, imágenes, assets
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (public)/          # Rutas públicas (revista)
│   │   ├── (auth)/            # Login, registro
│   │   ├── (socios)/          # Zona privada de socios
│   │   ├── admin/             # Panel de administración
│   │   └── api/               # API Routes
│   ├── components/            # Componentes React
│   ├── lib/                   # Utilidades, clientes, config
│   ├── hooks/                 # React hooks
│   └── types/                 # TypeScript types
├── scripts/                   # Migración WordPress
├── tailwind.config.ts
├── next.config.ts
└── package.json
```

## Desarrollo

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local

# Inicializar base de datos
npx prisma db push

# Ejecutar en desarrollo
npm run dev
```

## Documentación

- [Arquitectura detallada](docs/ARCHITECTURE.md) — Stack, modelo de datos, módulos, migración, fases de implementación

## Licencia

Proyecto privado de la Asociación Cultural Olvidos de Granada.
