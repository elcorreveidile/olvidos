import { Mail, MapPin, Instagram, Facebook } from "lucide-react";
import Link from "next/link";

export default function ContactoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-azul text-white py-16 mt-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-black mb-4">Contacto</h1>
          <p className="text-xl opacity-90">
            ¿Tienes alguna pregunta? ¿Quieres colaborar con nosotros? Escríbenos
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Información de contacto */}
          <div>
            <h2 className="text-2xl font-bold text-azul mb-6">
              Ponte en contacto
            </h2>
            <p className="text-acero mb-8">
              Estaremos encantados de escuchar tus sugerencias, comentarios o
              propuestas de colaboración.
            </p>

            <div className="space-y-6">
              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-coral/10 rounded-sm flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-coral" />
                </div>
                <div>
                  <h3 className="font-bold text-azul mb-1">Email</h3>
                  <a
                    href="mailto:info@olvidosdegranada.es"
                    className="text-acero hover:text-coral transition-colors"
                  >
                    info@olvidosdegranada.es
                  </a>
                </div>
              </div>

              {/* Dirección */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-coral/10 rounded-sm flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-coral" />
                </div>
                <div>
                  <h3 className="font-bold text-azul mb-1">Sede</h3>
                  <p className="text-acero">
                    Granada, España
                  </p>
                </div>
              </div>

              {/* Redes Sociales */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-coral/10 rounded-sm flex items-center justify-center flex-shrink-0">
                  <Instagram className="w-6 h-6 text-coral" />
                </div>
                <div>
                  <h3 className="font-bold text-azul mb-1">Instagram</h3>
                  <a
                    href="https://instagram.com/olvidosdegranada"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-acero hover:text-coral transition-colors"
                  >
                    @olvidosdegranada
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-coral/10 rounded-sm flex items-center justify-center flex-shrink-0">
                  <Facebook className="w-6 h-6 text-coral" />
                </div>
                <div>
                  <h3 className="font-bold text-azul mb-1">Facebook</h3>
                  <a
                    href="https://facebook.com/olvidosdegranada"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-acero hover:text-coral transition-colors"
                  >
                    Olvidos de Granada
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Formulario de contacto */}
          <div className="bg-white rounded-sm shadow-card p-8">
            <h2 className="text-2xl font-bold text-azul mb-6">
              Envíanos un mensaje
            </h2>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-acero mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-coral focus:border-transparent"
                  placeholder="Tu nombre"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-acero mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-coral focus:border-transparent"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-acero mb-2">
                  Asunto *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-coral focus:border-transparent"
                  placeholder="Asunto de tu mensaje"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-acero mb-2">
                  Mensaje *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-coral focus:border-transparent resize-none"
                  placeholder="Escribe tu mensaje aquí..."
                />
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-coral text-white font-bold rounded-sm hover:bg-coral-dark transition-colors"
              >
                Enviar Mensaje
              </button>
            </form>

            <p className="text-sm text-acero-light mt-4 text-center">
              * Campos obligatorios
            </p>
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-16 bg-azul/10 rounded-sm p-8">
          <h3 className="text-xl font-bold text-azul mb-4 text-center">
            ¿Quieres hacerte socio?
          </h3>
          <p className="text-acero text-center mb-6 max-w-2xl mx-auto">
            Únete a nuestra comunidad y apoya la cultura y literatura de Granada.
            Como socio, recibirás nuestra revista, acceso a eventos exclusivos y
            mucho más.
          </p>
          <div className="text-center">
            <Link
              href="/hazte-socio"
              className="inline-block px-8 py-3 bg-coral text-white font-bold rounded-sm hover:bg-coral-dark transition-colors"
            >
              Hazte Socio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
