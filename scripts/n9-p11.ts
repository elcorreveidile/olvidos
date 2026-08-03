import { addArticle } from "./n9-add";

async function main() {
  // Texto 1 (columna izquierda): anuncio del Encuentro + programa + invitados.
  await addArticle({
    title: "Encuentro sobre la poesía y la novela de la Generación de los 50",
    slug: "encuentro-generacion-de-los-50",
    byline: "Editorial",
    pages: "11",
    excerpt:
      "Olvidos de Granada y la Diputación organizan en diciembre, en el Palacio de los Condes de Gavia, un encuentro sobre la Generación de los 50 bajo el título «Palabras para un tiempo de silencio».",
    paragraphs: [
      `En el próximo mes de diciembre, y organizado por <strong>OLVIDOS DE GRANADA</strong> y el Área de Cultura de la Diputación Provincial de Granada, se celebrará en el Palacio de los Condes de Gavia de la ciudad un <em>Encuentro sobre la poesía y la novela de la Generación de los 50</em>, bajo el título de <strong>PALABRAS PARA UN TIEMPO DE SILENCIO</strong>.`,
      `El <em>Encuentro</em> pretende ser la ocasión de una reflexión rigurosa sobre la obra de unos escritores que constituye, hoy por hoy, un grupo por el que cada día, y pasadas las fiebres de algunas modas, crece más el interés. La organización del <em>encuentro</em>, de la que en el mes de septiembre se hará público el programa ya ultimado, tendrá la siguiente estructura:`,
      `a) Habrá una exposición de carácter histórico y bio-bibliográfico en la que, además de los necesarios referentes históricos, procuraremos ofrecer una muestra lo más completa posible de ediciones, documentos, correspondencia, etc., que facilite un acercamiento explicativo a la obra de los escritores objeto del <em>Encuentro</em>.`,
      `b) Previamente al <em>Encuentro</em>, se celebrarán las sesiones de un Seminario de Estudios sobre dicha época; cada escritor será objeto de un estudio monográfico dirigido por un especialista.`,
      `c) En la primera quincena de diciembre, tendrán lugar las sesiones finales del Seminario de Estudios, así como el <em>Encuentro</em> propiamente dicho, dividido en jornadas de poesía y novela.`,
      `Los escritores invitados a participar en el <em>encuentro</em> son los siguientes: Carlos Barral, Francisco Brines, José M. Caballero Bonald, Jesús Fernández Santos, Juan García Hortelano, Jaime Gil de Biedma, Ángel González, José Agustín Goytisolo, Juan Goytisolo, Luis Goytisolo, Juan Marsé, Carmen Martín Gaite, Claudio Rodríguez, Rafael Sánchez Ferlosio, Fernando Quiñones y José Ángel Valente.`,
      `OLVIDOS informará, a partir del mes de septiembre, de la organización del <em>Encuentro</em> y de la forma de participar en el Seminario de Estudios.`,
      `En este número, y como el principio de ese acercamiento en el <em>Encuentro</em>, un texto de José Ramón Ripoll sobre Jaime Gil de Biedma, una entrevista con Claudio Rodríguez, por Benjamín Prado, y las palabras de presentación de Luis García Montero en la lectura de Francisco Brines que tuvo lugar el 28 de junio pasado en Marbella, organizada por la Delegación de Cultura del Ayuntamiento de aquella ciudad para iniciar las tareas de un Taller Literario. La extraordinaria amabilidad de Francisco Brines nos ha permitido publicar dos poemas que forman parte de su último libro, aún inédito.`,
    ],
  });

  // Texto 2 (columna derecha): editorial/manifiesto que abre la serie.
  await addArticle({
    title: "Palabras para un tiempo de silencio",
    slug: "palabras-para-un-tiempo-de-silencio",
    byline: "Editorial",
    pages: "11",
    excerpt:
      "Por qué volver los ojos a la cultura de los años cincuenta: presentación de la serie sobre la Generación del 50.",
    paragraphs: [
      `De todo hace casi treinta años, un espacio de tiempo más que suficiente para las voluntades personales y ajustado por lo que se refiere al ritmo de la historia. La década de los cincuenta, su cultura literaria, surge ante nosotros con la lejanía precisa, invitándonos a todos a discutir y aclarar conceptos. Los habitantes de aquel barco, los artífices de la insolente travesía, están en condiciones de contar tranquilamente verdades, mentiras y recuerdos, piadosos o no. Sus herederos, los que llegaron después o nacieron mientras ellos estaban de viaje, han alcanzado la mínima experiencia respetable, la edad que les permite saber exactamente lo que quieren preguntar.`,
      `Es pues, el momento de hablar. ¿Pero hay razones serias para llamar la atención sobre los años cincuenta y su literatura? Nosotros creemos que sí.`,
      `Con la cultura de posguerra española está pasando algo parecido a lo que ocurría en los viejos manuales de Historia con la Edad Media; hay demasiada prisa en decir que se trata de una época oscura entre dos periodos gloriosos. Fascinados por la evocación mítica de la cultura republicana y por la reciente alegría novísima, hoy se tiende a creer que en medio sólo hubo un molesto paréntesis, un tiempo de silencio. Sin embargo, los que juzgan un país únicamente por su forma de gobierno corren el peligro de ignorar lo más interesante de su cultura; es evidente que entonces nacieron palabras, gestos que no se han superado o caminos de los que somos deudores por sus consecuencias. Años de penitencia nacional para algunos, personas que nos devolvieron al mundo, experiencias que no deben perderse.`,
      `Por eso, desde el desconcierto actual, donde no hay puntos de clara referencia, es importante volver los ojos a aquel horizonte que formó, entre la voluntad y lo imposible, un panorama cultural específico. La reflexión en el campo de la cultura debe descansar en ese lugar exacto donde coinciden las iniciativas espontáneas y los proyectos de educación pública a largo plazo. Es necesario educar (es decir, sacar de la inercia) y alentar al mismo tiempo. Por eso, si entre los más jóvenes se está produciendo la recuperación de cierta ética cultural de los años cincuenta, parece oportuno reunir, estudiar objetivamente y ofrecer aquellas palabras nacidas para un tiempo de silencio.`,
    ],
  });
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
