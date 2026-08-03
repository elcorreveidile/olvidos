/**
 * "Los trucos de Claudio Rodríguez" — entrevista de Benjamín Prado (nº9, págs.
 * 13-14). Formato de diálogo: por eso construimos el HTML a mano (párrafos con
 * el interlocutor en <strong>).
 */
import { db } from "../src/lib/db";
import { slugifyName } from "../src/lib/colaboradores";

const TITLE = "Los trucos de Claudio Rodríguez";
const SLUG = "los-trucos-de-claudio-rodriguez";
const BYLINE = "Benjamín Prado";
const PAGES = "13-14";
const EXCERPT =
  "Entrevista con Claudio Rodríguez, recién Premio Nacional, sobre Don de la ebriedad, Conjuros, Alianza y Condena y El vuelo de la celebración.";

const bp = (t: string) => `<p><strong>B. P.:</strong> ${t}</p>`;
const cr = (t: string) => `<p><strong>C. R.:</strong> ${t}</p>`;

const content = [
  `<p>El <strong>PRÓXIMO LIBRO</strong> de Claudio Rodríguez es un enorme cartapacio donde no creo que él mismo consiga entender absolutamente nada. Cada poema consiste en un montón de servilletas de papel, posavasos, pedazos de periódico, hojas de cuaderno, cuidadosamente grapado por una esquina. Igual de este desbarajuste de papelotes revueltos entre dos tapas de cartón sale una obra maestra de nuestra literatura pero, de momento, cualquiera lo iba a decir.</p>`,
  `<p>El reciente Premio Nacional se sienta frente a mí, sonriendo por encima de una corbata que hace daño a la vista. A lo largo de la conversación es posible que deje de fumar un par de segundos, para tomar aliento.</p>`,

  `<p><strong>Benjamín Prado:</strong> Si quieres, empezamos hablando de <em>Don de la ebriedad</em>, Premio Adonais, 1953, tu primer libro.</p>`,
  `<p><strong>Claudio Rodríguez:</strong> Bueno.</p>`,
  bp(`¿Por qué las cosas están vistas desde una permanente lejanía, <em>con delgadez de música distante</em>?`),
  cr(`Cuando empecé a escribir <em>Don de la ebriedad</em> tenía 17 años. Los poemas brotaban de un contacto directo con las cosas, de la contemplación, el entusiasmo, la intuición de lo que podía ser la realidad. Algunos críticos, como Philip Silver, hablan de surrealismo. Yo no pienso así. Hay que tener en cuenta que este primer libro mío forma una unidad, es un sólo poema. Puede haber fragmentos, sobre todo los primeros, en los cuales el tono afirmacional es tan intenso que quizá el lector no percibe una interpretación lógica de la realidad, sino una sensación de ebriedad en contacto con los planos de lo irracional.`),
  bp(`Así que tú utilizabas una simbología a base de nombres propios pertenecientes a elementos del paisaje rural castellano por otra cosa. A mí no me vengas con que estabas hablando de Zamora, el poeta de la Naturaleza, Fray Luis de León, odas a la vida retirada y todo eso, viva el campo.`),
  cr(`Bueno, pues, claro, podría ser cualquier otro paisaje. A mí no me interesaban ni la belleza ni la miseria de Castilla. Eso está bien visto. Y pasa como con Jorge Guillén, los dos hechos fundamentales son la luminosidad y el espacio.`),
  bp(`<em>Comienzo a comprobar que nuestro reino / tampoco es de este mundo.</em> En tu poesía hay ciertos reflejos de la tradición mística, San Juan, Santa Teresa.`),
  cr(`Siempre se intenta alcanzar lo inasequible o lo que lo parece. Por otra parte, el lenguaje oral, del cual yo partí, conduce a la cercanía de la palabra con el espíritu. Además, ten en cuenta que la mística es castellana. Mis lecturas siempre han sido, también ahora, San Juan, Fray Luis, Santa Teresa, y pueden existir resonancias, afinidades dadas por la naturaleza misma y los hombres que andan por ahí, claro, tan parecidos siempre unos a otros.`),
  bp(`La reordenación del paisaje a partir de los sentimientos es evidente, sobre todo en el <em>Libro Tercero</em>, dedicado más directamente al amor: <em>Todo es nuevo quizá para nosotros (...) / (...) Aquella / curva, de almendros florecidos, suave, / ¿Tenía flor ayer? El ave aquella, / ¿no vuela acaso en más abiertos círculos?</em>`),
  cr(`Es verdad. Pero ¿es que las cosas existen? No sé si alguna cosa puede ser hermosa en sí misma antes de que cualquiera crea que lo es, seguramente no.`),
  bp(`<em>¡Qué diferencia de emoción existe / entre el surco derecho y el izquierdo!</em>`),
  cr(`Exactamente, eso es.`),
  bp(`Has escrito en alguna ocasión que «gran parte de la poesía contemporánea queda coja por la distancia esencial del lenguaje ante las cosas». ¿Se puede llegar al conocimiento a través de la claridad?`),
  cr(`La poesía es participación entre las cosas y la experiencia poética de ellas, a través del lenguaje. Esta participación es un modo peculiar de conocer.`),
  bp(`La estructuración de <em>Don de la ebriedad</em> es temática.`),
  cr(`Hay que tener en cuenta una cosa, Benjamín. El orden de los fragmentos no es cronológico. Algunos poemas del <em>Libro Tercero</em> están escritos mucho antes que los del Primero. Ordené por puro azar. Los poemas de <em>Don de la ebriedad</em> son intercambiables dentro del libro. El último fragmento del primer poema tenía que haber sido el final absoluto del libro. <em>Canto del caminar</em> y <em>Canto del despertar</em> van juntos, por ejemplo, tenían que ir juntos; pero recuerdo haber escrito éste mucho antes que aquel, y entre los dos, muchos otros fragmentos que no tenían nada que ver. Es el impulso de ebriedad lo que va hilando los distintos fragmentos, sólo eso. El resto de la ordenación es casual, arbitraria. Algunos poemas ni siquiera tienen tema concreto.`),
  bp(`En <em>Conjuros</em>, segundo libro que publicas, la contemplación del mundo va a ser mucho más serena a partir de lo que Carlos Bousoño ha llamado una <em>imagen visionaria continuada</em>. Sigue con tu afán de interpretar la... ¿De qué te ríes?`),
  cr(`No, no. A mí es que me da como verguenza oírte estas cosas, no sé. Pero está muy bien, de verdad. Sigue, sigue.`),
  bp(`Y qué más.`),
  cr(`Y, sí, sobre eso que ibas a decir de seguir interpretando la realidad, que es lo más difícil para un poeta, a mí siempre me ha gustado repetir un verso de Rilke: «Atreveos a decir lo que llamáis manzana». Ese es el misterio de una obra.`),
  bp(`En los poemas de <em>Conjuros</em>, que va a repetirse en <em>Alianza y Condena</em>, exageradamente, existe una crítica implícita, interlineal, de los modos políticos sociales de la España de 1958, no me digas que no.`),
  cr(`Hay, sí, algún tipo de enfrentamiento con la realidad.`),
  bp(`Y qué más.`),
  cr(`...este enfrentamiento con la realidad, que puede ser dura, te lleva a una posición de tipo crítico, moral. Para mí no hay duda de que el arte entraña moralidad. O sea, aparte de las interpretaciones que uno pueda ofrecer del objeto, se trata de la moralidad de la existencia.`),
  bp(`En poemas como <em>Al ruido del Duero</em>, <em>Incidente en los Jerónimos</em>: <em>(...) ¡que ya no puedo / ni ver siquiera, que zozobro y choco / contra la piedra, contra / los muros de este templo, de esta patria! / (...) Llegaré, llegaré. Ahí está mi vida, / ahí está el altar, ahí brilla mi pueblo!</em>, tú no estás hablando ni del Duero, ni del ruido, ni de los Jerónimos, aunque también lo estés haciendo. Al menos, existe una rebelión contra una realidad molesta.`),
  cr(`Contra el destino humano. De la tendencia de los hombres hacia la falsedad, el engaño, hacia todo lo que no signifique claridad, pureza. Y hay, claro que sí, cierta rebelión contra la situación de algunas gentes y algunas cosas. Por otra parte, se trata de símbolos, alegorías disémicas. Se supone que estoy hablando de otra cosa, es verdad. Es lo que tú llamas el truco. A veces, después de buscar la verdad toda la vida, cuando ya la tiene en las manos, como el grajo protagonista de <em>Incidente en los Jerónimos</em>, uno va y se muere, se pierde, cambia de opinión, qué sé yo.`),
  bp(`El lenguaje empleado, insisto, es un pretexto.`),
  cr(`Por otra parte, es un truco muy viejo apoyarse en una realidad para trascenderla.`),
  bp(`Entre los años 1958 y 1960 estás de lector de español en Nottingham y del 60 al 64 en Cambridge. En 1965, la Revista de Occidente te publica <em>Alianza y Condena</em>. El libro ¿está escrito en Inglaterra?`),
  cr(`Algunos poemas sí. Hay muchas alusiones al paisaje inglés.`),
  bp(`Planteas muchas dudas sobre la condición humana. <em>¿Por qué desplaza el mismo aire el gesto / de la entrega o el robo, / que cierra una puerta o el que la abre, / el que da luz o apaga? / ¿Por qué es el mismo el giro del brazo / cuando siembra, / que cuando siega, / y el del amor que el del asesinato?</em> Pero hay más en este poema llamado <em>Gestos</em>: <em>Nosotros, tan gesteros pero tan poco alegres, / raza que sólo supo / tejer banderas, raza de desfiles, / de fantasías y de dinastías.</em>`),
  cr(`Son también circunstancias biográficas, circunstancias vitales muy extremas, desagradables. El hombre es algo donde se combinan la falsedad y la autenticidad de la vida, esa es la reflexión general del libro. Los críticos se han equivocado. <em>Alianza y Condena</em> no son dos cosas opuestas. La lectura equivocada ha sido: Alianza: lo que nos atrae; Condena: lo que nos repele. Al menos, la vida consiste en las dos cosas a un tiempo. Toda esa gente que anda por ahí diciendo esto es bueno, esto es malo... no sé.`),
  bp(`<em>No son tiempos / de mirar con nostalgia / esa estrella infinita del paso de los hombres. / Hay mucho que olvidar / y más aún que esperar.</em>`),
  cr(`Sí, ya entiendo por qué insistes. Claro que hay un concepto de tipo social. Pero yo prefiero hablar de poesía histórica. El tono de exaltación se convierte en reflexión. En algunos poemas como este, <em>Gestos</em>, hay una toma de conciencia directa, de tipo histórico, crítico ante la situación de España... y ante la condición general del hombre. Hay, todavía, que esperar al hombre nuevo. No el superhombre de Nietzsche, claro.`),
  bp(`En otro poema del libro, <em>Pinar amanecido</em>, dices: <em>Pobre de aquel que mire y vea claro / que lo que une es la defensa, el miedo.</em>`),
  cr(`Estamos otra vez en pleno territorio moral. El hombre no se une al hombre por generosidad, amor, sino por sentimientos contrarios: el miedo, la envidia. Por eso existen las casas, las calles, no por comunicación, sino por defensa. Vivimos en vecindad, no en compañía. Por otro lado, está el amor. El que no ama es como si no existiera. Es lo que llamaba Alberti <em>el cuerpo deshabitado</em>.`),
  bp(`Eso es ver la vida desde detrás de un cristal sucio.`),
  cr(`Eso es como la veo yo.`),
  bp(`Algunas otras composiciones, <em>Un suceso</em>, <em>Tiempo mezquino</em>, <em>Sin leyes</em>, revelan relaciones amorosas deformadas, ¿no?`),
  cr(`En <em>Un suceso</em>, hablo de una niña de cinco años, a ver si me van a acusar de infanticidio; lo que pasa es que, quizás se me fue un poco la pluma. Y los otros son enfrentamientos con algún tipo de desengaño amoroso que es verdad que están un poco encubiertos. <em>Sin leyes</em> es una reflexión junto a un cuerpo tendido, algo así como lo que en la literatura medieval se llamaban <em>albadas</em>, cuando el amor adúltero tiene que huir de la mañana, poco menos que tirándose por una ventana. Hablar de los despojos del amor, esa batalla, no es nada original.`),
  bp(`El último poema del libro es una <em>Oda a la hospitalidad</em>.`),
  cr(`La hospitalidad es el origen de la fiesta, del canto.`),
  bp(`<em>El vuelo de la celebración</em> es, hasta que consigas ordenar ese desastre que hay encima de la mesa, tu último trabajo publicado.`),
  cr(`La celebración como conocimiento, como servidumbre de todo lo que ocurre, lo triste, lo dulce, lo despreciable.`),
  bp(`La estructura del libro, temática y lingüística, es muy novedosa dentro de tu obra.`),
  cr(`Porque la vida era otra; los tiempos también. Un poema no es sólo la expresión de una experiencia concreta. La poesía es algo temporal; su verdad y sus mentiras se pueden comprobar, únicamente, por los resultados afectivos que consigan. Y las palabras, no sé, las palabras que lleva un poema son las suyas, aquellas con las que, obligatoriamente, tenía que ser hecho. Las palabras son insustituibles.`),
  bp(`¿Qué suceso real motivó el poema que abre el libro, <em>Herida en cuatro tiempos</em>?`),
  cr(`Esto... es una cosa terrible que ocurrió. La muerte violenta de mi hermana. ¡Me impresionó tanto! Y, al lado de ese horror, las cosas seguían sucediendo, igual que siempre. La vida es un delito, en esos momentos. Y no escribo ese poema, me hundo.`),
  bp(`<em>Ballet de papel</em> y <em>Perro de poeta</em>, dedicado a Sirio, can de Vicente Aleixandre, parecen dos intentos de crítica literaria implícita.`),
  cr(`Y, sin embargo, no lo son.`),
  bp(`Pero Sirio ¿sólo ladraba a los malos poetas, cuyo tufo olía desde lejos?`),
  cr(`Y, ahora querrás que te diga quienes eran esos poetas, nombres y apellidos, ¿eh?`),
  bp(`No.`),
  cr(`No me lo creo.`),
  bp(`Te lo he demostrado. Eres un tramposo.`),
  cr(`No.`),
  bp(`Y yo te digo que sí.`),
  cr(`Bueno.`),
].join("\n");

async function main() {
  const issue = await db.magazineIssue.findFirst({ where: { number: 9 }, select: { id: true, publishedAt: true } });
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
  await db.authorsOnArticles.create({ data: { articleId: article.id, authorId: author.id, order: 0 } });

  console.log(`✓ ${TITLE} — ${BYLINE} (págs. ${PAGES})`);
  await db.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
