# Con-textos: especiales interactivos de Olvidos

«Con-textos» es la sección de especiales de actualidad con contexto histórico
(datos contrastados, fuentes primarias, Diarios de Sesiones). Cada especial es
un artículo normal de la revista, con el patrón de «pasos» de la casa, al que se
intercalan **islas** interactivas mediante marcadores en el HTML.

## Cómo está montado

| Pieza | Dónde |
|---|---|
| Datos tipados (fuentes, cronología, citas, declaraciones, series, vídeos, imágenes, geo) | `src/data/con-textos/<especial>/` |
| Tipos y utilidades | `src/lib/con-textos/` (`types.ts`, `eras.ts`, `islas-def.ts`, `especiales.ts`) |
| Prosa de cada paso (HTML con marcadores) | `src/content/con-textos/<especial>/NN-<paso>.html` |
| Definición de los pasos | `src/lib/con-textos/<especial>/pasos.ts` |
| Composición y validación | `src/lib/con-textos/<especial>/compose.ts` |
| Componentes de las islas | `src/components/islas/` |
| Renderizado del cuerpo | `src/components/content/ArticleBody.tsx` |
| Vista previa sin base de datos | `/admin/vista-previa/con-textos/<especial>` (`?paso=N` o `?paso=todo`) |
| Script de publicación | `scripts/con-textos-<especial>.ts` |
| Dossier documental y bloques de investigación | `docs/con-textos/<especial>/` |

Los datos completos nunca viajan al navegador: `ArticleBody` ejecuta en servidor
el *loader* de cada isla, que filtra y aligera los datos, y pasa al componente
solo ese subconjunto.

## Marcadores

Cada fichero de paso empieza por `<h2>` y puede llevar, uno por línea y fuera de
`<p>`, marcadores de isla:

```html
<!--isla:linea-temporal anios="1909-1927" eras="restauracion" tipos="guerra,parlamentaria" gobiernos="derecha" compacta="true"-->
<!--isla:hemeroteca anios="1921-1923" eras="…" temas="annual,responsabilidades" camaras="congreso" bloques="derecha,izquierda" limite="12" completa="true"-->
<!--isla:comparador crisis="perejil-2002,ceuta-2021" bloques="gobierno,derecha,izquierda" orden="cronologico|reciente" disposicion="auto|apilada|columnas"-->
<!--isla:grafico serie="se-annual-bajas" tipo="bar|line|grouped" grupos="A|B" titulo="…" alto="320"-->
<!--isla:mapa puntos="geo-ceuta,geo-tarajal" recuadros="bbox-protectorado-norte" zoom="12" centro="35.9,-5.3" titulo="…" alto="380"-->
<!--isla:video id="vid-is-annual" titulo="…"-->
<!--isla:figura id="img-monte-arruit-1921" ancho="texto|completo" pie="…"-->
<!--isla:fuentes ids="src-…" titulo="…" agrupar="true"-->
```

Las llamadas a fuentes se escriben `[[cite:src-id]]` en la prosa; la composición
las numera por paso y la isla `fuentes` las lista. Los ids de series, vídeos,
imágenes, puntos y fuentes son los de `src/data/con-textos/<especial>/`. Un
atributo desconocido, un id inexistente o una cita sin fuente hacen fallar la
composición. Nada marcado `unverified` entra en una isla.

Bloques del comparador y de la hemeroteca (`Bloc` en `src/lib/con-textos/types.ts`):
`gobierno`, `derecha`, `izquierda`, `nacionalistas` (PNV, EH Bildu, ERC, Junts,
BNG, CC…), `marruecos`, `monarquia` y `otro` (actores no parlamentarios: UE,
terceros países, sindicatos, prensa…). Los ministros de Sumar van en `gobierno`;
sus portavoces parlamentarios, en `izquierda`.

El comparador decide en servidor la disposición de los bloques de cada crisis
(`comparadorLayout` en `islas-def.ts`): columnas si están compensados y
apilados, con «Ver más» por bloque, cuando uno tiene muchas más declaraciones
que los otros (16 o más en total, más de cuatro bloques, o el mayor dobla al
menor con al menos seis). `disposicion` fuerza una u otra; `orden="reciente"`
pone primero lo último.

### Citas parlamentarias verificadas por vídeo

Mientras el Congreso no publica el Diario de Sesiones de una sesión, una cita
puede darse por verificada con la grabación oficial del Canal Parlamento:
`unverified: false`, `pdfUrl: ""`, `videoUrl` con el enlace permanente de la
intervención (`https://app.congreso.es/v1/…`) y `sessionRef` con el corte y el
minuto (`… vídeo del Congreso, corte 777808, min. 12:40; Diario de Sesiones
pendiente`). `scripts/con-textos-check.ts` exige ese formato y las lista con
`--pendientes`; la hemeroteca enlaza «Vídeo de la intervención» y avisa
«Diario de Sesiones pendiente». Cuando salga el Diario se añaden `pdfUrl` y la
página y se coteja el texto.

Regla «literal según grabación»: el texto es lo que se oye, sin muletillas ni
falsos arranques, con puntuación y cifras al estilo del Diario y sin corchetes;
solo entra en una isla si además lo recoge otra fuente (Moncloa o prensa); si
difieren, manda la grabación y se anota; nada en catalán, euskera o gallego salvo
traducción propia marcada en `note`; lo dudoso va a prosa con «según la
grabación» o se descarta. Para transcribir: `pip install faster-whisper` y
`python3 scripts/con-textos-transcribir.py --ficha <ficha del Canal Parlamento>
--salida docs/con-textos/<especial>/transcripciones/<sesión>` (carpeta ignorada
por git; las transcripciones automáticas no son fuente).

## Flujo de trabajo

1. Editar la prosa en `src/content/con-textos/<especial>/` (y, si hace falta,
   los datos en `src/data/con-textos/<especial>/`).
2. Comprobar sin base de datos:
   ```bash
   npx tsx scripts/con-textos-espana-marruecos.ts --dry-run --sync-titles
   ```
   o abrir `/admin/vista-previa/con-textos/espana-marruecos` en local o en el
   preview de Vercel (requiere sesión de administrador).
3. Publicar o actualizar en la base de datos (en local, con `.env.local`):
   ```bash
   npx tsx --env-file=.env.local scripts/con-textos-espana-marruecos.ts            # crea en DRAFT o actualiza
   npx tsx --env-file=.env.local scripts/con-textos-espana-marruecos.ts --publish  # deja en PUBLISHED
   ```
   El script crea la categoría «Con-textos», las etiquetas y la firma, y nunca
   degrada un artículo ya publicado a borrador. `CON_TEXTOS_USER_EMAIL` fija el
   usuario propietario (si no, el primer ADMIN).
4. Hacer commit de `src/data/pasos-titles.json` si `--sync-titles` lo ha cambiado.

Los artículos generados así **no se editan en el editor del panel**: Tiptap
descarta los comentarios HTML y borraría los marcadores. El editor los muestra
en modo solo lectura; los cambios se hacen en el repositorio y se vuelve a
ejecutar el script.

## Modo de lectura

`/articulos/<slug>?paso=N` pagina por pasos; `?paso=todo` muestra el especial
seguido, con índice de capítulos y barra de progreso. Ambas vistas comparten la
URL canónica sin parámetros.
