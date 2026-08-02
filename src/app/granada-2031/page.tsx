import type { Metadata } from "next";
import Image from "next/image";
import { CategoryHeading } from "@/components/content/CategoryHeading";

export const metadata: Metadata = {
  title: "Apoyamos Granada 2031",
  description:
    "Olvidos de Granada apoya la candidatura de Granada a Capital Europea de la Cultura 2031. Por qué nos sumamos a este proyecto de ciudad.",
};

export default function Granada2031Page() {
  return (
    <div className="max-w-content mx-auto px-4 py-12">
      {/* Cabecera editorial */}
      <header className="mb-12 border-b-2 border-tinta pb-8 text-center">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-coral">
          Apoyamos
        </p>
        <CategoryHeading>granada 2031</CategoryHeading>
        <p className="mx-auto mt-6 max-w-2xl font-editorial text-lg leading-snug text-tinta/70">
          <em>Olvidos de Granada</em> apoya la candidatura de Granada a Capital
          Europea de la Cultura 2031.
        </p>
      </header>

      <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-start">
        {/* Justificación */}
        <section className="max-w-article">
          <h2 className="mb-4 text-2xl font-black text-tinta">
            <span className="text-coral">[</span>Por qué nos sumamos
          </h2>
          <div className="prose-editorial">
            <p>
              <em>Olvidos de Granada</em> nació en 1982 de una convicción de su
              fundador, Mariano Maresca: que la cultura de esta ciudad merece ser
              recordada, cuidada y proyectada. Fieles a ese impulso, apoyamos sin
              reservas la candidatura de Granada a Capital Europea de la Cultura
              2031.
            </p>
            <p>
              A Mariano le habría entusiasmado esta candidatura. Dedicó su vida a
              demostrar que Granada no es un decorado ni una postal, sino un lugar
              donde la cultura se piensa, se discute y se hace. Una capitalidad
              europea es justamente el tipo de empeño colectivo en el que él se
              habría implicado: no por el escaparate, sino por todo lo que puede
              poner en marcha dentro de la ciudad.
            </p>
            <p>
              Porque Granada no necesita inventarse una cultura para la ocasión:
              la tiene, viva y honda, en su literatura, su música y su
              pensamiento. Por las páginas y los encuentros de Olvidos han pasado
              nombres como Antonio Muñoz Molina, Luis García Montero o Javier
              Egea, y siguen pasando los creadores que escriben el presente de la
              ciudad. Una capitalidad europea sería el reconocimiento a ese
              trabajo colectivo y sostenido.
            </p>
            <p>
              «El trabajo de la memoria es esencial, casi nuestra única arma»,
              decía Mariano. Creemos, como él, que la cultura no es un adorno sino
              un motor: de convivencia, de memoria y de futuro. La candidatura es
              una oportunidad para que toda la ciudad —instituciones, creadores y
              sociedad civil— reme en la misma dirección. Desde el asociacionismo
              cultural, ese es también nuestro sitio, y el mejor modo de honrar su
              legado.
            </p>
            <p>
              Puedes conocer el proyecto en la web oficial de la candidatura,{" "}
              <a
                href="https://2031granada.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                2031granada.org
              </a>
              .
            </p>
          </div>
        </section>

        {/* Logo de la candidatura */}
        <aside className="mx-auto md:mx-0">
          <a
            href="https://2031granada.org"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Granada, Capital Europea de la Cultura 2031 — candidatura oficial"
            className="inline-block rounded-md bg-white p-6 shadow-card transition-transform hover:-translate-y-0.5"
          >
            <Image
              src="/granada-2031/marca-firma.png"
              alt="Granada 2031 · Capital Europea de la Cultura · Ciudad finalista"
              width={200}
              height={226}
              className="h-auto w-40 md:w-48"
            />
          </a>
        </aside>
      </div>
    </div>
  );
}
