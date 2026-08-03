import { addArticle } from "./n9-add";

async function main() {
  await addArticle({
    title: "Son los celos",
    slug: "son-los-celos",
    byline: "Antonio Jiménez Millán",
    pages: "5",
    excerpt:
      "Líneas de sombra. Los bares nocturnos, la multitud postmoderna y un desenlace: son los celos.",
    paragraphs: [
      `Siempre te preguntas por qué termina y, a veces, comienza la noche en estos bares donde hay que alzar demasiado la voz y uno corre el peligro de que los empujones derramen el vaso que inicia tu corto viaje hacia la embriaguez. Yo sé que no te gustan, pero tal vez sea un tributo inevitable a la moda, como si esa luz de neón, que a nadie favorece, os convocara secretamente a la ceremonia del roce y del gesto un sábado tras otro y, sin sentir, fuera instalándose en los ojos una expresión noctámbula y solidaria. Hace frío en la calle, no os atrevéis a salir. Alcanzar la barra es un proyecto más difícil que entender la semiótica y sus distintas escuelas; al final consigues otra copa, la tarea del héroe.`,
      `Esos ojos inyectados en Larios, la risa de aquella mujer, la música tan fuerte. Recuerdas los bares de hace muchos años, cuando la zona aún no había sido invadida por legiones de adolescentes; recuerdas, por ejemplo, a aquel personaje que se emborrachaba, casi metódicamente, quince minutos después de abrir su propio local. Pronto desapareció: su pasión madrugadora por el alcohol le conducía a jugarse las consumiciones con los clientes, a través de procedimientos diversos. Luego, esas tabernas semiocultas, diseminadas por calles estrechas y umbrías, lugares para cultivar los mitos de la bohemia, cuando tal cosa parecía imaginable, a ratos. Ahora sigues el viaje por escaleras y sótanos donde se arrastra la condición postmoderna. Crece la multitud: ellos son los ejércitos de la noche. Bajo esta luz que hiere, intermitente, giran al ritmo de una canción que evoca el terror del milenio, las aldeas perdidas, las almas en pena; por un instante aparece ante ti la figura del conde maldito, cabalgando por llanuras desoladas, señor de todos los fantasmas. Pero ya son otras leyendas, y la imagen de los héroes no es la misma: tal vez no exista ninguna.`,
      `La voz de Patti Smith se quiebra entre reflejos violáceos, describe caballos alocados que corren por los laberintos de la sangre. Adviertes en la pista una rápida marea en blanco y negro, mientras brillan metales recuperados de un tiempo bastante ajeno a estos cuerpos casi adolescentes. Fíjate en las miradas: una forma de agredir y defenderse. Antiguos tratadistas fijarían su temperamento, colérico o sanguíneo; a Stendhal le hubieran apasionado, sobre todo al principio, cuando se tomaba muy en serio aquello de analizar los comportamientos amorosos, e incluso algún clérigo de las lujosas cortes de Provenza se hubiese servido de ellas para establecer una complicada casuística sentimental. Sin embargo, a ti sólo te revelan que existe una buena dosis de mal humor en el ambiente y un repertorio de posibilidades que en nada se aproximan a las sutilezas de los trovadores. Más bien, los boleros de Moncho: ya saben todos a quién pertenece, ya todos han de advertir que es sólo suya, su propiedad privada, como un imperativo categórico. Pero en otro barrio de la ciudad, más moderno, ella lo vio salir, un coche sin luces, un golpe certero, y todo terminó.`,
      `La música, cada vez más fuerte. El humo en los ojos. Ella ha desaparecido y es hora de marcharse; por qué agotar la noche en este sitio, piensas. De repente la ves sentada junto a alguien que —luego lo sabrías— deseaba una mujer para toda la vida. Y sabrías también que a ella siempre se acercan los que exigen fidelidad por principios: una mala costumbre que empieza a no resultarte ajena, para su desgracia. Se despide de él. Salís a la calle y el frío de la noche te despeja de un agobio metido en alcohol y malas intenciones. Los faros alumbrarán un vértigo de calles vacías, las llantas rozarán las aceras al doblar esquinas demasiado familiares, cuando la primera claridad acompañe al frío, se extienda por el asfalto húmedo.`,
      `Permaneces callado, como quien presiente tormenta, y piensas que allí seguirán bailando, ahora con una música más cansada que fuese la expresión final del invierno. Ya no puedes arrepentirte: son los celos.`,
    ],
  });

  await addArticle({
    title: "Motivos del ron",
    slug: "motivos-del-ron",
    byline: "Antonio Jiménez Millán",
    pages: "5",
    excerpt:
      "Líneas de sombra. El ron, el mar y la leyenda: un brindis último por todos los dioses destruidos.",
    paragraphs: [
      `Para nosotros, que no nos hemos ido a Santiago, sigue teniendo algo de leyenda; acaso busquemos en él una compensación de lejanos mitos cifrados en la aventura y el abordaje. Sus antiguos adictos guardamos cierta fidelidad: uno termina por volver a él, dejándose seducir por sus trampas más suaves, cuando ya la ginebra, con ese sabor extraño que evoca destilerías frecuentadas por mercaderes rastreros y colonizadores venidos desde el norte, nos había acostumbrado a frenar los abusos. Es el suyo un ritmo ondulante, parecido al de las noches en que comienza a sentirse el verano y el mar apenas se mueve; nos descubre otros reflejos, afirma que la austeridad no fue hecha para quienes se atrevieron una vez a escuchar su llamada, como el viejo poeta que, en la distancia de los mástiles y las arboladuras, forjaba sus imágenes de la evasión: no lo retendría ni la mujer ni los inciertos jardines en el espejo de la mirada, ni siquiera el desafío angustioso de la página en blanco. (Sobre un fondo de las espumas agitadas se presiente lo desconocido y lo nuevo, la invitación al viaje, el trayecto de embarcaciones que varaban en el charco sucio de la infancia y de la muerte).`,
      `Pero la carne no es triste, aún, y yo amo algunos libros, algunas ciudades en cuyos rincones, ocultos o lujosos, he sabido que esa llamada también tiene su parte de crueldad, la antesala de un lenguaje que anticipa la ruina y jamás conduce al olvido, como quieren los tangos y ciertas canciones sentimentales. Casi siempre existirá un camarero que sirva, no más, esa última copa que no será ni la penúltima, porque aquellos que se deciden a adentrarse en los rituales nocturnos siguen itinerarios nunca fijos, pero de alguna manera coincidentes en la reiteración. Y buscan otro bar, acompañan al cierre de algunos, el madrugón de otros, hasta que llega esa hora que confunde las apariencias con la luz en un brillo grisáceo. Más dura será la resaca. Pero jamás el olvido, si no es bajo la forma de espejismo fugaz que se desvanece como el humo en las vidrieras de lugares sofisticados con estilo falsamente inglés, donde las parejas se sientan para acabar la tarde, antes de dirigirse a un reino impreciso, entre los vivos y los muertos, igual que los ángeles de Rilke. Invocar la pérdida a través de un conjuro inútil, restituir las máscaras: nada valdría. Sólo se sabe de un cuerpo que aún nos roza en las proximidades de las noches más intensas, cuando se ha compartido ese mismo ron, dócil como la arena, en horas de mejor recuerdo.`,
      `A falta de barriles de madera gastada en las bodegas, uno se conforma con pequeñas dosis, brebajes conocidos para aplazar siempre el momento de la retirada nocturna. Pero más lejos, mucho más lejos, oscuros barcos fantasmas se internarán en las tormentas de un mar irreconocible, y el viento hará que se aproximen a puertos donde nunca podrían fondear porque ya no vienen de este mundo, porque la mirada de los vigías seguirá fija en una línea de sombras, como un brindis último por todos los dioses destruidos.`,
    ],
  });
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
