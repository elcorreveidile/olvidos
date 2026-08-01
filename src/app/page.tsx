import Link from "next/link";
import {
  getFeaturedArticles,
  getUpcomingEvents,
} from "@/lib/queries";
import type { ArticleSummary } from "@/types/content";
import { Hero } from "@/components/home/Hero";

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
  // Fetch real data from database
  const [articlesData, eventsData] = await Promise.all([
    getFeaturedArticles(),
    getUpcomingEvents(2),
  ]);

  const articles = articlesData;
  const events = eventsData as EventType[];

  // Fallback to latest articles if no featured articles
  const displayArticles =
    articles.length > 0
      ? articles
      : [];

  return (
    <div className="max-w-content mx-auto px-4 py-12">
      {/* Hero */}
      <Hero />

      {/* Artículos destacados */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-azul">
            <span className="text-coral">[</span>Últimos artículos
          </h2>
          <Link
            href="/articulos"
            className="text-sm font-bold text-coral hover:text-azul transition-colors"
          >
            Ver todos →
          </Link>
        </div>

        {displayArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayArticles.map((article) => (
              <Link
                key={article.id}
                href={`/articulos/${article.slug}`}
                className="article-card rounded-sm overflow-hidden block"
              >
                {article.coverImage ? (
                  <div
                    className="aspect-[16/10] bg-gray-100 bg-cover bg-center"
                    style={{ backgroundImage: `url(${article.coverImage})` }}
                  />
                ) : (
                  <div className="aspect-[16/10] bg-gray-100" />
                )}
                <div className="p-6">
                  {article.categories.length > 0 && (
                    <span className="text-xs font-bold text-coral category-bracket">
                      {article.categories[0].category.name}
                    </span>
                  )}
                  <h3 className="article-card-title mt-2 text-lg font-bold text-azul leading-tight">
                    {article.title}
                  </h3>
                  {article.excerpt && (
                    <p className="article-card-excerpt mt-2 text-sm text-acero leading-relaxed line-clamp-3">
                      {article.excerpt}
                    </p>
                  )}
                  {article.publishedAt && (
                    <p className="article-card-meta mt-4 text-xs text-acero-light">
                      {formatDate(new Date(article.publishedAt))}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-sm">
            <p className="text-acero font-editorial">
              Aún no hay artículos publicados. ¡Muy pronto habrá contenido nuevo!
            </p>
          </div>
        )}
      </section>

      {/* Próximos eventos */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-azul">
            <span className="text-coral">[</span>Próximos encuentros
          </h2>
          <Link
            href="/actividades"
            className="text-sm font-bold text-coral hover:text-azul transition-colors"
          >
            Ver todos →
          </Link>
        </div>

        {events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  className="shadow-card rounded-sm p-6 hover:shadow-card-hover transition-shadow block"
                >
                  <div className="flex gap-4">
                    <div className="text-center min-w-[60px]">
                      <span className="block text-2xl font-black text-coral">
                        {day}
                      </span>
                      <span className="block text-xs font-bold text-acero uppercase">
                        {month}
                      </span>
                    </div>
                    <div className="flex-1">
                      <span className="text-xs font-bold text-coral tag-paren">
                        {getEventTypeLabel(event.eventType)}
                      </span>
                      <h3 className="mt-1 text-lg font-bold text-azul">
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
          <div className="text-center py-12 bg-gray-50 rounded-sm">
            <p className="text-acero font-editorial">
              No hay próximos eventos programados. ¡Estamos organizando nuevas
              actividades!
            </p>
          </div>
        )}
      </section>

      {/* CTA Hazte socio */}
      <section className="bg-azul rounded-sm p-12 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          <span className="text-coral">[</span>Hazte socio
        </h2>
        <p className="text-acero-light max-w-lg mx-auto mb-8 font-editorial">
          Apoya la cultura de Granada. Disfruta de contenido exclusivo,
          invitaciones a eventos, carnet digital y mucho más.
        </p>
        <Link
          href="/hazte-socio"
          className="inline-block px-8 py-3 bg-coral text-white font-bold rounded-sm hover:bg-coral-dark transition-colors"
        >
          Únete a Olvidos
        </Link>
      </section>
    </div>
  );
}
