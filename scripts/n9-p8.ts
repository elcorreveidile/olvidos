/**
 * "Cuestión de esti(l)o" (Uno y todos los veranos) — Juan Carlos Rodríguez.
 * Ensayo largo del nº9 (págs. 8-9) con tres secciones numeradas, epígrafes y
 * versos citados: por eso construimos el HTML a mano (h3 + blockquote) en vez
 * de usar el helper `addArticle`, que envuelve todo en <p>.
 */
import { db } from "../src/lib/db";
import { slugifyName } from "../src/lib/colaboradores";

const TITLE = "Cuestión de esti(l)o";
const SLUG = "cuestion-de-estilo";
const BYLINE = "Juan Carlos Rodríguez";
const PAGES = "8-9";
const EXCERPT =
  "Uno y todos los veranos. El verano como invención de clase: de la sombra de los ricos al sol de las vacaciones pagadas.";

const content = [
  `<p><em>Uno y todos los veranos.</em></p>`,

  `<blockquote>La suerte llegó algo más tarde, me cayó justo antes de la puesta del sol. La tienda de Guedali estaba escondida entre hileras de puestos cerrados a cal y canto. ¡Oh, Dickens! ¿Dónde estaría tu sombra esta tarde?<br><br>— Isaak E. Babel: <em>Caballería roja</em></blockquote>`,

  `<h3>I · La sombra vendo: tal como éramos</h3>`,

  `<figure><img src="https://0fozgfuttuxgknhs.public.blob.vercel-storage.com/revista/ilustraciones/cuestion-estilo-montecatini-UmbdESzFUdrdLmn6M5q9ucnTLlXqJ7.jpg" alt="Cartel Art Déco de Montecatini, Italia" /></figure>`,

  `<p>Primero se lo inventaron los ricos. Eran los ricos/ricos, los de verdad. Mueca apenas mordaz, lino y organdí, niños con nurse y todo blanco: el sombrero, la cofia, el desmayo de la mano transparente. Podían elegir el balneario, pero preferían San Sebastián o Biarritz. Porque aquél era un verano difícil de imaginar fuera de temporada. Los miro desde lejos —ellos jamás se hubieran dignado bajar a mirarnos— y los admiro a mi pesar: ¡los ricos! Sólo Visconti les obligó a que le miraran. En absoluto Hemingway o Fitzgeral: ni siquiera civilizadamente. Y el resultado fue atroz, se fueron muriendo todos manoseados por la peste de Venecia o por el dulce aburrimiento de Cestona. Pero entre finales de siglo y nuestra primera mitad, el verano fue —ciertamente— un invento extraño para hoy. Como digo: <em>se buscaba la sombra</em> («¡Oh siglo diecinueve / oh siglo de vapor y del buen tono / o por decir mejor, decimonono»). Se buscaba la sombra y el juego. A los ricos les gustaba jugar. Apostaban a los caballos o al <em>box</em>, desde luego, que también fueron inventos suyos, pero sobre todo al monte y al bacarrá. Esa fascinación por el tapete verde o por el tan stendhaliano rojo/negro de la ruleta. (A los ricos les gustaba el azar porque, obviamente, lo tenían asegurado: sólo gente como Mallarmé o Claude Bernard temblaban ante el azar). Y ahí fue donde aparecieron —por primera vez— las noches de verano. El escote y el collar de perlas, el smoking y las fichas acariciando la mejilla de melocotón de la chica de al lado, a ver si trae suerte. San Sebastián y Biarritz, nuestros ricos de verdad desplegándose hacia el norte, hábiles estrategas, alrededor de la Corte</p>`,

  `<blockquote>tots<br>com<br>un<br>sol<br>hom</blockquote>`,

  `<p>como escribió Pere Quart. Pero aquello sólo fue la prehistoria de nuestro verano. «La sombra / la sombra vendo», que cantaba una de nuestras más queridas tonadilleras. Aquellos fueron veranos angélicos. Los que acaso —en sus ruinas o sus más deliciosos rescoldos— describió Berlanga en su curiosísimo <em>Novio a la vista</em> («la niña quiere un marido / la madre quiere un marqués / el marqués quiere dinero / y están contentos los tres»). El verano sólo existía para ellos. El primer acto de nuestra historia. Después llegamos nosotros y la cosa ya se volvió mucho más triste y más fea.</p>`,

  `<figure><img src="https://0fozgfuttuxgknhs.public.blob.vercel-storage.com/revista/ilustraciones/cuestion-estilo-vichy-P4Mn4WG8U27epRwM67c793VzAJsj7q.jpg" alt="Cartel Art Déco de Vichy, Comité des Fêtes" /></figure>`,

  `<h3>II · Summer Time</h3>`,

  `<blockquote>«No quiero yo decir que se excluyan recíprocamente virtud y elegancia...»<br><br>— Abate Marchena: <em>Lecciones de Filosofía Moral y Elocuencia</em></blockquote>`,

  `<p>Después llegamos nosotros, pero porque nos trajeron. Como pasar del tendido de sombra al de sol. Empezamos a llegar de verdad entre los años 20 y 30: nos trajo el capitalismo. El verano, con nosotros, dejó de ser una estación florida, un tiempo más, para aprender a convertirse en un fragor: <em>las vacaciones</em>. Desde el XVI habíamos mantenido las mismas constantes ideológicas, la misma marrullería vital prolongada aún a fines del XIX: nuestra mentalidad jerárquica / corporativa y nuestro inconsciente <em>realmente</em> agrario, cuando hablábamos antes de los ricos. Sólo que las cosas estaban cambiando a matacaballo. Y nunca mejor dicho. Las guerras civiles del XIX, tan torpemente llamadas carlistas («Si la reina de España muriera / y don Carlos quisiera reinar / correría la sangre española / como corren las olas del mar». O Unamuno: <em>Paz en la guerra</em>) fueron el primer indicio del paso al sol. Olas guajiras cubanas, el Rif marroquí y Baler en Filipinas: «Ha llegado un general / llamado Martínez Campos / con muchos soldados blancos / para venir a operar / Se marchó a la Vuelta Abajo / y aumentó la insurrección / tiró las llaves al mar / y pa España se volvió». La Vuelta Abajo, el tabaco de los Habanos que uno fuma —un día de estos me voy a tener que quitar— o como cantaban en el pueblo: «esas minas de Marruecos / no son minas de valor / que son arroyos de sangre / que derrama la nación...» Estábamos, en efecto, entrando en otro mundo: o sea, el ritmo de trabajo capitalista, que cambió, obvio, el ritmo agrícola de las estaciones. El tan bellamente descrito en el <em>Libro de Alexandre</em>:</p>`,

  `<blockquote>Trillaba don Agosto las mieses por las eras<br>aventaba las parvas, alçaba las çeveras<br>iba de los agraces faciendo uvas veras<br>estón facia outoño sus ordenes primeras</blockquote>`,

  `<p>Los jornaleros nunca tuvieron verano. También los miraba: levantarse a las seis y luego, bajo mi ventana, el patear lerdo de los mulos, y las colleras de aquella madrugada. No es que hubieran perdido el sol, es que nunca lo tuvieron sino a golpes: el golpe de la hoz en cada surco, el surco en cada piel y la mejilla a golpes de sol, curtiéndose. Sin duda por eso los otros buscaban la sombra: todas las mujeres querían ser pálidas. Pero llegó el aire nuevo: venía de Nueva York o Manchester. Sólo que aquí empezó por Málaga, Bilbao, Barcelona, incluso luego Madrid. Quién lo iba a decir: el humo de las fábricas engendraba un nuevo sol. Al golpe de la hoz se le unía el golpe del martillo. El sol del cuerpo y del deporte. (Fue sintomático: del boxeo aristocrático y del golf pasamos hoy a esa asfixia de la <em>maratón popular</em>). ¿Es verdad que se hace mejor el amor en verano? ¿O quizá en primavera con los tallos ardiendo? ¿O quizá no es más que un obligado simulacro toda esta vieja historia agraria de las estaciones y no menos el invento industrialista del verano? Michael Ende o Pavese: la historia interminable de los días fantásticos crueles y bellísimos en su dulzura de arena. Como la interminable historia de una saga finlandesa traducida por Borges. Pushkin se me acerca con todos los románticos, con Ibsen y Chejov y sus almendros, para llevarme a los Hispano-Suiza de siete cilindros en V de nuestros 20-30. Fue luego, precisamente un verano del 42, el verano de Stalingrado, cuando una astilla se clavó en el labio de un anónimo soldado yanki que vigilaba en su patrullera algunas islas del Pacífico. Aquella astilla rompió el labio del marino. Aquel labio, así roto, se volvería inconfundible e ineludible con el tiempo. Con el tiempo aquel marino se llamaría Humphrey Bogart. Las astillas nunca han tenido nombre: <em>As time goes bye...</em> Pero antes estábamos en los 20.</p>`,

  `<p>Bañadores de tirantes para ellos y primeras faldillas para ellas. Poco a poco se fueron arrinconando las casetas: ya sí que estábamos llegando nosotros: la escoria pequeñoburguesa, por supuesto, pero también las masas. En las fábricas y en las oficinas y en el tajo lo habían comprendido: o nos daban un tiempo de descanso para recuperarnos o no podían seguir explotándonos con la misma eficacia. Uno no aguanta siempre, qué caramba. Incluso —o sobre todo— lo había ganado la gente ardua de nuestros sindicatos. Y de repente te estalla en la yema misma de las palabras, de las manos. La jornada de ocho horas ya había sido decisiva, como dijo Marx. El tiempo de vacaciones incluso: «Me encontraba en bañador / y le dije a mi bañero / con acento de candor: Tápame, tápame, tápame...» curioso de nuevo: sólo así, en nuestro tiempo, el <em>sol</em> (y no <em>la sombra</em>) del verano se transformó en la época del celo: Carolina de Mónaco en casi todas las revistas del corazón, o sea, del sol.</p>`,

  `<p>Pues empezábamos, con todo, a ganar el sol. Fueron, como digo, los años 20 y 30. Sólo que ahí las cosas no es que volvieran a torcerse, es que se hicieron definitivamente claras: cuando —era lógico, obvio— comenzamos a pasar del sindicalismo a la política (los frentes populares, sin duda) nuestros nuevos ricos, a los que ya les importaban un bledo San Sebastián o Biarritz, los ricos del humo de las fábricas o del teclear de la oficina del banco, le vieron algo así, cómo lo diría, como las orejas al lobo. Y amaneció un nuevo sol: cara al sol, con la camisa nueva... El capitalismo y sus pistoleros. Lo habían ensayado antes en USA con Capone (y luego en Hiroshima y en la caza de brujas). Ese sí que fue un <em>Summer Time: siempre en julio.</em> Curioso. Terminaba el mes de las flores, un mayo donde nadie entendió jamás aquello de <em>con flores a porfía</em> y un 18 donde nos enseñaban lo más incomprensible también: <em>imposible el ademán</em>, que casi todos traducíamos penosamente como <em>imposible el alemán</em>...</p>`,

  `<p>Pero cierto que fueron otros tiempos. Hoy ya la democracia nos invade. Mejor dicho, la socialdemocracia: no sólo la del Norte (hace también mucho tiempo que dejó de interesarnos el que nos invadiesen las suecas) sino sobre todo la de nuestro Cono Sur —atlántico, mediterráneo—. Ese tenaz empeño por tratar de convencernos de que <em>ya</em> todo es así, y que nunca nada podrá cambiarse jamás, jamás, aunque uno se sienta, como Góngora, «descaminado, enfermo, peregrino». Aunque uno recuerde que por siempre:</p>`,

  `<blockquote>«Repetido latir, si no vecino,<br>distinto oyó de can siempre despierto»</blockquote>`,

  `<p>Quiero decir, que estaba por supuesto llegando un verano en el que pese a todo, y por nuestro claro instinto de clases subalternas, no veíamos las cosas precisamente demasiado claras. Porque uno no se ha hecho nunca a la vera de los regalos de los de arriba. Quizás sólo porque todos sabíamos de antemano que los de arriba nunca regalan nada. Sólo pudimos recoger aquellas migajas de estío: «Para y óyeme, oh sol, yo te saludo / y extático ante ti, me atrevo a hablarte...» Sólo migajas. La fiesta no daba para más.</p>`,

  `<h3>III · Cama de peregrinos y cansados</h3>`,

  `<p style="text-indent:0"><em>(La Noche: P. Liñán de Riaza, S. XVII)</em></p>`,

  `<figure><img src="https://0fozgfuttuxgknhs.public.blob.vercel-storage.com/revista/ilustraciones/cuestion-estilo-robert-funk-atPzg9P23TXrzUpMv5nnG3KpkpuL3x.jpg" alt="Un dinosaurio de juguete sobre la arena, entre bañistas diminutos" /><figcaption>Robert Funk</figcaption></figure>`,

  `<p>Da igual: la primera noche de verano o nuestro primer sol. ¿Luego fue un larguísimo invierno de 40 años? No tanto, pues que sobrevivimos. Quizás para los exiliados. O para los presos, sin duda. Para nosotros, no. El capitalismo supo cuidarnos. No hay ningún melodrama en esto. Mejor, acaso sería hablar, como tituló Pere Quart a su libro, de <em>Vacaciones pagadas</em>. Nos las pagaron, obvio, y nos las siguen pagando (cuidado por si nos oyen). O mucho más si se enfoca la cuestión desde un punto de vista adolescente y escolar: el tiempo del vacío, la suspensión del tiempo. Eso sí que es ya definitivamente nietzscheano a la hora de abrazar el verano. Como un maizal o un <em>surfing</em>: la estulticia burguesa de la adolescencia y el cuerpo. Esa mezcla grotesca de biologicismo positivista y organicismo escolástico, pasada por la moda del Corte Inglés o Galerías... marcando <em>esti(l)o</em>. ¿La arruga sólo es bella en la ropa? Así fue como el sol, con nosotros, se llenó de cremas y de aceites, de familias y toallas y playas, de la estupidez de la mera apariencia o de hasta el agua delgada. Qué lejos ya los aires tan livianos del abanico... Qué lejos ya cuando una vez fuimos muy jóvenes, muy pobres y muy felices. Evidentemente París dejó de ser una fiesta. Pero ésta es otra historia, aunque sea la misma. Pues a fin de cuentas las cosas se volvieron irremediables. Incluso la playa</p>`,

  `<blockquote>«Que será tálamo luego<br>do el garzón sus dichas cobre»</blockquote>`,

  `<figure><img src="https://0fozgfuttuxgknhs.public.blob.vercel-storage.com/revista/ilustraciones/cuestion-estilo-playa-UCYBo1s0X3tJuRkyj3VpoIFSy53W3Z.jpg" alt="Playa abarrotada de bañistas en pleno verano" /></figure>`,

  `<p>Hablar del verano, es pues, pese a todo —y con todo— hablar de su hervor, de su presente brutal, de lo que nos une ahora, en camiseta o desnudos. Qué más da. Pero es también reírnos un poco de nuestra propia ridiculez. E incluso acordarnos de algo en el estío. Pues, en efecto, no sé nada organicista (ni teleológico), lo único que queda siempre es el final. Por ejemplo el final de este artículo. Porque el final es el principio: o mejor dicho, no existió jamás el principio ni, por supuesto, tampoco el final. Lo único real eran —son— unos determinados tipos de relaciones (¿de producción, o sea, de vida?): aquello que nos hizo —que nos hace— y conviene recordar —aunque por supuesto no sirva para nada— esa mentira más o menos cansina que el sistema establece en torno al verano: como si fuera el príncipe de Blancanieves o, de nuevo, la suspensión del tiempo (si se quiere, una manera inversa de <em>su</em> tiempo). Pura retórica hablar, pues, de un final. Sólo palabras (ni siquiera un calco hegeliano) para aludir a lo que resulta ser simplemente una deleznable prolongación: el mismo sistema (aunque quizá invertido) en la playa y en la fábrica. Y luego viene casi silbante, casi de cascabel, la realidad que se vicia en esa tristeza opaca (dulzura por dulzura, corazona) e irreversiblemente atroz («imposible la hays dejado / para vos y para mí»). Cuando vuelven a aparecer las rebequitas en la calle, los coches como siempre furtivos por la acera, nosotros, la escoria del tiempo, y fíjate, ya hace fresco, y volveremos a reírnos con la pobre gente —pobres alumnos— que aún leen a los nuevos filósofos —más reír imposible— o a luchar —aunque nadie nos vea como síntoma— una vez más, por el <em>trabajo</em> (?) de nuestro pueblo. Y es como si casi todo el mundo se volviera a su casa, las flores mustias de la siesta, de la urbanización o la montaña («por aquí el mar, por allí la montaña» ¿no lo dice así?) y se va poniendo el sol, lo sabes, aunque aún pretendas que te escueza la espalda (¿para qué Wittgenstein, para qué Bataille?) y aquí en la arena apenas sólo quede, por la sombra, la huella de aquel pie, cielos, recuerdas, en tu último día de verano.</p>`,
].join("\n");

async function main() {
  const issue = await db.magazineIssue.findFirst({
    where: { number: 9 },
    select: { id: true, publishedAt: true },
  });
  if (!issue) throw new Error("No existe el nº9");
  const admin = await db.user.findFirst({ where: { role: "ADMIN" }, select: { id: true } });

  const authorSlug = slugifyName(BYLINE);
  const author = await db.author.upsert({
    where: { slug: authorSlug },
    update: { name: BYLINE },
    create: { name: BYLINE, slug: authorSlug },
  });

  const article = await db.article.upsert({
    where: { slug: SLUG },
    update: { content, status: "PUBLISHED", byline: BYLINE, excerpt: EXCERPT, pages: PAGES, title: TITLE },
    create: {
      title: TITLE,
      slug: SLUG,
      excerpt: EXCERPT,
      content,
      byline: BYLINE,
      status: "PUBLISHED",
      issueId: issue.id,
      authorId: admin?.id ?? "",
      pages: PAGES,
      publishedAt: issue.publishedAt ?? new Date("1986-01-01T00:00:00Z"),
    },
  });

  await db.authorsOnArticles.deleteMany({ where: { articleId: article.id } });
  await db.authorsOnArticles.create({
    data: { articleId: article.id, authorId: author.id, order: 0 },
  });

  console.log(`✓ ${TITLE} — ${BYLINE} (págs. ${PAGES})`);
  await db.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
