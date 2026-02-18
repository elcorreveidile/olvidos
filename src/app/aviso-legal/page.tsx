export default function AvisoLegalPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-azul text-white py-16 mt-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-black mb-4">Aviso Legal</h1>
          <p className="text-xl opacity-90">
            Información legal de Olvidos de Granada
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-sm shadow-card p-8 md:p-12">
            <div className="prose prose-lg max-w-none space-y-6">
              <section>
                <h2 className="text-2xl font-bold text-azul mb-4">Datos Identificativos</h2>
                <p className="text-acero mb-4">
                  En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio,
                  de Servicios de la Sociedad de la Información y Comercio Electrónico,
                  se informa:
                </p>
                <ul className="list-none space-y-2 text-acero">
                  <li><strong>Denominación social:</strong> Asociación Cultural Olvidos de Granada</li>
                  <li><strong>Domicilio:</strong> Granada, España</li>
                  <li><strong>Email:</strong> info@olvidosdegranada.es</li>
                  <li><strong>Sitio Web:</strong> https://olvidosdegranada.es</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-azul mb-4">Finalidad del Sitio Web</h2>
                <p className="text-acero">
                  El sitio web tiene como finalidad la difusión de las actividades
                  culturales y literarias de la Asociación Cultural Olvidos de Granada,
                  así como la gestión de las relaciones con sus socios y la publicación
                  de su revista digital.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-azul mb-4">Propiedad Intelectual</h2>
                <p className="text-acero mb-4">
                  Todos los derechos de propiedad intelectual sobre el contenido de este
                  sitio web (textos, imágenes, logos, diseños, vídeos, música, software)
                  son propiedad exclusiva de la Asociación Cultural Olvidos de Granada o
                  de terceros que han autorizado su uso.
                </p>
                <p className="text-acero">
                  Queda prohibida la reproducción, distribución, comunicación pública o
                  transformación de cualquier contenido sin la autorización expresa del
                  titular de los derechos.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-azul mb-4">Responsabilidad</h2>
                <p className="text-acero mb-4">
                  La Asociación no se hace responsable de los daños que pudieran derivarse
                  del uso de este sitio web, ni de la información contenida en el mismo.
                </p>
                <p className="text-acero">
                  Tampoco garantiza la ausencia de virus u otros elementos dañinos en el
                  sitio web o en los servidores que lo alojan.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-azul mb-4">Enlaces a Terceros</h2>
                <p className="text-acero mb-4">
                  Este sitio web puede contener enlaces a sitios web de terceros. La
                  Asociación no tiene control sobre dichos sitios y no se hace
                  responsable de su contenido o políticas de privacidad.
                </p>
                <p className="text-acero">
                  La inclusión de enlaces no implica recomendación ni endorsement de los
                  sitios enlazados.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-azul mb-4">Protección de Datos</h2>
                <p className="text-acero mb-4">
                  Los datos personales recogidos a través de este sitio web serán
                  tratados de acuerdo con nuestra Política de Privacidad y con la
                  normativa vigente en materia de protección de datos (RGPD y LOPD-GDD).
                </p>
                <p className="text-acero">
                  Puedes consultar nuestra Política de Privacidad en{" "}
                  <a href="/politica-privacidad" className="text-coral hover:text-coral/80">
                    este enlace
                  </a>.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-azul mb-4">Cookies</h2>
                <p className="text-acero mb-4">
                  Este sitio web utiliza cookies con la finalidad de mejorar la experiencia
                  de usuario y recopilar información estadística anónima.
                </p>
                <p className="text-acero">
                  Puedes configurar tu navegador para rechazar cookies, aunque esto puede
                  afectar la funcionalidad del sitio.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-azul mb-4">Legislación Aplicable</h2>
                <p className="text-acero">
                  Este sitio web se rige por la legislación española. Para cualquier
                  controversia, las partes se someten a los Juzgados y Tribunales de
                  Granada.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-azul mb-4">Contacto</h2>
                <p className="text-acero mb-4">
                  Para cualquier cuestión relacionada con este sitio web, puedes
                  contactarnos a través de:
                </p>
                <ul className="list-none space-y-2 text-acero">
                  <li>• Email: info@olvidosdegranada.es</li>
                  <li>• Formulario de contacto:{" "}
                    <a href="/contacto" className="text-coral hover:text-coral/80">
                      /contacto
                    </a>
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-azul mb-4">Última Actualización</h2>
                <p className="text-acero">
                  Febrero 2026
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
