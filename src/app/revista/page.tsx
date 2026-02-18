import Link from "next/link";
import { Calendar, BookOpen, Download } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function RevistaPage() {
  // Por ahora, mostramos números de ejemplo
  // En el futuro, esto vendrá de la base de datos con MagazineIssue

  const issues = [
    {
      number: 1,
      title: "Número Inaugural",
      date: "2024-01-01",
      description: "Primer número de la revista Olvidos de Granada",
      cover: null,
      pdf: null,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-azul text-white py-16 mt-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <BookOpen className="w-12 h-12" />
            <h1 className="text-5xl font-black">Números Anteriores</h1>
          </div>
          <p className="text-xl opacity-90 max-w-3xl">
            Explora nuestra colección de revistas digitales. Cada número es un viaje
            a través de la cultura y literatura de Granada.
          </p>
        </div>
      </div>

      {/* Issues Grid */}
      <div className="container mx-auto px-4 py-12">
        {issues.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-sm shadow-card">
            <BookOpen className="w-16 h-16 text-acero-light mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-azul mb-2">
              Próximamente
            </h2>
            <p className="text-acero text-lg mb-6">
              Estamos preparando los primeros números de nuestra revista.
            </p>
            <p className="text-acero-light">
              Mientras tanto, puedes explorar nuestros artículos en la sección de
              {" "}
              <Link href="/articulos" className="text-coral hover:text-coral/80 font-medium">
                Artículos
              </Link>
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {issues.map((issue) => (
              <div
                key={issue.number}
                className="bg-white rounded-sm shadow-card hover:shadow-card-hover transition-all"
              >
                {/* Cover Image */}
                {issue.cover ? (
                  <div className="relative h-64 overflow-hidden rounded-t-sm">
                    <img
                      src={issue.cover}
                      alt={`Nº ${issue.number}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-coral text-white px-3 py-1 text-sm font-bold rounded-sm">
                      Nº {issue.number}
                    </div>
                  </div>
                ) : (
                  <div className="relative h-64 overflow-hidden rounded-t-sm bg-gradient-to-br from-azul to-azul/80 flex items-center justify-center">
                    <div className="text-center text-white">
                      <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-6xl font-black opacity-30">
                        {issue.number}
                      </p>
                    </div>
                    <div className="absolute top-4 right-4 bg-coral text-white px-3 py-1 text-sm font-bold rounded-sm">
                      Nº {issue.number}
                    </div>
                  </div>
                )}

                {/* Issue Info */}
                <div className="p-6">
                  <h2 className="text-xl font-bold text-azul mb-2">
                    {issue.title}
                  </h2>

                  <div className="flex items-center gap-2 text-sm text-acero-light mb-4">
                    <Calendar className="w-4 h-4" />
                    <time>
                      {new Date(issue.date).toLocaleDateString("es-ES", {
                        month: "long",
                        year: "numeric",
                      })}
                    </time>
                  </div>

                  <p className="text-acero mb-6">{issue.description}</p>

                  {/* Actions */}
                  <div className="flex gap-3">
                    {issue.pdf ? (
                      <a
                        href={issue.pdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-coral text-white text-sm font-bold rounded-sm hover:bg-coral-dark transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Descargar PDF
                      </a>
                    ) : (
                      <span className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-acero-light text-acero text-sm font-bold rounded-sm">
                        Próximamente
                      </span>
                    )}
                    <Link
                      href={`/articulos?issue=${issue.number}`}
                      className="inline-flex items-center justify-center px-4 py-2 border border-azul text-azul text-sm font-bold rounded-sm hover:bg-azul hover:text-white transition-colors"
                    >
                      Ver Contenido
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-azul to-azul/90 rounded-sm shadow-card p-8 text-white text-center">
          <BookOpen className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">¿Quieres recibir la revista?</h2>
          <p className="text-lg mb-6 opacity-90 max-w-2xl mx-auto">
            Hazte socio de Olvidos de Granada y recibirás cada nuevo número de la
            revista directamente en tu email.
          </p>
          <Link
            href="/hazte-socio"
            className="inline-flex items-center px-8 py-3 bg-coral text-white font-bold rounded-sm hover:bg-coral/90 transition-colors"
          >
            Hazte Socio
          </Link>
        </div>
      </div>
    </div>
  );
}
