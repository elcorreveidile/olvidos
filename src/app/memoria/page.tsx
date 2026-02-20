import { getPublishedArticles } from "@/lib/actions/articles";
import Link from "next/link";
import Image from "next/image";
import { Clock, BookMarked } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function MemoriaPage() {
  const result = await getPublishedArticles();

  const articles = result.success && result.articles ? result.articles : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-azul to-azul/80 text-white py-16 mt-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <BookMarked className="w-12 h-12" />
            <h1 className="text-5xl font-black">Memoria Histórica</h1>
          </div>
          <p className="text-xl opacity-90 max-w-3xl">
            Un viaje a través del tiempo recuperando las historias, tradiciones y
            olvidos de Granada
          </p>
        </div>
      </div>

      {/* Intro Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-sm shadow-card p-8 mb-12">
          <h2 className="text-3xl font-bold text-azul mb-6">Nuestra Memoria</h2>
          <div className="prose prose-lg max-w-none text-acero">
            <p>
              En esta sección, recopilamos artículos, documentos y testimonios que
              narran la historia viva de Granada. Cada pieza es un fragmento de
              memoria que merece ser preservado y compartido con las generaciones
              futuras.
            </p>
            <p>
              Desde las calles del Albaicín hasta los recuerdos de nuestros mayores,
              cada historia cuenta. Cada documento es una ventana al pasado que nos
              ayuda a entender nuestro presente y construir nuestro futuro.
            </p>
          </div>
        </div>

        {/* Articles by Category */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-azul mb-6 flex items-center gap-3">
            <Clock className="w-8 h-8 text-coral" />
            Artículos Históricos
          </h2>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-sm shadow-card">
            <BookMarked className="w-16 h-16 text-acero-light mx-auto mb-4" />
            <p className="text-acero text-lg">
              No hay artículos publicados en la memoria histórica aún.
            </p>
            <p className="text-acero-light mt-2">
              Pronto añadiremos contenido histórico a esta sección.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <article
                key={article.id}
                className="bg-white rounded-sm shadow-card hover:shadow-card-hover transition-all"
              >
                {/* Article Image */}
                {article.coverImage && (
                  <Link href={`/articulos/${article.slug}`}>
                    <div className="relative h-48 overflow-hidden rounded-t-sm">
                      <Image
                        src={article.coverImage}
                        alt={article.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 right-4 bg-coral text-white px-3 py-1 text-xs font-bold rounded-sm">
                        Memoria
                      </div>
                    </div>
                  </Link>
                )}

                {/* Article Content */}
                <div className="p-6">
                  {/* Categories */}
                  {article.categories && article.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {article.categories.map((category: any) => (
                        <Link
                          key={category.id}
                          href={`/categoria/${category.slug}`}
                          className="text-xs font-bold text-coral hover:text-coral/80"
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Title */}
                  <Link href={`/articulos/${article.slug}`}>
                    <h3 className="text-xl font-bold text-azul mb-3 hover:text-coral transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                  </Link>

                  {/* Excerpt */}
                  <p className="text-acero mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>

                  {/* Read More */}
                  <Link
                    href={`/articulos/${article.slug}`}
                    className="inline-flex items-center text-coral font-bold hover:text-coral/90 transition-colors"
                  >
                    Leer más →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Quote Section */}
        <div className="mt-16 bg-gradient-to-r from-coral to-coral/90 rounded-sm shadow-card p-8 text-white">
          <blockquote className="text-2xl font-bold text-center max-w-4xl mx-auto">
            &ldquo;Un pueblo que no conoce su historia está condenado a repetirla.
            La memoria es nuestra defensa contra el olvido.&rdquo;
          </blockquote>
        </div>
      </div>
    </div>
  );
}
