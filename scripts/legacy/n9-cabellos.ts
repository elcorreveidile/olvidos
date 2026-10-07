import { addArticle } from "./n9-add";

async function main() {
  await addArticle({
    title: "Cabellos de ángel",
    slug: "cabellos-de-angel",
    byline: "Editorial",
    pages: "14",
    excerpt:
      "Nota sobre la concesión del Premio Príncipe de Asturias a Ángel González, el poeta que se empeñó en despeinar la poesía española.",
    paragraphs: [
      `Ya se han dicho las cosas más oscuras y seguramente también las más brillantes. Se han enlazado las palabras como cabellos de seda y oro en una misma trenza —adornando las espaldas transparentes—. Sin embargo ahora, cuando la poesía parece estar tan bella y repeinada, salta a los titulares del anuncio el nombre de uno de los poetas españoles contemporáneos que con más acierto y reincidencia se empeñó en despeinarla: Ángel González.`,
      `La concesión del Premio Príncipe de Asturias al asturiano Ángel González no debe verse únicamente como el fruto de esa política compensatoria con efecto retroactivo que ha puesto en marcha, aceleradamente, la Administración socialista. Ángel González va más allá del crédito antológico o de la representación poética de un grupo históricamente fechado. Él, junto con otros como Gil de Biedma, Barral, etc., pusieron en marcha un procedimiento poético no sólo útil para aquellos primeros años en que le tocó subir a escena (la década de los sesenta fundamentalmente, en el caso que nos ocupa) sino decididamente imprescindible para el destino de la postrer poesía española, como la historia más reciente se encargó de demostrar. Vanos han resultado los intentos de romper con esta poética desde posiciones más o menos formalistas, esencialistas o decadentes. Tan vanos como los de romper con la actualidad de la realidad social, hoy, veinte de junio, huelga general, aunque la informática del poder se luzca desinformándonos. Algunos de los de entonces —aunque se nos tache de tradicionales, seguramente por eso— seguimos siendo los mismos. Sólo que más resabiados, más libres y más tiernos.`,
      `Por eso nos sentimos felices, felices de tomar —junto con ese Ángel, canoso ya y un poco menos pobre— no el oro ni la seda; tan sólo el simple, el fresco, el puro (apasionadamente), el perfumado, el leve (airadamente), el suave pelo. Y sacarla a las calles, despeinada, ondulando en el viento —libre, suelto, a su aire— su cabello sombrío como una larga y negra carcajada.`,
    ],
  });
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
