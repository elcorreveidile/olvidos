# España y Marruecos, 1859-2026. Dossier de documentación

**Especial «Con-textos» de Olvidos de Granada · material de trabajo · versión 1.0 (2 de septiembre de 2026, cerrada antes del pleno extraordinario del 3 de septiembre)**

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

Cuando hay discrepancias se registran todas con su fuente y fecha. Ejemplo: los muertos de la entrada masiva de Ceuta de julio de 2026 fueron 19 (31 de julio, fuentes policiales), 67 (1 de agosto), 72 (Delegación del Gobierno) y 88 (morgue de la Ciudad Autónoma) a primeros de agosto, «aproximadamente cien» (AUGC), 75 (Interior, 4 de agosto), 79 (Instituto de Medicina Legal) y 141 en la cifra de Caminando Fronteras verificada a 4 de agosto (78 en territorio español y 63 en Marruecos); Marruecos reconoce 11. El artículo usará la de 141 y explicará la evolución y las metodologías.

### 0.5 Lo que este dossier no hace

No atribuye intenciones que no estén documentadas. La pregunta «¿qué habrían hecho PP y Vox en el Gobierno?» se responde sólo con lo que ellos mismos han propuesto y con lo que hicieron cuando gobernaron (capítulo 11).

---

## 1. Actualidad: Ceuta, julio-septiembre de 2026

Fuentes completas, horas y URL en `bloques/01-actualidad-2026.md`. Investigación cerrada el 2 de septiembre, antes de la comparecencia de Sánchez en el pleno extraordinario del 3 de septiembre (9:00).

### 1.1 Dos correcciones al planteamiento inicial

- La frase de Sánchez «un ataque, una violación de la integridad territorial de España» es del **31 de julio**, en Ceuta (La Moncloa). El 31 de agosto, en la SER, dijo lo contrario sobre Marruecos: «No hay ninguna información de participación alguna».
- El artículo 102.2 de la Constitución exige la iniciativa de «la cuarta parte de los miembros del Congreso» y la aprobación por mayoría absoluta: con 350 diputados son **88** (El Español, 8 ago), no 75 como publicaron The Objective y otros. Vox tiene 33; PP y Vox suman 170, por debajo de los 176 de la mayoría absoluta.

### 1.2 Cronología

| Fecha | Hecho | Fuente primaria o de referencia |
|---|---|---|
| 29 jun / 8 jul / 13 jul | Sentencia del Supremo (STS 814/2026): el «rechazo en frontera» no se aplica a quien llega a nado; procedimiento ordinario con abogado y asilo. Tres fechas según la fuente; Robles la fecha «de 8 de julio» en el Congreso | DSCD-15-CO-609, p. 5; Moncloa.com |
| 20 jul | Sánchez en Argel con Tebune: «nueva etapa», VIII RAN en octubre, más gas | La Moncloa |
| 20-29 jul | Unas 1.500 llegadas a nado; «unos ciento cincuenta» nadadores diarios (Robles); menores acogidos de 180 a 800 | DSCD-15-CO-609, p. 6; El Español (Vivas, 30 ago) |
| 24-30 jul | Campaña en Facebook «asalto Karyaj a Ceuta»: 25 grupos con ~1.032.000 membresías; sin Gobierno ni organización identificados detrás | Golden Owl, 3 ago |
| 27 jul | Vivas llama al jefe de Gabinete de Sánchez; Robles confirma en el Congreso la reunión Vivas-delegado del Gobierno con alerta de «posible colapso» | DSCD-15-CO-609, p. 6 |
| 28 jul | Vivas pide a Marlaska el estado de alarma; Jupol alerta públicamente | El Español; Infobae |
| 29 jul | Interior: «no había fundamento jurídico». El CENIF emite informe: «riesgo alto» de llegadas a nado, «riesgo extremo» en escenario de accesos coordinados «previsto para el 30 de julio» | El Independiente, 31 ago; El Español, 1 sept |
| 30 jul, 11:30 | «Asalto masivo» por El Tarajal y Benzú (cronología del EMAD citada por Robles). Sindicatos policiales: «colapso total», Marruecos «ya no está reteniendo a nadie». Despliegue del Ejército (más de 3.000 efectivos) | DSCD-15-CO-609, p. 5; El Independiente; El Debate |
| 31 jul | «Unas 49.000» entradas en 24 horas. Sánchez y Marlaska en Ceuta: «un ataque, una violación de la integridad territorial de España». Benyaich: situación «no querida por el reino de Marruecos». La jueza Tardón (AN) pide informes a Policía y Guardia Civil (DP 64/2026, denuncia de Iustitia Europa). Italia anuncia controles Schengen | La Moncloa; El Debate; El Independiente; El Español |
| 1 ago | Barrera flotante de 500 m en El Tarajal; Instrucción 9/2026 de Interior. Carta de Sánchez a Von der Leyen: «En menos de 48 horas… control de la frontera». 67 muertos. Retornos: 25.000 a las 14:30, ~48.500 al cierre del día. EEUU eleva a nivel 3 la alerta de viaje | Euronews; The Objective; DSCD-15-CO-609, p. 7; Elcano |
| 2-5 ago | Muertos: 72 (Delegación), 88 (morgue de Ceuta), ~100 (AUGC), 75 (Interior, 4 ago), 79 (IML), **141 = 78 + 63** (Caminando Fronteras, 5 ago); Marruecos reconoce 11. Interior fija 72.000 entradas (4 ago). Von der Leyen: «no se puede aceptar ningún intento de utilizar la migración ilegal como medio para ejercer presión» | France 24; Canal Sur; CeutaTV; Infobae; Libertad Digital |
| 6 ago | Comisión Europea (Mercier): canales «particularmente rusos» amplificaron «empezando el 30 de julio, pero antes del 30 de julio, no hemos visto esta actividad» | ElNacional.cat; El Español |
| 8 ago | Abascal en X: «La traición de Pedro Sánchez… debe llevarse a los tribunales… artículo 102». El PP pide la dimisión de Marlaska | El Español |
| 10 ago | Ouahbi (Justicia, Marruecos): «Seguimos reivindicando nuestros territorios». Torres habla de 80.000; el Gobierno lo corrige a 72.000 | Infobae; Euronews |
| 12-13 ago | Robles: «A Ceuta y Melilla no se las toca», «españolísimas». Marlaska: quedan unos 5.000; 1.898 menores; nadie «será trasladado a la Península» | The Objective; Público |
| 15 ago | Marruecos expulsa de Fnideq a TVE y EFE tras grabar una carga policial | The Objective |
| 21 ago | Nota de Exteriores: «Ceuta y Melilla son dos ciudades españolas frontera de España y de la UE» | El Español |
| 24 ago | Mawlid en Rabat: Toufiq evoca «la lucha de los marroquíes para liberar las ciudades ocupadas de la costa atlántica» ante Mohamed VI. Jabaroot filtra 70.380 nombres de la DGST y la DGSN y señala a Hammouchi y El Himma | El Español; The Objective; Infobae |
| 25 ago | Consejo de Seguridad Nacional y mando único, «veintiséis días después» (Muñoz). Robles en la Comisión de Defensa: el CNI «realizó la labor que competencialmente les era exigible»; «lo sucedido el pasado 30 de julio no puede volver a ocurrir» | DSCD-15-CO-609 |
| 26 ago | Diputación Permanente: el PP retira la petición de Sánchez (comparecerá el 3 sept); cinco peticiones rechazadas 34-35. Millán (Vox): «Esto es traición». Belarra: «Marruecos ha utilizado a su gente como arma arrojadiza, pero ustedes están intentando castigar a Marruecos utilizando a la gente» | DSCD-15-PL-200, pp. 33-44, 70 |
| 27 ago | Emboscada en Benzú a cuatro militares (heridos; doce detenidos). Comparecen Bolaños («no existe ninguna evidencia» de Marruecos) y Mónica García («crisis humanitaria, aunque el PP siga insistiendo en llamarlo invasión») | Ceuta al Día; DSCD-15-CO-610, p. 38 |
| 28 ago | Comparecen Marlaska, Albares y Saiz. Ana Vázquez (PP): «Si el Gobierno no sabía nada, es incompetente. Y si disponía de información, es negligente». ERC, Junts, PNV, Bildu y Sumar cargan contra Marlaska. Jupol informa a Vivas del informe sobre los gendarmes | Press Digital; The Objective; Infobae. Diarios no publicados |
| 30 ago | Vivas: «El lunes 27 llamé a Moncloa y me dijeron que estuviera tranquilo, el martes pedí el estado de alarma, el miércoles me dijeron que no había fundamento jurídico, el jueves llegó la avalancha» | El Español |
| 31 ago | Sánchez (SER) exonera a Marruecos, señala bulos «asociadas tanto a Rusia como a Israel y a una internacional ultraderechista» y anuncia la visita del Rey. Sa'ar: «He lied again». Fiscalía: 23 agresiones sexuales, 5 violaciones, 9 víctimas menores. Abascal: «lacayo de Marruecos»; pide al PP los votos para el 102 y suspender el Tratado de 1991. El Independiente publica el informe del CENIF del 29 de julio | The Objective; elDiario.es; Vozpópuli |
| 1 sept | Zajárova exige «hechos concretos». SEAE: «no tenemos pruebas concluyentes que sugieran que la crisis en sí fuera desencadenada por desinformación procedente de actores estatales extranjeros»; cuentas israelíes «no vinculadas directamente al Gobierno o al Estado israelí». 21:29: El Español publica el informe del CENIF a la jueza | El Independiente; El Español |
| 2 sept | Carta de Marlaska al director de la Policía pidiendo «la veracidad de lo publicado». La jueza ordena que el informe «solo se podía informar a su señoría». Día de Ceuta: Casa del Rey, «La Corona y todos, con nuestra ciudad» (13:00); Feijóo (14:12): «El Gobierno lo sabía y lo tapó» | The Objective; ElNacional.cat; El Español (directo) |

### 1.3 Las cifras, una a una

**Entradas**: 49.000 (Interior/Guardia Civil, 31 jul) → «aproximadamente 50.000» (carta de Sánchez, 1 ago) → 40.000 (Interior marroquí, 3 ago) → **72.000 oficial** (Interior, 4 ago) → 80.000 (Torres, 10 ago, corregido) → «72.000-80.000» (CENIF). **Retornos**: 25.000 a las 14:30 del 1 de agosto (Robles), ~48.500 al cierre del día (Elcano), «aproximadamente el 90%» (Robles, CENIF). **Muertos**: tabla en el bloque; la cifra que usará el artículo es la de Caminando Fronteras verificada a 4 de agosto (141: 78 en aguas o suelo español y 63 en Marruecos), con la evolución oficial (19 → 67 → 72 → 75 → 79) y el dato marroquí (11) explicados. Las cifras 34 y 43 que circulan sólo constan en Wikipedia. **Permanecen**: 5.000 (Marlaska, 13 ago), 10.000 (Vivas, 30 ago). **Menores**: 1.898 identificados, más de 500 expedientes de asilo, «500 niñas» pendientes de traslado (Sánchez).

### 1.4 Quién pide qué

| Bloque | Qué pide | Dónde |
|---|---|---|
| PP | Convocar a la embajadora marroquí, llamar a consultas al embajador en Rabat, dimisión de Marlaska, elecciones. «España está ante un Gobierno fallido, pero no ante un Estado fallido» (Feijóo). «¿Por qué no han llamado al embajador de Marruecos?» (Muñoz, 25 ago). No pide el art. 102 | Ceuta, 2 sept; DSCD-15-CO-609, p. 11 |
| Vox | Art. 102 por «traición» (8 y 31 ago); suspender el Tratado de Amistad de 1991 y el acuerdo preferencial UE-Marruecos; condena «formal y solemne» de la UE (Buxadé). En el Congreso: «los actos u omisiones que ustedes han realizado… encajan dentro del delito de traición a la seguridad de España» (Asarta); «las muertes… han sido provocadas por el régimen de Marruecos, con la complicidad del Partido Socialista» (Millán) | DSCD-15-CO-609, p. 14; DSCD-15-PL-200, pp. 42-43 |
| Gobierno | «Cautela» (Bolaños); Marruecos «socio fiable» (Albares, Marlaska); «no hay ninguna información de participación alguna» (Sánchez, 31 ago); Rusia e Israel amplifican bulos; el Rey visitará Ceuta | SER; Infobae; El Español |
| Sumar / Podemos / IU | Depurar responsabilidades y convocar a la embajadora (Sumar); Marlaska «no puede seguir ni un minuto más» y romper con la «dictadura» marroquí (Podemos); dimisión si conocía el informe (IU). Belarra (26 ago): el PP quiere «castigar a Marruecos utilizando a la gente» | El Español; Infobae; DSCD-15-PL-200, p. 36 |
| PNV / ERC / Junts / Bildu | Responsabilidad «grave» de Marruecos (Legarda); «monarquía absoluta que utiliza las fronteras y a su gente como arma arrojadiza» (Jordà); «parece ser que Marruecos tuvo mucho que ver» (Matute); competencias de inmigración (Junts) | DSCD-15-PL-200, pp. 37-40 |
| Casa Real | «Preocupación e indignación» (1 ago, **[NO VERIFICADO en casareal.es]**); audiencia a Vivas (6 ago); «La Corona y todos, con nuestra ciudad» (2 sept) | Infobae; casareal.es; X |
| Marruecos | «No querida por el reino de Marruecos» (Benyaich, 31 jul); silencio oficial sobre los muertos; 40.000 llegados y 11 muertos (Khalfi); «seguimos reivindicando nuestros territorios» (Ouahbi); «ciudades ocupadas» (Toufiq) | El Independiente; Canal Sur; Infobae; El Español |

### 1.5 El informe del CENIF y la investigación judicial

El CENIF es el Centro Nacional de Inmigración y Fronteras, unidad de inteligencia de la Comisaría General de Extranjería y Fronteras de la Policía Nacional. Emitió una primera alerta el 29 de julio y remitió su informe a la Audiencia Nacional el 31 de agosto, dentro de las Diligencias Previas 64/2026 del Juzgado Central de Instrucción de María Tardón, abiertas el 31 de julio por denuncia de Iustitia Europa para determinar si hay «indicios de delito contra la independencia del Estado». Según El Español (1 sept, 21:29): «la finalidad migratoria del incidente fue solo la cobertura formal» de una operación dirigida; «gendarmes marroquíes dieron indicaciones a los inmigrantes» y «gestionar[on] el flujo»; «individuos de paisano» «daban instrucciones a los policías marroquíes»; «operación de contra-inteligencia ofensiva de manual». Tres oleadas: hombres jóvenes con neoprenos y aletas antes de las 11:00 del 30; familias con niños entre las 11:00 y las 22:00; de nuevo jóvenes desde las 22:00 y el 31. Una segunda convocatoria para el 15 de agosto fue «totalmente controlada» por Marruecos. El firmante no está identificado **[NO VERIFICADO]**. El 2 de septiembre Marlaska escribió al director de la Policía pidiendo «la veracidad de lo publicado» y la jueza ordenó que el informe «solo se podía informar a su señoría» (RD 769/1987, art. 15). La jueza espera un último informe de la Guardia Civil antes de decidir sobre su competencia.

### 1.6 Lo que hay y lo que no hay sobre injerencias

Hay: amplificación por canales rusos a partir del 30 de julio (Comisión Europea, 6 y 28 ago); cuentas israelíes no estatales (Danon, Ben Gvir) de volumen menor (SEAE, 1 sept); una campaña de movilización en Facebook sin patrocinador identificado (Golden Owl). No hay: prueba de que la desinformación causara la entrada (SEAE); informe público que atribuya al Estado israelí una campaña; constancia policial de actividad rusa o israelí previa («no nos consta», Policía y Guardia Civil, 2 sept). Sí hay un informe oficial español que atribuye la dirección de la entrada a agentes marroquíes: el del CENIF. El «informe del grupo 411» sólo aparece en Wikipedia **[NO VERIFICADO]**.

### 1.7 Parlamento

Verificados en PDF: Comisión de Defensa del 25 de agosto (DSCD-15-CO-609), Diputación Permanente del 26 (DSCD-15-PL-200, con vídeo en el Congreso) y Comisión de Sanidad del 27 (DSCD-15-CO-610). No publicados a 2 de septiembre: Justicia (27), Interior, Exteriores y Migraciones (28), Juventud (31). Pleno extraordinario con Sánchez el 3 de septiembre. Todas las citas de estos Diarios están en `quotes.ts` con página y URL; las de las comisiones sin Diario van como no verificadas.

### 1.8 Lectura provisional

La secuencia documentada es: alertas locales y policiales (27-29 jul), informe de inteligencia con «riesgo extremo» (29 jul), entrada masiva dirigida según la Policía (30-31 jul), respuesta del Gobierno centrada en el control de la frontera y en la cooperación con Rabat, y un mes de disputa sobre quién sabía qué. El PP construye el relato de la ocultación («lo sabía y lo tapó») y pide elecciones; Vox construye el de la traición y pide el art. 102, que aritméticamente no puede prosperar sin el PP y sin 176 votos; el Gobierno desplaza el foco a Rusia e Israel y al Rey; los socios de izquierda y los nacionalistas coinciden, con matices, en señalar a Marruecos y a Marlaska. Lo que nadie del arco parlamentario ha pedido, con las fuentes consultadas, es una respuesta militar contra Marruecos: la exigencia máxima documentada es suspender el Tratado de Amistad (Vox) y llamar a consultas a los embajadores (PP).

## 2. Siglo XIX: la Guerra de África, Margallo y Algeciras

Fuentes, referencias de Diario y URL en `bloques/02-xix-1927.md`. Hallazgo metodológico: cada Diario de la serie histórica se sirve como PDF con OCR en `https://app.congreso.es/est_sesiones/resource?id=<legislatura>/<año>/<mes>/C-<núm>-<pág>.pdf`; todas las citas marcadas como verificadas se han leído en ese PDF.

### 2.1 Guerra de África (1859-1860): un consenso nacionalista

- **Gobierno**: Unión Liberal de O'Donnell (código «liberal»), que acumula Guerra; Isabel II. **Quién inicia**: España declara la guerra tras incidentes de cabilas de Anyera en el campo exterior de Ceuta (agosto de 1859).
- **Congreso, 22 de octubre de 1859 (DSC núm. 148, pp. 4121-4144)** [verificado]. O'Donnell: «el Gobierno ha creído que era llegado el caso de apelar a las armas […] para recibir la satisfacción del agravio hecho al honor de la Nación española»; «No vamos animados de un espíritu de conquista, no. […] vamos a lavar nuestra honra, a exigir garantías para lo futuro». La proposición de apoyo (López de Ayala) se aprueba en votación nominal por los **186 presentes** (el Diario; la prensa dijo 187). El progresista Calvo Asensio se adhiere «en nombre de la prensa» de todas las ideas «unidas por un lazo común, el amor a la Patria».
- Historiografía (Serrallonga, *Ayer*): «Progresistas, demócratas y algunos miembros de la Unión Liberal se presentan como los más fervientes defensores de la contienda. El broche lo pone Castelar». Rivero: «sólo para una guerra de África podría yo tolerar la quinta». 445 voluntarios catalanes con Prim.
- Bajas 4.040-7.020, en un 68-72% por el cólera. Wad-Ras (26-4-1860): indemnización de 400 millones de reales (100 millones de pesetas; 140 millones cobrados según Echenique) y ocupación de Tetuán hasta el pago: «guerra grande y paz chica».
- **Corona**: Isabel II, al reabrir las Cortes el 25-5-1860, dijo que las ventajas del tratado «compensan, en cuanto cabe, los gastos del Tesoro público» **[NO VERIFICADO en el DSC]**.
- **Lectura**: no es un caso de «derecha contra Marruecos»; es la guerra más popular del siglo, empujada por progresistas y demócratas tanto como por el Gobierno.

### 2.2 Margallo (1893) y el Tratado de Marrakech (1894): un gobierno liberal

- **Gobierno**: Sagasta (Partido Liberal); regencia de María Cristina. **Quién inicia**: las cabilas de Guelaya atacan las obras del fuerte de Sidi Guariach (2-3 de octubre de 1893); Margallo muere el 28 de octubre; Martínez Campos negocia en Marrakech (5-3-1894, 20 millones de pesetas).
- **Las Cortes estuvieron cerradas durante la guerra**; el debate fue en abril de 1894 [verificado]: Azcárate recuerda que las minorías republicanas acordaron volver a la Cámara «si el interés de la Patria lo reclamase» (DSC 98, p. 3294); conservadores y republicanos piden expedientes para «discutir la responsabilidad que corresponda al Gobierno», incluida la súplica de los jefes rifeños a la Reina para cambiar el emplazamiento del fuerte (p. 3295). Sagasta (DSC 100, pp. 3353-3354): el tratado deja «muy a salvo la dignidad de la Nación» y «el patriotismo aconseja callar, porque de ciertas cosas cuanto menos se hable, mejor»; López Domínguez, ministro de la Guerra (DSC 101, p. 3375): «Si vergüenza hubo, yo la acepto para mí».
- Republicanos: Castelar, «Pronto castigo y a casa»; Ruiz Zorrilla, «con vergüenza para nuestro pueblo» **[NO VERIFICADO en original]**.

### 2.3 1904-1906: reparto y Algeciras

Convenio hispano-francés de 3-10-1904 (Gobierno conservador de Maura); Conferencia de Algeciras (enero-abril 1906, Gobierno liberal de Moret): policía bajo el Sultán con instructores españoles en Tetuán y Larache y franceses en el resto. Ratificación en Cortes **[NO VERIFICADO]**.

## 3. 1909-1927: del Barranco del Lobo a Alhucemas. Annual y las responsabilidades

Fuentes y URL en `bloques/02-xix-1927.md` (§4-8).

### 3.1 1909: Maura, los reservistas y la «Regia prerrogativa»

- **Gobierno**: Maura, conservador («gobierno largo»); Alfonso XIII. **Quién inicia**: ataque rifeño a los obreros del ferrocarril minero (9-7-1909); movilización de reservistas (10-11 de julio); Barranco del Lobo (27-7: 153 muertos, muere el general Pintos); Semana Trágica (26-7 a 2-8); Ferrer fusilado (13-10). Las Cortes, cerradas hasta el 15 de octubre.
- **Debate de 18-19 de octubre de 1909 (DSC 3 y 4)** [verificado]. Moret (liberal): «se traía a los reservistas con escenas de dolor por la separación de sus familias […] en el Gobierno habían faltado las dos grandes condiciones del Poder público: la previsión por una parte, y la energía para la represión por la otra» (p. 22); «los Gobiernos los busca el Poder Real» (p. 52). Maura: «se decía al pueblo que todo esto tenía por objeto convertir al ejército español en guardián de minas para que unos cuantos burgueses se enriquecieran» (p. 41); «¡loado sea Dios que estamos en vísperas de comparecer ante el sufragio universal!» (p. 55). El 21-10-1909 Maura comunica su dimisión «ínterin S. M., en uso de su Regia prerrogativa, designa nuevo Ministerio» (DSC 6, p. 85): el Rey retira la confianza a Maura y llama a Moret. El «¡Maura, no!» es consigna de prensa y calle, no frase del Diario.
- Pablo Iglesias (7-7-1910): «antes que S. S. suba al Poder, debemos llegar hasta el atentado personal» **[NO VERIFICADO]**.
- **Corona**: Alfonso XIII visita Melilla en enero de 1911 y Montero Ríos lo apoda «el Africano».
- **Lectura**: aquí sí hay un gobierno conservador que escala (movilización de reservistas, ocupación) y una izquierda que se opone en la calle; pero es la Corona, no las Cortes, quien derriba a Maura.

### 3.2 1912: Canalejas, el Tratado y «para nosotros no hay Tratado»

Gobierno liberal de Canalejas (asesinado el 12-11-1912; DSC 179 recoge la comunicación y a García Prieto: «no quedan en nuestro espíritu fuerzas para discurrir ni para hablar»). Tratado hispano-francés de 27-11-1912 firmado bajo Romanones. Ese mismo día en el Congreso (DSC 188, pp. 5486-5487) [verificado]: Rodríguez Romeo pide retirar la partida «Acción de España en África» («Ahora ya sabemos que el statu quo cuesta 62 millones»); Romanones: «Mientras el Tratado no reciba la sanción del Parlamento no puede causar estado de derecho ninguna de sus consecuencias: para nosotros no hay Tratado». Fecha de la ratificación **[NO VERIFICADO]**. **Lectura**: el Protectorado es obra de gobiernos liberales.

### 3.3 1921: Annual y «fué el Rey»

- **Gobierno**: Allendesalazar (conservador), ministro de la Guerra vizconde de Eza; desde el 14-8-1921, Maura con La Cierva en Guerra. **Quién inicia**: ofensiva de Abd el-Krim sobre un dispositivo español en avance (Abarrán 1-6, Igueriben 21-7, Annual 22-7, Monte Arruit 9-8). Bajas: 13.363 (Picasso), 8.668 españoles (Prieto), 7.875 (Caballero Poveda).
- **Primer debate (octubre-noviembre de 1921)** [verificado]. La Cierva (20-10, DSC 77, p. 3687): «¿es que hay alguien aquí que diga con carácter general que el Ejército español es un Ejército de bandidos?». **Prieto (27-10, DSC 81, p. 3831)**: «¿Quién, entonces, autorizó la operación sobre Alhucemas, quién la decretó? […] lo dijo el general Silvestre al volver a Melilla desde la borda del barco: fué el Rey. (Rumores y protestas.)»; el presidente Sánchez Guerra le reprocha «hipótesis […] atentatorias a la promesa por V. S. dada»; Prieto (p. 3832): «llevar al Rey a la zona del Protectorado como si fuera una zona de conquista […] ocho mil cadáveres parece que se agrupan en torno de las gradas…». La Cierva (p. 3833): «la responsabilidad que pueda exigirse sólo incumbe y alcanza a los Gobiernos». Maura (10-11, DSC 88, pp. 4076-4077): un debate que «interesa a todos los hogares […] en todos los ámbitos de la Monarquía».
- **El telegrama «¡Olé los hombres!»**: aparece por primera vez en el folleto de Blasco Ibáñez *Por España y contra el rey* (1924-25). Tusell y García Queipo de Llano no hallaron en el Archivo de Palacio «ningún documento que demuestre que el monarca mantuviera relación escrita o telegráfica con Silvestre»; ni Prieto ni Companys lo mencionaron en sus ataques parlamentarios; el «telegrama personal y reservado» que Prieto cita el 21-11-1922 es de La Cierva (DSC 105, p. 4194). Gajate (2013): «no existen pruebas documentales, sino sólo testimonios indirectos». El artículo debe presentarlo como leyenda política, no como hecho.

### 3.4 1922: el Expediente Picasso y el debate de noviembre

Picasso entrega el expediente el 18-4-1922; el Consejo Supremo procesa a 39 militares y pide suplicatorio contra Berenguer (senador vitalicio; aprobado en el Senado el 28-6-1923). Comisión de Responsabilidades (21-7-1922, a iniciativa del conservador Sánchez Guerra, presidida por Alcalá-Zamora). Tres dictámenes el 14-11-1922: conservador (sólo responsabilidades militares), liberal (censura e inhabilitación de Allendesalazar, Lema y Eza), socialista (acusación de los gobiernos Allendesalazar y Maura ante el Senado). Sesiones [verificadas]:

| Fecha | Orador | Cita | Ref. |
|---|---|---|---|
| 14-11 | Villanueva, Romanones, Lerroux, M. Álvarez, Alba, Gasset, Alcalá-Zamora | «es indispensable la plena depuración de las responsabilidades militares y políticas» | DSC 101, p. 4016 |
| 21-11 | Prieto (PSOE) | «sería una vileza enorme erigir una figura política, clavar el mástil de una bandera sobre un pedestal tan macabro como el que forman las toneladas de huesos humanos recogidos en la zona de Melilla […] un pueblo que no tuviese la gallardía y la valentía de liquidar […] las responsabilidades de esta tragedia, sería un pueblo que no tenía ya derecho a existir como pueblo libre» | DSC 105, p. 4187 |
| 21-11 | Prieto | «¿Quién lo mandó? ¿Quién lo ordenó? ¿Quién lo dispuso? Eso es lo que, teniendo yo una firmísima convicción, no hay manera de demostrar en las páginas del expediente Picasso» | p. 4193-4194 |
| 22-11 | Sánchez Guerra (conservador, presidente del Consejo) | «permitidme lo único que me puede ser permitido: la elocuencia del silencio» | DSC 106, p. 4234 |
| 23-11 | Votación | El dictamen socialista, «no tomado en consideración […] por 145 votos contra 7» | DSC 107, p. 4276 |
| 24-11 | Alcalá-Zamora (liberal) | «han sido tan claras, tan evidentes, tan abrumadoras las responsabilidades, que con una intensa y sincera amargura […] me he visto en el trance de tener que reconocerlas» | DSC 108, pp. 4313-4314 |
| 28-11 | Sánchez Guerra | Inhabilitar a ex ministros «constituye […] un agravio a la prerrogativa de la Corona» | DSC 109, p. 4369 |
| 30-11 | Maura | «condenar sin oír, aun justamente, es una iniquidad […] si […] viene la acusación en debida forma, ya verá S. S. cómo yo voto» | DSC 111, pp. 4464-4465 |
| 1-12 | Melquíades Álvarez | La doctrina de Maura es «inaceptable y peligrosa […] peligrosísima» | DSC 112, pp. 4494-4495 |
| 5-12 | Sánchez Guerra | «la sesión no puede continuar, porque no hay Gobierno, pues yo marcho desde aquí a Palacio a presentar la dimisión» (Wikipedia la fecha erróneamente el 22-11) | DSC 113, p. 4529 |

### 3.5 1923: «yo aquí soy la Corona» y el golpe

Gobierno de García Prieto (concentración liberal). Debate de 3-4 de julio de 1923 [verificado]: La Cierva denuncia «este filón […] de las responsabilidades» (DSC 21, p. 671); García Prieto: «yo aquí, Sr. Cierva, soy la Corona; frente a la Corona soy el Parlamento; y como soy la Corona, en nombre de la Corona no puedo acusar a S. S. ni a nadie» (DSC 22, p. 707), aunque «puede haber responsables políticos […] Yo afirmo resueltamente que sí» (p. 708); Prieto: «Conocemos la escasa capacidad revolucionaria de España en estos instantes» (p. 711-712); **Companys** (republicano): «después del desastre de Annual, el país os hubiera debido barrer a todos, y con vosotros al Rey. (Grandes protestas en toda la Cámara.)» (p. 717), y advierte de que si no se exigen responsabilidades a los ministros «el Ejército no lo consentirá» (p. 718). La segunda Comisión (10-7-1923) convoca al pleno para el 1-2 de octubre: «Nunca llegaría a reunirse». **Golpe del 13-9-1923**: el manifiesto promete «al problema de Marruecos solución pronta, digna y sensata» y sanciona «la responsabilidad colectiva de los partidos políticos»; en junio el Rey se había negado a cesar a Primo de Rivera y sólo pidió a Cavalcanti «que le mantuviera informado». Bernardo Mateo Sagasta escondió el Expediente Picasso hasta abril de 1931.

### 3.6 1925-1927: Alhucemas y la Asamblea Nacional

Desembarco de Alhucemas (8-9-1925; Directorio Militar; cooperación francesa; 13.000 hombres, 361 muertos); rendición de Abd el-Krim a Francia (mayo 1926); fin oficial de la guerra (comunicado de Sanjurjo, 8/10-7-1927); bajas totales 53.500 españolas. Asamblea Nacional Consultiva (decreto de 12-9-1927): sesión inaugural presidida por el Rey el 10-10-1927; Yanguas Messía: «El gesto viril del General Primo de Rivera salvó a España de la anarquía […] la pacificación en Marruecos» (DSAN 1, pp. 8-9) [verificado]. Coda: las Cortes republicanas declararon a Alfonso XIII culpable de alta traición (20-11-1931) por dirigir la acción militar en Marruecos «a espaldas del Consejo de Ministros»; Romanones defendió que en el expediente Picasso no hay «pruebas fehacientes, ni siquiera pruebas indiciarias» **[NO VERIFICADO en DSC]**.

### 3.7 Lectura provisional del periodo 1909-1927

Las guerras del Rif las gestionan gobiernos de los dos partidos del turno; la escalada militar decisiva (1921) se produce bajo conservadores, y la exigencia de responsabilidades la encabezan socialistas (Prieto, Besteiro), republicanos (Companys) y liberales (Alcalá-Zamora, Melquíades Álvarez), mientras los conservadores (Sánchez Guerra, Maura, La Cierva) protegen «la prerrogativa de la Corona». El desenlace no lo da el Parlamento sino el Rey, que ampara el golpe que entierra el expediente. Es el episodio que mejor sostiene la hipótesis de Javier en su versión fuerte: derecha, Ejército de África y Corona frente a un Parlamento que pedía cuentas.

## 4. 1931-1975: República, guerra civil, Ifni y el Sáhara

Fuentes y URL en `bloques/03-republica-1977.md`. Las citas parlamentarias se han leído en los PDF de la serie histórica (Cortes republicanas 1931-1936 y Cortes Españolas 1943-1977).

### 4.1 La República y el Protectorado (1931-1936)

- **Azaña (1931)**: decreto de 4-7-1931 que separa el alto comisario (civil) del jefe militar de Marruecos y reduce el Ejército de África (unos 50.000 hombres en el bienio; 32.000-34.000 en 1936); descontento africanista **[secundaria]**. Barriobero en las Constituyentes (28-7-1931): «en el presupuesto de cientos de millones de Marruecos, hay la cantidad de 51.300 pesetas para enseñanza».
- **Nacionalismo marroquí**: 800 notables piden a Alcalá-Zamora la igualdad (mayo de 1931); la República no abre vía alguna de autonomía **[NO VERIFICADO el texto de la carta]**. La única voz parlamentaria por la independencia es comunista: Balbontín (Constituyentes, 25-8-1933, DSC 395, pp. 15080-15082): «nosotros, los comunistas, seguimos manteniendo en pie […] la bandera del abandono de Marruecos o, más claramente, de la independencia de Marruecos».
- **Ifni (abril de 1934)**: Gobierno Lerroux (radical, con la CEDA; código «derecha»); el coronel Capaz desembarca el 6-4-1934. **Quién inicia**: España. Debate de 19-4-1934 (DSC 71, pp. 2392-2403) [verificado]: Bolívar (PCE): «ha sido anunciada, en una forma algo teatral, la ocupación por el Gobierno imperialista español del territorio de Ifni»; «En realidad, ha sido un atraco a mano armada» (pp. 2392-2393); Goicoechea (Renovación Española) celebra la rehabilitación de Capaz, confinado por Azaña (p. 2394); Ramos Acosta (radical-socialista) enumera «la pérdida de dos vidas y el avión que ocupaban; de otras cinco vidas de soldados musulmanes y una de un soldado español» (pp. 2394-2395); Cruz (Canarias): «traer al dominio de España lo que fue siempre de España» (p. 2396); Rodríguez de Viguri (agrarios) felicita al Gobierno (p. 2397); **Lerroux**: «nuestro imperialismo ha consistido en coger a un coronel que, acompañado de un oficial y un cabo, han desembarcado en el territorio de Ifni […] Y se ha asentado allí ese emperador (Risas.)» (p. 2398). **Lectura**: la única expansión territorial de la República la decide el centro-derecha con aplauso de la derecha y crítica de la izquierda; el patrón de 1909-1921 se repite a pequeña escala.
- **Gil Robles (1935)** nombra a Franco jefe del Estado Mayor Central y a Mola jefe de Marruecos; sin intervención parlamentaria localizada sobre Marruecos.
- **17-19 de julio de 1936**: el golpe empieza en Melilla (Seguí, Gazapo; Romerales fusilado; 189 ejecutados esa noche según Beevor), Tetuán y Ceuta; Franco llega a Tetuán el 19. Tropas marroquíes reclutadas: entre 62.000 y 100.000 según la fuente (Madariaga, Bárbulo, El Attar), 11.000-20.000 muertos; en julio de 1938 el Cuerpo de Ejército Marroquí tenía unos 98.000 hombres (Thomas). El bando de guerra de Melilla **[NO VERIFICADO: texto vía Wikipedia]**.

### 4.2 Franquismo: independencia (1956), Ifni-Sáhara (1957-58), provincias y retrocesión (1969)

- **7-4-1956, Declaración conjunta hispano-marroquí** (Madrid; BOE de 4-3-1957 **[URL no localizada]**): Franco reconoce la independencia y la «unidad territorial» de Marruecos «a pesar de las protestas formuladas por el Ejército» (García Valiño). NO-DO 693 A. Cabo Juby no pasa a Marruecos hasta 1958.
- **Guerra de Ifni-Sáhara (23-11-1957 a 30-6-1958)**: ataque del Ejército de Liberación marroquí; Edchera (13-1-1958); operación franco-española Teide/Écouvillon; acuerdo de Cintra (1-4-1958) entrega Cabo Juby. **Quién inicia**: Marruecos (irregulares). Bajas españolas: 198/574/80, 205/573/166 o 190/500/80 según la fuente. Franco, 30-12-1957: ni el pueblo marroquí ni Mohamed V tenían responsabilidad **[NO VERIFICADO; paráfrasis]**. NO-DO: 26 noticiarios sobre Ifni entre 1943 y 1969, 16 de ellos en 1957-58; González Sáez: el noticiario «minimizó la relevancia de los hechos militares».
- **Provincialización**: Decreto de 10-1-1958 (BOE 14-1-1958, p. 87): «Los Territorios del África Occidental Española se hallan integrados por dos provincias, denominadas Ifni y Sahara Español»; Ley 8/1961 de la Provincia de Sahara (representación en Cortes). El Consejo de Estado juzgó después la provincialización «funcional» (Oreja).
- **Tratado de Fez (4-1-1969; BOE 5-6-1969)**: «España retrocede a Marruecos en plena soberanía el territorio de Ifni». Pleno de las Cortes Españolas de 22-4-1969 (BOCE 1050, pp. 25579-25589) [verificado]: procedimiento de «Cortes oídas» usado «solamente dos veces»; García-Valdecasas: «no me gustan las cesiones encubiertas de soberanía, porque la soberanía debe resplandecer» (p. 25581); votación nominal pedida por 51 procuradores; Carrero Blanco vota sí, Blas Piñar no; el Diario no imprime totales (295/66/25 según Montoro; recuento propio ~277/67/25). Arriado de bandera en Sidi Ifni el 30-6-1969 (NO-DO 1384 B).

### 4.3 El Sáhara (1973-1976)

- Polisario (10-5-1973); la Yemaa pide la autodeterminación (20-2-1973); España anuncia en la ONU un referéndum para el primer semestre de 1975 (20-8-1974); Carro en las Cortes: «La propia ONU nos pidió que aplazáramos este proceso» (DSP 20, p. 108). Kissinger a Arias (Torrejón, 9-11-1974): «Qué más les da a ustedes. Hassán lo desea tanto…» **[NO VERIFICADO; memorias de Perinat]**.
- **16-10-1975**: opinión consultiva de la CIJ: el Sáhara no era *terra nullius* y no había «vínculos jurídicos de soberanía territorial» con Marruecos; Hassan II anuncia la Marcha Verde («el derecho ha prevalecido sobre la injusticia» **[traducción NO VERIFICADA]**). Memorando de la CIA (Colby a Kissinger, 3-10): «El rey Hassan ha decidido invadir el Sáhara Español en las próximas tres semanas». Consejo de Seguridad: resoluciones 377, 379 y 380 (6-11: «deplora la realización de la marcha»).
- **Los dos bandos del Gobierno**: 17-10 último Consejo de Ministros de Franco; 18-10 orden de preparar la evacuación (Golondrina); 21-10 Solís en Marrakech (Hassan II: «Yo no quiero que se vayan Vds. del Sáhara tan pronto» **[NO VERIFICADO]**); cable de EEUU (23-10): «tres cuartas partes del problema quedaron resueltas tras el acuerdo alcanzado con Solís»; 25-10 el BOC publica el proyecto de ley de descolonización.
- **Juan Carlos, jefe de Estado interino (30-10-1975), en El Aaiún (2-11)**: ante unos 500 oficiales: «Se hará cuanto sea necesario para que nuestro Ejército conserve intacto su prestigio y su honor […] España cumplirá sus compromisos […] deseamos proteger también los legítimos derechos de la población civil saharaui» (*Informaciones*, vía Archivo de la Transición) **[NO VERIFICADO en hemeroteca]**.
- **La tesis del pacto secreto**: el National Intelligence Bulletin de la CIA de 6-11-1975 (El Español, 2017) recoge, por el embajador Stabler, que «Madrid y Rabat han acordado que los manifestantes sólo entrarán unas pocas millas en el Sáhara español» y que unos 50 marroquíes entrarán en El Aaiún. **Nivel de evidencia**: acredita una coordinación sobre el alcance de la marcha atribuida a Juan Carlos; no acredita un «Sáhara a cambio de la Corona» (Público 2025: «indicios indirectos»; Muñoz Lorente: nada indica que Kissinger conociera u organizara la marcha). El artículo debe distinguir ambas cosas.
- **Marcha Verde (6-9-11)**: 350.000 civiles y 25.000 soldados; Carro a Agadir el 7; Hassan ordena el regreso el 9. **Declaración de Madrid (14-11-1975; UNTS vol. 988)**: España «ratifica su resolución […] de descolonizar»; administración temporal con Marruecos y Mauritania; fin de la presencia «antes del 28 de febrero de 1976»; «será respetada la opinión de la población saharaui, expresada a través de la Yemaá». Nunca se publicó en el BOE. Corell (ONU, 2002): «El Acuerdo de Madrid no transfirió la soberanía sobre el Territorio».
- **Cortes Españolas, 18-19-11-1975 (DSP 20)** [verificado]: dictamen aprobado por **345 votos a favor, 4 en contra y 4 abstenciones** (no 354/4 ni «15 de noviembre»). García-Valdecasas: «El proyecto no traía antecedentes ninguno (tan apremiante había sido su envío)» (pp. 102-104). Carro, ministro de la Presidencia: «La soberanía no es negociable […] **el Sahara es de España; pero el Sahara no es España**» (pp. 106-107); «Pero de ello a deducir que sea el Sahara una provincia española hay un abismo. (El señor PEDROSA LATAS: Eso no es cierto.)» (p. 107). **Ley 40/1975** (BOE 20-11-1975, el día de la muerte de Franco), firmada por «Juan Carlos de Borbón, Príncipe de España»: el territorio «nunca ha formado parte del territorio nacional»; el Gobierno «dará cuenta razonada de todo ello a las Cortes».
- **Operación Golondrina**: 12.000 militares, 25.000 civiles, 40.000 toneladas evacuadas; 26-2-1976 España comunica a la ONU el fin de su presencia; 27-2 proclamación de la RASD; arriado el 26 o el 28 de febrero según la fuente. Los NO-DO de noviembre de 1975 no mencionan la Marcha Verde.

### 4.4 Lectura provisional del periodo

Bajo la República, el único episodio expansivo (Ifni, 1934) lo decide el centro-derecha y lo critica la izquierda; bajo la dictadura no hay debate posible, pero la retrocesión de Ifni (1969) y la entrega del Sáhara (1975) las votan unas Cortes orgánicas casi unánimes, con la ultraderecha (Piñar) como única oposición. La Marcha Verde es la mayor cesión territorial de la historia contemporánea española y la ejecuta un régimen de derecha con el príncipe como jefe de Estado interino: el dato más incómodo para la versión simple de la hipótesis y, a la vez, el precedente de la «migración como palanca» que Marruecos reedita en 2021 y 2026.

## 5. 1975-2004: Transición, Tratado de Amistad y Perejil

Fuentes y URL en `bloques/04-democracia-1977-2025.md` (§1-2). Todas las citas parlamentarias de este capítulo se han leído en el PDF del Diario de Sesiones.

### 5.1 Transición y años de González

- **14-11-1976, Tinduf**: Felipe González, en la oposición, visita los campamentos saharauis y promete apoyo; existe vídeo no oficial; la frase «hasta la victoria final» **[NO VERIFICADO]**. En 1985, tras el ataque del Polisario al patrullero *Tagomago*, Fernández Ordóñez expulsa de España a los miembros del Frente.
- **LO 7/1985 de Extranjería** (Gobierno González) deja sin documentación a miles de musulmanes de Ceuta y Melilla; Aomar Dudú lidera las protestas de 1985-86.
- **Tratado de Amistad, Buena Vecindad y Cooperación (Rabat, 4-7-1991; BOE-A-1993-5422)**: firmado por González y Laraki; art. 1: Reunión de Alto Nivel anual. Sólo hubo doce RAN entre 1993 y 2023 y ninguna entre 2015 y 2023. Es el tratado que Mohamed VI invocará contra la visita real de 2007 y que Vox pide suspender en 2026.
- **Estatutos de Autonomía de Ceuta y Melilla (LO 1/1995 y 2/1995)**, Gobierno González.

### 5.2 Aznar (PP): 2001 y Perejil

- **Octubre de 2001**: Marruecos retira a su embajador (censo de la MINURSO, «la traición de Aznar»; ruptura de la negociación pesquera; Ceuta y Melilla); no regresan hasta enero de 2003. Moratinos, 21-11-2007: «hubo quince meses, casi dos años, sin embajadores marroquí y español […] durante el período del Partido Popular» (DSCD VIII 301, p. 14975). **Quién inicia**: Marruecos.
- **Perejil (11-21 de julio de 2002)**. Doce gendarmes ocupan el islote el 11-7; Operación Romeo-Sierra a las 06:17 del 17-7; mediación de Powell (20-7); Palacio y Benaissa firman en Rabat (21-7). **Quién inicia**: Marruecos; España responde militarmente. Corrección: compareció **Ana Palacio** (ministra desde el 9-7), no Piqué; Aznar no compareció (habló en el debate del estado de la Nación), como recordará Sánchez el 8-6-2022 (DSCD XIV 192, p. 48).
  - Aznar (15-7-2002, DSCD VII 179, p. 8967): «Es imprescindible volver al statu quo anterior a la ocupación de la isla. […] España no aceptará hechos consumados.» Zapatero (p. 8975): «cuenta con nosotros para defender los intereses de nuestro país […] con plena lealtad a España». Anasagasti (PNV, p. 9020): «la responsabilidad histórica que tiene España en su antigua colonia del Sahara, en la que usted no está haciendo nada en serio».
  - Resolución conjunta (16-7-2002, DSCD 180, pp. 9087-9088): **334 a favor, 0 en contra, 4 abstenciones**. Lasagabaster (EA): apoyo «a una solución por la vía diplomática, no un apoyo a iniciativas militares».
  - Comisiones de Exteriores y Defensa (17-7-2002, DSCD CO 543): Palacio: «no estamos dispuestos a ser colocados ante hechos consumados» (p. 17347-17348); Trillo: «estábamos, pues, ante un claro supuesto de legítima defensa» (p. 17349); Zapatero: «un asunto de Estado que exige una política de Estado» (p. 17357); Azpiazu (PNV): «ayer fuimos de alguna manera utilizados para bendecirla» (pp. 17354-17355); Alcaraz (IU): «el Reino de Marruecos es una dictadura que no respeta los derechos humanos» (p. 17355).
- **Lectura**: el único uso de la fuerza contra Marruecos en democracia lo ordena un gobierno del PP, en respuesta a una ocupación marroquí, con la unanimidad del Congreso y matices de PNV, EA e IU. La Corona no interviene (capítulo 8).

## 6. 2004-2018: la visita real de 2007, las vallas, El Tarajal y el rechazo en frontera

Fuentes y URL en `bloques/04-democracia-1977-2025.md` (§3-4).

### 6.1 Zapatero (PSOE): vallas de 2005 y visita de los Reyes (2007)

- **29-9 a 6-10-2005**: cinco muertos en la valla de Ceuta (al menos tres tiroteados desde Marruecos según las autopsias) y seis en Melilla «al repeler Marruecos a tiros otro salto masivo»; «al menos 14 desde agosto» (El País). Zapatero despliega 480 soldados de Regulares y La Legión bajo mando de la Guardia Civil; Marruecos, 1.600 agentes. **Quién inicia**: terceros (migrantes subsaharianos); respuesta española militar y marroquí armada. Concertinas retiradas en 2007 y reinstaladas por Fernández Díaz en 2013.
- **Visita de los Reyes a Ceuta y Melilla (5-6-11-2007)**: cronología y comunicado de Mohamed VI en el capítulo 8 (El País, 6-11-2007: «flagrante falta de respeto por parte del Gobierno español de la letra y el espíritu del Tratado de Amistad»). Juan Carlos I en Melilla: «Como Rey que se debe a todos los españoles, tenía contraído el compromiso de visitar Melilla». Congreso, 21-11-2007 (DSCD VIII 301): De Arístegui (PP): «su gestión del viaje fue torpe […] No se dieron cuenta de que el 6 de noviembre coincidía con el 32º aniversario de la marcha verde» (pp. 14974-14975); Moratinos: «esta crisis es totalmente superficial, que no tiene ni pies ni cabeza» (p. 14975). **Quién inicia**: España (visita); Marruecos escala. **Lectura**: el gesto más «territorial» de la democracia lo refrenda un gobierno socialista y el PP lo critica por torpe, no por hacerlo.

### 6.2 Rajoy (PP): El Tarajal (2014) y la LO 4/2015

- **6-2-2014**: 200-300 personas intentan entrar a nado; la Guardia Civil dispara 145 pelotas de goma y 5 botes de humo (denuncia de las ONG); 14-15 muertos; 23 devueltos desde la playa. **Quién inicia**: terceros; España (uso de la fuerza).
- Comisión de Interior, 13-2-2014 (DSCD X CO 500): Fernández Díaz: «en ningún momento el objetivo del uso de los medios en la mar fue alcanzar a ninguno de los inmigrantes sino hacer visible una barrera disuasoria» (p. 5); «No estamos, por tanto, ante un supuesto de la denominada devolución en caliente, que sería irregular […] sin que haya relación causa-efecto entre el empleo de los medios antidisturbios […] y dichos fallecimientos» (pp. 7-8). Trevín (PSOE): «no se responde con material antidisturbios» (p. 18); Olabarría (PNV): «No existe la devolución en caliente. Existe la persecución en caliente» (p. 23); Iñarritu (Amaiur): «es la cuarta versión oficial» (p. 35). Pleno 19-2-2014 (DSCD 178): Trevín: «Fallecieron quince seres humanos que merecen respeto, dignidad y memoria» (p. 53); Escobar (PP): «El control de la inmigración irregular es y debe ser política de Estado» (p. 54). Judicial: archivo (2015), reapertura y 16 guardias procesados (2017), archivo definitivo confirmado por el Supremo (2022).
- **LO 4/2015 (BOE 31-3-2015)**, disposición adicional décima de la LO 4/2000: «Los extranjeros que sean detectados en la línea fronteriza […] mientras intentan superar los elementos de contención fronterizos […] podrán ser rechazados a fin de impedir su entrada ilegal en España». Es la norma que el Supremo limita en 2026 a quien supera «elementos de contención físicos», origen inmediato de la crisis de Ceuta (capítulo 1).
- **TEDH, N.D. y N.T. c. España**: Sala (3-10-2017) condena; Gran Sala (13-2-2020) absuelve por la «conducta» de los demandantes.
- 2018: Marruecos cierra unilateralmente la aduana comercial de Melilla (agosto). **Quién inicia**: Marruecos.
- **Lectura**: bajo el PP, la confrontación no es con Marruecos sino con los migrantes: fuerza en la playa y legalización del rechazo en frontera; Rabat, en cambio, es un socio con el que se coordina la devolución.

## 7. 2018-2025: Ceuta 2021, el giro sobre el Sáhara y Melilla 2022

Fuentes y URL en `bloques/04-democracia-1977-2025.md` (§5).

### 7.1 Ghali y Ceuta (abril-mayo de 2021)

- 18-4-2021: Brahim Ghali ingresa en Logroño; Rabat convoca al embajador y «deplora» la decisión. 17-19 de mayo: 8.000 entradas según Interior (6.000-10.000 según prensa), unos 1.500 menores, Ejército desplegado; Benyaich: «Hay actos que tienen consecuencias y se tienen que asumir». **Quién inicia**: España (Ghali, sin informar a Rabat); Marruecos (apertura de la frontera).
- Pleno, 19-5-2021 (DSCD XIV 103; sesión de control, no comparecencia): Casado (PP): «la peor crisis diplomática con Marruecos de nuestra historia democrática […] Es la crónica de una crisis anunciada» (p. 5); Sánchez: «España está sufriendo un desafío de un tercer país, que es Marruecos, y queremos saber de qué lado está el principal partido de la oposición» (p. 6); Espinosa de los Monteros (Vox): «una auténtica invasión para tomar la ciudad de Ceuta» (p. 11); Iceta: «un ataque a nuestras fronteras» (p. 31); Vehí (CUP): «Salvar niños o reprimir niños» (p. 30). Moción de Vox sobre Interior (20-5-2021): 153-195-1, rechazada. Comisión de Interior, 25-6-2021 (DSCD CO 446): Marlaska: «no fue una crisis migratoria, que fue una crisis fronteriza […] nuestro país acaba donde acaban Ceuta y Melilla» (p. 14); «en menos de cuarenta y ocho horas habían sido devueltos más del 80%» (p. 15). Cese de González Laya (10/12-7-2021); Marruecos habría exigido su destitución según un informe del CNI.
- **Lectura**: Vox estrena aquí el marco de «invasión» que reaparece en 2026; el PP habla de crisis «anunciada»; el Gobierno reclama lealtad a la oposición.

### 7.2 La carta a Mohamed VI (marzo de 2022)

- Texto (El País, 23-3-2022): «España considera que la propuesta marroquí de autonomía presentada en 2007 como la base más seria, creíble y realista para la resolución de este diferendo»; «construir una nueva relación […] y la abstención de toda acción unilateral». La hace pública el Gabinete Real marroquí el 18-3. Argelia retira a su embajador el 19-3 y suspende su Tratado de Amistad el 8-6-2022. **Quién inicia**: España (Gobierno).
- Pleno, 30-3-2022 (DSCD XIV 174): Sánchez recuerda que en las RAN de 2012 y 2015 «bajo la Presidencia de Mariano Rajoy […] desaparecía cualquier referencia al derecho a la autodeterminación» (p. 19); Gamarra (PP): «¿Le ha dado Marruecos alguna garantía sobre Ceuta, Melilla y Canarias?» (p. 24); Abascal: «La carta que usted ha enviado es un puñetero insulto a este Parlamento […] ¡Claro que hay un problema con Marruecos! Lo han provocado ustedes […] acogiendo aquí a uno de los jefes del Frente Polisario» (pp. 25-26); Echenique (UP): «un régimen autocrático» (p. 29); Rufián: «canjea principios por más control marroquí en la valla» (p. 32); Esteban (PNV): «Marruecos ha utilizado las crisis migratorias a su antojo, incluso ha presionado y ha conseguido que se cese a una ministra» (p. 43); Aizpurua (Bildu): «una triple crisis» (p. 46).
- PNL sobre el Sáhara, 7-4-2022: **168 a favor, 118 en contra, 61 abstenciones**, aprobada con el PSOE solo (PP a favor; Vox y Cs abstención). Ese día Sánchez y Mohamed VI firman en Rabat la declaración conjunta («una nueva página»; aduanas, conexiones marítimas, espacio aéreo).
- **Lectura**: es la única vez en democracia en que un gobierno pierde a todo el arco parlamentario, derecha e izquierda, por su política marroquí; la derecha lo reprocha por ceder, la izquierda por abandonar al Sáhara.

### 7.3 Melilla, 24 de junio de 2022

- Muertos: 23 (Marruecos), 27-29 (AMDH), «al menos 37» y hasta 77 desaparecidos (Caminando Fronteras), «podría superar los 100» (Amnistía); 133 entradas, 470 rechazos. Defensor del Pueblo (14-10-2022): «se efectuó un rechazo en frontera de 470 personas sin contemplarse las previsiones legales»; entregas «en dos minutos» hacen «imposible sostener que se han realizado rechazos en frontera conforme a las mínimas exigencias legales». Bachelet pide investigar. Fiscalía: archivo (23-12-2022).
- Congreso: Iñarritu: «¿Dónde está el señor Grande-Marlaska?» (DSCD 197, p. 54); Bermúdez de Castro (PP): «bien resuelto» es «una afirmación tan desafortunada como carente de humanidad» (DSCD 198, pp. 15-16); Marlaska: «un Estado de derecho no puede aceptar en modo alguno ataques violentos a su frontera» (p. 16); Barandiaran (PNV): «la mayor tragedia ocurrida jamás en una frontera europea externa» (p. 17); Rufián coloca tres balas en la tribuna (DSCD 200, p. 60); Abascal: «Buenas vallas hacen buenos vecinos» (p. 40). La frase de Sánchez «bien resuelto» sólo consta vía citas parlamentarias **[NO VERIFICADO en transcripción oficial]**.
- **Lectura**: la izquierda se divide (Bildu, ERC, CUP, Podemos hablan de masacre; el Gobierno defiende la actuación) y la derecha critica la frase, no la política.

### 7.4 2023-2025

RAN de febrero de 2023 (Rabat menciona la soberanía marroquí sobre el Sáhara y omite la española sobre Ceuta y Melilla; protesta española de mayo de 2023 por una nota que las llama «ciudades marroquíes»); Mundial 2030; conversaciones sobre el espacio aéreo del Sáhara (2024); aduanas comerciales abiertas en enero de 2025 y cerradas a los seis meses según la prensa **[NO VERIFICADO: sólo titulares]**; XIII RAN en Madrid (4-12-2025). La visita de Estado de Felipe VI a Marruecos y su viaje a Ceuta seguían pendientes al cierre de 2025.

## 8. La monarquía

Fuentes completas y URL en `bloques/05-monarquia-geopolitica.md` (parte A).

### 8.1 Isabel II y Alfonso XIII (siglo XIX y Restauración)

Lo sustancial está en los debates parlamentarios de los capítulos 2 y 3. Fuera de ellos, un dato de contexto: la revista *Europa en África* llamó a Alfonso XIII «primer africanista» en enero de 1909. El rey consolidó un binomio Corona-Ejército en el que los oficiales «africanistas» (Legión, Regulares) hicieron carrera, ascensos y mentalidad en Marruecos. Sobre su responsabilidad directa en Annual, la historiografía citada concluye que «nadie, hasta el momento, ha demostrado este extremo»; lo que sí está documentado es su aprobación del golpe de Primo de Rivera en septiembre de 1923, que cerró el expediente de responsabilidades. (El Debate, 21-7-2024; Fernando Mora, El Español, 28-8-2026.) Precedente de visita real a Ceuta y Melilla: Alfonso XIII en 1927.

### 8.2 Juan Carlos I y Hassan II: el canal paralelo (1975-1999)

- **2 de noviembre de 1975**: el príncipe Juan Carlos, jefe del Estado en funciones, viaja a El Aaiún en plena Marcha Verde y promete que España «respetaría sus compromisos internacionales». Doce días después se firman los Acuerdos de Madrid. (Véase el capítulo 4 para la tesis del pacto secreto con Hassan II y su nivel de evidencia.)
- **1976**: Hassan II declara que «el asunto de Ceuta y Melilla es para mí un asunto solucionado», en el sentido de que España las devolvería cuando recuperase Gibraltar. En 1987 propone al Rey una «célula de reflexión» mixta para estudiar soluciones «dentro del marco de los derechos imprescriptibles de Marruecos». (González Campos, Global Politics and Law.)
- **1979** **[NO VERIFICADO en el documento original]**: un telegrama estadounidense desclasificado en 2014 atribuye a Juan Carlos la disposición a «ceder Melilla a Marruecos y convertir a Ceuta en protectorado internacional». Solo consta vía Wikipedia; no entra en los datos.
- **1989**: visita de Estado de Hassan II a Madrid; acuerdos de cooperación militar e inversiones y estudio del enlace fijo del Estrecho; Reuniones de Alto Nivel anuales. No se ha localizado ningún discurso de Juan Carlos I ante el Parlamento marroquí **[NO VERIFICADO]**.
- **4 de julio de 1991**: Tratado de Amistad, Buena Vecindad y Cooperación. Ambos reyes «eran amigos antes de que Juan Carlos llegara a la Zarzuela» y mantuvieron «un canal de comunicación» en los conflictos (Público, 23-8-2026).
- El «augurio»: según las memorias de Juan Carlos I (*Reconciliación*), Hassan II le dijo sobre Ceuta y Melilla: «La próxima generación tendrá que resolver esta cuestión».

### 8.3 Juan Carlos I y Mohamed VI (1999-2014)

- **Octubre de 2001**: Rabat retira a su embajador (pesca, Sáhara, censo de la MINURSO). No consta papel de la Corona.
- **Perejil, julio de 2002**: el Gobierno de Aznar impidió al Rey asistir a la boda de Mohamed VI (12-14 de julio); no hay constancia de contactos entre ambos reyes durante la crisis; la mediación fue de Colin Powell. **[NO VERIFICADO: mediación regia]**. Mohamed VI «modificó la tradicional posición de no usar la fuerza» al ocupar el islote (González Campos).
- **2005, Marrakech**: «Es mucho más fuerte lo que nos une que lo que nos ha separado» (Juan Carlos I). En 2011 fue el primer jefe de Estado en visitar la ciudad tras el atentado.
- **5-6 de noviembre de 2007, Ceuta y Melilla**: el precedente que condiciona todo. Cronología: 30-10 anuncio; 31-10/1-11 el primer ministro Abbas El Fassi pide al Rey «renunciar» al viaje; 2-11 Marruecos llama a consultas a su embajador Omar Azziman «por período indeterminado» siguiendo «muy altas instrucciones de Su Majestad el Rey Mohamed VI»; 5-11 Ceuta (unas 25.000 personas), El Fassi compara ante el Parlamento marroquí la situación con la ocupación israelí de Palestina («Junto con Israel, España es hoy la única nación reacia a pasar la página de la ocupación», Al Jazeera, traducción); 6-11 Melilla (unas 30.000 personas) y comunicado del Palacio Real: la visita es un «paso contraproducente», un episodio «lamentable» y un «acto nostálgico de una época oscura y superada»; España debía «asumir su responsabilidad»; Mohamed VI pedía «negociaciones formales sobre el futuro» de ambas ciudades. Juan Carlos I defendió la visita como su «deber» y llamó a las ciudades «parte integrante de nuestro territorio nacional». El Gobierno Zapatero respondió con «normalidad institucional» (De la Vega) y «los lazos entre Marruecos y España son sólidos» (Moratinos); España no retiró a su embajador. 3-1-2008 carta de Zapatero a Mohamed VI; 9-1-2008 regreso de Azziman: 65 días fuera. Fuente primaria de la reacción marroquí: Al Jazeera, 7-11-2007; cronología en Vozpópuli, 23-8-2026.

### 8.4 Felipe VI y Mohamed VI (2014-2026)

- Viaje de presentación a Marruecos en julio de 2014 (tras el Vaticano y Portugal); visita de Estado en febrero de 2019, cumbre de la relación (once acuerdos; Mohamed VI regaló su *selham* a la Reina). Se conocen desde niños. No se ha localizado un discurso de Felipe VI ante el Parlamento marroquí; el de 2019 fue en la cena de Estado **[NO VERIFICADO]**.
- **17 de enero de 2022**: ante el cuerpo diplomático, Felipe VI: «Ahora ambas naciones debemos caminar juntos para empezar a materializar ya esta nueva relación». Rabat esperaba precisamente ese gesto desde Zarzuela para cerrar la crisis de 2021 (El Español, 19-1-2022). Dos meses después llega la carta de Sánchez sobre el Sáhara.
- Asimetría: Mohamed VI «concentra poder político, religioso y económico»; Felipe VI «opera bajo restricciones gubernamentales»; Juan Carlos «tenía mayor peso político que Felipe VI» (Público, 23-8-2026).
- **Doce años sin pisar Ceuta ni Melilla**. Precedentes: Alfonso XIII (1927), Juan Carlos como príncipe (Ceuta, 1970), los Reyes (2007), la princesa Leonor (Ceuta, 21-6-2025, desembarco de fragata).

### 8.5 El Rey y la crisis de 2026

| Fecha | Hecho | Fuente |
|---|---|---|
| 1 ago, 17:10 | El Rey expresa «preocupación e indignación» y dice que el Estado «debe velar por su seguridad» | Infobae (directo). **[NO VERIFICADO en casareal.es]** |
| 6 ago | Audiencia en Marivent al presidente de Ceuta, Juan Jesús Vivas, «a petición del monarca». Vivas: «El rey está comprometido con la visita a Ceuta y la hará porque cumple sus compromisos» | casareal.es (actividad 17058); moncloa.com |
| 18-19 ago | Moncloa: «No nos oponemos», «Moncloa no da instrucciones» | Público |
| 22 ago | Feijóo: convencido de que el Rey quería ir «cuando el Gobierno autorizase ese desplazamiento» | RTVCE; Newtral |
| 24 ago | Elma Saiz: «no le constaba» que el Rey hubiese comunicado su intención | Newtral |
| 25 ago | El Rey no asiste al Consejo de Seguridad Nacional (no es obligatorio, art. 21.2 LSN) | Newtral |
| 31 ago | Sánchez (SER): «Hay argumentos y razones suficientes para que el jefe del Estado visite por fin, después de 20 años, Ceuta y Melilla»; «es lo que se va a hacer, cuando se den las condiciones». Lapsus: «lleva reinando más de 20 años» | El Independiente; Newtral; Infobae |
| 31 ago | PP (Sémper): «si Feijóo fuera presidente del Gobierno, acompañaría al Rey a visitar Ceuta»; pide no «manosear» la Corona | El Español; Libertad Digital |
| 1 sept | Despacho Sánchez-Felipe VI; Gobierno: «la visita se hará», «España es un país soberano y Ceuta y Melilla son territorio español»; sin fecha, incluiría ambas ciudades | Infobae |
| 1 sept | PP (Muñoz): «Si el Rey no ha estado en Ceuta hasta ahora es porque no se le ha permitido». Vox (Millán): el Gobierno usa al Rey para «desviar el foco». Podemos (Belarra): el Gobierno castiga a Marruecos «a través del maltrato a la gente de Ceuta» | Infobae/EP; El Independiente |
| 1 sept | Rabat guarda silencio oficial. Hespress: la visita «amenaza con reabrir» la disputa; Yahya Yahya la llama «provocación explícita». Elecciones marroquíes el 23-9-2026 | Hespress; El Constitucional |

**El refrendo (arts. 56 y 64 CE)**: el viaje necesita refrendo del Gobierno si tiene «carácter público y no personal»; el refrendo es «apoyo o ratificación», no autorización expresa, y la presencia de ministros ya lo constituye; de los actos del Rey responden quienes los refrendan (Itziar Gómez Fernández, UC3M, en Newtral, 31-8-2026). Esto explica que ni Rajoy ni Sánchez hayan propiciado la visita en doce años y que hoy el PP diga que Feijóo «acompañaría al Rey»: quien refrenda asume la reacción de Rabat, que en 2007 costó 65 días sin embajador.

### 8.6 Mohamed VI, su entorno, su salud y la palanca migratoria

- **Fouad Ali El Himma**: compañero del Colegio Real, ministro del Interior (2002-2007), fundador del PAM, consejero del Gabinete Real desde 2011 y «artífice de la estrategia real para la Cuestión del Sáhara»; su nombre sonó en la crisis de mayo de 2021.
- **Abdellatif Hammouchi**: director de la DGST desde 2005 y de la DGSN desde 2015; Gran Cruz de la Orden del Mérito de la Guardia Civil (2019, entregada en Madrid en noviembre de 2025).
- **Jabaroot (24-8-2026)**: filtración de 70.381 nombres de la DGST y la DGSN; afirma que «la migración de marroquíes hacia Europa, comenzando por España, es un plan oficial marroquí», señala a Hammouchi como responsable y a El Himma como «arquitecto», sostiene que «el rey no tenía conocimiento» y ofrece «los datos originales de Pegasus relacionados con Pedro Sánchez». El CNI confirmó coincidencias con agentes ya investigados; la prensa marroquí no lo cubrió; autenticidad no verificada de forma independiente (Infobae, 24-8; El Independiente, 26-8).
- **Salud y sucesión**: sarcoidosis (2018), cirugías cardíacas, ausencia en el terremoto de 2023; el 4-5-2026 el Gabinete Real nombra al príncipe heredero Moulay Hassan coordinador de las oficinas del Estado Mayor de las Fuerzas Armadas Reales (comunicado literal en el bloque).
- **La migración como palanca, según los expertos**: Rut Bermejo (Elcano, 4-8-2026): «España ha externalizado progresivamente parte del control de sus fronteras hacia Marruecos desde los años 90», lo que «puede incrementar la capacidad de influencia de los países de tránsito». Carmen González Enríquez (Elcano, 12-3-2026): en 2021 «Marruecos alentó la entrada en Ceuta de unos 10.000 inmigrantes». Haizam Amirah Fernández (31-7-2026): Rabat pudo «enviar un mensaje poco sutil a Madrid» tras el viaje a Argel. Ignacio Cembrero (COPE, 30-8-2026): «No nos cabe la menor duda de que Marruecos ha estado detrás de esta operación, lo que pasa es que se les ha ido de las manos»; sitúa el detonante en la investigación sobre Pegasus, no en Argelia. Informes de inteligencia española (vía Wikipedia): Marruecos «permitió, aprovechó y franqueó la entrada, pero no la planeó inicialmente». Bernabé López García e Irene Fernández-Molina: sin intervención localizada sobre 2026.

### 8.7 Lectura provisional

La Corona española ha funcionado desde 1975 como canal paralelo y, a la vez, como el actor más expuesto: cada gesto regio en Ceuta y Melilla desata la reacción del Palacio marroquí (1927 no consta; 2007 sí, con 65 días sin embajador). La monarquía marroquí, en cambio, concentra la decisión: la crisis de 2026 apunta a su aparato de seguridad (Hammouchi, El Himma) y a un rey enfermo que prepara la sucesión. La pregunta de Javier («¿qué papel juega la monarquía?») tiene por tanto dos respuestas: en España, la de un símbolo que el Gobierno de turno administra mediante el refrendo y que la derecha reclama como bandera («Feijóo acompañaría al Rey»); en Marruecos, la de un poder real que usa la frontera como instrumento.

## 9. Europa y el Estrecho

Fuentes completas y URL en `bloques/05-monarquia-geopolitica.md` (parte B).

### 9.1 Schengen: Italia y España se controlan mutuamente

- **31 de julio de 2026**: Meloni anuncia en X y el Viminale aprueba, en el Comité de Análisis presidido por Matteo Piantedosi, la reintroducción de controles con España en fronteras aéreas y marítimas durante un mes desde el 1 de agosto: «medida extraordinaria, adoptada para salvaguardar la seguridad nacional» (Meloni); «una elección necesaria para proteger la seguridad de nuestros ciudadanos» (Tajani); «comprobaciones selectivas» a ciudadanos de terceros países (Viminale). Piantedosi coordinó con el ministro francés Laurent Nuñez el refuerzo de la frontera terrestre.
- Respuesta española: Albares: «mensaje impropio del Ministro de Exteriores de un país socio», «demagogia partidista». Sánchez: «La solidaridad y la empatía son opcionales. El respeto a los tratados europeos y a los datos, no» (Frontex: 478.600 entradas irregulares en Italia frente a 234.760 en España, 2021-2026).
- **Qué es y qué no es**: no se «suspende» Schengen; se aplica la posibilidad de controles temporales de los arts. 25-28 del Código de Fronteras Schengen (Reglamento (UE) 2016/399, reformado por el 2024/1717): máximo dos meses por amenaza grave, con preaviso de cuatro semanas, o diez días inmediatos en emergencia. El propio Código dice que la migración «por un gran número de nacionales de terceros países» no debe considerarse por sí misma una amenaza al orden público; la Comisión, no obstante, apreció riesgo de «movimientos secundarios». Ceuta y Melilla tienen régimen especial desde 1991 (Declaración del Reino de España en el Acta Final): nadie viaja a la Península sin identificarse ante la Policía Nacional. (Newtral, 3-8-2026.) **[NO VERIFICADO]**: notificación italiana y dictamen de la Comisión.
- **Controles recíprocos de España**: Orden en el BOE de 9-8-2026 (BOE-A-2026-17375): controles «aleatorios (no sistemáticos)» a viajeros desde Italia del 8 de agosto al 7 de septiembre, «con independencia de su nacionalidad», por la presión del Mediterráneo central y el «deficiente cumplimiento» italiano de las normas de asilo. Hasta el 31-8: 1.066 vuelos y 12.337 viajeros de terceros países controlados; Italia rechazó a 31 viajeros procedentes de España.
- **Prórroga (31-8-2026)**: Italia prorroga 15 días desde el 8 de septiembre («persisten las razones», Piantedosi; «España es una nación hermana»); España mantiene los suyos otros 15 días.

### 9.2 Comisión, Frontex y la cuestión de la injerencia

- 31-7: Von der Leyen ofrece «el despliegue urgente de oficiales de Frontex»; Interior lo rechaza por no ser «práctico». 1-8: Brunner: «Cuando nuestras fronteras se ven amenazadas, la respuesta europea debe ser decidida, rápida y unida». 4-8: Brunner: «Europa ha superado la prueba. Estas personas no han podido acceder al espacio Schengen». Von der Leyen: «Ninguna de las personas que ingresaron a Ceuta llegó a la España peninsular o al resto de la Unión Europea». 28-8: Interior pide apoyo de Frontex y Europol para el «triaje»; 29-8: Bruselas lo estudia «con rapidez»; unas 5.000 personas seguían en Ceuta.
- **Injerencia**: Sánchez (SER, 31-8): «hubo redes rusas e israelíes que propagaron estos bulos», con «una internacional ultraderechista»; sobre Marruecos: «No hay ninguna información procedente de las Fuerzas y Cuerpos de Seguridad del Estado, ni del CNI». Portavoz de la Comisión (Mercier): se detectaron canales rusos de «manipulación e interferencia» que «intentaron rápidamente amplificar la situación de Ceuta» a partir del 30 de julio, no antes; ningún informe europeo menciona a Israel. 1-9 (fuentes comunitarias, COPE): «no hay evidencias» de que la crisis fuera provocada por Rusia, Israel u otro Estado extranjero, aunque sí «una importante actividad de desinformación… para avivar las divisiones». Zajárova (Rusia): «sin hechos… no hay nada de qué hablar». Sa'ar (Israel): «una mentira descarada». EEUU elevó a nivel 3 la advertencia de viaje a Ceuta el 1-8.
- Conclusión provisional: la amplificación rusa está documentada por la UE; la provocación por un Estado extranjero, no. Marruecos es el único actor al que un informe oficial español (CENIF, capítulo 1) atribuye la dirección de la entrada.

### 9.3 Gibraltar: el tratado de 2026

Acuerdo político el 11-6-2025; texto presentado por la Comisión el 17-2-2026 y publicado el 26-2; luz verde de los Estados el 1-4; firma el 14-7; aplicación provisional desde el 15-7-2026; pendiente de ratificación por el Parlamento Europeo. Contenido: desaparece la Verja («el último muro de Europa continental»); España asume los controles Schengen en puerto y aeropuerto; unión aduanera UE-Reino Unido respecto a Gibraltar con inspección española de mercancías; impuesto indirecto del 15% con convergencia en tres años; protección de unos 15.000 trabajadores transfronterizos; el texto «no afecta a las posiciones de soberanía». (Exteriores; La Moncloa; Euronews.) La expresión «llaves del Estrecho» no aparece en fuente localizada; lo verificable es que Hassan II vinculó en 1976 el futuro de Ceuta y Melilla a Gibraltar y que Rota alberga el Escuadrón de Destructores 60, «única unidad permanente fuera de territorio continental estadounidense» (The Objective, 30-8-2026). **[NO VERIFICADO]**: reacción británica a la crisis de Ceuta.

### 9.4 La guerra de Irán, Ormuz y las bases

- 28-2-2026: operación «Furia Épica» de EEUU e Israel contra Irán; 4-3 Irán anuncia el cierre de Ormuz (unos 20 millones de barriles diarios en condiciones normales); 8-4 alto el fuego temporal; 13-4 bloqueo naval estadounidense; 17-20-6 memorándum y reapertura parcial. **[NO VERIFICADO]**: ningún dato localizado que documente un aumento del tráfico por el Estrecho de Gibraltar atribuible a Ormuz; la idea de que el Estrecho se convirtió en «la única vía mediterránea segura» circula en medios afines (teleSUR, Cubadebate) sin base cuantificada.
- Negativa española: Albares (1-3): «Las bases españolas no se están usando para esta operación, y no se usarán para nada no incluido en el acuerdo con Estados Unidos»; Robles: «Ni desde Morón ni desde Rota han realizado ni van a realizar ninguna acción»; Sánchez (4-3): «No a la guerra, no vamos a ser cómplices». Trump (3-3): «Vamos a cortar todo el comercio con España». EEUU reubicó 15 aeronaves; el 11-3 España retiró a su embajadora en Israel. Base jurídica: Convenio de Cooperación para la Defensa de 1988. **[NO VERIFICADO]**: nota oficial de La Moncloa o Exteriores. 30-8-2026: el Pentágono planifica en Morón plazas para B-52 (The Objective).

### 9.5 Marruecos y sus aliados

- **EEUU**: proclamación de Trump del 10-12-2020 («the entire Western Sahara territory is part of the Kingdom of Morocco»); declaración conjunta EEUU-Marruecos-Israel del 22-12-2020 (Acuerdos de Abraham); Resolución 2797 del Consejo de Seguridad (31-10-2025; 11 votos a favor, abstención de China, Pakistán y Rusia; Argelia no participó): la autonomía bajo soberanía marroquí como «la solución más viable»; ejercicio African Lion 26 (abril-mayo 2026, B-52 con F-16 marroquíes).
- **Israel**: Acuerdos de Abraham; Pegasus: cinco infecciones del móvil de Sánchez entre octubre de 2020 y diciembre de 2021, una de ellas el 19-5-2021, al día siguiente de su viaje a Ceuta; archivo judicial en enero de 2026; en julio de 2026 una investigación de 39 periodistas de 14 medios vincula los ataques a la inteligencia marroquí (Euronews; The Objective). **[NO VERIFICADO]**: cooperación militar Israel-Marruecos en 2026.
- **Francia**: carta de Macron a Mohamed VI (30-7-2024): «el presente y el futuro del Sáhara Occidental se inscriben en el marco de la soberanía marroquí»; visita de Estado en octubre de 2024.
- **Argelia**: cuatro años de crisis con España tras la carta de Sánchez de marzo de 2022; reconciliación el 20-7-2026 en Argel («socio estratégico», gas al 34% de las importaciones, VIII RAN en octubre). La hipótesis de que Ceuta fue la respuesta de Rabat al viaje a Argel «se basa en la coincidencia temporal» y en el precedente de 2021, «no en hechos confirmados» (Infobae, 30-7); la sostiene Amirah Fernández y la rechaza el diputado marroquí Lahcen Haddad; Cembrero apunta a Pegasus.
- **Rusia**: abstención en la 2797; amplificación de la crisis en redes; exige pruebas. **[NO ENCONTRADO]**: grano y triángulo Rusia-Argelia-Marruecos en 2026.

### 9.6 El marco migratorio europeo

Pacto de Migración y Asilo aplicable desde el 12-6-2026 (cuatro pilares: fronteras con el EES, asilo, solidaridad y retornos; la Comisión reivindica un «-55%» de cruces irregulares en dos años). En España, Instrucción de Interior de 11-6-2026 (BOE-A-2026-12856). Italia y Dinamarca lideraron una carta de 22 Estados por el endurecimiento. González Enríquez (Elcano): «la completa aplicación del PEMA está en peligro por el rechazo de varios Estados del este». **[NO ENCONTRADO]**: posiciones alemana y francesa sobre Ceuta 2026 y cifras de fondos UE-Marruecos.

### 9.7 Lectura provisional

Ceuta 2026 no es sólo una crisis bilateral: es la primera vez que un Estado miembro reintroduce controles contra España invocando Ceuta, y ocurre en un Estrecho militarizado por la guerra de Irán, con España enfrentada a Washington por las bases y reconciliada con Argel, mientras Marruecos consolida su eje con EEUU, Israel y Francia sobre el Sáhara. La derecha española lee la crisis como «guerra híbrida» de Marruecos (Vox) o como negligencia del Gobierno (PP); el Gobierno la lee como bulos amplificados por Rusia e Israel; Bruselas, como una prueba superada de la frontera exterior. Ninguna de las tres lecturas explica sola los 141 muertos.

## 10. Contraste de la hipótesis

La pregunta: ¿las confrontaciones con Marruecos parten históricamente de la derecha? Para responderla separamos tres cosas que suelen mezclarse: quién gobierna, quién inicia el episodio y quién escala el discurso. Codificación de gobiernos en el capítulo 0.3; detalle y fuentes en los capítulos 1 a 9.

### 10.1 La tabla

| Episodio | Gobierno (código) | Quién inicia | Respuesta española | Discurso en las Cortes: derecha / izquierda | Corona |
|---|---|---|---|---|---|
| 1859-60 Guerra de África | O'Donnell, Unión Liberal (liberal) | España (declaración de guerra) | Guerra; Wad-Ras | Unanimidad de 186; progresistas y demócratas los más fervientes | Isabel II bendice la paz |
| 1893 Margallo | Sagasta (liberal) | Cabilas de Guelaya | Campaña militar; Tratado de Marrakech | Conservadores y republicanos piden responsabilidades; Sagasta: «el patriotismo aconseja callar» | Regencia; súplica rifeña a la Reina |
| 1909 Barranco del Lobo | Maura (derecha) | Cabilas (ataque); España (movilización) | Reservistas; ocupación; represión de la Semana Trágica | Liberales (Moret) y republicanos contra Maura; Maura: «guardián de minas» | Alfonso XIII retira la confianza a Maura |
| 1912 Protectorado | Canalejas / Romanones (liberal) | España y Francia | Tratado | Socialistas en contra; Romanones: «para nosotros no hay Tratado» | — |
| 1921 Annual | Allendesalazar, luego Maura (derecha) | Abd el-Krim, sobre un avance español | Reconquista; Expediente Picasso | Prieto: «fué el Rey»; conservadores: «prerrogativa de la Corona»; 145-7 contra el dictamen socialista | Sospecha no probada; ampara el golpe de 1923 |
| 1925 Alhucemas | Primo de Rivera (dictadura) | España y Francia | Desembarco; fin de la guerra en 1927 | Sin Cortes; Asamblea Nacional aplaude | Preside la Asamblea |
| 1934 Ifni | Lerroux con la CEDA (derecha) | España | Ocupación | Derecha y agrarios aplauden; comunistas: «atraco a mano armada» | Alcalá-Zamora (presidente de la República) |
| 1936 golpe | Frente Popular (izquierda) | Ejército de África | Guerra civil | — | — |
| 1957-58 Ifni-Sáhara | Franco (dictadura) | Ejército de Liberación marroquí | Guerra; Cintra entrega Cabo Juby | Sin debate | — |
| 1969 Ifni | Franco (dictadura) | Negociación | Retrocesión | Cortes orgánicas; sólo Piñar en contra | — |
| 1975 Marcha Verde | Arias / Franco agonizante (dictadura) | Marruecos (Hassan II) | Acuerdos de Madrid; retirada | 345-4-4 | Juan Carlos, interino, coordina con Rabat el alcance de la marcha |
| 1991 Tratado de Amistad | González (izquierda) | Ambos | Tratado; RAN anuales | Consenso | Juan Carlos y Hassan II, amigos |
| 2001 embajador | Aznar (derecha) | Marruecos | Firmeza (pesca, MINURSO) | — | Sin papel |
| 2002 Perejil | Aznar (derecha) | Marruecos (ocupación) | Operación militar | 334-0-4; PNV, EA e IU matizan | Aznar impide al Rey ir a la boda de Mohamed VI |
| 2005 vallas | Zapatero (izquierda) | Migrantes; disparos marroquíes | Ejército en apoyo de la Guardia Civil | — | — |
| 2007 visita real | Zapatero (izquierda) | España (visita) | «Normalidad institucional» | PP: gestión «torpe»; no critica la visita | Los Reyes en Ceuta y Melilla; Mohamed VI: «acto nostálgico» |
| 2014 Tarajal | Rajoy (derecha) | Migrantes; uso de la fuerza español | Pelotas de goma; devoluciones; LO 4/2015 | PSOE, IU, PNV, Amaiur exigen responsabilidades; PP: «política de Estado» | — |
| 2021 Ceuta | Sánchez (izquierda) | España (Ghali); Marruecos (frontera) | Ejército; devoluciones; cese de Laya; giro de 2022 | PP: «crisis anunciada»; Vox: «invasión»; Gobierno pide lealtad | — |
| 2022 Sáhara | Sánchez (izquierda) | España (carta) | Alineamiento con Rabat | Todo el arco contra el Gobierno: 168-118-61 | Felipe VI había pedido «caminar juntos» en enero |
| 2022 Melilla | Sánchez (izquierda) | Migrantes; fuerza marroquí y española | «Bien resuelto»; 470 rechazos | Izquierda dividida; PP critica la frase | — |
| 2026 Ceuta | Sánchez (izquierda) | Marruecos (según el CENIF); sentencia del TS como detonante | Ejército; barrera; retornos; cooperación con Rabat; Rey a Ceuta | PP: «lo sabía y lo tapó», elecciones; Vox: «traición», art. 102, romper el Tratado; socios: Marlaska y Marruecos | Felipe VI: «preocupación e indignación»; visita anunciada sin fecha |

### 10.2 Lo que sale de la tabla

1. **Quién inicia**. En el siglo XIX y hasta 1934, quien inicia las guerras coloniales es España, con gobiernos de los dos partidos del turno: liberales en 1859, 1893 y 1912; conservadores en 1909, 1921 y 1934. Desde 1957, quien inicia las confrontaciones territoriales es casi siempre Marruecos (Ifni 1957, Marcha Verde 1975, embajador 2001, Perejil 2002, aduana 2018, frontera 2021 y 2026). Las crisis migratorias con muertos (2005, 2014, 2022) las «inician» terceros y las convierten en crisis el uso de la fuerza de uno u otro Estado.
2. **Quién gobierna cuando se usa la fuerza contra Marruecos**. Las tres veces que España ha empleado la fuerza contra el Estado marroquí o sus irregulares en democracia y dictadura reciente son Ifni 1957 (Franco), Perejil 2002 (Aznar) y, contra migrantes, Tarajal 2014 (Rajoy). Las grandes cesiones son también de gobiernos de derecha o de la dictadura (Ifni 1969, Sáhara 1975) o del PSOE (Sáhara 2022). Ningún gobierno de izquierda ha usado la fuerza contra Marruecos; dos gobiernos de izquierda (2005, 2021, 2026) han desplegado el Ejército en Ceuta y Melilla en funciones de apoyo.
3. **Quién escala el discurso**. Aquí la hipótesis se sostiene mejor: en 1921-23 la derecha protege a la Corona y al Ejército de África frente a la izquierda que pide responsabilidades; en 1934 la derecha aplaude la ocupación de Ifni; en 2021 Vox estrena «invasión»; en 2022 la derecha reprocha la cesión y la izquierda el abandono del Sáhara; en 2026 la derecha pide desde llamar a consultas a los embajadores (PP) hasta juzgar al presidente por traición y romper el Tratado (Vox). El marco de la «guerra híbrida» y la «invasión» es hoy patrimonio de PP y Vox, aunque el propio Sánchez usó «ataque» y «violación de la integridad territorial» el 31 de julio.
4. **La opinión pública**. El Barómetro del Real Instituto Elcano de 2025 (BRIE 45) muestra que Marruecos es el país que más españoles perciben como amenaza (55% de quienes ven alguna) y que ese temor es «sobre todo en la derecha»: 27% entre los votantes de izquierda, 56% en el centro y 73% en la derecha. La escalada discursiva de PP y Vox tiene, por tanto, un electorado que la demanda.
5. **La Corona**. Alfonso XIII es el rey «africanista» cuyo papel en Annual nunca se probó pero que amparó el golpe que enterró las responsabilidades; Juan Carlos coordina con Hassan II en 1975 y mantiene con él un canal paralelo hasta 1999; la visita de 2007 la refrenda un gobierno socialista; Felipe VI ha esperado doce años y en 2026 la visita a Ceuta se convierte en bandera de la derecha («Feijóo acompañaría al Rey»). La monarquía marroquí, en cambio, es el actor que decide: la crisis de 2026 apunta a su aparato de seguridad.

### 10.3 Conclusión provisional

La versión fuerte de la hipótesis («las confrontaciones con Marruecos parten de la derecha») no resiste la tabla: las guerras de 1859, 1893 y 1912 son liberales; Marruecos inicia casi todo desde 1957; y las crisis de 2021 y 2026 estallan con gobiernos del PSOE. La versión matizada sí se sostiene y es más interesante: **cuando hay una crisis con Marruecos, la derecha española tiende a escalarla en términos de soberanía, honor y traición (1921-23, 1934, 2002, 2021, 2022, 2026) y la izquierda tiende a desescalarla en términos de cooperación y humanitarismo (1893, 1922, 2007, 2021, 2026)**, con excepciones notables (el PSOE de 1859 y 1912 fue tan africanista como el resto; el PSOE de 2022 fue el más pro-marroquí de la democracia). Y hay una constante que atraviesa las etiquetas: el Ejército de África y su heredero, el mando de Ceuta y Melilla, junto con la Corona, han sido el eje de la política marroquí de España más que los partidos.

## 11. «¿Qué habrían hecho?»

Javier pregunta qué habría hecho la derecha en el Gobierno con los informes del 29 de julio. Este dossier no especula: recoge lo que PP y Vox han pedido (2021, 2022, 2026), lo que hicieron cuando gobernaron y el marco jurídico que limita a cualquier gobierno.

### 11.1 Lo que piden hoy (2026)

| Medida | PP | Vox | Fuente |
|---|---|---|---|
| Convocar a la embajadora marroquí | Sí (Feijóo, 2 sept; Muñoz, 25 ago) | Sí | Cap. 1 |
| Llamar a consultas al embajador en Rabat | Sí (Feijóo, 2 sept) | Sí | Cap. 1 |
| Dimisión de Marlaska | Sí | Sí | Cap. 1 |
| Elecciones generales | Sí («la única salida») | — | The Objective, 2 sept |
| Art. 102 CE (procesar a Sánchez por «traición») | No lo ha pedido | Sí (8 y 31 ago); necesita 88 diputados y 176 votos | Cap. 1 |
| Suspender el Tratado de Amistad de 1991 | No | Sí (Abascal, 31 ago; Buxadé, 2 sept) | Cap. 1 |
| Suspender el acuerdo preferencial UE-Marruecos y visados | No | Sí (Buxadé) | Cap. 1 |
| Condena «formal y solemne» de la UE | No | Sí | Cap. 1 |
| Declarar «emergencia nacional» / estado de alarma | Sí (Vivas lo pidió el 28 jul) | Sí | Cap. 1 |
| Aplicar la Ley de Seguridad Nacional y mando único | Sí (reprocha que tardara «veintiséis días») | Sí | DSCD-15-PL-200 |
| Acompañar al Rey a Ceuta | Sí («Feijóo acompañaría al Rey») | — | Cap. 8 |
| Respuesta militar contra Marruecos | **No documentada** | **No documentada** | — |

Con las fuentes consultadas, ningún grupo parlamentario ha pedido una acción militar contra territorio marroquí ni contra las personas que cruzaron. La exigencia máxima documentada es diplomática (romper el Tratado, suspender acuerdos) y judicial (art. 102). Las preguntas retóricas de Javier («¿rematar a cañonazos?», «¿bombardear?», «¿disparar?») no tienen correlato en ninguna propuesta registrada; el artículo no debe atribuirlas a nadie.

### 11.2 Lo que hicieron cuando gobernaron

- **Perejil (2002, Aznar)**: ante una ocupación marroquí con una docena de gendarmes, operación militar sin bajas y vuelta al statu quo en diez días, con unanimidad parlamentaria y mediación de EEUU. Es el precedente de «respuesta militar» y muestra sus límites: se hizo contra soldados en un islote deshabitado, no contra civiles ni contra la frontera.
- **Vallas de 2005**: fue un gobierno del PSOE quien desplegó al Ejército en apoyo de la Guardia Civil; Marruecos disparó contra los migrantes.
- **Tarajal (2014, Rajoy)**: uso de material antidisturbios contra personas en el agua (15 muertos), devolución inmediata de 23 a Marruecos, negación de la relación causa-efecto y legalización posterior del «rechazo en frontera» (LO 4/2015). El Congreso no reprobó al ministro. Es el precedente de «uso de la fuerza contra quienes cruzan» y su coste: la sentencia de Sala del TEDH de 2017 (revocada en 2020) y la sentencia del Supremo de 2026 que limita ese rechazo, origen de la crisis actual.
- **Ceuta 2021 (Sánchez)**: Ejército desplegado, devolución de más del 80% en 48 horas, cese de la ministra de Exteriores y, diez meses después, giro sobre el Sáhara. Precedente de «desescalada mediante concesión».

### 11.3 El marco jurídico que limita a cualquier gobierno

- **Constitución**: art. 8 (Fuerzas Armadas: integridad territorial), art. 116 (estados de alarma, excepción y sitio; el estado de sitio lo declara el Congreso por mayoría absoluta a propuesta del Gobierno), art. 102 (responsabilidad penal del presidente y los ministros: cuarta parte del Congreso = 88 diputados y mayoría absoluta = 176; Tribunal Supremo; no cabe indulto). Con 33 diputados, Vox no puede iniciar el 102; PP y Vox suman 170.
- **Ley de Seguridad Nacional 36/2015**: situación de interés para la seguridad nacional y mando único, activados el 25 de agosto de 2026.
- **Código de Fronteras Schengen** (Reglamento 2016/399): régimen especial de Ceuta y Melilla desde 1991; controles temporales interiores (arts. 25-28) como los que Italia aplica a España.
- **LO 4/2000, disposición adicional décima** (rechazo en frontera, 2015) tal como la limita la STS 814/2026: no aplicable a quien llega a nado; procedimiento con abogado y asilo. El propio Supremo señala que «nada impediría aplicar la disposición adicional décima si se establecieran elementos de contención en el mar», fundamento de la barrera flotante y de la Instrucción 9/2026.
- **CEDH, Protocolo 4, art. 4** (prohibición de expulsiones colectivas), con la doctrina N.D. y N.T. (2020): la conducta de quien fuerza la entrada en masa puede justificar el rechazo, pero no el uso de fuerza letal.
- **Tratado de Amistad de 1991**: prevé RAN anuales y consultas; no contiene cláusula de suspensión unilateral, pero cualquier tratado puede denunciarse (Convención de Viena, art. 56). Argelia suspendió el suyo con España en 2022 y lo reactivó en 2026: el precedente muestra el coste (comercio, gas) más que la eficacia.

### 11.4 Lectura

Con los informes del 29 de julio en la mano, las opciones reales de cualquier gobierno eran las que se discutieron después: reforzar la frontera antes del 30 (lo que PP y Vox reprochan que no se hiciera), activar la Ley de Seguridad Nacional (se hizo el 25 de agosto), declarar el estado de alarma (Interior lo descartó por falta de «fundamento jurídico»), convocar a la embajadora (no se hizo) y, si se prueba la dirección marroquí, escalar diplomáticamente. Nada en el historial de PP y Vox en el Gobierno (Perejil, Tarajal) ni en sus propuestas de 2026 apunta a una respuesta militar contra Marruecos; sí apunta, en el caso del PP de 2014, a un uso de la fuerza contra las personas en la frontera cuyo coste jurídico es precisamente el que desencadenó la crisis de 2026.

## 12. Series estadísticas y multimedia disponibles

Fuentes, tablas completas y URL en `bloques/06-series-multimedia.md`; datos tipados en `series.ts`, `videos.ts`, `images.ts` y `geo.ts`.

### 12.1 Series completas (listas para los gráficos)

| Serie | Cobertura | Fuente | Estado |
|---|---|---|---|
| Entradas irregulares en Ceuta y Melilla, por vía terrestre y marítima | 2018-2026 (a 31 ago) | Balances anuales del Ministerio del Interior (PDF, con las revisiones de un balance al siguiente) | Completa. Nota: Interior **excluye** de la serie las entradas masivas de mayo de 2021 y del 30-31 de julio de 2026; hay que sumarlas aparte |
| Entradas por vía terrestre en Ceuta y Melilla | 2009-2017 | APDHA a partir de Frontex/Interior (1.639 en 2009 → 11.624 en 2015 → 6.168 en 2017) | Agregada; discrepancias APDHA/Interior en 2018 registradas |
| Entradas irregulares totales en España y por rutas (Península y Baleares, Canarias, Ceuta y Melilla) | 2018-2026 | Interior (64.298 en 2018, máximo histórico; 63.970/64.019 en 2024; 36.775 en 2025; 20.417 a 31-8-2026) | Completa. «Estrecho» no existe como categoría oficial |
| Muertos y desaparecidos en la frontera sur | 1988-2023 | APDHA (serie íntegra, 16.898 acumulados; 2.789 en 2023) | Completa; hueco 2024-2025 |
| Muertos y desaparecidos | 2018-2026 | Caminando Fronteras (843 en 2018; 10.457 en 2024; 3.090 en 2025; 1.317 en enero-mayo de 2026) | Casi completa; hueco 2020 |
| Comparativa de crisis (2005, Tarajal 2014, Ceuta 2021, Melilla 2022, Ceuta 2026) | — | Entradas, muertos oficiales y según ONG, retornos y menores, con todas las cifras alternativas | Completa |
| Bajas españolas en las guerras de Marruecos | 1859-1958 | Madariaga (1909: 153 muertos), Picasso/Caballero Poveda/Prieto (Annual: 7.875-13.363), Defensa (Ifni: 198 muertos, 574 heridos, 80 desaparecidos) | Con discrepancias; 1859 y 1893 **[NO VERIFICADO en monografía]** |
| Población de Ceuta y Melilla | 2018-2025 | INE (API) y BOE | Completa (Ceuta 83.595 y Melilla 86.780 a 1-1-2025) |
| Comercio España-Marruecos | 2024-2026 | Secretaría de Estado de Comercio y prensa que cita el Informe Mensual (22.500-22.757 millones anuales; exportaciones 2025: 12.330 millones) | Parcial; hueco Datacomex 2015-2023 y remesas |
| Marruecos como amenaza (Barómetro Elcano) | 2021, 2024, 2025 | BRIE 42, 44 y 45: 35% → 49% → 55% de quienes ven una amenaza | Parcial; hueco anterior a 2021. **Dato clave para el capítulo 10**: en 2025 Marruecos es «temido sobre todo en la derecha»: 27% en la izquierda, 56% en el centro, 73% en la derecha (BRIE 45, p. 35) |
| Cronologías horarias | 6-11-1975 (cruce a las 10:33) y 30-31-7-2026 (25.000 salidas a las 13:00, 37.500 a las 15:30 «a un ritmo de unas 150 personas por minuto», 43 muertos a las 15:39, 57 a las 17:40) | Wikipedia con resoluciones de la ONU; RTVE y elDiario.es en directo | Sin cronología oficial en ninguno de los dos casos |
| Votaciones parlamentarias | 1859 (186), 1922 (145-7), 1975 (345-4-4), 2002 (334-0-4), 2021 (153-195-1), 2022 (168-118-61), 2026 (34-35) | Diarios de Sesiones | Completa |

Huecos que el artículo debe declarar: Ceuta y Melilla 2000-2008; totales de España 2000-2017; OIM Missing Migrants por año (web inaccesible); APDHA 2024-2025; comercio anual; Elcano anterior a 2021.

### 12.2 Vídeos (46 registrados)

- **NO-DO** (RTVE Play, incrustable con `https://www.rtve.es/drmn/embed/video/<id>/`): Mohamed V en Madrid (1956), Ifni (30-12-1957 y 13-1-1958), retrocesión de Ifni (1969). **No existe** NO-DO sobre la Marcha Verde: los noticiarios de octubre-diciembre de 1975 no la mencionan.
- **Informe Semanal**: entrevista a Hassan II (9-2-1985, la primera a TVE), *Perejil, el peñón de la discordia* (20-7-2002), *De cuando Sidi Ifni era España* (2019), *100 años de Annual* (2021), *Memorias del Sáhara* (2025), *Ceuta, un mes al límite* (29-8-2026). Documentos RNE: *Annual, no sólo un desastre militar*; *La sombra de Abdelkrim*.
- **Telediarios**: Ceuta 17-5-2021; absolución del Tarajal (2020); 31-7, 9-8 y 25-8-2026.
- **Canal Parlamento** (YouTube): Plenos de 19-5-2021, 22 y 30-3-2022, 6-7-4-2022, 8-6-2022, 29-6-2022; Comisión de Defensa (25-8-2026), Diputación Permanente (26-8-2026), Interior y Exteriores (28-8-2026); Pleno del 3-9-2026.
- **La Moncloa**: declaración de Sánchez en Ceuta (31-7-2026, embed `youtube-nocookie`), 25-8 y 31-8. **Casa Real**: viaje de Estado a Marruecos (13-14-2-2019). **PP**: Feijóo en Ceuta (19-8 y 2-9-2026). **Vox**: Abascal en El Escorial (31-8-2026), concentración (2-9-2026).
- Huecos: Telediarios originales de Perejil (2002) y del Tarajal (2014) no localizables por la API de RTVE; se cubren con Informe Semanal y sustitutos no oficiales.

### 12.3 Imágenes (45 verificadas en Wikimedia Commons, con dimensiones, autor y licencia)

Fortuny (*La batalla de Tetuán*, MNAC; *Wad-Ras*, Prado), grabados de 1859-60, Cabrerizas Altas (1893), Campúa (Barranco del Lobo 1909; el Rey en Melilla 1911), Annual (vista aérea, Monte Arruit, Silvestre, Berenguer, Abd el-Krim), Alhucemas (1925), Ejército de África 1936, Ifni (1934, 1957-58), Marcha Verde (Anefo, CC0; juramento de Hassan II), Hassan II (1983), El Aaiún (1972), mapas del Protectorado y del Sáhara, Perejil, vallas de Ceuta y Melilla, Tarajal (2014; Sánchez en el Tarajal 31-7-2026, Pool Moncloa), Melilla 2022 (informe del CNDH marroquí). Excluida *La Paz de Wad-Ras* por restricción de uso en Commons. **No existe** foto libre de Juan Carlos I con Hassan II ni de Felipe VI con Mohamed VI (2019); la única de Felipe y Mohamed VI es de 2001, subida por un particular, a verificar.

### 12.4 Geografía (para el mapa)

25 puntos y 4 recuadros en `geo.ts`: Ceuta, Melilla, Benzú, El Tarajal (aproximado), Perejil, Alhucemas, Annual, Tetuán, Wad-Ras, Castillejos, Gurugú/Barranco del Lobo, Sidi Ifni, El Aaiún, Tah, Tarfaya, Gibraltar, Rota, Morón, Nador, Tánger, Algeciras, Larache, Xauen, Dajla; recuadros del Protectorado norte, Cabo Juby, Sáhara español e Ifni.

---

## 13. Estado del dossier y siguientes pasos

- **Cobertura**: 499 fuentes (se regenera en `FUENTES.md`), 142 episodios, 170 citas parlamentarias (145 leídas en el PDF del Diario de Sesiones correspondiente, con número y página), 167 declaraciones de 2026 por bloque, 30 series numéricas, 46 vídeos, 45 imágenes y 29 referencias geográficas.
- **Hemeroteca parlamentaria verificada**: 1859, 1894, 1909, 1912, 1921, 1922, 1923, 1927 (serie histórica), 1933, 1934 (Cortes republicanas), 1969 y 1975 (Cortes Españolas), 2002, 2007, 2014, 2021, 2022 (Congreso) y agosto de 2026 (Comisión de Defensa, Diputación Permanente, Comisión de Sanidad). Pendientes de publicación oficial: comisiones de Justicia, Interior, Exteriores, Migraciones y Juventud (27-31 ago 2026) y el Pleno del 3 de septiembre; el Senado histórico y actual no ha podido consultarse (403/500).
- **Lo que queda marcado [NO VERIFICADO]** y no entra en las islas interactivas hasta comprobarlo: el telegrama «¡Olé los hombres!» (leyenda sin documento), el discurso de Isabel II de 1860, el pacto secreto Juan Carlos-Hassan II (sólo coordinación probada), el comunicado de Felipe VI del 1-8-2026 en casareal.es, la frase de Sánchez «bien resuelto» (2022), las cifras de Wikipedia sin fuente (34/43 muertos, 60.000 entradas), el «grupo 411», la fecha exacta de la sentencia del Supremo (29 jun / 8 jul / 13 jul).
- **Decisiones editoriales que el artículo debe tomar**: usar 141 muertos (Caminando Fronteras) con la evolución oficial explicada; 72.000 entradas (Interior); 88 diputados para el art. 102; distinguir siempre lo que pide el PP de lo que pide Vox; presentar la tesis de Javier en su versión matizada (capítulo 10.3).
- **Fase 2**: los ficheros de `src/data/con-textos/espana-marruecos/` alimentan directamente la línea temporal (`timeline.ts` + `gobiernos.ts`), la hemeroteca (`quotes.ts`), el comparador «quién dijo qué» (`statements.ts`), los gráficos (`series.ts`), los vídeos (`videos.ts`), las imágenes (`images.ts`) y el mapa (`geo.ts`).
