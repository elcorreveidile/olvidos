import Link from "next/link";
import type { Metadata } from "next";
import { getPublicSiteFlags } from "@/lib/actions/site-config";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { CategoryHeading } from "@/components/content/CategoryHeading";

export const metadata: Metadata = {
  title: "Hazte socio",
  description:
    "Hazte socio de la Asociación Cultural Olvidos de Granada: apoya la memoria cultural granadina, recibe la revista y accede a los encuentros.",
};

const BENEFICIOS = [
  {
    t: "La revista",
    d: "La edición del curso en digital para todos; en papel para socios Mecenas e Institucionales cuando salga el número impreso.",
  },
  {
    t: "Encuentros",
    d: "Te invitamos a las presentaciones, recitales y encuentros, con asiento reservado para socios.",
  },
  {
    t: "Voz y voto",
    d: "Participa en la Asamblea General con voz y voto, y en la vida de la asociación.",
  },
  {
    t: "Comunidad",
    d: "Forma parte de una comunidad viva de amantes de la cultura granadina.",
  },
  {
    t: "Carné digital",
    d: "Tu carné de socio con QR, siempre en el móvil.",
  },
  {
    t: "Apoya la memoria",
    d: "Tu cuota hace posible el libro de Mariano, la vuelta de la revista al papel y el mantenimiento de esta web.",
  },
];

const PLANES = [
  {
    nombre: "Estándar",
    precio: "50€",
    destacado: false,
    nota: "Socio individual",
    beneficios: [
      "Carné digital de socio con QR",
      "Voz y voto en la Asamblea",
      "Invitación a los encuentros, con asiento reservado",
      "La edición del año de la revista, en digital",
      "El libro y la revista impresa a precio de socio",
    ],
  },
  {
    nombre: "Mecenas",
    precio: "120€",
    destacado: true,
    nota: "Individual · mayor apoyo",
    beneficios: [
      "Todo lo del plan Estándar",
      "La revista impresa del año, en tu casa",
      "Ejemplar del libro de las editoriales de Mariano",
      "Tu nombre en los créditos de la revista impresa",
      "Mención como Mecenas en la web",
    ],
  },
  {
    nombre: "Institucional",
    precio: "250€",
    destacado: false,
    nota: "Entidades, bibliotecas y empresas",
    beneficios: [
      "Membresía a nombre de la entidad",
      "5 ejemplares de cada edición impresa (revista y libro)",
      "Logotipo destacado en la web",
      "Factura y convenio de colaboración",
      "Voz y voto en la Asamblea, mediante un representante",
    ],
  },
];

const FAQ = [
  {
    q: "¿Qué es la Asociación Cultural Olvidos de Granada?",
    a: "Una entidad sin ánimo de lucro que edita la revista Olvidos de Granada (ISSN 2605-4515) y mantiene vivo el legado de Mariano Maresca: conserva el archivo impreso, publica nuevos textos, organiza encuentros y trabaja para devolver la revista al papel.",
  },
  {
    q: "¿Qué hace la asociación con mi cuota?",
    a: "Hace posibles los proyectos de esta etapa: el libro con las editoriales que Mariano Maresca escribió para Imaginarias, la vuelta de la revista al papel (una edición impresa por curso) y la organización de encuentros. También cubre el mantenimiento de esta web, donde viven el archivo y los nuevos textos. Cada cuota es un apoyo directo a la memoria cultural granadina.",
  },
  {
    q: "¿Los socios participan en la Asamblea?",
    a: "Sí. Como socio de número tienes voz y voto en la Asamblea General y puedes ser elector y elegible para la Junta Directiva (Estatutos, art. 34). Las entidades socias participan a través de un representante. El derecho de voto requiere estar al corriente de la cuota.",
  },
  {
    q: "¿Cómo puedo hacerme socio?",
    a: "Desde esta página, eligiendo un plan. El proceso es rápido y seguro, y tendrás tu carné digital en tu área de socio en cuanto se confirme el pago.",
  },
  {
    q: "¿La cuota es anual?",
    a: "Sí, la cuota es anual. Te avisaremos antes de cada renovación y podrás cambiar de plan o darte de baja cuando quieras.",
  },
  {
    q: "¿Voy a recibir una revista impresa?",
    a: "Estamos preparando la etapa impresa. Cada curso editaremos una revista en papel que recopila todo lo publicado en la web —la primera, con el curso 2026-2027, prevista para diciembre de 2027— y un libro con las editoriales que Mariano Maresca escribió para el programa Imaginarias de Canal Sur. Todos los socios reciben la edición digital; los socios Mecenas e Institucionales la reciben también impresa en casa.",
  },
  {
    q: "¿Hace falta vivir en Granada?",
    a: "No. Puedes hacerte socio desde cualquier lugar: la edición digital de la revista te llega estés donde estés, y la impresa (Mecenas e Institucional) va por correo. Los encuentros se celebran sobre todo en Granada.",
  },
  {
    q: "¿Qué métodos de pago aceptáis?",
    a: "Tarjetas de crédito y débito (Visa, Mastercard, American Express) a través de la plataforma segura Stripe.",
  },
  {
    q: "¿Puedo colaborar de otra forma?",
    a: "Sí. Además de las cuotas, aceptamos donaciones y colaboraciones. Escríbenos a olvidosdegranada@gmail.com y lo vemos.",
  },
  {
    q: "¿Puedo darme de baja cuando quiera?",
    a: "Sí, cuando quieras, sin permanencia ni penalizaciones. Escríbenos a olvidosdegranada@gmail.com y lo tramitamos. Tus datos están protegidos según el RGPD.",
  },
];

export default async function HazteSocioPage() {
  // Solo redirigimos al área de socios a quien REALMENTE tiene ficha de socio
  // (no por rol): así evitamos un bucle /hazte-socio ↔ /mi-cuenta para admins o
  // sesiones sin Member (que /mi-cuenta reenvía aquí al no encontrar socio).
  const userId = (await auth())?.user?.id;

  if (userId) {
    const member = await db.member.findUnique({
      where: { userId },
      select: { id: true },
    });
    if (member) {
      redirect("/mi-cuenta");
    }
  }

  const { allowRegistrations } = await getPublicSiteFlags();

  return (
    <div className="max-w-content mx-auto px-4 py-12">
      {/* Cabecera editorial */}
      <header className="mb-12 border-b-2 border-tinta pb-8 text-center">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-coral">
          La asociación
        </p>
        <CategoryHeading>hazte socio</CategoryHeading>
        <p className="mx-auto mt-6 max-w-2xl font-editorial text-lg leading-snug text-tinta/70">
          Únete a la Asociación Cultural Olvidos de Granada y ayuda a preservar y
          difundir la memoria cultural de la ciudad.
        </p>
      </header>

      {/* Qué es Olvidos */}
      <section className="mb-16 max-w-article">
        <h2 className="mb-4 text-2xl font-black text-tinta">
          <span className="text-coral">[</span>Qué es Olvidos
        </h2>
        <div className="prose-editorial">
          <p>
            <em>Olvidos de Granada</em> nació en 1982 de la mano de Mariano
            Maresca (1945–2023) —profesor de Filosofía del Derecho, agitador
            cultural y maestro de varias generaciones de escritores— con la
            vocación de ser «el archivo vivo de la creación artística y cultural
            granadina». Entre 1984 y 1987, a través de entrevistas, ensayos,
            crónicas y fotografías, documentó a los escritores, artistas,
            músicos y pensadores que de otro modo habrían quedado en el olvido.
          </p>
          <p>
            Por sus páginas y sus encuentros pasaron nombres como Antonio Muñoz
            Molina, Luis García Montero o Javier Egea. En 2011 la revista revivió
            en formato digital como repositorio de aquellos números, y hoy la{" "}
            <strong>Asociación Cultural Olvidos de Granada</strong> mantiene vivo
            ese legado: recupera el archivo impreso, publica nuevos textos y
            organiza encuentros culturales.
          </p>
          <p>
            Como decía Mariano, «el trabajo de la memoria es esencial, casi
            nuestra única arma». Hacerte socio es sumarte a esa tarea. Puedes
            leer más sobre él en{" "}
            <a
              href="https://www.marianomaresca.com/biografia"
              target="_blank"
              rel="noopener noreferrer"
            >
              marianomaresca.com
            </a>
            .
          </p>
        </div>
      </section>

      {/* Beneficios */}
      <section className="mb-16">
        <h2 className="mb-8 text-2xl font-black text-tinta">
          <span className="text-coral">[</span>Qué te llevas como socio
        </h2>
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-sm bg-acero-light/40 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFICIOS.map(({ t, d }) => (
            <div key={t} className="bg-white p-6">
              <h3 className="mb-1 text-lg font-bold text-tinta">
                <span className="text-coral">[</span>
                {t}
              </h3>
              <p className="font-editorial text-tinta/70">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Objetivos / hoja de ruta (teaser público) */}
      <section className="mb-16">
        <div className="rounded-sm bg-tinta p-8 text-white md:p-10">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-coral-light">
            Hoja de ruta
          </p>
          <h2 className="mb-6 text-2xl font-black md:text-3xl">
            Lo que estamos construyendo con tu cuota
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <h3 className="mb-1 font-bold text-coral-light">
                El libro de Mariano
              </h3>
              <p className="font-editorial leading-snug text-white/80">
                Una edición que reúne las editoriales que Mariano Maresca
                escribió para <em>Imaginarias</em>, el programa cultural de Canal
                Sur.
              </p>
            </div>
            <div>
              <h3 className="mb-1 font-bold text-coral-light">
                La revista impresa, cada curso
              </h3>
              <p className="font-editorial leading-snug text-white/80">
                Recuperamos el papel: cada curso, un número impreso que recopila
                todo lo publicado en la web. El primero, con el curso 2026-2027,
                previsto para diciembre de 2027.
              </p>
            </div>
            <div>
              <h3 className="mb-1 font-bold text-coral-light">
                El archivo, en la web
              </h3>
              <p className="font-editorial leading-snug text-white/80">
                Pasamos cada número del archivo, hoy en PDF, a formato web para
                que se lea mejor, se pueda buscar y quede bien indexado.
              </p>
            </div>
          </div>
          <p className="mt-6 text-sm font-editorial text-white/70">
            Hacerte socio es sumarte a esta etapa desde el principio.
          </p>
        </div>
      </section>

      {/* Planes */}
      <section className="mb-16">
        <h2 className="mb-8 text-2xl font-black text-tinta">
          <span className="text-coral">[</span>Elige tu cuota
        </h2>

        {!allowRegistrations && (
          <div className="mb-6 rounded-sm border border-amber-200 bg-amber-50 p-4 text-center text-sm text-amber-800">
            Las nuevas inscripciones están temporalmente desactivadas. Escríbenos a{" "}
            <strong>olvidosdegranada@gmail.com</strong> para más información.
          </div>
        )}

        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
          {PLANES.map((plan) => (
            <div
              key={plan.nombre}
              className={`flex flex-col overflow-hidden rounded-sm shadow-card ${
                plan.destacado ? "ring-2 ring-coral" : ""
              }`}
            >
              <div
                className={`relative p-6 text-center text-white ${
                  plan.destacado ? "curtain-stage" : "curtain-velvet"
                }`}
              >
                {plan.destacado && (
                  <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-sm bg-white/95 px-2 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-teatro shadow-sm">
                    ★ En escena
                  </span>
                )}
                <h3
                  className={`mb-2 text-2xl font-bold ${
                    plan.destacado
                      ? "[text-shadow:0_2px_12px_rgba(0,0,0,0.45)]"
                      : ""
                  }`}
                >
                  {plan.nombre}
                </h3>
                <div
                  className={`text-4xl font-black ${
                    plan.destacado
                      ? "[text-shadow:0_2px_18px_rgba(255,205,130,0.55)]"
                      : ""
                  }`}
                >
                  {plan.precio}
                </div>
                <p className="text-sm opacity-90">/año</p>
                {plan.nota && (
                  <p className="mt-2 text-xs leading-snug opacity-90">
                    {plan.nota}
                  </p>
                )}
              </div>
              <div className="flex flex-1 flex-col p-6">
                <ul className="mb-6 flex-1 space-y-3">
                  {plan.beneficios.map((b) => (
                    <li key={b} className="flex items-start gap-2">
                      <span className="mt-0.5 font-bold text-coral">·</span>
                      <span className="text-tinta/80">{b}</span>
                    </li>
                  ))}
                </ul>
                {allowRegistrations ? (
                  <Link
                    href="/registro-socio"
                    className="block w-full rounded-sm bg-coral px-6 py-3 text-center font-bold text-white transition-colors hover:bg-coral-dark"
                  >
                    Hacerme socio
                  </Link>
                ) : (
                  <span className="block w-full cursor-not-allowed rounded-sm bg-gray-200 px-6 py-3 text-center font-bold text-gray-500">
                    Inscripciones cerradas
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section>
        <h2 className="mb-6 text-2xl font-black text-tinta">
          <span className="text-coral">[</span>Preguntas frecuentes
        </h2>
        <div className="max-w-3xl space-y-3">
          {FAQ.map((item) => (
            <details
              key={item.q}
              className="rounded-sm border border-acero-light/50 p-6"
            >
              <summary className="cursor-pointer font-bold text-tinta">
                {item.q}
              </summary>
              <p className="mt-4 font-editorial text-tinta/70">{item.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
