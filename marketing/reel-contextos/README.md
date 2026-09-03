# Reel «Con-textos» (nueva sección pública)

Reel vertical (9:16, 1080×1920, ~17 s, **sin audio** — la música se añade en la
app) para presentar **en público** la nueva sección de la revista:
**Con-textos** (`olvidos.es/articulos?categoria=con-textos`).

Es un **manifiesto tipográfico**: usa el copy REAL de la propia sección (leído
de la web) y no muestra la lista de artículos porque la sección aún está vacía
(0 artículos). En cuanto se publiquen piezas, se puede hacer una variante con
capturas reales del listado.

## Copy real de la sección (fuente: olvidos.es)
> «Especiales de actualidad con contexto histórico: datos contrastados, fuentes
> primarias y Diarios de Sesiones. **Contra el bulo, contexto.**»

## Storyboard
1. **Gancho** — "Contra el bulo, **contexto**." (papel, tinta + coral).
2. **Nombre** — `[o` · Nueva categoría · "[ Con-textos" (velvet).
3. **Manifiesto** — "Especiales de actualidad con contexto histórico."
4. **Pilares** — 1) Datos contrastados · 2) Fuentes primarias · 3) Diarios de
   Sesiones (aparición escalonada) + "Contra el bulo, contexto."
5. **Cierre** — `[o` · "[ Con-textos" · olvidos.es · "Contra el bulo, contexto."

Marca del repo: coral `#ff6261`, tinta `#141414`, teatro
`#7a1420/#9b1c2c/#3f0910`, tipos Libre Franklin + Crimson Text, motivo `[`.

## Reproducir el pipeline
```bash
# (opcional) capturar la sección en vivo, por si se quiere una variante con lista
PAGE_PATH="/articulos?categoria=con-textos" OUT_NAME=contextos \
RAW_DIR=footage-reel/raw-contextos node scripts/reel-capture-page.mjs

# montar y codificar el manifiesto (plantilla autónoma; no necesita capturas)
RAW_DIR=footage-reel/raw-contextos \
TEMPLATE=scripts/reel-contextos.template.html \
OUT=footage-reel/clip-contextos.mp4 PORTADA=footage-reel/portada-contextos.png \
PORTADA_T=4.6 node scripts/reel-clip-build.mjs      # PROBE=1 para pruebas
```

## Entregables (binarios, gitignored, se entregan aparte)
- `clip-contextos.mp4` + `portada-contextos.png`

Pieza versionada: `scripts/reel-contextos.template.html`.
