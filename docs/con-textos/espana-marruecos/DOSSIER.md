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
