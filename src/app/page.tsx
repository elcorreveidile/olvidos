import Link from "next/link";
import Image from "next/image";
import {
  getPublishedArticles,
  getUpcomingEvents,
  getAllIssues,
} from "@/lib/queries";
import { Hero } from "@/components/home/Hero";
import { MagazineIssue } from "@/components/content/MagazineIssue";
import { ArticleCard } from "@/components/content/ArticleCard";

type EventType = {
  id: string;
  title: string;
  slug: string;
  shortDesc: string | null;
  location: string | null;
  address: string | null;
  startDate: Date;
  endDate: Date | null;
  eventType: string;
};

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getEventTypeLabel(eventType: string): string {
  const labels: Record<string, string> = {
    BOOK_PRESENTATION: "Presentación",
    RECITAL: "Recital",
    CONFERENCE: "Conferencia",
    WORKSHOP: "Taller",
    EXHIBITION: "Exposición",
    SCREENING: "Proyección",
    CONCERT: "Concierto",
    MEETING: "Encuentro",
    OTHER: "Evento",
  };
  return labels[eventType] || "Evento";
}

export default async function HomePage() {
  const [articlesData, eventsData, issues] = await Promise.all([
    getPublishedArticles(1, 3),
    getUpcomingEvents(2),
    getAllIssues(),
  ]);

  const articles = articlesData.articles;
  const events = eventsData as EventType[];

  // Destacamos en portada los números de la época en color (9–17), los más vistosos.
  const destacados = [...issues]
    .filter((i) => i.number >= 1 && i.number < 100)
    .sort((a, b) => b.number - a.number)
    .slice(0, 6);

  return (
    <div className="max-w-content mx-auto px-4 py-12">
      <Hero />

      {/* Del archivo */}
      {destacados.length > 0 && (
        <section className="mb-16">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-coral">
                1981 · La revista impresa
              </p>
              <h2 className="text-2xl font-black text-tinta">
                <span className="text-coral">[</span>Del archivo
              </h2>
            </div>
            <Link
              href="/revista"
              className="text-sm font-bold text-coral transition-colors hover:text-tinta"
            >
              Ver la hemeroteca →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
            {destacados.map((issue) => (
              <MagazineIssue
                key={issue.id}
                number={issue.number}
                title={issue.title}
                slug={issue.slug}
                coverImage={issue.coverImage}
                articleCount={issue._count?.articles}
              />
            ))}
          </div>
        </section>
      )}

      {/* Últimos artículos */}
      <section className="mb-16">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-black text-tinta">
            <span className="text-coral">[</span>Últimos artículos
          </h2>
          <Link
            href="/articulos"
            className="text-sm font-bold text-coral transition-colors hover:text-tinta"
          >
            Ver todos →
          </Link>
        </div>

        {articles.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard
                key={article.id}
                title={article.title}
                slug={article.slug}
                excerpt={article.excerpt}
                coverImage={article.coverImage}
                coverPosition={article.coverPosition}
                publishedAt={article.publishedAt}
                categories={article.categories.map((c) => c.category)}
                author={article.author}
                authors={article.authors}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-sm border border-acero-light/40 bg-gray-50 py-12 text-center">
            <p className="font-editorial text-acero">
              Muy pronto, nuevos artículos de la época digital. Mientras tanto,
              explora el{" "}
              <Link href="/revista" className="font-bold text-coral hover:text-tinta">
                archivo impreso
              </Link>
              .
            </p>
          </div>
        )}
      </section>

      {/* Próximos encuentros */}
      <section className="mb-16">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-black text-tinta">
            <span className="text-coral">[</span>Próximos encuentros
          </h2>
          <Link
            href="/actividades"
            className="text-sm font-bold text-coral transition-colors hover:text-tinta"
          >
            Ver todos →
          </Link>
        </div>

        {events.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {events.map((event) => {
              const eventDate = new Date(event.startDate);
              const day = eventDate.getDate();
              const month = new Intl.DateTimeFormat("es-ES", {
                month: "short",
              }).format(eventDate);

              return (
                <Link
                  key={event.id}
                  href={`/actividades/${event.slug}`}
                  className="block rounded-sm p-6 shadow-card transition-shadow hover:shadow-card-hover"
                >
                  <div className="flex gap-4">
                    <div className="min-w-[60px] text-center">
                      <span className="block text-2xl font-black text-coral">
                        {day}
                      </span>
                      <span className="block text-xs font-bold uppercase text-acero">
                        {month}
                      </span>
                    </div>
                    <div className="flex-1">
                      <span className="tag-paren text-xs font-bold text-coral">
                        {getEventTypeLabel(event.eventType)}
                      </span>
                      <h3 className="mt-1 text-lg font-bold text-tinta">
                        {event.title}
                      </h3>
                      {event.location && (
                        <p className="mt-1 text-sm text-acero">
                          {event.location}
                          {event.address && `, ${event.address}`}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="rounded-sm border border-acero-light/40 bg-gray-50 py-12 text-center">
            <p className="font-editorial text-acero">
              No hay próximos encuentros programados. ¡Estamos organizando nuevas
              actividades!
            </p>
          </div>
        )}
      </section>

      {/* Apoyo a Granada 2031 */}
      <Link
        href="/granada-2031"
        className="group mb-16 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 rounded-sm border border-acero-light/40 bg-gray-50 px-6 py-4 text-center transition-colors hover:border-coral/50"
      >
        <Image
          src="/granada-2031/simbolo.png"
          alt=""
          aria-hidden
          width={14}
          height={32}
          className="h-6 w-auto"
        />
        <span className="text-sm text-tinta/70">Apoyamos la candidatura de</span>
        <strong className="text-sm font-bold text-tinta">
          Granada, Capital Europea de la Cultura 2031
        </strong>
        <span className="text-sm font-semibold text-coral transition-transform group-hover:translate-x-0.5">
          Por qué nos sumamos →
        </span>
      </Link>

      {/* CTA Hazte socio */}
      <section className="curtain-velvet rounded-sm p-12 text-center">
        <h2 className="mb-4 text-3xl font-bold text-white">
          <span className="text-coral">[</span>Hazte socio
        </h2>
        <p className="mx-auto mb-8 max-w-lg font-editorial text-white/80">
          Carné digital, voz y voto en la asociación, la edición del año e
          invitación a los encuentros. Y tu apoyo a la vuelta de la revista al
          papel.
        </p>
        <Link
          href="/hazte-socio"
          className="inline-block rounded-sm bg-coral px-8 py-3 font-bold text-white transition-colors hover:bg-coral-dark"
        >
          Únete a Olvidos
        </Link>
      </section>
    </div>
  );
}
