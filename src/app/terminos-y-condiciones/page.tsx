export default function TerminosCondicionesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-azul text-white py-16 mt-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-black mb-4">Términos y Condiciones</h1>
          <p className="text-xl opacity-90">
            Última actualización: Febrero 2026
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-sm shadow-card p-8 md:p-12">
            <div className="prose prose-lg max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-azul mb-4">1. Introducción</h2>
                <p className="text-acero mb-4">
                  Bienvenido a Olvidos de Granada. Estos Términos y Condiciones regulan
                  el uso de nuestro sitio web, servicios y la relación entre la Asociación
                  Cultural Olvidos de Granada y sus socios, colaboradores y usuarios.
                </p>
                <p className="text-acero">
                  Al acceder o utilizar nuestro sitio web y servicios, aceptas estos
                  términos en su totalidad. Si no estás de acuerdo con estos términos,
                  por favor, no utilices nuestros servicios.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-azul mb-4">2. Definiciones</h2>
                <ul className="list-disc pl-6 space-y-2 text-acero">
                  <li><strong>Asociación:</strong> Asociación Cultural Olvidos de Granada</li>
                  <li><strong>Sitio Web:</strong> olvidosdegranada.es y todos sus subdominios</li>
                  <li><strong>Socio:</strong> Persona inscrita como miembro de la Asociación</li>
                  <li><strong>Servicios:</strong> Todas las actividades, publicaciones y eventos ofrecidos por la Asociación</li>
                  <li><strong>Usuario:</strong> Cualquier persona que acceda al Sitio Web</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-azul mb-4">3. Membresía y Cuotas</h2>
                <h3 className="text-xl font-bold text-azul mb-3">3.1. Tipos de Membresía</h3>
                <p className="text-acero mb-4">
                  La Asociación ofrece tres categorías de membresía:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-acero mb-4">
                  <li><strong>Estándar:</strong> Cuota anual de 30€</li>
                  <li><strong>Colaborador:</strong> Cuota anual de 60€</li>
                  <li><strong>Honorífico:</strong> Cuota anual de 120€</li>
                </ul>

                <h3 className="text-xl font-bold text-azul mb-3">3.2. Derechos de los Socios</h3>
                <ul className="list-disc pl-6 space-y-2 text-acero mb-4">
                  <li>Recibir la revista de la Asociación en formato digital y/o impreso según la categoría</li>
                  <li>Participar en todas las actividades organizadas por la Asociación</li>
                  <li>Acceder a eventos exclusivos para socios</li>
                  <li>Disfrutar de descuentos en establecimientos colaboradores</li>
                  <li>Ejercer el derecho de voto en las asambleas generales (socios con más de 6 meses de antigüedad)</li>
                </ul>

                <h3 className="text-xl font-bold text-azul mb-3">3.3. Obligaciones de los Socios</h3>
                <ul className="list-disc pl-6 space-y-2 text-acero">
                  <li>Pagar la cuota de membresía en los plazos establecidos</li>
                  <li>Respetar los estatutos y reglamentos de la Asociación</li>
                  <li>Mantener actualizados los datos personales</li>
                  <li>Utilizar los servicios de manera responsable y respetuosa</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-azul mb-4">4. Uso del Sitio Web</h2>
                <h3 className="text-xl font-bold text-azul mb-3">4.1. Contenido</h3>
                <p className="text-acero mb-4">
                  Todo el contenido del sitio web (textos, imágenes, logotipos, diseños,
                  música, vídeos) es propiedad de la Asociación o de sus colaboradores
                  y está protegido por las leyes de propiedad intelectual.
                </p>

                <h3 className="text-xl font-bold text-azul mb-3">4.2. Prohibiciones</h3>
                <p className="text-acero mb-4">
                  Queda prohibido:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-acero">
                  <li>Reproducir, modificar o distribuir el contenido sin autorización</li>
                  <li>Utilizar el sitio web para fines ilegales o no autorizados</li>
                  <li>Publicar contenido ofensivo, difamatorio o que viole derechos de terceros</li>
                  <li>Intentar acceder a áreas restringidas del sitio</li>
                  <li>Interferir con el funcionamiento normal del sitio</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-azul mb-4">5. Protección de Datos</h2>
                <p className="text-acero mb-4">
                  Los datos personales de los socios y usuarios serán tratados conforme
                  a lo establecido en nuestra Política de Privacidad y en cumplimiento del
                  Reglamento General de Protección de Datos (RGPD).
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-azul mb-4">6. Propiedad Intelectual</h2>
                <p className="text-acero mb-4">
                  Todos los derechos de propiedad intelectual sobre el contenido del
                  sitio web y las publicaciones de la Asociación quedan reservados. El uso
                  no autorizado constituye una violación de las leyes de propiedad
                  intelectual.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-azul mb-4">7. Cancelación y Bajas</h2>
                <h3 className="text-xl font-bold text-azul mb-3">7.1. Baja Voluntaria</h3>
                <p className="text-acero mb-4">
                  Cualquier socio puede solicitar su baja en la Asociación en cualquier
                  momento mediante comunicación por email a info@olvidosdegranada.es o
                  desde su área privada. No se devolverán las cuotas ya pagadas.
                </p>

                <h3 className="text-xl font-bold text-azul mb-3">7.2. Expulsión</h3>
                <p className="text-acero mb-4">
                  La Asociación reserves el derecho de expedientizar y dar de baja a
                  aquellos socios que incumplan gravemente estos términos o los estatutos
                  de la Asociación.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-azul mb-4">8. Limitación de Responsabilidad</h2>
                <p className="text-acero mb-4">
                  La Asociación no se hace responsable de:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-acero">
                  <li>Daños directos o indirectos derivados del uso del sitio web</li>
                  <li>Interrupciones del servicio por causas técnicas</li>
                  <li>Contenido de sitios web enlazados desde nuestro sitio</li>
                  <li>El mal uso de la información publicada</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-azul mb-4">9. Modificaciones</h2>
                <p className="text-acero mb-4">
                  La Asociación se reserva el derecho de modificar estos términos en
                  cualquier momento. Los cambios serán publicados en esta página y
                  entrarán en vigor desde el momento de su publicación.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-azul mb-4">10. Jurisdicción</h2>
                <p className="text-acero mb-4">
                  Para cualquier controversia que pudiera surgir, las partes se someten a
                  los Juzgados y Tribunales de Granada, renunciando a cualquier otro
                  fuero que pudiera corresponderles.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-azul mb-4">11. Contacto</h2>
                <p className="text-acero mb-4">
                  Para cualquier cuestión relacionada con estos Términos y Condiciones,
                  puedes contactarnos en:
                </p>
                <ul className="list-none space-y-2 text-acero">
                  <li>• Email: info@olvidosdegranada.es</li>
                  <li>• Dirección: Granada, España</li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
