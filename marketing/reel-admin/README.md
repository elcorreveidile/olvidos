# Reels del área de administración (Equipo Editor)

Serie de reels verticales (9:16, 1080×1920, **sin audio** — la música se añade
en la app) para enseñar al **Equipo Editor** de la revista cómo funciona el
panel de administración de Olvidos. Contenido 100 % REAL: capturas de la propia
aplicación (el panel `/admin` en local, con datos de ejemplo del Equipo Editor),
recorridas con paneo/zoom dentro de una ventana de navegador.

Son **tres reels** cortos y complementarios (un solo vídeo sería muy denso).
Juntos cubren **el funcionamiento de todo lo que está implementado** en el panel:

## Reel 1 — «El panel del Equipo Editor» (~18 s)
Visión general: dónde está cada cosa.
1. **Intro** — `[o` · Equipo Editor · "El panel de administración".
2. **Tu panel** — el dashboard: total de artículos, publicados, borradores.
3. **Cada pieza** — actividad reciente: borradores, en revisión y publicados.
4. **Artículos** — el listado con filtros por estado y categoría.
5. **De un vistazo** — quién escribe cada artículo y en qué estado está.
6. **Cierre** — "Escribe. Revisa. Publica." · olvidos.es/admin.

## Reel 2 — «Publica un artículo» (~18 s)
El flujo editorial, paso a paso.
1. **Intro** — `[o` · Equipo Editor · "Publica un artículo".
2. **Empieza** — información básica: título, extracto y firma.
3. **Tu texto** — el editor de texto enriquecido (negritas, títulos, enlaces…).
4. **Clasifica** — categorías y etiquetas.
5. **Publica** — Borrador → Enviar a revisión → Publicar.
6. **Cierre** — "Escribe. Revisa. Publica." · olvidos.es/admin.

## Reel 3 — «El panel, al completo» (~22 s)
El resto de lo implementado: gestión de la asociación.
1. **Intro** — `[o` · Equipo Editor · "El panel, al completo".
2. **Revista** — números, portadas y PDFs (hemeroteca).
3. **Agenda** — actividades y eventos.
4. **Socios** — la base de socios (niveles y estados) al día.
5. **Cuentas** — contabilidad: ingresos, gastos, saldo y libro.
6. **Documentos** — estatutos, actas y libro de socios.
7. **Ajustes** — identidad, contacto, SEO y operación del sitio.
8. **Cierre** — "Todo en un solo sitio." · olvidos.es/admin.

Las pantallas de socios, pagos, contabilidad y documentos se capturan con
**datos de ejemplo ficticios** (nombres tipo «María López», correos
`@ejemplo.olvidos.es`): nunca datos reales de socios.

Marca leída del repo: coral `#ff6261`, tinta `#141414`, teatro
`#7a1420/#9b1c2c/#3f0910`, tipos Libre Franklin + Crimson Text (incrustadas como
@font-face data-URI), motivo `[`.

## Reproducir el pipeline
Requiere la app corriendo en local con datos de ejemplo (usuario del Equipo
Editor con rol `EDITOR`). El script de captura inicia sesión y toma las
pantallas del panel en escritorio (1440×900):

```bash
# 1) Capturar el panel autenticado (escritorio). Inicia sesión como EDITOR.
BASE_URL=http://localhost:3000 EDIT_ID=<id-de-un-articulo> \
RAW_DIR=footage-reel/raw-admin-desktop VW=1440 VH=900 DSF=1 \
node scripts/reel-capture-admin.mjs

# 2) Montar y codificar cada reel (renderAt determinista -> H.264 WASM).
RAW_DIR=footage-reel/raw-admin-desktop \
SCENES=scripts/scenes-admin-panel.json \
OUT=footage-reel/clip-admin-panel.mp4 \
PORTADA=footage-reel/portada-admin-panel.png \
node scripts/reel-admin-build.mjs        # PROBE=1 para fotogramas de prueba

RAW_DIR=footage-reel/raw-admin-desktop \
SCENES=scripts/scenes-admin-publicar.json \
OUT=footage-reel/clip-admin-publicar.mp4 \
PORTADA=footage-reel/portada-admin-publicar.png \
node scripts/reel-admin-build.mjs

# 3) (Opcional) Añadir música y validar la estructura del mp4.
node scripts/reel-add-audio.mjs <musica.mp3> footage-reel/reel-admin-panel-musica.mp4 \
  --video footage-reel/clip-admin-panel.mp4 --loop
node scripts/reel-validate-mp4.mjs footage-reel/clip-admin-panel.mp4
```

### Piezas del pipeline (versionadas, en `scripts/`)
- `reel-capture-admin.mjs` — captura autenticada del panel (login + pantallas).
- `reel-admin.template.html` — motor del "tour guiado" (ventana de navegador +
  Ken Burns + rótulos de marca); lee escenas y textos inyectados.
- `reel-admin-build.mjs` — inyecta fuentes, capturas, escenas y META; renderiza
  y codifica el mp4.
- `scenes-admin-panel.json`, `scenes-admin-publicar.json`,
  `scenes-admin-gestion.json` — guion de cada reel (escenas = imagen +
  encuadre `from`/`to` en píxeles + rótulo + duración).

Para el reel 3 hace falta iniciar sesión con un usuario **ADMIN** (accede a
socios/pagos/contabilidad); los reels 1 y 2 usan el rol **EDITOR**.

## Entregables (binarios, gitignored, se entregan aparte)
- `clip-admin-panel.mp4` + `portada-admin-panel.png`
- `clip-admin-publicar.mp4` + `portada-admin-publicar.png`
- `clip-admin-gestion.mp4` + `portada-admin-gestion.png`

## Nota
Los reels usan **la vista de escritorio** del panel a propósito: el Equipo
Editor trabaja desde el ordenador, y las tablas del admin se leen mucho mejor
así que en móvil.
