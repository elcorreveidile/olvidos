import { addArticle } from "./n9-add";

async function main() {
  await addArticle({
    title: "La hora de las revistas",
    slug: "la-hora-de-las-revistas",
    byline: "Editorial",
    pages: "4",
    excerpt:
      "La espuma de los días. Editorial sobre la floración de revistas culturales, la política cultural del momento y la desaparición de La Granada de papel.",
    paragraphs: [
      `Por alguna razón, es la hora de las revistas. Llama la atención, además, que muchas de las nuevas revistas estén hechas tan fuera de Madrid que, a veces, se tenga la impresión de estar ante una especie de revancha de la periferia. Eso sería, en todo caso, secundario. ¿Quién podría quejarse de que el deseo o la necesidad de hacer revistas en las que decir o mostrar cosas esté encontrando el camino de las imprentas y el público? ¿Y quién no pensará también que, desgraciadamente, muchas de esas revistas acabarán chocando con realidades irresistibles que las pondrán en peligro y amenazarán su continuidad?`,
      `Antes de ello, sin embargo, es bueno que tomemos nota de lo que esa <em>hora de las revistas</em> puede estar representando en nuestro país. Nos parece un hecho que, al mismo tiempo, bien puede ser índice de muchas cosas. ¿No puede ocurrir que un sector de la <em>izquierda intelectual</em>, el que no ha participado en el acceso al <em>gobierno de las cosas</em>, busque en la comunicación cultural su propia forma de intervención en la realidad social? Aunque pudiera darse alguna razón suficiente para reprochar que aquella <em>izquierda intelectual</em> acepte tal división del trabajo (unos a gobernar, los otros a «la cultura»), habría que pensar antes en lo que puede aportar la existencia de nuevos y diversos canales de comunicación cultural. Una de las primeras ganancias en ese sentido puede ser, desde luego, la de la creación de un público que, en la medida en que cuenta con más referencias, más días y más puntos de vista, será <em>más público</em>, más capaz de intervenir con solvencia y rigor en los debates que nuestra sociedad tiene planteados y que no son, ni mucho menos, entelequias para entretenimientos de ociosos.`,
      `Es curioso, en ese sentido, que iniciativas como esta tomen nota de que ese propósito estén surgiendo desde abajo, desde la sociedad. En ello hay, nos parece, un implícito reproche a una forma de entender en este Gobierno la política cultural tan trasnochadamente <em>progre</em> que permite pensar incluso en la desaparición del Ministerio de Cultura o de los organismos inferiores de la administración que tienen competencias en esta materia. Cuando tanta gala se hace de los magníficos propósitos de <em>modernizar</em> España, llama la atención que los responsables de la política cultural todavía sean sensibles al espejismo de la espontaneidad (como si la dinamización y el enriquecimiento de la vida cultural pudieran alcanzarse sin esfuerzo público) y tan pobres de argumentos ante la zafia acusación de dirigismo que, desde la derecha, pudiera hacerse a un programa coherente por sus propósitos expresos. A ese vacío están acudiendo las revistas, cada una con su complejo y su limitación correspondiente, pero todas con una condición mínima: están presentes, el ciudadano tiene a su alcance instrumentos de interés para informarse y opinar sobre temas que también son de su interés. La objetiva necesidad de tal presencia está haciendo, además, que revistas de un prestigio ya largo —como la <em>Revista de Occidente</em>— estén siendo capaces de ofrecer un contenido cada vez más cercano a intereses intelectuales no tan añejos, con la consiguiente recuperación del público.`,
      `Políticos hay, en cambio, para los que ese tipo de empresas debieran sufrir un proceso de <em>selección natural</em> en los términos que dictan las leyes del mercado. En un ridículo delirio demagógico (fruto de convertir la necesidad de hacer cosas en coartada de una política cada vez más exclusivamente tecnocrática), afirman que las subvenciones a las revistas están de más porque de ellas debiera encargarse esa misma Sociedad Civil. Olvidan estos políticos, en primer lugar, que tanto el sueldo que ellos cobran como las carreteras que ellos mandan hacer las paga esa misma Sociedad Civil, y en segundo lugar, que la anhelada <em>modernización</em> de España aún no ha dado frutos visibles, entre ellos el de una Sociedad Civil capaz de articular ella misma sus propios medios <em>privados</em> para organizarse como <em>opinión pública</em>. Aquí, entre <em>El País</em>, la SER y RTVE (que son como nuestra Santísima Trinidad de la polancomunicación de masas), está todo hecho. La homologación de la opinión a través de esos ultrapoderosos medios es, no ya un riesgo futuro, sino una real y efectiva insuficiencia de nuestra democracia. ¿Por qué, entonces, tanto escrúpulo <em>liberal</em> en cuestión tan decisiva?`,
      `Pero afortunadamente, la nómina de revistas jóvenes sería tan larga como imposible de hacer: el problema de la distribución hace que, en muchos casos, conozcamos alguna cuando va por el número tres y de otras sólo tengamos noticia por alguna reseña de prensa. No destacaremos ninguna, por tanto.`,
      `Si queremos terminar con una pregunta: ¿qué ha pasado con <em>La Granada de papel</em>? En el primer número de esta época de OLVIDOS saludaba en primera página a esa revista y en su interior hablaba de los tebeos de Granada. <em>La Granada de papel</em> ha salido sólo tres veces, y la última hace ya bastantes meses. Es inexplicable su desaparición: el público la había acogido muy bien y el trabajo de los dibujantes granadinos tenía en sus páginas la oportunidad de ese imprescindible contacto con el público que es la única garantía seria contra el estancamiento. Si las firmas de nuestros amigos dibujantes están en <em>Madriz</em> o en <em>Cairo</em>, ¿por qué no puede existir <em>La Granada de papel</em>?`,
      `La respuesta que deseamos para esta pregunta no es una explicación de complejidades burocráticas. Lo que queremos es que <em>La Granada de papel</em>, u otra cosa, esté en los quioscos. De lo contrario, tendrá poco sentido —y será casi un chiste macabro— hacer exposiciones sobre tebeos y dar conferencias en las que los buenos dibujantes que hay no encuentran más oportunidad que la que a algunos de ellos, y con tanta satisfacción como orgullo, OLVIDOS ha podido darles.`,
    ],
  });

  await addArticle({
    title: "Búscala",
    slug: "buscala",
    byline: "Pedro Salmerón",
    pages: "4",
    excerpt:
      "Relato. Dos hermanas recién llegadas al taller de costura y un niño curioso, Carlos.",
    paragraphs: [
      `Están recién llegadas al taller de costura, vienen de Barcelona donde perdieron a su padre hace unos meses. Las dos hermanas están enfundadas en unos trajes negros muy ceñidos. Teresa, la maestra, las ha colocado en una habitación estrecha y alta con una hermosa ventana a la terraza por donde entra la luz de la mañana.`,
      `El suelo está cubierto por hilachos y recortes de tela. La más rubia de ellas se ha descalzado, se levanta la falda por encima de las rodillas y mueve rítmicamente sus pies sobre el pedal de la máquina, que hace tac-tac-tac...`,
      `Carlos, uno de los niños de la jefa, curiosea a través de la puerta mirando fijamente a las dos desconocidas.`,
      `—¡Ven aquí, queremos conocerte!`,
      `—A ver, ¿cómo te llamas?`,
      `—Yo soy Carlos.`,
      `—¿Eres de aquí?`,
      `—De siempre.`,
      `—¿A qué te gusta jugar?`,
      `—Al balón.`,
      `—¿Sólo a eso?`,
      `—Y también a los médicos.`,
      `—Nosotras podemos enseñarte algo mejor.`,
      `La rubia ha dejado la máquina y mira fijamente al niño, sus manos acarician la cara y el pelo de Carlos. Luego se desabrocha los botones de la blusa: su cuello es blanco como la nieve, más abajo la curva de sus senos se recorta sobre el sostén, que baja un poco más hasta que asoman las rosetas de los pezones como si fueran un dibujo de fantasía. En medio hay un surco profundo en el que se balancea una cruz de oro delicada, ceñida por una cadena muy fina. A duras penas se la saca, enredada entre sus cabellos dorados, luego la suelta en sus manos como una cascada luminosa.`,
      `—Carlos... ¿La ves?— le dice ahuecando la mano, como cuando se tiene un secreto.`,
      `Sin esperar respuesta del niño, que la mira hipnotizado, desliza la cadena entre sus pechos y le dice:`,
      `—¡Búscala!`,
      `Las dos hermanas estallan en risas incontenibles cuando la mano de Carlos queda retenida, fundida con la carne caliente y sedosa, apretada por ella hasta notar el ahogo de su risa y los latidos de su corazón.`,
    ],
  });

  await addArticle({
    title: "Todo lo que se ve",
    slug: "todo-lo-que-se-ve",
    byline: "Pedro Salmerón",
    pages: "4",
    excerpt: "Relato. Doña Engracia, el niño y la finca frente al mar.",
    paragraphs: [
      `Doña Engracia llevaba al niño de la mano por el viejo camino de la finca y le decía constantemente:`,
      `—Todo lo que se ve es mío.`,
      `Luis miraba las lomas que recortaban su vista sobre el cielo, toda aquella extensión de terreno llena de almendros cargados de fruto le parecía el infinito. A través de una garganta se divisaba el mar, al que bajaban como agolpados los bancales llenos de verdor. Volvió sus ojos hacia ella, sus grandes pechos de matrona que, envueltos por la lustrosa tela negra de sayal, la tapaban la cara de media luna, los carrillos hinchados, la nariz aguileña, la piel brillante...`,
      `—¿Y el mar también es tuyo?`,
      `—El mar no, pero la playa sí.`,
      `—¿Me vas a llevar a que me bañe?`,
      `—Tal vez.`,
      `—Nunca me he bañado en playa propia. ¿Se siente algo especial?`,
      `—Se nota como un gusto en la entrepierna, pero eso está reservado al propietario.`,
    ],
  });
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
