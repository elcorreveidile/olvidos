# España y Marruecos, 1859-2026. Dossier de documentación

**Especial «Con-textos» de Olvidos de Granada · material de trabajo · versión 0.1 (2 de septiembre de 2026)**

Este dossier reúne, ordena y referencia la documentación sobre la que se construirá el especial interactivo. No es el artículo: es su expediente. Cada dato lleva su fuente; lo que no ha podido cotejarse en fuente primaria se marca **[NO VERIFICADO]** y queda fuera de los datos que alimentan las piezas interactivas hasta que se verifique.

Los bloques de investigación en bruto, con todas las URL, están en `bloques/`. Los datos estructurados que consumirá el artículo están en `src/data/con-textos/espana-marruecos/` y se regeneran con `npx tsx scripts/con-textos-merge.ts espana-marruecos`.

---

## 0. Nota metodológica y advertencias

### 0.1 Qué pregunta responde el especial

El detonante es la crisis de Ceuta de julio de 2026 y su explotación política: el 2 de septiembre, tras conocerse un informe policial que atribuye a agentes marroquíes la dirección de la entrada masiva, el líder de la oposición acusa al Gobierno de haberlo sabido y ocultado, y la extrema derecha pide juzgar al presidente por traición. Javier plantea dos preguntas de fondo:

1. ¿Es cierto que, históricamente, las confrontaciones con Marruecos parten de la derecha española?
2. ¿Qué papel ha jugado la monarquía, española y marroquí, en cada una de ellas?

Y una tercera, de actualidad: ¿qué implicaciones europeas y geopolíticas tiene la crisis de 2026 (Schengen, el Estrecho, Gibraltar, EEUU, Israel, Rusia, Argelia)?

El enfoque acordado es someter la primera pregunta a los datos y argumentarla donde los datos la sostengan, reconociendo las excepciones. Para eso hace falta una tabla honesta: cada episodio, quién gobernaba, con qué orientación, quién inició la confrontación, cómo se respondió, qué se dijo en las Cortes y qué hizo la Corona.

### 0.2 Qué contamos como fuente primaria

- **Diarios de Sesiones** del Congreso (serie histórica 1808-1977 y etapa democrática), del Senado (1834-1923 y etapa actual) y de las Cortes Españolas franquistas (1943-1977). Son el eje del especial: permiten leer, con la misma vara, lo que dijo cada bloque político en 1859, 1893, 1909, 1922, 1934, 1975, 2002, 2007, 2014, 2021, 2022 y 2026.
- **Boletín Oficial del Estado** y Gaceta de Madrid (tratados, leyes, reales decretos).
- **Documentos oficiales**: Ministerio del Interior (balances de inmigración irregular), Defensor del Pueblo, Fiscalía, Audiencia Nacional (autos y providencias públicos), Comisión Europea y Servicio Europeo de Acción Exterior, Tribunal Supremo, Tribunal Europeo de Derechos Humanos, Naciones Unidas.
- **Declaraciones públicas** recogidas por medios de referencia con fecha y hora; cuando existe vídeo oficial (La Moncloa, Congreso, RTVE, canales de los partidos), se enlaza.

Fuentes secundarias (historiografía académica, Real Instituto Elcano, prensa de calidad, Wikipedia como mapa de navegación) sirven para contextualizar y para localizar las primarias, no para sustituirlas.

### 0.3 Cómo codificamos «derecha» e «izquierda» a lo largo de 170 años

Las etiquetas no significan lo mismo en 1859 que en 2026. Usamos cuatro valores y una etiqueta literal por gobierno (véase `src/data/con-textos/espana-marruecos/gobiernos.ts`):

| Código | Siglo XIX y Restauración | Siglo XX | Democracia |
|---|---|---|---|
| **derecha** | moderados; Partido Conservador (Cánovas, Silvela, Maura, Dato, Allendesalazar, Sánchez Guerra) | radicales con la CEDA (1933-35); gobiernos de la «dictablanda» | UCD (centro-derecha), PP; Vox en la oposición |
| **liberal** | Unión Liberal (O'Donnell); progresistas; Partido Liberal (Sagasta, Moret, Canalejas, Romanones, García Prieto) | Gobierno provisional de 1931; Portela | — |
| **izquierda** | I República (1873-74) | Azaña 1931-33; Frente Popular 1936-39 | PSOE (González, Zapatero, Sánchez); socios: IU, Podemos, Sumar, ERC, Bildu |
| **dictadura** | — | Primo de Rivera (1923-30); Franco (1936/39-1975) | — |

Advertencias:
- La Guerra de África de 1859 la declara un gobierno de la Unión Liberal con el apoyo entusiasta de casi todo el arco, incluidos progresistas y demócratas. No es un caso de «derecha contra Marruecos» sino de consenso nacionalista.
- La guerra de 1893 (Sagasta) y el Protectorado de 1912 (Canalejas) son decisiones de gobiernos liberales.
- Annual (1921) ocurre bajo gobiernos conservadores y la exigencia de responsabilidades la encabeza la izquierda (Prieto) y sectores liberales; la dictadura de 1923 la cierra.
- Ifni (1934) es una ocupación decidida por el gobierno radical con apoyo de la CEDA; la izquierda republicana la critica.
- Ifni-Sáhara (1957-58) y la Marcha Verde (1975) ocurren bajo la dictadura, con Juan Carlos como jefe de Estado interino en noviembre de 1975.
- Perejil (2002) y Tarajal (2014) ocurren bajo el PP, pero Perejil lo inicia Marruecos.
- La visita real de 2007, el giro sobre el Sáhara de 2022 y las crisis de 2021 y 2026 ocurren bajo gobiernos del PSOE; en 2021 y 2026 el detonante lo pone Marruecos.

Por eso la tabla del capítulo 10 separa tres cosas: quién gobierna, quién inicia y quién escala el discurso.

### 0.4 Cifras

Cuando hay discrepancias se registran todas con su fuente y fecha. Ejemplo: los muertos de la entrada masiva de Ceuta de julio de 2026 fueron 34 y 43 (31 de julio, provisionales), 67 (1 de agosto), 72 (Delegación del Gobierno) y 88 (Ciudad Autónoma) a primeros de agosto, «más de cien» (AUGC) y 141 en la cifra consolidada (78 en territorio español y 63 en Marruecos). El artículo usará la consolidada y explicará la evolución.

### 0.5 Lo que este dossier no hace

No atribuye intenciones que no estén documentadas. La pregunta «¿qué habrían hecho PP y Vox en el Gobierno?» se responde sólo con lo que ellos mismos han propuesto y con lo que hicieron cuando gobernaron (capítulo 11).

---

## 1. Actualidad: Ceuta, julio-septiembre de 2026

*(Pendiente de fusión del bloque 01.)*

## 2. Siglo XIX: la Guerra de África, Margallo y Algeciras

*(Pendiente de fusión del bloque 02.)*

## 3. 1909-1927: del Barranco del Lobo a Alhucemas. Annual y las responsabilidades

*(Pendiente de fusión del bloque 02.)*

## 4. 1931-1975: República, guerra civil, Ifni y el Sáhara

*(Pendiente de fusión del bloque 03.)*

## 5. 1975-2004: Transición, Tratado de Amistad y Perejil

*(Pendiente de fusión del bloque 04.)*

## 6. 2004-2018: la visita real de 2007, las vallas, El Tarajal y el rechazo en frontera

*(Pendiente de fusión del bloque 04.)*

## 7. 2018-2025: Ceuta 2021, el giro sobre el Sáhara y Melilla 2022

*(Pendiente de fusión del bloque 04.)*

## 8. La monarquía

*(Pendiente de fusión del bloque 05.)*

## 9. Europa y el Estrecho

*(Pendiente de fusión del bloque 05.)*

## 10. Contraste de la hipótesis

*(Se redacta al final, con la tabla completa.)*

## 11. «¿Qué habrían hecho?»

*(Se redacta al final.)*

## 12. Series estadísticas y multimedia disponibles

*(Pendiente de fusión del bloque 06.)*
