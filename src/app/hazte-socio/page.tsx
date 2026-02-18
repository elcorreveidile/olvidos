import Link from "next/link";
import { Check, Heart, Users, BookOpen, Calendar } from "lucide-react";

export default function HazteSocioPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-azul to-azul/80 text-white py-16 mt-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-black mb-4">Hazte Socio</h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Únete a la comunidad de Olvidos de Granada y ayuda a preservar nuestra
            cultura y literatura
          </p>
        </div>
      </div>

      {/* Beneficios */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-azul mb-4">¿Por qué hacerte socio?</h2>
          <p className="text-acero max-w-2xl mx-auto">
            Tu apoyo nos permite continuar con nuestra misión de recuperar y
            difundir el patrimonio cultural de Granada
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-sm shadow-card p-6">
            <div className="w-12 h-12 bg-coral/10 rounded-sm flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-coral" />
            </div>
            <h3 className="text-xl font-bold text-azul mb-2">Revista Digital</h3>
            <p className="text-acero">
              Recibe nuestra revista en formato digital con artículos, ensayos y
              creaciones literarias exclusivas
            </p>
          </div>

          <div className="bg-white rounded-sm shadow-card p-6">
            <div className="w-12 h-12 bg-coral/10 rounded-sm flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-coral" />
            </div>
            <h3 className="text-xl font-bold text-azul mb-2">Eventos Exclusivos</h3>
            <p className="text-acero">
              Acceso prioritario y descuentos en presentaciones, recitales,
              conferencias y todas nuestras actividades
            </p>
          </div>

          <div className="bg-white rounded-sm shadow-card p-6">
            <div className="w-12 h-12 bg-coral/10 rounded-sm flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-coral" />
            </div>
            <h3 className="text-xl font-bold text-azul mb-2">Comunidad</h3>
            <p className="text-acero">
              Forma parte de una comunidad de amantes de la cultura y la literatura
              de Granada
            </p>
          </div>

          <div className="bg-white rounded-sm shadow-card p-6">
            <div className="w-12 h-12 bg-coral/10 rounded-sm flex items-center justify-center mb-4">
              <Heart className="w-6 h-6 text-coral" />
            </div>
            <h3 className="text-xl font-bold text-azul mb-2">Apoya la Cultura</h3>
            <p className="text-acero">
              Tu cuota directamente apoya nuestras actividades culturales y la
              preservación del patrimonio granadino
            </p>
          </div>

          <div className="bg-white rounded-sm shadow-card p-6">
            <div className="w-12 h-12 bg-coral/10 rounded-sm flex items-center justify-center mb-4">
              <Check className="w-6 h-6 text-coral" />
            </div>
            <h3 className="text-xl font-bold text-azul mb-2">Carnet Digital</h3>
            <p className="text-acero">
              Carnet de socio digital que demuestras tu pertenencia a la
              Asociación Cultural Olvidos de Granada
            </p>
          </div>

          <div className="bg-white rounded-sm shadow-card p-6">
            <div className="w-12 h-12 bg-coral/10 rounded-sm flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-coral" />
            </div>
            <h3 className="text-xl font-bold text-azul mb-2">Descuentos</h3>
            <p className="text-acero">
              Descuentos en libros, actividades culturales y establecimientos
              colaboradores
            </p>
          </div>
        </div>

        {/* Planes de membresía */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-azul mb-8 text-center">
            Elige tu plan de membresía
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Plan Estándar */}
            <div className="bg-white rounded-sm shadow-card overflow-hidden">
              <div className="bg-azul text-white p-6 text-center">
                <h3 className="text-2xl font-bold mb-2">Estándar</h3>
                <div className="text-4xl font-black">30€</div>
                <p className="text-sm opacity-90">/año</p>
              </div>
              <div className="p-6">
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-coral flex-shrink-0 mt-0.5" />
                    <span className="text-acero">Revista digital anual</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-coral flex-shrink-0 mt-0.5" />
                    <span className="text-acero">Acceso a eventos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-coral flex-shrink-0 mt-0.5" />
                    <span className="text-acero">Carnet digital</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-coral flex-shrink-0 mt-0.5" />
                    <span className="text-acero">Descuentos colaboradores</span>
                  </li>
                </ul>
                <Link
                  href="/registro-socio"
                  className="block w-full px-6 py-3 bg-coral text-white text-center font-bold rounded-sm hover:bg-coral-dark transition-colors"
                >
                  Hacerme Socio
                </Link>
              </div>
            </div>

            {/* Plan Colaborador */}
            <div className="bg-white rounded-sm shadow-card overflow-hidden ring-2 ring-coral">
              <div className="bg-coral text-white p-6 text-center relative">
                <div className="absolute top-2 right-2 bg-white text-coral text-xs font-bold px-2 py-1 rounded-sm">
                  Popular
                </div>
                <h3 className="text-2xl font-bold mb-2">Colaborador</h3>
                <div className="text-4xl font-black">60€</div>
                <p className="text-sm opacity-90">/año</p>
              </div>
              <div className="p-6">
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-coral flex-shrink-0 mt-0.5" />
                    <span className="text-acero">Todo lo del plan Estándar</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-coral flex-shrink-0 mt-0.5" />
                    <span className="text-acero">Revista impresa (2 números)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-coral flex-shrink-0 mt-0.5" />
                    <span className="text-acero">Entradas gratuitas a eventos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-coral flex-shrink-0 mt-0.5" />
                    <span className="text-acero">Mención en la web</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-coral flex-shrink-0 mt-0.5" />
                    <span className="text-acero">Descuento del 20% en libros</span>
                  </li>
                </ul>
                <Link
                  href="/registro-socio"
                  className="block w-full px-6 py-3 bg-coral text-white text-center font-bold rounded-sm hover:bg-coral-dark transition-colors"
                >
                  Hacerme Colaborador
                </Link>
              </div>
            </div>

            {/* Plan Honorífico */}
            <div className="bg-white rounded-sm shadow-card overflow-hidden">
              <div className="bg-azul text-white p-6 text-center">
                <h3 className="text-2xl font-bold mb-2">Honorífico</h3>
                <div className="text-4xl font-black">120€</div>
                <p className="text-sm opacity-90">/año</p>
              </div>
              <div className="p-6">
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-coral flex-shrink-0 mt-0.5" />
                    <span className="text-acero">Todo lo del plan Colaborador</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-coral flex-shrink-0 mt-0.5" />
                    <span className="text-acero">Revista impresa completa</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-coral flex-shrink-0 mt-0.5" />
                    <span className="text-acero">Invitación a eventos VIP</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-coral flex-shrink-0 mt-0.5" />
                    <span className="text-acero">Dedicada en la revista</span>
                  </li>
                </ul>
                <Link
                  href="/registro-socio"
                  className="block w-full px-6 py-3 bg-azul text-white text-center font-bold rounded-sm hover:bg-azul-dark transition-colors"
                >
                  Hacerme Socio Honorífico
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div>
          <h2 className="text-3xl font-bold text-azul mb-8 text-center">
            Preguntas Frecuentes
          </h2>

          <div className="max-w-3xl mx-auto space-y-4">
            <details className="bg-white rounded-sm shadow-card p-6">
              <summary className="font-bold text-azul cursor-pointer">
                ¿Cómo puedo hacerme socio?
              </summary>
              <p className="mt-4 text-acero">
                Puedes hacerte socio a través de nuestra página de registro. El
                proceso es rápido y seguro. Una vez completado, recibirás tu carnet
                digital inmediatamente.
              </p>
            </details>

            <details className="bg-white rounded-sm shadow-card p-6">
              <summary className="font-bold text-azul cursor-pointer">
                ¿Qué métodos de pago aceptáis?
              </summary>
              <p className="mt-4 text-acero">
                Aceptamos tarjetas de crédito y débito (Visa, Mastercard, American
                Express) a través de nuestra plataforma de pago segura Stripe.
              </p>
            </details>

            <details className="bg-white rounded-sm shadow-card p-6">
              <summary className="font-bold text-azul cursor-pointer">
                ¿Puedo darme de baja cuando quiera?
              </summary>
              <p className="mt-4 text-acero">
                Sí, puedes darte de baja en cualquier momento desde tu área de socio.
                No hay penalizaciones ni compromisos de permanencia.
              </p>
            </details>

            <details className="bg-white rounded-sm shadow-card p-6">
              <summary className="font-bold text-azul cursor-pointer">
                ¿Mis datos están seguros?
              </summary>
              <p className="mt-4 text-acero">
                Absolutamente. Cumplimos con todas las normativas de protección de
                datos (GDPR) y nunca compartimos tu información con terceros sin tu
                consentimiento.
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
