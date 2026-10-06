import { addArticle } from "./n9-add";

async function main() {
  await addArticle({
    title: "Una plaza menos y una duda más",
    slug: "una-plaza-menos-y-una-duda-mas",
    byline: "Editorial",
    pages: "6",
    excerpt:
      "Mitológicas. Introducción de la sección: sobre las intervenciones urbanísticas en Granada —Alijares y La Romanilla— y la necesidad del debate cívico.",
    paragraphs: [
      `Lamentablemente, este primer curso de OLVIDOS va a ser un triste <em>capicúa urbanístico</em>: empezamos con Alijares y terminamos con la Romanilla. Pero es demasiado importante para dejarlo pasar sin decir dos palabras: en buena medida, somos lo que la ciudad (que no es sólo un soporte físico, pero que también es eso) nos permite ser, y la nuestra, Granada, al margen de lo que las mitologías exijan, merece tanta atención como todo lo que se refiere a la calidad de la vida que cada cual puede sacar adelante.`,
      `Necesariamente, cualquier intervención sobre esta ciudad será siempre polémica: no cuentan sólo los grandes, medianos y pequeños intereses económicos, políticos y hasta personales en juego, sino también el hecho de tratarse de una ciudad de enorme singularidad histórica en cuanto tal. Ocurre, sin embargo, que las intervenciones que se están produciendo en la Granada más visible no encuentran una acogida favorable. Nadie puede descartar que ello se deba a falta de información o, incluso, a un fanatismo conservador de las tradiciones. En el caso de que así fuera, no eximiría ello a las autoridades de la responsabilidad sobre la que parece obligado volver a insistir: un gobernante verdaderamente grande es el que pone a los gobernados en condiciones de hacer una crítica profunda y seria de los actos de gobierno. ¿Por qué no se revisan, o se complementan, las normas que rigen la <em>exposición pública</em> de los proyectos? ¿Por qué no se provoca —sí: <em>provoca</em>— un debate en el que los ciudadanos puedan ejercer de tales?`,
      `Cuando tan fácil es lanzar al público —con ruedas de prensa y esfuerzos de información que, para eso, sí son verdaderamente eficaces— al seguimiento de polémicas en las que lo que hay verdaderamente en juego no sale a la luz o que —como también ha ocurrido— carecen del menor interés público, ¿por qué tardan tanto los instrumentos y la infraestructura de una <em>verdadera transparencia política</em>? Entre los ciudadanos, nada ha removido el desinterés por la cosa pública del que el franquismo tan buen partido sacara. Nadie quiere hoy eso. ¿Por qué ceder a la inercia?`,
      `Hay algo más, sin embargo. Parece que, al menos en los dos casos citados —Alijares y La Romanilla—, la reacción pública de rechazo no obedece sólo a desinformación. Se apunta —aunque sean sólo intuiciones, pero tan dignas de ser tenidas en cuenta como todo lo que viene de los ciudadanos— a una tónica de improvisación y pastiche, a un criterio de intervención en el que parece primar una idea extremadamente personal y singular de la ciudad que resulta difícil llegar a entender. ¿A gusto de quién se ha hecho La Romanilla? Lo que los ciudadanos sabemos es que tenemos una plaza menos y una duda más.`,
    ],
  });
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
