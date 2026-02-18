# 🚀 Guía de Despliegue en Vercel

Guía paso a paso para desplegar Olvidos de Granada en Vercel.

---

## 📋 Pre-Despliegue: Configuración de Servicios

### 1. Base de Datos (Neon PostgreSQL) - GRATIS

1. Ve a https://neon.tech
2. Regístrate con GitHub (recomendado)
3. Crea un nuevo proyecto: "olvidos-db"
4. Copia la **Connection String** (PostgreSQL URL)
5. Guárdala temporalmente

### 2. Generar NEXTAUTH_SECRET

En tu terminal local:

```bash
openssl rand -base64 32
```

Copia el resultado, lo necesitarás para Vercel.

### 3. Stripe (Opcional - Solo para pagos)

Para **despliegue de pruebas** sin pagos, puedes dejar las claves de Stripe vacías o usar valores dummy.

Si quieres probar pagos:
1. Ve a https://dashboard.stripe.com/test/apikeys
2. Copia las claves de prueba
3. No configures webhooks todavía (se hace después del primer despliegue)

---

## 🚀 Despliegue en Vercel

### Paso 1: Crear Cuenta en Vercel

1. Ve a https://vercel.com
2. Haz clic en "Sign Up"
3. Regístrate con **GitHub** (recomendado para auto-deploy)

### Paso 2: Importar Proyecto

1. En Vercel, clic en **"Add New..."** → **"Project"**
2. Busca tu repositorio: `olvidos` o como se llame
3. Clic en **"Import"**

### Paso 3: Configurar Proyecto

Vercel detectará automáticamente que es un proyecto Next.js.

#### **Framework Preset:**
- Framework: **Next.js**
- Root Directory: `./`
- Build Command: `npm run build` (automático)
- Output Directory: `.next` (automático)

#### **Install Command:**
```
npm install
```

### Paso 4: Variables de Entorno

Añade las siguientes variables en **Environment Variables**:

| Name | Value | Environment |
|------|-------|-------------|
| `DATABASE_URL` | Tu URL de Neon | All (Production, Preview, Development) |
| `NEXTAUTH_URL` | Déjalo vacío por ahora | All |
| `NEXTAUTH_SECRET` | El secreto generado | All |
| `NEXT_PUBLIC_APP_URL` | Déjalo vacío por ahora | All |

**Variables opcionales para pruebas (pueden ir vacías):**
- `STRIPE_SECRET_KEY` (puede ir vacía)
- `STRIPE_PUBLISHABLE_KEY` (puede ir vacía)
- `STRIPE_WEBHOOK_SECRET` (déjalo vacío)

### Paso 5: Desplegar

1. Clic en **"Deploy"**
2. Espera a que termine el build (2-3 minutos)
3. ¡Listo! Vercel te dará una URL como: `https://olvidos-xyz.vercel.app`

---

## ✅ Post-Despliegue: Configuración Final

### 1. Actualizar Variables con la URL de Vercel

Una vez tengas la URL de Vercel (ej: `https://olvidos-xyz.vercel.app`):

1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Actualiza estas variables:

```
NEXTAUTH_URL=https://olvidos-xyz.vercel.app
NEXT_PUBLIC_APP_URL=https://olvidos-xyz.vercel.app
```

### 2. Configurar Base de Datos

Necesitas ejecutar las migraciones de Prisma en la base de datos de Neon:

**Opción A: Desde tu terminal local (recomendado)**

```bash
# Instalar Prisma CLI globalmente si no lo tienes
npm install -g prisma

# Crear archivo .env.local con DATABASE_URL de Neon
echo "DATABASE_URL=tu_url_de_neon" > .env.local

# Generar Prisma Client
npx prisma generate

# Hacer push del schema a la base de datos
npx prisma db push

# (Opcional) Crear un usuario admin inicial
npx prisma db seed
```

**Opción B: Usando Neon Dashboard**

1. Ve a tu proyecto en Neon
2. Clic en "SQL Editor"
3. Pega el schema que está en `prisma/schema.prisma`
4. Ejecuta el SQL

### 3. Crear Usuario Admin Inicial

Opción A: **Usando la CLI de Prisma**

```bash
npx prisma db seed
```

Opción B: **Directamente en Neon SQL Editor**

```sql
-- Crear usuario admin
INSERT INTO "User" (
  id,
  email,
  name,
  role,
  "emailVerified",
  "createdAt",
  "updatedAt"
) VALUES (
  'admin-user-id',
  'admin@olvidosdegranada.es',
  'Administrador',
  'ADMIN',
  NOW(),
  NOW(),
  NOW()
);

-- Crear miembro admin
INSERT INTO "Member" (
  id,
  "userId",
  "memberNumber",
  "membershipLevel",
  status,
  "joinDate",
  "createdAt",
  "updatedAt"
) VALUES (
  'admin-member-id',
  'admin-user-id',
  1,
  'STANDARD',
  'ACTIVE',
  NOW(),
  NOW(),
  NOW()
);
```

Luego ve a `/login` y usa "Forgot Password" para establecer una contraseña.

---

## 🧪 Testing del Despliegue

### Checklist de Verificación

- [ ] La home carga correctamente
- [ ] El header y footer se muestran
- [ ] Las páginas de artículos funcionan (aunque no hay datos)
- [ ] El login redirige correctamente
- [ ] No hay errores en la consola del navegador
- [ ] Las imágenes cargan (si hay alguna)

### Crear Datos de Prueba

Para probar el sitio con datos reales, puedes:

**Opción 1: Usar el Panel Admin**

1. Inicia sesión como admin
2. Ve a `/admin`
3. Crea:
   - Una categoría
   - Un tag
   - Un artículo de prueba
   - Un evento de prueba

**Opción 2: Seed Script**

```bash
# Este script lo puedes crear después
npx prisma db seed
```

---

## 🔧 Configuración Opcional (No necesaria para pruebas)

### Stripe para Pagos Reales

1. Ve a https://dashboard.stripe.com/test/webhooks
2. Añade endpoint: `https://tu-url.vercel.app/api/stripe/webhook`
3. Copia el `Signing Secret` → `STRIPE_WEBHOOK_SECRET`
4. Añádelo en Vercel Environment Variables

### Email con Resend

1. Ve a https://resend.com/api-keys
2. Crea API key
3. Añade en Vercel: `RESEND_API_KEY`
4. Añade `EMAIL_FROM=info@olvidosdegranada.es`

### Google Analytics

1. Crea propiedad en GA4
2. Copia el ID de medición (ej: `G-XXXXXXXXXX`)
3. Añade en Vercel: `NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX`

---

## 🔄 Deploys Automáticos

Vercel hace **deploy automático** cada vez que haces push a GitHub:

```bash
git add .
git commit -m "feat: nueva funcionalidad"
git push origin claude/plan-magazine-website-redesign-GmiqK
```

Vercel detectará el push y desplegará automáticamente.

---

## 🐛 Troubleshooting

### Error: "Database connection failed"

**Solución:** Verifica que `DATABASE_URL` sea correcta y incluya `?sslmode=require`

### Error: "NextAuth not configured"

**Solución:** Asegúrate de que `NEXTAUTH_URL` y `NEXTAUTH_SECRET` están configuradas

### Error: "Build failed"

**Solución:**
1. Verifica los logs de build en Vercel
2. Asegúrate de que todas las dependencias están en `package.json`
3. Revisa que no haya errores de TypeScript

### Las páginas no se encuentran

**Solución:**
1. Verifica que las rutas estén correctamente configuradas
2. Revisa el archivo `next.config.mjs`

---

## 📊 Próximos Pasos

Una vez que el despliegue de pruebas funcione:

1. ✅ Configurar dominio personalizado (olvidosdegranada.es)
2. ✅ Configurar producción de Stripe
3. ✅ Configurar emails transaccionales
4. ✅ Optimizar imágenes y assets
5. ✅ Configurar analytics
6. ✅ Añadir monitoring (Vercel Analytics)

---

## 🎯 URL de Despliegue

Tu sitio estará disponible en:

**Preview:** `https://olvidos-xyz.vercel.app`
**Producción:** `https://olvidosdegranada.es` (cuando configures el dominio)

---

¿Necesitas ayuda con algún paso específico?
