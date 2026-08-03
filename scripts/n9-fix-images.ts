/**
 * Añade las imágenes que faltaban en varios artículos del nº9 (comprobado
 * página a página contra el PDF). Inserta <figure> intercaladas en el contenido
 * ya existente, sin rehacer la transcripción.
 */
import { db } from "../src/lib/db";

const U = {
  cuadernos:
    "https://0fozgfuttuxgknhs.public.blob.vercel-storage.com/revista/ilustraciones/n9-p4-cuadernos-del-norte-gWpLYEl02VpPQDtgLMwEZk7K5WBezm.jpg",
  nuevasletras:
    "https://0fozgfuttuxgknhs.public.blob.vercel-storage.com/revista/ilustraciones/n9-p4-nuevas-letras-CiZwfv3ISjQn7G2HtqeJFnTlbO2k3v.jpg",
  saber:
    "https://0fozgfuttuxgknhs.public.blob.vercel-storage.com/revista/ilustraciones/n9-p4-saber-hajKFiYPgoaQSfmNmcAVLdoMqxs2Od.jpg",
  culturista:
    "https://0fozgfuttuxgknhs.public.blob.vercel-storage.com/revista/ilustraciones/n9-cuestion-estilo-culturista-e4rKLFpec5yR8uhc62qJQBsiFBwWI9.jpg",
  canavate1:
    "https://0fozgfuttuxgknhs.public.blob.vercel-storage.com/revista/ilustraciones/n9-romanilla-canavate-1-In16mdu2iWWJcjO9lu4B9wrzzo9UVh.jpg",
  canavate2:
    "https://0fozgfuttuxgknhs.public.blob.vercel-storage.com/revista/ilustraciones/n9-romanilla-canavate-2-dn7d1wV6eGRZZm4JdftHkXu7x7SbyV.jpg",
  calle:
    "https://0fozgfuttuxgknhs.public.blob.vercel-storage.com/revista/ilustraciones/n9-romanilla-calle-rsYQobbVHJuMGP6d2pv3ROmYlyLTPy.jpg",
  biedma2:
    "https://0fozgfuttuxgknhs.public.blob.vercel-storage.com/revista/ilustraciones/n9-verbo-personas-2-A3n00DjUW9dCUSAYJr69fSye9l5yoh.jpg",
};

const fig = (url: string, alt: string, credit?: string) =>
  `<figure><img src="${url}" alt="${alt}" />${credit ? `<figcaption>${credit}</figcaption>` : ""}</figure>`;

// Inserta las figuras repartidas de forma pareja entre los párrafos.
function insertEvenly(content: string, figures: string[]): string {
  const paras = content.split("\n").filter(Boolean);
  const P = paras.length;
  const n = figures.length;
  const out: string[] = [];
  let fi = 0;
  for (let i = 0; i < P; i++) {
    out.push(paras[i]);
    while (fi < n && Math.floor(((fi + 1) * P) / (n + 1)) === i + 1) {
      out.push(figures[fi]);
      fi++;
    }
  }
  while (fi < n) out.push(figures[fi++]);
  return out.join("\n");
}

// Inserta una figura tras el párrafo de índice `after` (0-based).
function insertAfter(content: string, after: number, figure: string): string {
  const paras = content.split("\n").filter(Boolean);
  paras.splice(Math.min(after + 1, paras.length), 0, figure);
  return paras.join("\n");
}

async function update(slug: string, transform: (c: string) => string, extra: any = {}) {
  const a = await db.article.findUnique({ where: { slug }, select: { content: true } });
  if (!a) throw new Error(`No existe ${slug}`);
  await db.article.update({ where: { slug }, data: { content: transform(a.content), ...extra } });
  console.log(`✓ ${slug}`);
}

async function main() {
  // 1) La hora de las revistas (p.4): 3 portadas de revista (sin crédito).
  await update("la-hora-de-las-revistas", (c) =>
    insertEvenly(c, [
      fig(U.cuadernos, "Portada de la revista «Los Cuadernos del Norte»"),
      fig(U.nuevasletras, "Portada de «Las Nuevas Letras» — Diderot y la estética de la Ilustración"),
      fig(U.saber, "Portada de la revista «Saber» — Figuras de lo sagrado"),
    ]),
  );

  // 2) Cuestión de esti(l)o (p.6/8-9): el culturista «Los veranos» pasa a ser
  //    la portada del artículo (crédito Robert Funk).
  await update("cuestion-de-estilo", (c) => c, {
    coverImage: U.culturista,
    coverPosition: "center",
    coverCredit: "Robert Funk",
  });

  // 3) La plaza de La Romanilla (p.6/7): además del farol (portada, Fernando
  //    Barrera), van las dos fotos de Juan Cañavate y la vista de la calle.
  await update("la-plaza-de-la-romanilla", (c) =>
    insertEvenly(c, [
      fig(U.canavate1, "La Romanilla: hexágono, fuente y palmeras en escorzo", "Juan Cañavate"),
      fig(U.canavate2, "La Romanilla: barandillas y palmeras jóvenes de la plaza", "Juan Cañavate"),
      fig(U.calle, "La Romanilla: la plaza con las farolas y la fachada al fondo"),
    ]),
  );

  // 4) El verbo y las personas (p.12-13): foto pequeña (dos figuras) + corrige
  //    la paginación (12-13, no 12-14).
  await update(
    "el-verbo-y-las-personas",
    (c) => insertAfter(c, 2, fig(U.biedma2, "Jaime Gil de Biedma, fotografía")),
    { pages: "12-13" },
  );
}

main()
  .then(() => db.$disconnect())
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
