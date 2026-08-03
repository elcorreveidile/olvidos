# Transcripción de la revista impresa a formato web

Guía del procedimiento que estamos usando para pasar los números de *Olvidos de
Granada* (PDF escaneado) a artículos web (`Article` ligados a su `MagazineIssue`).
Sirve de referencia para transcribir el resto de ejemplares.

> **Estado (nº 9):** transcritas págs. 4-14. Pendientes: pág. 14 «Cabellos de
> ángel», y de la pág. 15 en adelante (García Montero «El tiempo de Francisco
> Brines», etc.). El año del nº 9 está puesto provisionalmente en 1986 y hay que
> validarlo con la portada.

## Principios (acordados con Javier)

1. **Artículo por artículo, no página por página.** El diseño de la revista
   entrelaza columnas y artículos que empiezan en una página y siguen en otra.
   Hay que leer siguiendo cada artículo por sus columnas, no por franjas de página.
2. **Leer las páginas como imagen, no `pdftotext`.** El OCR de un maquetado a
   varias columnas sale desordenado. Se leen las páginas como imagen (herramienta
   Read sobre el PDF, `pages:"N"`) y se transcribe a mano.
3. **Imágenes solo donde las tiene el original**, en su sitio aproximado.
4. **Crédito de foto = pie de foto.** Si en el papel aparece el autor de una
   imagen, va como `<figcaption>` (o `coverCredit` si es la portada del artículo).
5. **El orden de «En este número» = el de la revista** (se ordena por el campo
   `pages`).
6. **El texto fiel al papel**, incluidas erratas evidentes solo cuando aportan
   (normalmente se corrige lo obvio). Cursivas para títulos de obra y versos
   citados; secciones numeradas con `<h3>`; epígrafes/versos con `<blockquote>`.

## Modelo de datos

- `Article`: `title`, `slug`, `excerpt`, `content` (HTML), `byline` (firma tal
  cual sale, p.ej. «Editorial»), `pages` (p.ej. `"8-9"`), `status: PUBLISHED`,
  `issueId` (del nº), `authorId` (admin), `publishedAt` (= `issue.publishedAt`),
  `coverImage`, `coverCredit`, `coverPosition`.
- Autor real: se hace `Author` a partir de la firma (`slugifyName`) y se enlaza
  con `AuthorsOnArticles`. La firma «Editorial» crea un autor «Editorial».
- Las imágenes viven en **Vercel Blob** (`revista/ilustraciones/…`), no en git.

> **Ojo:** la BD y el Blob son los de **producción** (dev lee `.env.local`). Al
> ejecutar un script, los datos entran en producción al instante; lo único que
> necesita despliegue es el **código**. (Estamos trabajando en local sin subir a
> GitHub/Vercel salvo que se pida.)

## Flujo paso a paso

### 1. Tener el PDF del número a mano
```bash
# el nº9 está en /tmp/olv9.pdf (54 MB). Info y nº de páginas:
pdfinfo /tmp/olv9.pdf
```

### 2. Leer las páginas del artículo (como imagen)
Con la herramienta Read sobre el PDF, `pages:"12-14"` (máx. 20 págs/petición).
Transcribir columna por columna siguiendo el artículo.

### 3. Crear el artículo
- **Texto corrido sencillo** → helper `scripts/n9-add.ts` (`addArticle`), que
  envuelve cada párrafo en `<p>` y hace el `Author` + enlace. Un lote por
  página/tanda: ver `scripts/n9-p4.ts`, `n9-p6.ts`, `n9-p7.ts`, `n9-p11.ts`.
- **HTML rico** (secciones `<h3>`, `<blockquote>`, diálogo con interlocutores en
  `<strong>`, etc.) → script propio que construye `content` a mano y replica la
  lógica de `addArticle`. Ejemplos: `scripts/n9-p8.ts` (ensayo «Cuestión de
  esti(l)o»), `scripts/n9-claudio.ts` (entrevista con formato B. P. / C. R.).

```bash
npx tsx scripts/n9-<loque-sea>.ts
```

### 4. Extraer las imágenes del PDF (recorte por región)
Localizar el recorte renderizando la página a 100 dpi y midiendo (página del nº9
= 796,68 × 1150,92 pt → 100 dpi ≈ 1106 × 1598 px; a 200 dpi se multiplica ×2):
```bash
pdftoppm -png -f 8 -l 8 -r 100 /tmp/olv9.pdf /tmp/p8   # página completa para medir
# recorte a 200 dpi:  -x -y -W -H en píxeles de esa resolución
pdftoppm -png -f 8 -l 8 -r 200 -x 205 -y 560 -W 620 -H 1050 /tmp/olv9.pdf /tmp/foto
sips -s format jpeg -s formatOptions 85 /tmp/foto-08.png --out /tmp/foto.jpg
```
Verificar el recorte leyéndolo como imagen antes de subirlo. Reencuadrar si una
cara/figura sale cortada.

### 5. Subir a Blob y enlazar
El token está en `.env.local` como `BLOB_READ_WRITE_TOKEN` **entre comillas**
(hay que quitarlas). Patrón:
```ts
import { readFileSync } from "fs";
import { put } from "@vercel/blob";
let token = readFileSync(".env.local","utf8").split("\n")
  .find(l=>l.startsWith("BLOB_READ_WRITE_TOKEN="))!
  .slice("BLOB_READ_WRITE_TOKEN=".length).trim().replace(/^["']|["']$/g,"");
const { url } = await put("revista/ilustraciones/NOMBRE.jpg", buf,
  { access:"public", addRandomSuffix:true, contentType:"image/jpeg", token });
```
- **Portada del artículo:** `data:{ coverImage:url, coverCredit:"Autor", coverPosition:"center" }`.
- **Imagen intercalada:** insertar en `content` una `<figure><img src=url alt="…" />
  <figcaption>Autor</figcaption></figure>` (sin `figcaption` si no hay crédito).
  Para insertarlas en un contenido ya creado, ver `scripts/n9-fix-images.ts`
  (reparte figuras entre los párrafos). Para achicar una foto: `<figure
  style="max-width:340px;margin:2em auto;">`.

### 6. Verificar en el navegador (local)
`npm run dev` en `/Users/javierbenitez/AI/olvidos` y abrir
`/revista/olvidos-9` (índice) y `/articulos/<slug>`.

> **Importante:** al añadir campos nuevos al esquema (`prisma db push` +
> `prisma generate`), **reiniciar `npm run dev`**; si no, el cliente Prisma viejo
> sigue en memoria y no devuelve el campo nuevo (nos pasó con `coverCredit`).

## Estilos de contenido (`.prose-editorial` en `globals.css`)

- Todos los `<p>` con sangría (como el papel), salvo el que sigue a un título.
- `<h2>`/`<h3>`/`<h4>` para cabeceras y secciones numeradas.
- `<blockquote>` con filete coral para epígrafes/versos (versos con `<br>`).
- `figure` / `figcaption`: pie a la derecha, pequeño y en gris.

## Checklist rápido por artículo
- [ ] Texto transcrito columna a columna, cursivas y secciones.
- [ ] `byline`, `pages`, `excerpt` correctos; `Author` enlazado.
- [ ] Todas las imágenes del original, en su sitio.
- [ ] Créditos como pie de foto donde el papel los da.
- [ ] Verificado en `/articulos/<slug>` y en el índice del número.
