# Sistema CRUD de Artículos - Panel de Administración

## Resumen de la Implementación

Se ha configurado el editor Tiptap y creado el sistema completo de CRUD para la gestión de artículos en el panel de administración del proyecto Olvidos de Granada.

## Archivos Creados

### Componentes
- `/src/components/admin/RichTextEditor.tsx` - Editor de texto enriquecido con Tiptap

### Server Actions
- `/src/lib/actions/articles.ts` - Acciones de servidor para CRUD de artículos

### Páginas del Admin
- `/src/app/admin/layout.tsx` - Layout del panel de administración
- `/src/app/admin/page.tsx` - Dashboard del panel
- `/src/app/admin/articulos/page.tsx` - Listado de artículos
- `/src/app/admin/articulos/nuevo/page.tsx` - Crear nuevo artículo
- `/src/app/admin/articulos/[id]/editar/page.tsx` - Editar artículo existente

## Instalación de Dependencias

El `package.json` ha sido actualizado con las siguientes dependencias:

```json
{
  "@tiptap/extension-placeholder": "^2.4.0",
  "@tiptap/extension-link": "^2.4.0",
  "@tiptap/extension-image": "^2.4.0",
  "@tiptap/extension-text-align": "^2.4.0",
  "react-hook-form": "^7.51.0",
  "@hookform/resolvers": "^3.3.0"
}
```

Para instalar las dependencias, ejecuta:

```bash
npm install
```

## Configuraciones Realizadas

### 1. Tailwind CSS
Se han añadido variantes adicionales del color coral en `tailwind.config.ts`:
- coral-50 a coral-900
- coral-light, coral-dark

### 2. Editor Tiptap
El editor incluye:
- Toolbar con botones para:
  - Negrita, Cursiva
  - Encabezados H2, H3
  - Listas (ordenada y desordenada)
  - Alineación de texto (izquierda, centro, derecha)
  - Enlaces
  - Imágenes
- Placeholder personalizable
- Estilos minimalistas acordes al diseño corporativo

### 3. Server Actions
Implementadas las siguientes acciones:
- `createArticle(data)` - Crear nuevo artículo
- `updateArticle(id, data)` - Actualizar artículo
- `deleteArticle(id)` - Soft delete (cambia estado a ARCHIVED)
- `getArticle(id)` - Obtener un artículo
- `getArticles(filters)` - Listado con filtros y paginación
- `getCategories()` - Obtener categorías
- `getMagazineIssues()` - Obtener números de revista

### 4. Páginas del Admin

#### Listado de Artículos (`/admin/articulos`)
- Tabla con: título, estado, fecha, autor, acciones
- Filtros por estado (todos, publicados, borradores, revisión)
- Búsqueda por título
- Paginación
- Botón "Nuevo artículo"

#### Crear Artículo (`/admin/articulos/nuevo`)
- Formulario completo con:
  - Título (con autogeneración de slug)
  - Slug editable
  - Extracto
  - Contenido con editor Tiptap
  - Imagen de portada
  - Selección de categorías (múltiples)
  - Tags (separados por coma)
  - Número de revista (opcional)
  - Configuración: destacado, solo socios
  - Meta tags SEO
- Tres botones de acción:
  - Guardar borrador
  - Enviar a revisión
  - Publicar
- Validación con react-hook-form + zod
- Redirección tras guardar

#### Editar Artículo (`/admin/articulos/[id]/editar`)
- Similar a crear artículo pero:
  - Carga datos existentes
  - Muestra imagen de portada si existe
  - Pre-selecciona categorías y tags
  - Mantiene el estado actual

## Funcionalidades de Seguridad

- Verificación de autenticación en todas las páginas
- Verificación de rol (EDITOR o ADMIN requerido)
- Validación de datos con Zod
- Manejo de errores con mensajes amigables
- Uso de `revalidatePath` para actualizar caché

## Diseño

### Colores
- Coral (#ff6261) - Acciones primarias
- Azul (#013559) - Títulos y elementos importantes
- Grises - Textos secundarios y fondos

### Layout
- Sidebar fijo con navegación
- Header con información del usuario
- Contenido principal con máximo de ancho
- Diseño responsive

## Uso

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Ejecutar el servidor de desarrollo**:
   ```bash
   npm run dev
   ```

3. **Acceder al panel**:
   - Navega a `/admin`
   - Inicia sesión con credenciales de usuario con rol EDITOR o ADMIN

4. **Crear un artículo**:
   - Haz clic en "Nuevo artículo"
   - Completa el formulario
   - Selecciona las categorías deseadas
   - Añade tags separados por coma
   - Elige el estado (borrador, revisión, publicado)
   - Haz clic en el botón correspondiente

5. **Editar un artículo**:
   - Ve al listado de artículos
   - Haz clic en el icono de editar
   - Realiza los cambios necesarios
   - Guarda los cambios

## Notas Importantes

- Los artículos se crean con `status: DRAFT` por defecto
- Al cambiar a `PUBLISHED` se establece automáticamente `publishedAt`
- Las categorías y tags se crean automáticamente si no existen
- El slug se genera automáticamente desde el título pero puede editarse
- La eliminación es un "soft delete" - el artículo se archiva pero no se borra

## Próximos Pasos Opcionales

- Añadir funcionalidad de subir imágenes
- Implementar vista previa del artículo
- Añadir historial de cambios
- Implementar autosave
- Añadir contador de palabras y caracteres
- Permitir programación de publicaciones
- Añadir bulk actions (eliminar múltiples artículos)
