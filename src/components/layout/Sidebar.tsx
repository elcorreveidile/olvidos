import Link from "next/link";

interface SidebarProps {
  categories?: Array<{ name: string; slug: string; count?: number }>;
  recentArticles?: Array<{ title: string; slug: string; publishedAt: string }>;
}

export function Sidebar({ categories = [], recentArticles = [] }: SidebarProps) {
  return (
    <aside className="space-y-8">
      {/* Buscador */}
      <div>
        <form action="/buscar" method="get">
          <input
            type="search"
            name="q"
            placeholder="Buscar..."
            className="w-full px-4 py-2 border border-acero-light rounded-sm text-sm focus:outline-none focus:border-coral"
          />
        </form>
      </div>

      {/* Categorías */}
      {categories.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-azul mb-4 uppercase tracking-wide">
            Secciones
          </h3>
          <ul className="space-y-2">
            {categories.map((cat) => (
              <li key={cat.slug}>
                <Link
                  href={`/articulos?categoria=${cat.slug}`}
                  className="flex items-center justify-between text-sm text-acero hover:text-coral transition-colors group"
                >
                  <span className="category-bracket">{cat.name}</span>
                  {cat.count !== undefined && (
                    <span className="text-xs text-acero-light group-hover:text-coral">
                      ({cat.count})
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Artículos recientes */}
      {recentArticles.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-azul mb-4 uppercase tracking-wide">
            Recientes
          </h3>
          <ul className="space-y-3">
            {recentArticles.map((article) => (
              <li key={article.slug}>
                <Link
                  href={`/articulos/${article.slug}`}
                  className="block text-sm text-acero hover:text-coral transition-colors leading-snug"
                >
                  {article.title}
                </Link>
                <span className="text-xs text-acero-light">
                  {new Intl.DateTimeFormat("es-ES", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  }).format(new Date(article.publishedAt))}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* CTA Hazte socio */}
      <div className="bg-azul rounded-sm p-6 text-center">
        <h3 className="text-white font-bold text-sm mb-2">Hazte socio</h3>
        <p className="text-acero-light text-xs mb-4 leading-relaxed">
          Apoya la cultura y disfruta de contenido exclusivo, eventos y más.
        </p>
        <Link
          href="/hazte-socio"
          className="inline-block px-6 py-2 bg-coral text-white text-sm font-bold rounded-sm hover:bg-coral-dark transition-colors"
        >
          Únete
        </Link>
      </div>
    </aside>
  );
}
