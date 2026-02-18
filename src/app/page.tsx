import Link from "next/link";

export default function HomePage() {
  return (
    <div className="max-w-content mx-auto px-4 py-12">
      {/* Hero */}
      <section className="text-center mb-16">
        <h1 className="text-h1-article font-black text-azul mb-4 text-balance">
          <span className="text-coral">[</span>olvidos
        </h1>
        <p className="text-xl text-acero font-editorial max-w-xl mx-auto">
          Revista de acciones culturales
        </p>
      </section>

      {/* Artículos destacados (placeholder) */}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Placeholder cards */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="article-card rounded-sm overflow-hidden">
              <div className="aspect-[16/10] bg-gray-100" />
              <div className="p-6">
                <span className="text-xs font-bold text-coral category-bracket">
                  Sección
                </span>
                <h3 className="article-card-title mt-2 text-lg font-bold text-azul leading-tight">
                  Título del artículo de ejemplo
                </h3>
                <p className="article-card-excerpt mt-2 text-sm text-acero leading-relaxed">
                  Breve extracto del artículo que aparecerá aquí cuando se
                  conecte la base de datos.
                </p>
                <p className="article-card-meta mt-4 text-xs text-acero-light">
                  18 de febrero de 2026
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Próximos eventos (placeholder) */}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="shadow-card rounded-sm p-6 hover:shadow-card-hover transition-shadow">
              <div className="flex gap-4">
                <div className="text-center min-w-[60px]">
                  <span className="block text-2xl font-black text-coral">25</span>
                  <span className="block text-xs font-bold text-acero uppercase">Feb</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-coral tag-paren">
                    Presentación
                  </span>
                  <h3 className="mt-1 text-lg font-bold text-azul">
                    Título del evento de ejemplo
                  </h3>
                  <p className="mt-1 text-sm text-acero">
                    Lugar del evento, Granada
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
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
