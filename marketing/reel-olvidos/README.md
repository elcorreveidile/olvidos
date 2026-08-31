# Reel Olvidos (presentación de olvidos.es)

Reel vertical (9:16, 1080×1920, ~20 s, **sin audio** — la música se añade en la app)
que presenta la web de la revista **Olvidos de Granada**. Contenido 100 % REAL,
capturado de la propia web en vivo (www.olvidos.es); nada inventado.

## Storyboard
1. **Telón** — la intro de teatro (recreada con el CSS de marca: rojo teatro
   `#7a1420`, keyframes de apertura) abre y revela la home.
2. **Home** — hero `[olvidos`, lema real "Literatura, pensamiento y memoria… desde 1981".
3. **Archivo** — rejilla real de la hemeroteca (portadas n.º 17–12).
4. **Artículo** — lectura real: *Cuarenta años de «Palabras para un tiempo de silencio»*.
5. **Cierre** — `[o` · olvidos.es · **Entra en olvidos.es**.

Marca leída del repo: coral `#ff6261`, tinta `#141414`, teatro `#7a1420/#9b1c2c/#560d16`,
tipos Libre Franklin + Crimson Text (incrustadas como @font-face data-URI), motivo `[`.

## Reproducir el pipeline
```bash
# 1) Capturar la web en vivo (Chromium por el proxy; TLS 1.2 evita el corte por ECH)
NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt node scripts/reel-capture-live.mjs
# 2) Montar y codificar (renderAt determinista -> H.264 WASM). QP configurable.
QP=28 node scripts/reel-build.mjs           # PROBE=1 para fotogramas de prueba
# 3) Validar el mp4 por estructura de cajas (Chromium OSS no decodifica H.264)
node scripts/reel-validate-mp4.mjs footage-reel/reel.mp4
```

## Entregables
- `reel.mp4` (1080×1920, sin audio) · `portada.png` — binarios, gitignored, se entregan aparte.
- `reel.srt` — rótulos temporizados.
- `caption.txt` — 2 opciones de copy + hashtags.

## Zonas seguras
Texto de rótulos entre el 12 % superior y el 20 % inferior; el marco de móvil puede
sangrar en esas zonas (son sólo imagen).
