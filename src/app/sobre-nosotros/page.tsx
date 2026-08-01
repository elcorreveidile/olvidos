import Link from "next/link";
import { Heart, BookOpen, Users, Calendar } from "lucide-react";

export default function SobreNosotrosPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-azul text-white py-16 mt-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-black mb-4">Sobre Nosotros</h1>
          <p className="text-xl opacity-90">
            Conoce la historia y misión de Olvidos de Granada
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Mission Section */}
        <div className="bg-white rounded-sm shadow-card p-8 mb-8">
          <h2 className="text-3xl font-bold text-azul mb-6">Nuestra Misión</h2>
          <div className="prose prose-lg max-w-none text-acero">
            <p>
              Olvidos de Granada es una asociación cultural dedicada a recuperar,
              preservar y difundir el patrimonio histórico y literario de Granada.
            </p>
            <p>
              A través de nuestras publicaciones, eventos y actividades, mantenemos
              vivo el legado cultural de nuestra ciudad para las generaciones presentes
              y futuras.
            </p>
            <blockquote className="border-l-4 border-coral pl-4 italic">
              &ldquo;La cultura es la memoria de un pueblo, y sin ella, los pueblos pierden su identidad.&rdquo;
            </blockquote>
          </div>
        </div>

        {/* What We Do */}
        <div className="bg-white rounded-sm shadow-card p-8 mb-8">
          <h2 className="text-3xl font-bold text-azul mb-6">Lo Que Hacemos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-coral/10 rounded-sm flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-coral" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-azul mb-2">Revista Cultural</h3>
                <p className="text-acero">
                  Publicamos artículos, ensayos y creaciones literarias que exploran
                  la historia, cultura y tradiciones de Granada.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-coral/10 rounded-sm flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-coral" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-azul mb-2">Eventos Culturales</h3>
                <p className="text-acero">
                  Organizamos presentaciones de libros, recitales, conferencias y
                  actividades que celebran nuestra cultura.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-coral/10 rounded-sm flex items-center justify-center">
                  <Users className="w-6 h-6 text-coral" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-azul mb-2">Comunidad</h3>
                <p className="text-acero">
                  Creamos una comunidad de amantes de la cultura que comparten
                  pasión por el patrimonio granadino.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-coral/10 rounded-sm flex items-center justify-center">
                  <Heart className="w-6 h-6 text-coral" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-azul mb-2">Patrimonio</h3>
                <p className="text-acero">
                  Trabajamos activamente en la recuperación y preservación de
                  documentos, historias y memorias de Granada.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-azul to-azul/90 rounded-sm shadow-card p-8 text-white">
          <h2 className="text-3xl font-bold mb-4">Únete a Nosotros</h2>
          <p className="text-lg mb-6 opacity-90">
            Forma parte de nuestra comunidad y ayuda a mantener viva la cultura de Granada.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/hazte-socio"
              className="inline-flex items-center px-6 py-3 bg-coral text-white font-bold rounded-sm hover:bg-coral/90 transition-colors"
            >
              Hazte Socio
            </Link>
            <Link
              href="/actividades"
              className="inline-flex items-center px-6 py-3 bg-white/20 text-white font-bold rounded-sm hover:bg-white/30 transition-colors"
            >
              Ver Actividades
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
