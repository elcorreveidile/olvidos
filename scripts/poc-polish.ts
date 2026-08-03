/**
 * POC (versión pulida): transcripción limpia y completa del artículo
 * "El verbo y las personas" (Jaime Gil de Biedma), de J. Ramón Ripoll, nº9,
 * leído directamente de las páginas 12-14. Reemplaza el borrador anterior y lo
 * publica como muestra terminada, enlazado al número.
 *   npx tsx scripts/poc-polish.ts
 */
import { db } from "../src/lib/db";
import { slugifyName } from "../src/lib/colaboradores";

const P = (html: string) => `<p>${html}</p>`;

const parrafos = [
  `No hay nada más costoso, en ésto de enunciar públicamente un nombre me refiero, que tratar de justificar la propia presentación por otros motivos que no sean los exclusivamente literarios, sin caer en la vulgar y la mediocre literatura. Mentar a Bécquer, Juan Ramón o cualquier aerolito de la generación del 27 no es nada peligroso. Todo lo que se expone o bien se archiva en los anales de la metacrítica (pues todo lo que yo tenga que decir de algo o de alguien estribará, de seguro, en la paradoja del conocimiento pitagórico) o no ha pasado nada y aquí paz y después mantendré lo contrario. Y es que hablar de muertos titulados siempre obliga a jugar con la ventaja tácita de esa propia mortandad ortodoxa. Pero enfrentarse a cualquier obra en movimiento, y más, adentrarse desde unas posiciones de contemporaneidad inmediata con ese trabajo es, en la mayoría de los casos, decirse a sí mismo las cosas que de ese otro se quieren oír. Es decir, el texto ajeno se revela en nuestro discurso de una forma aparente, circunscrito por una común medida del tiempo y por ese narcisismo del ser vivo que suele apoderarse de todo cuando aún no atisba el final.`,

  `Precisamente ésto, el inmiscuir mis vivencias poéticas, a lo largo de una o repetidas lecturas de la obra de Jaime Gil de Biedma me puede conducir al falso equívoco de no hablar de Gil de Biedma sino de mi relación visceral con su palabra. No me parece fortuito, y más bien diría que exactamente encontrado, el título de lo que podríamos considerar su <em>summa poeticae</em>, bajo el que se recoge por el propio autor una extensa y nada caprichosa selección de toda su producción en verso: <em>Las personas del verbo</em>. Justamente las infinitas caras de la moneda aplicables a un decir con sus libres conjugaciones. El verbo, en este caso considerado como esa omnipresencia casi innombrable anterior al movimiento de la palabra, tal como lo entendía María Zambrano, a quien no tengo duda que Gil de Biedma ha leído (el poema <em>Piazza del popolo</em> está dedicado a ella), el verbo, repito, se nos presenta como una invitación a formar parte de esa ronda inefable que constituye el libre albedrío del sentimiento poético. Una libertad superior a lo que entendemos por interpretación individual. Lo dicho dicho está, claro, preciso y sin ambigüedades, pero en lo dicho y sobre lo dicho existe un margen, algo más que sentimental, donde perfectamente tienen cabida, casi obligadamente, las conspiraciones del lector.`,

  `Quizás por la ambivalencia verbal de su exposición, por un pensamiento capaz de sustraerse de las regiones oscuras del mero espejismo de su entorno personal (con la limitación de tiempo y espacio que todo monólogo interno trae consigo), por su superación <em>in situ</em> del trauma yoísta, puede considerarse a Gil de Biedma como escritor navegante entre varios campos éticos de distintas mundologías, más allá de lo estrictamente literario. Le oí decir a Gimferrer, con motivo de la presentación en Madrid de la segunda edición de <em>Las personas del verbo</em>, que Gil de Biedma era el interlocutor válido entre dos generaciones poéticas: entre la suya propia, con toda la carga vital e idearia que el 50 lleva consigo, y la generación llamada novísima, que ya, con tan poca perspectiva histórico-sociológica, se erige en precursora de lo venidero. Yo diría más. Me parece que la apreciación de Gimferrer, aunque no falta de sentido y sumamente aceptable, se reduce a un área estrictamente profesional, limitándose al reducido invento, aunque infinito para cada cual, de los que ofician la pluma. Gil de Biedma tiene la suerte o la desgracia de ser un hombre puente. Un puente inmenso por el que atraviesan dos amplias concepciones, no sólo de la poesía sino del pensamiento poético. O sí, por qué no decirlo, de la poesía con mayúsculas, con toda la inefabilidad teórica, filosófica y sentimental que ello trae inmerso. Es un puente de piel, donde se adhiere, a costa de sangre y de agudeza perceptiva, todo el saber pasado, la tradición renovadora de un Juan Ramón Jiménez, el mecanismo plástico y frondoso de un Guillén, la sensualidad mayestática de un Cernuda; pero dejando, al mismo tiempo, abierto el otro lado a la modernidad, a la vida inmediata que nos pertenece a nosotros, a sus contemporáneos, a una España que busca el conocimiento de todas las fuentes de sabidurías y de sensaciones sin olvidar la dignidad de los ancestros. Y es que a este poeta le pasa lo mismo que a Ortega y Juan Ramón. Lo nuevo en tradición, entendiendo la tradición como la fuente progresista que nos ha conducido hasta aquí. Lo demás es mero conservadurismo que no nos pertenece.`,

  `En esa modernidad se construyen los parámetros de la obra de Gil de Biedma. Si en <em>Según sentencia del tiempo</em> o en <em>Compañeros de viaje</em> todo se ordena según la costumbre de la lírica hispánica (la buena costumbre), en <em>Moralidades</em> o en <em>Poemas póstumos</em> la conmoción poética alcanza otras lindes que enriquecen su poesía. Aquí el poema busca su eternidad. Lo eterno alcanzable en el segundo aunque surja su olvido. Y aquí aparece una extraña apariencia muy difícil de encontrar, no ya en los poetas de su generación, sino en la mayoría de los poetas españoles: la verdad producida. Yo no sé si lo que escribe Gil de Biedma, en su mundo real, para entendernos, será del todo verdad, ni me importa. Me estoy refiriendo a la sensación lectora de su discurso. Todo aparece en su forma inmediata y posterior como una gran verdad que nos creemos. Lo que nos queda, después de haber leído, después de haber exprimido su poesía, es un hombre desnudo que nos ha contado todo lo que nos tenía que contar. Un hombre desnudo como sincerado ante sí mismo (pues el espejo del poema <em>Contra Jaime Gil de Biedma</em> no es puramente el que sabe que le escucha —y ahí estamos nosotros mismos—, sino ante sus queridos lectores, que Jaime sabe muy bien quiénes son). Yo no sé si este hombre nos tiene que presentar al escribir en cuanto al engranaje de sus claves; lo que sí es cierto es que se nos explica, que nos obliga a caminar de cómo va por dentro, y aquí lo importante, nos hace caminar por dentro a nosotros mismos. Y eso sólo se consigue con la hermosura de la veracidad. (Esto es lo mejor que le puede ocurrir a un poeta, pero el hombre, aunque la dualidad sea indivisible, ahí queda con su desnudez y sufrimiento).`,

  `Si la verdad de la poemática discurre por una situación vital de procedimientos frente al propio escrito, los medios formales, también difíciles de separar de la actitud ética o moral del autor, encuentran esa sensación de verdad en la propia historia. Gil de Biedma cuenta historias en sus poemas. Narra, a lo largo de una estructura puramente poética, con recursos poéticos, el poema. Y en ello es donde su parámetro de conocimiento, influencia o percepción salta los límites de nuestra dicción lírica. Jaime es un hombre culto, habla y escribe en varios idiomas, tuvo una educación privilegiada, su trabajo como gerente de una empresa de tabacos le permite pasar grandes temporadas en el extranjero y, por tanto, es un hombre abierto a la asimilación y al diletantismo de otras culturas. Las lecturas de otros poetas de lengua inglesa, diría yo de T. S. Eliot y de Yeats, de Pound en otro sentido, le dieron ese hálito formal de la narratividad. Contar sin divagaciones, sin palabrerías, sin especulaciones ultrasensoriales. Contar en poesía.`,

  `Algunos escritores, compañeros de su generación, como Fernando Quiñones o parte de Valente, ante la aventura de Gil de Biedma, siguieron este camino. Pero aquí, en su obra, la narración se nos muestra de forma superior en cuanto a captación de un período descriptivo, con principio y final, que no olvida su origen ni su objetivo, que no se sale de su entorno prioritario que es la poesía, esa poesía como ofrenda y enfrentamiento. Acordémonos del <em>Tercer cuarteto</em> de Eliot y de su simetría en torno a la línea que relata. De esa narración que conlleva a que la verdad sea un resultado perfectamente asimilable por el lector, e indiscutible por la arriesgada actitud del autor, se desprende el personaje central de esta obra en continua ebullición: el tiempo. Si en algún momento se le escucha decir al poeta <em>envejecer, morir, es el único argumento de la obra</em>, no es que el tiempo actúe en la escena como un elemento melodramático que se lamente de cuanto ha sido, que lleve sus amargas desavenencias en el curso de la representación, para prepararse de una manera honrosa y desesperada a su final; no, no va a buscar la postura estética adecuada para la caída del telón, sino que va a morderse su propio discurso hasta escarbar en la esencia de la melancolía. Tiempo de reflexión y de nostalgia de su propia existencia, aunque a veces las temporalidades cobren una medida cotidiana. Y es ahí donde duele este espacio de horas: en la confrontación diaria de lo que va naciendo y lo que va dejando de ser, en un suceso capaz de desarrollarse a partir del cerco de una arruga en el rostro o la nebulosa de una cama. Tiempo cercado por el amor y la experiencia. Tiempo conjurado por el placer y la amargura de no haberlo encontrado en ocasiones. Tiempo comparado con su propia dimensión de tiempo. Tiempo de quien juzga por haber conocido la belleza y la frescura de la juventud. Lo joven como ese estado virginal donde se alían la inocencia con la complicidad, la pureza con el guiño de ese saber que la vida anticipa a la sabiduría.`,

  `Es este mismo tiempo quien se obliga a la meditación en las afueras de las bibliotecas o contemplado muy lejos del reloj de pared. El tiempo en Gil de Biedma puedo entenderlo como un largo viaje por el erotismo, donde sus puntos de referencia para medirse son los estadios de la memoria. Renace entonces la palabra y ese verbo absoluto e indivisible para todas las personas. Brota el verbo como memoria del vivo, sensual y preciso hacia la constelación del amor, hacia un tiempo más alto donde la desdicha puede hacerse belleza y donde el sabor de una copa de antaño aparece gritando su presencia.`,

  `Muchas cosas más me gustaría decirme a mí mismo de Jaime Gil de Biedma, y además, decírmelas siempre de manera distinta, porque desde que leí la primera tanda de sus poemas, me sugieren cosas nuevas y diferentes cada vez que los cojo entre mis manos. Una vez me aposté con un amigo, en el café Gijón de Madrid, una copa a que aquel hombre de la mesa de enfrente no era Gil de Biedma, y resultó que sí. Así fue como conocí a este hombre. Ahora me apostaría lo mismo a que el Gil de Biedma que vamos a escuchar va a ser otra vez nuevo y va a hablarnos de cosas diferentes. Y ésta la gano.`,

  `<em>En junio de 1982, J. Ramón Ripoll presentó en Cádiz una lectura poética de Jaime Gil de Biedma. Este artículo reproduce, por primera vez, las palabras pronunciadas en aquel acto.</em>`,
];

const content = parrafos.map(P).join("\n");

async function main() {
  const issue = await db.magazineIssue.findFirst({ where: { number: 9 }, select: { id: true } });
  if (!issue) throw new Error("No existe el nº9");
  const admin = await db.user.findFirst({ where: { role: "ADMIN" }, select: { id: true } });

  // Limpia el borrador rugoso anterior.
  await db.article.deleteMany({ where: { slug: "poc-jaime-gil-de-biedma-n9" } });

  // Autor real ("firma"): crea el Author y lo enlaza (así se muestra y enlaza
  // como autor, no el "subido por").
  const authorName = "J. Ramón Ripoll";
  const authorSlug = slugifyName(authorName);
  const author = await db.author.upsert({
    where: { slug: authorSlug },
    update: { name: authorName },
    create: { name: authorName, slug: authorSlug },
  });

  const slug = "el-verbo-y-las-personas";
  const article = await db.article.upsert({
    where: { slug },
    update: { content, status: "PUBLISHED", byline: authorName },
    create: {
      title: "El verbo y las personas",
      slug,
      excerpt:
        "Retrato de Jaime Gil de Biedma y de su poesía —Las personas del verbo, Moralidades, Poemas póstumos— a partir de la lectura que J. Ramón Ripoll ofreció en Cádiz en 1982.",
      content,
      byline: authorName,
      status: "PUBLISHED",
      issueId: issue.id,
      authorId: admin?.id ?? "",
      pages: "12–14",
      publishedAt: new Date("1986-01-01T00:00:00Z"),
    },
  });

  await db.authorsOnArticles.deleteMany({ where: { articleId: article.id } });
  await db.authorsOnArticles.create({
    data: { articleId: article.id, authorId: author.id, order: 0 },
  });

  console.log(`✓ "El verbo y las personas" publicado (slug: ${slug}, nº9, autor: ${authorName}).`);
}

main().finally(() => db.$disconnect());
