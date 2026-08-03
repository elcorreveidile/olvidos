import Link from "next/link";
import type { Metadata } from "next";
import { CategoryHeading } from "@/components/content/CategoryHeading";
import { DesarrolloCredit } from "@/components/shared/DesarrolloCredit";
import {
  COLABORADORES,
  AGRADECIMIENTOS,
  slugifyName,
  resolveAuthorSlug,
} from "@/lib/colaboradores";

export const metadata: Metadata = {
  title: "Sobre Olvidos",
  description:
    "Olvidos de Granada, revista de acciones culturales editada por la Asociación Cultural Olvidos de Granada. ISSN 2605-4515.",
};

const EQUIPO = [
  "Ramón Repiso Ruiz",
  "Alfonso Salazar",
  "Javier Benítez Láinez",
];

// "Coordinadores" en el original se refiere a coordinadores de piezas/procesos
// concretos; la coordinación de la publicación es Javier Benítez Láinez.
const COORDINACION = ["Javier Benítez Láinez"];


export default function SobreNosotrosPage() {
  return (
    <div className="max-w-content mx-auto px-4 py-12">
      {/* Cabecera editorial */}
      <header className="mb-12 border-b-2 border-tinta pb-8 text-center">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-coral">
          La asociación
        </p>
        <CategoryHeading>sobre olvidos</CategoryHeading>
        <p className="mx-auto mt-6 max-w-2xl font-editorial text-lg leading-snug text-tinta/70">
          <em>Olvidos de Granada</em> es una revista de acciones culturales
          nacida en 1981. Tras su primera época impresa, hoy continúa como
          publicación viva de la Asociación Cultural Olvidos de Granada.
        </p>
      </header>

      {/* Misión */}
      <section className="mb-16 max-w-article">
        <h2 className="mb-4 text-2xl font-black text-tinta">
          <span className="text-coral">[</span>Nuestra razón de ser
        </h2>
        <div className="prose-editorial">
          <p>
            Recuperar, preservar y difundir el patrimonio literario y cultural de
            Granada: esa es la vocación de Olvidos desde su primer número. A través
            de la revista, los encuentros y el archivo, mantenemos vivo un legado
            que va de la palabra impresa al presente digital.
          </p>
          <p>
            La revista dio voz a más de un centenar de escritores, artistas y
            pensadores, y sigue siendo un espacio abierto a la creación y al
            pensamiento crítico sobre la cultura granadina y contemporánea.
          </p>
          <blockquote>
            La cultura es la memoria de un pueblo; sin ella, los pueblos pierden
            su identidad.
          </blockquote>
        </div>
      </section>

      {/* Historia */}
      <section className="mb-16 max-w-article">
        <h2 className="mb-4 text-2xl font-black text-tinta">
          <span className="text-coral">[</span>Una historia breve pero intensa
        </h2>
        <div className="prose-editorial">
          <p>
            <em>Olvidos de Granada</em> nació en noviembre de 1982 en La
            Tertulia, epicentro de la cultura alternativa granadina de los
            ochenta, de la mano de <strong>Mariano Maresca</strong>, su fundador
            y director. En aquellos primeros números ya se felicitaba a García
            Márquez o a Rafael Alberti por sus ochenta años, y Luis García
            Montero firmaba sus artículos «De Granada y sus poetas».
          </p>
          <p>
            Tras un silencio de casi dos años, la revista renació en noviembre
            de 1984 como mensual de la Diputación Provincial, etapa que se
            prolongó hasta 1987. Fue una publicación multidisciplinar —creación,
            traducción y crítica— en la que los poetas se atrevieron con la prosa
            (Ángeles Mora, Javier Egea, el propio García Montero) junto a
            profesores de Filosofía y de Derecho. En sus páginas despuntaron
            Antonio Muñoz Molina y Justo Navarro, y se tejió buena parte de lo
            que sería «La otra sentimentalidad».
          </p>
          <p>
            Olvidos forma parte de aquel florecimiento de revistas literarias del
            sur —junto a <em>La Fábrica del Sur</em> o <em>Las Nuevas Letras</em>—,
            uno de los capítulos hoy más olvidados de nuestra historia literaria.
            De rescatarlo del olvido va, precisamente, este proyecto.
          </p>
        </div>
      </section>

      {/* Qué hacemos */}
      <section className="mb-16">
        <h2 className="mb-6 text-2xl font-black text-tinta">
          <span className="text-coral">[</span>Lo que hacemos
        </h2>
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-sm bg-acero-light/40 sm:grid-cols-3">
          {[
            {
              t: "La revista",
              d: "Artículos, ensayos y creación literaria sobre la historia y la cultura de Granada y su tiempo.",
            },
            {
              t: "Encuentros",
              d: "Presentaciones, recitales, conferencias y talleres que celebran y piensan la cultura.",
            },
            {
              t: "El archivo",
              d: "La digitalización y preservación de la colección impresa, número a número.",
            },
          ].map((item) => (
            <div key={item.t} className="bg-white p-6">
              <h3 className="mb-2 text-lg font-bold text-tinta">
                <span className="text-coral">[</span>
                {item.t}
              </h3>
              <p className="font-editorial text-tinta/70">{item.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Fines (estatutos) */}
      <section className="mb-16 max-w-article">
        <h2 className="mb-4 text-2xl font-black text-tinta">
          <span className="text-coral">[</span>Nuestros fines
        </h2>
        <div className="prose-editorial">
          <p>
            Según el artículo 6 de nuestros <strong>estatutos</strong>, la
            Asociación Cultural Olvidos de Granada, sin ánimo de lucro, persigue
            estos fines:
          </p>
        </div>
        <ul className="mt-6 space-y-4">
          {[
            "Proteger el legado de la revista Olvidos de Granada.",
            "Gestionar la revista digital www.olvidos.es en una web dispuesta al efecto.",
            "Divulgar el pensamiento crítico y la cultura en todas sus manifestaciones —literatura, fotografía, pintura, cine, filosofía, cómic, escultura, música, danza y cualquier otra expresión del conocimiento humano— y ponerlas en valor.",
            "Organizar actividades culturales que contribuyan al enriquecimiento de la ciudadanía que reside en Andalucía.",
            "Poner en relación ese legado mediante exposiciones, conferencias, jornadas, publicaciones y otras actividades de divulgación.",
            "Asesorar y apoyar a instituciones y entidades, públicas o privadas, en el ámbito del conocimiento, el pensamiento crítico y la expresividad artística.",
            "Promover actividades escénicas, conciertos y propuestas participativas en espacios patrimoniales para la divulgación de los valores culturales de la asociación.",
          ].map((fin, i) => (
            <li key={i} className="flex gap-3 font-editorial text-tinta/80">
              <span className="mt-1 shrink-0 font-black text-coral">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{fin}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 font-editorial text-sm text-tinta/60">
          Para lograrlos, la asociación publica artículos, celebra jornadas y
          conferencias, y organiza exposiciones, conciertos y otras actividades
          artísticas, pudiendo optar a subvenciones públicas para cumplir sus
          objetivos.
        </p>
      </section>

      {/* Ficha de la asociación */}
      <section className="mb-16">
        <h2 className="mb-6 text-2xl font-black text-tinta">
          <span className="text-coral">[</span>Datos de la publicación
        </h2>
        <dl className="grid grid-cols-1 gap-x-10 gap-y-4 border-t border-acero-light/50 pt-6 font-editorial text-tinta/80 sm:grid-cols-2">
          <div className="flex justify-between gap-4 border-b border-acero-light/30 pb-3">
            <dt className="font-sans text-sm font-bold uppercase tracking-wide text-acero">
              Edita
            </dt>
            <dd className="text-right">Asociación Cultural Olvidos de Granada</dd>
          </div>
          <div className="flex justify-between gap-4 border-b border-acero-light/30 pb-3">
            <dt className="font-sans text-sm font-bold uppercase tracking-wide text-acero">
              ISSN
            </dt>
            <dd className="text-right">2605-4515</dd>
          </div>
          <div className="flex justify-between gap-4 border-b border-acero-light/30 pb-3">
            <dt className="font-sans text-sm font-bold uppercase tracking-wide text-acero">
              CIF
            </dt>
            <dd className="text-right">G-19648625</dd>
          </div>
          <div className="flex justify-between gap-4 border-b border-acero-light/30 pb-3">
            <dt className="font-sans text-sm font-bold uppercase tracking-wide text-acero">
              Registro
            </dt>
            <dd className="text-right">
              Asociaciones de Andalucía, nº 10241, Secc. 1
            </dd>
          </div>
          <div className="flex justify-between gap-4 border-b border-acero-light/30 pb-3">
            <dt className="font-sans text-sm font-bold uppercase tracking-wide text-acero">
              Domicilio
            </dt>
            <dd className="text-right">C/ Carmen, 51 · 18198 Granada</dd>
          </div>
          <div className="flex justify-between gap-4 border-b border-acero-light/30 pb-3">
            <dt className="font-sans text-sm font-bold uppercase tracking-wide text-acero">
              Editor (2012–2023)
            </dt>
            <dd className="text-right">Mariano Maresca</dd>
          </div>
        </dl>

        <div className="mt-8 grid grid-cols-1 gap-8 font-editorial text-tinta/80 sm:grid-cols-2">
          <div>
            <h3 className="mb-2 font-sans text-sm font-bold uppercase tracking-wide text-acero">
              Equipo
            </h3>
            <p>{EQUIPO.join(" · ")}</p>
          </div>
          <div>
            <h3 className="mb-2 font-sans text-sm font-bold uppercase tracking-wide text-acero">
              Coordinación
            </h3>
            <p>{COORDINACION.join(" · ")}</p>
          </div>
          <div>
            <h3 className="mb-2 font-sans text-sm font-bold uppercase tracking-wide text-acero">
              Diseño
            </h3>
            <p>
              Mariano Maresca y Luis Miguel Aguilera{" "}
              <span className="text-acero">(original)</span> · Mesa 1{" "}
              <span className="text-acero">(versión actual)</span>
            </p>
          </div>
          <div>
            <h3 className="mb-2 font-sans text-sm font-bold uppercase tracking-wide text-acero">
              Desarrollo
            </h3>
            <p>
              <DesarrolloCredit />
            </p>
          </div>
        </div>

        {/* Colaboradores y agradecimientos */}
        <div className="mt-10 border-t border-acero-light/40 pt-6">
          <h3 className="mb-2 font-sans text-sm font-bold uppercase tracking-wide text-acero">
            Colaboradores
          </h3>
          <p className="font-editorial text-sm leading-relaxed text-tinta/60">
            {COLABORADORES.map((name, i) => (
              <span key={name}>
                <Link
                  href={`/autor/${resolveAuthorSlug(slugifyName(name))}`}
                  className="transition-colors hover:text-coral"
                >
                  {name}
                </Link>
                {i < COLABORADORES.length - 1 && (
                  <span className="font-bold text-coral"> • </span>
                )}
              </span>
            ))}
          </p>
        </div>
        <div className="mt-8">
          <h3 className="mb-2 font-sans text-sm font-bold uppercase tracking-wide text-acero">
            Agradecimientos
          </h3>
          <p className="font-editorial text-sm leading-relaxed text-tinta/60">
            {AGRADECIMIENTOS.join(" • ")}
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="curtain-velvet rounded-sm p-10 text-center">
        <h2 className="mb-3 text-2xl font-bold text-white">
          <span className="text-coral">[</span>Únete a Olvidos
        </h2>
        <p className="mx-auto mb-6 max-w-xl font-editorial text-white/80">
          Forma parte de la asociación y ayuda a mantener viva la cultura de
          Granada.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/hazte-socio"
            className="inline-block rounded-sm bg-coral px-8 py-3 font-bold text-white transition-colors hover:bg-coral-dark"
          >
            Hazte socio
          </Link>
          <Link
            href="/actividades"
            className="inline-block rounded-sm border border-white/50 px-8 py-3 font-bold text-white transition-colors hover:bg-white hover:text-teatro"
          >
            Ver encuentros
          </Link>
        </div>
      </section>
    </div>
  );
}
