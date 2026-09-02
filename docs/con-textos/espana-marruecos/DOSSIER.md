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

*(Pendiente de fusión del bloque 03.)*

## 5. 1975-2004: Transición, Tratado de Amistad y Perejil

*(Pendiente de fusión del bloque 04.)*

## 6. 2004-2018: la visita real de 2007, las vallas, El Tarajal y el rechazo en frontera

*(Pendiente de fusión del bloque 04.)*

## 7. 2018-2025: Ceuta 2021, el giro sobre el Sáhara y Melilla 2022

*(Pendiente de fusión del bloque 04.)*

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

*(Se redacta al final, con la tabla completa.)*

## 11. «¿Qué habrían hecho?»

*(Se redacta al final.)*

## 12. Series estadísticas y multimedia disponibles

*(Pendiente de fusión del bloque 06.)*
