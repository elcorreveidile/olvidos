# Formato de los bloques de investigación

Cada bloque produce dos ficheros en esta carpeta:

1. `NN-nombre.md`: hallazgos legibles, por episodios, con cita literal, fecha y URL de cada dato. Lo que no se haya podido verificar en fuente primaria se marca con **[NO VERIFICADO]**.
2. `NN-nombre.json`: los mismos hallazgos estructurados, con esta forma (todas las claves opcionales salvo `sources`):

```json
{
  "sources": [
    { "id": "src-xxx", "title": "", "author": "", "publisher": "", "date": "YYYY-MM-DD", "url": "", "kind": "oficial|parlamentaria|prensa|academica|dato|archivo|multimedia", "accessed": "2026-09-02", "note": "" }
  ],
  "events": [
    { "id": "ev-xxx", "date": "YYYY-MM-DD", "dateLabel": "22 de octubre de 1859", "title": "", "summary": "", "government": "derecha|liberal|izquierda|dictadura", "governmentLabel": "Gobierno de O'Donnell (Unión Liberal)", "headOfState": "Isabel II", "initiator": "espana|marruecos|ambos|otros|indeterminado", "kinds": ["guerra"], "era": "isabelina|sexenio|restauracion|dictadura-primo|republica|franquismo|transicion|democracia", "sourceIds": ["src-xxx"] }
  ],
  "quotes": [
    { "id": "q-xxx", "date": "YYYY-MM-DD", "dateLabel": "", "chamber": "congreso|senado|cortes-franquistas|otro", "legislature": "", "speaker": "", "party": "", "bloc": "derecha|izquierda|gobierno|monarquia|marruecos|otro", "role": "", "topics": [""], "era": "", "text": "cita literal", "context": "", "sessionRef": "DSC núm. N, fecha, p. N", "pdfUrl": "", "videoUrl": "", "sourceIds": [], "unverified": false }
  ],
  "statements": [
    { "id": "st-xxx", "crisisId": "ceuta-2026", "bloc": "derecha", "speaker": "", "role": "", "date": "", "dateLabel": "", "text": "cita literal", "sourceIds": [] }
  ],
  "series": [
    { "id": "se-xxx", "title": "", "unit": "personas", "kind": "bar|line|grouped", "groups": [], "points": [ { "x": 2021, "y": 0, "group": "", "note": "" } ], "sourceIds": [], "note": "" }
  ],
  "videos": [
    { "id": "vid-xxx", "provider": "youtube|rtve|congreso|otro", "embedUrl": "", "pageUrl": "", "title": "", "date": "", "sourceIds": [] }
  ],
  "images": [
    { "id": "img-xxx", "src": "https://upload.wikimedia.org/...", "alt": "", "width": 0, "height": 0, "credit": "", "license": "", "creditUrl": "https://commons.wikimedia.org/wiki/File:..." }
  ]
}
```

Reglas:
- Solo URLs reales, obtenidas de una búsqueda o de una página visitada. Nunca inventar URLs ni números de página.
- Citas literales entre comillas en el texto original; si se traduce, indicarlo.
- Para citas parlamentarias: sin cámara + fecha + orador + referencia del Diario + URL, `unverified: true`. Mientras el Diario no se publica, vale como verificación provisional la grabación oficial del Congreso: `videoUrl` con el enlace permanente de la intervención (`https://app.congreso.es/v1/…`), `sessionRef` con el corte y el minuto («… vídeo del Congreso, corte NNNNNN, min. m:ss; Diario de Sesiones pendiente»), `pdfUrl` vacío y texto cotejado con otra fuente (ver `docs/con-textos/README.md`, «literal según grabación»).
- Cifras: siempre con organismo, fecha y URL; si hay discrepancias, registrar todas.
