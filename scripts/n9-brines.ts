/**
 * "El tiempo de Francisco Brines" — Luis García Montero (nº9, pág. 15).
 * Ensayo + el poema «El pacto que me queda» de Brines (transcripción impresa)
 * junto a su manuscrito autógrafo + nota al pie. HTML a mano.
 */
import { db } from "../src/lib/db";
import { slugifyName } from "../src/lib/colaboradores";

const TITLE = "El tiempo de Francisco Brines";
const SLUG = "el-tiempo-de-francisco-brines";
const BYLINE = "Luis García Montero";
const PAGES = "15";
const EXCERPT =
  "Presentación de la poesía de Francisco Brines: el tiempo, la moral y el conocimiento, de Las Brasas a Ensayo de una despedida.";

const MANUSCRITO =
  "https://0fozgfuttuxgknhs.public.blob.vercel-storage.com/revista/ilustraciones/n9-brines-manuscrito-AO4P3KtxkTnca99QIGCpWWm2UDnl66.jpg";

const content = [
  `<p>De los poetas más señalados y señalables de la generación del 50, aparte de sus buenos versos, suele llamar la atención el tono de personal sencillez que utilizan para hablar no ya de su propia poesía sino de la poesía en general. Con una lógica apacible y lentísima, aprovechando argumentos de simple conversación y conversaciones de poca simplicidad como argumento, explican sus vidas en notas biográficas redactadas con muy cuidado desinterés, y van solucionando uno a uno los problemas más hipócritamente graves de la filosofía poética, esa afantasmada cliente de la tinta y la divagación. Es una actitud —y una aptitud— que sigue sorprendiendo todavía hoy, quizás más que nunca hoy, después de estos quince últimos años de negaciones sin prudencia, donde en nombre de la originalidad y del genio redivivo hemos escuchado declaraciones definitivas sobre el ser y el mal, el sí y el no, lo humano, en fin, con sus miserias y lo divino sin las suyas.</p>`,

  `<p>Personalmente confieso mi preferencia por el dificilísimo arte de hacer las contraportadas de los libros a media voz, utilizando la discreción como logro cultural, la humildad del sol generoso y modesto de las primeras mañanas del invierno, cuando se sabe bien recibido, pero en un tiempo que no es el suyo. Fiel a este tono, Francisco Brines publicó en 1984 un extenso prólogo a su <em>Selección propia</em> de sus poemas, insinuando la explicación de cómo escribe y de qué significa para él la escritura. Son palabras tenues, destinadas voluntariamente, según corresponde a la norma de sus orígenes, a conversar sobre poesía igual que sobre cualquier otro tema de la existencia humana. «De los emocionantes escombros de la vida —dice— surge la motivación del poema».</p>`,

  `<p>No es extraño, pues, que la poesía de Francisco Brines represente, con la máxima exactitud necesaria y posible, el devenir de la generación de los años cincuenta, en la medida en que sus versos abordan la intimidad, pero tomando paulatina conciencia de que no se trata de escribir desde el yo sino sobre el yo mismo, es decir, sobre lo subjetivo como tal. Es un matiz de seriedad destacable, y a partir de él puede comprenderse el decorado de moralidad y análisis, de intensidad y conocimiento, que rodea a sus personajes literarios desde los primeros versos de <em>Las Brasas</em> (1960). Un lector entregado a su espectáculo recibirá en seguida impresiones de objetividad y calma; lo verá, como ha escrito José Olivio Jiménez, preocupado por establecer su reino en la serenidad resignada con que se contempla y medita el paso del tiempo, pero siempre desde dentro y a lo largo de una existencia intransferible. La herida electiva metafísica que corteja a esta poesía permite visionar con claridad los arrabales de una obsesión temporal que cerca a casi toda una generación. Algunas veces es en el discurrir del tiempo donde se evoca la posibilidad primitiva de una deteriorada plenitud; otras, es el punto de confluencia entre el yo y el mundo, inevitablemente relacionados como cuerpos ajenos que se abrazan. Entre todas sus escenas posibles, el personaje preferirá con frecuencia la del hombre, algo mayor de la cuenta, que se sitúa en un interior solitario y doméstico, seguro en los límites privados de las habitaciones que suelen responsabilizarse de nosotros. Casi paralelamente, por medio de puertas, ventanas o balcones, espacios para el celestinaje arquitectónico e ideológico, la realidad pide un papel en el argumento, dando crédito al nacimiento del poema. La vaga demudación de ese momento en que la luz o la oscuridad penetran en el recinto interior provoca la situación exacta de los versos. No son símbolo, como ocurre con ingenua frecuencia; son los nudos que hablan del yo y de su mundo, de la subjetividad y su constitución. O bien el mar y los naranjos a través de un postigo abierto en la poesía de Francisco Brines.</p>`,

  `<p>A partir de aquí es comprensible que <em>Materia narrativa inexacta</em> (1965) se convierta en una versión lírica de la épica y que <em>Palabras a la oscuridad</em> (1966), paradójicamente, contenga una mirada real detrás de cada verso. Recuerdo ahora el poema <em>Después de la infancia</em>, dividido en dos partes que razonan por sí mismos los ingredientes de todo un estilo. Primero, el poema debe recrear una intensidad, la rememoración de una emotividad que posiblemente no exista ya en lo real; pero de inmediato esta conciencia de no existencia crea una posterior posibilidad de exaltación poética. Al paisaje levantino, al viejo valle infantil de olivares nocturnos, acaba sustituyéndolo en el poema la comprensión de su irrealidad. Desde el conocimiento elegido, toda mirada es un diagnóstico, todo diagnóstico, si se retiene la emoción, un verso. Algo que no son los recuerdos se va formando desde el pasado, algo que acaba convirtiéndose en ser, vistiendo al personaje literario, nombrándolo portavoz de un discurso concreto. El tiempo es importante aquí por lo que construye, por el rey que lo impone a sus vasallos, por la débil dureza que, poco a poco, introduce en los ojos de este rey, que su misma mirada, objetiva y con distancia, para salvar la lucidez necesita endurecerse en la conciencia de que no se ha llegado al final. A mi modo de ver, así se asienta definitivamente la poética de Francisco Brines. <em>Aún no</em> (1971) es un libro de atractiva dureza; y no estoy pensando en las estrofas satíricas que integran <em>Composiciones de lugar</em>, sino en los poemas más íntimos, los preferidos. Por ejemplo, <em>Onor</em> y <em>Los signos de la madrugada</em>, poemas de análisis rígido, poemas donde el yo se integra cada vez más en el mundo, a raíz de convertirse en un objeto merecedor de crítica destructiva. Sin egoísmo (o con el egoísmo más inteligente después de bajar al siglo), el desprendimiento personal empieza a levantar las barreras. Frente a la personalización del mundo, la objetivación del yo.</p>`,

  `<p>Finalmente, <em>Insistencias en Luzbel</em> (1977) parece reafirmar ese puerto del conocimiento que es vacío. Casi inevitable, andando el tiempo y los versos, que toda promesa de distancia acabe en el hielo, en la quietud desengañada, en las figuras de nuestra conciencia desdichada. Los poemas tendrán entonces algo más que un atisbo de estirpe romántica, un despunte de hombre deshabitado. Mientras, las primeras páginas de Francisco Brines se convierte en viajero regresado, cuerpo que no trae noticias de un descubrimiento porque es difícil contar la inexistencia personal como tema literario. Pero la conocida imposibilidad del mejor desierto romántico no se convierte, por esta vez, en límite. Aunque en la primera parte de <em>Insistencias en Luzbel</em> el personaje cierra los postigos para escindirse definitivamente de la luz, prevalecen luego los restos del vitalismo. La realidad, bajo el tirón del amor, se levanta con una coraza superior a su imagen más lúcida, y la vida es apoyada por la necesidad de la conveniencia. Esta es la dignidad de los que regresan a los placeres inferiores, las noches del sábado vividas como experiencias de caza mayor. La vida manda una vez más, sujetando las naves en el trastorno de su tormenta. Por dos veces, en 1974 y 1984, Francisco Brines ha reunido sus libros bajo el título <em>Ensayo de una despedida</em>, título que apunta con acierto a las dos direcciones que admite su ambigüedad semántica. La ficción previamente admitida y el intento real imposible. Intento, porque la vida que niega, en su abundancia, impide cualquier despedida; ficción, porque la mirada poética descubre los cimientos de una existencia que todavía no está en su noche de estreno.</p>`,

  `<p>La moral y el conocimiento, actores de un conocimiento que perdura en su interrelación. Ahora, una vez finalizados los ensayos y cumplidos, en la medida de lo posible, los ritos literarios, el presentador debe acabar, aceptando su papel de última mano que tira poco a poco de la cuerda para abrir el telón. Sobre la escena, Francisco Brines a solas con el público. En medio, únicamente un tiempo literario.</p>`,

  `<p style="font-size:0.85em;color:var(--color-acero);text-indent:0"><em>* Estas palabras fueron escritas para presentar una lectura de F. Brines en Marbella; de ahí sus limitaciones conscientes y su carácter de rápida lectura global.</em></p>`,

  `<h3>El pacto que me queda</h3>`,
  `<p style="text-indent:0;margin-bottom:0.5em"><em>Francisco Brines</em></p>`,

  `<blockquote>¿Y cómo devolver a mi vida la luz<br>de la mañana, las lágrimas nocturnas,<br>el asombro del mar, los silencios del mirlo,<br>el tiempo de una tarde inacabable?<br><br>¿Y cómo devolver sus diferencias<br>al dolor y a la dicha,<br>y ser los dos amados por igual,<br>pues completan los dos el sabor encendido de la vida?<br><br>Cuando la edad es ya desventurada<br>y es un pétalo el día,<br>y apenas quedan rosas,<br>no es posible que el mundo pueda ser recobrado.<br><br>Acógete a unos ojos, sólo jóvenes,<br>y descubre con ellos el mundo que perdiste.<br>Y que te miren luego, para ser aún del mundo.</blockquote>`,

  `<figure><img src="${MANUSCRITO}" alt="«El pacto que me queda», poema manuscrito y firmado por Francisco Brines" /><figcaption>«El pacto que me queda», autógrafo de Francisco Brines</figcaption></figure>`,
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
      title: TITLE, slug: SLUG, excerpt: EXCERPT, content, byline: BYLINE, status: "PUBLISHED",
      issueId: issue.id, authorId: admin?.id ?? "", pages: PAGES,
      publishedAt: issue.publishedAt ?? new Date("1986-01-01T00:00:00Z"),
    },
  });

  await db.authorsOnArticles.deleteMany({ where: { articleId: article.id } });
  await db.authorsOnArticles.create({ data: { articleId: article.id, authorId: author.id, order: 0 } });

  console.log(`✓ ${TITLE} — ${BYLINE} (págs. ${PAGES})`);
  await db.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
