export default function PoliticaPrivacidadPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-azul text-white py-16 mt-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-black mb-4">Política de Privacidad</h1>
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
                <h2 className="text-2xl font-bold text-azul mb-4">1. Responsable del Tratamiento</h2>
                <p className="text-acero mb-4">
                  <strong>Asociación Cultural Olvidos de Granada</strong>
                </p>
                <ul className="list-none space-y-2 text-acero">
                  <li>• Email: info@olvidosdegranada.es</li>
                  <li>• Sitio Web: olvidosdegranada.es</li>
                  <li>• Sede: Granada, España</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-azul mb-4">2. Datos que Recopilamos</h2>

                <h3 className="text-xl font-bold text-azul mb-3">2.1. Datos de Identificación</h3>
                <ul className="list-disc pl-6 space-y-2 text-acero mb-4">
                  <li>Nombre y apellidos</li>
                  <li>Dirección de correo electrónico</li>
                  <li>Contraseña (encriptada)</li>
                  <li>Dirección postal (opcional)</li>
                  <li>Teléfono (opcional)</li>
                </ul>

                <h3 className="text-xl font-bold text-azul mb-3">2.2. Datos de Pago</h3>
                <p className="text-acero mb-4">
                  Para el procesamiento de pagos, utilizamos <strong>Stripe</strong>, una
                  plataforma de pagos segura. La Asociación no almacena ni tiene acceso a
                  la información completa de tu tarjeta de crédito. Stripe cumple con
                  el estándar PCI-DSS para la protección de datos de pago.
                </p>

                <h3 className="text-xl font-bold text-azul mb-3">2.3. Datos de Navegación</h3>
                <p className="text-acero mb-4">
                  Recopilamos información sobre tu navegación para mejorar nuestros servicios:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-acero">
                  <li>Dirección IP</li>
                  <li>Tipo de navegador y dispositivo</li>
                  <li>Páginas visitadas</li>
                  <li>Tiempo de navegación</li>
                  <li>Referencias (sitio de procedencia)</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-azul mb-4">3. Finalidad del Tratamiento</h2>
                <p className="text-acero mb-4">
                  Tus datos serán utilizados para las siguientes finalidades:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-acero mb-4">
                  <li><strong>Gestión de la membresía:</strong> Administrar tu relación como socio de la Asociación</li>
                  <li><strong>Envío de comunicaciones:</strong> Informarte sobre actividades, publicaciones y noticias</li>
                  <li><strong>Procesamiento de pagos:</strong> Gestionar las cuotas de membresía y compras</li>
                  <li><strong>Mejora del servicio:</strong> Analizar el uso del sitio para mejorarlo</li>
                  <li><strong>Cumplimiento legal:</strong> Cumplir obligaciones fiscales y legales</li>
                </ul>

                <h3 className="text-xl font-bold text-azul mb-3">Base Legal</h3>
                <ul className="list-disc pl-6 space-y-2 text-acero">
                  <li>Consentimiento del interesado</li>
                  <li>Ejecución de un contrato de asociación</li>
                  <li>Cumplimiento de obligaciones legales</li>
                  <li>Interés legítimo para la mejora de servicios</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-azul mb-4">4. Destinatarios de los Datos</h2>
                <p className="text-acero mb-4">
                  Tus datos podrán ser comunicados a:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-acero mb-4">
                  <li><strong>Stripe:</strong> Para procesar pagos de forma segura</li>
                  <li><strong>Vercel:</strong> Para el alojamiento de nuestro sitio web</li>
                  <li><strong>Proveedores de email:</strong> Para el envío de comunicaciones (Resend)</li>
                  <li><strong>Administraciones públicas:</strong> Cuando así lo exija la ley (Hacienda, etc.)</li>
                </ul>
                <p className="text-acero">
                  No vendemos ni alquilamos tus datos personales a terceros.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-azul mb-4">5. Medidas de Seguridad</h2>
                <p className="text-acero mb-4">
                  Implementamos medidas técnicas y organizativas apropiadas para proteger
                  tus datos personales contra acceso no autorizado, alteración, divulgación
                  o destrucción:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-acero">
                  <li>Certificado SSL/TLS para conexiones seguras</li>
                  <li>Encriptación de contraseñas (bcrypt)</li>
                  <li>Acceso restringido a datos personales</li>
                  <li>Actualizaciones regulares de seguridad</li>
                  <li>Copias de seguridad periódicas</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-azul mb-4">6. Derechos ARCO+</h2>
                <p className="text-acero mb-4">
                  Como usuario, tienes los siguientes derechos reconocidos por el RGPD:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-acero">
                  <li><strong>Acceso:</strong> Solicitar información sobre tus datos personales</li>
                  <li><strong>Rectificación:</strong> Corregir datos inexactos o incompletos</li>
                  <li><strong>Supresión:</strong> Solicitar el borrado de tus datos (&ldquo;derecho al olvido&rdquo;)</li>
                  <li><strong>Oposición:</strong> Oponerte al tratamiento de tus datos</li>
                  <li><strong>Limitación:</strong> Solicitar que limitemos el tratamiento</li>
                  <li><strong>Portabilidad:</strong> Recibir tus datos en un formato estructurado</li>
                  <li><strong>Revocación:</strong> Retirar tu consentimiento en cualquier momento</li>
                </ul>
                <p className="text-acero mt-4">
                  Para ejercer estos derechos, envía un email a: info@olvidosdegranada.es
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-azul mb-4">7. Retención de Datos</h2>
                <p className="text-acero mb-4">
                  Los datos personales se conservarán mientras exista una relación con la
                  Asociación o mientras sea necesario para las finalidades descritas.
                </p>
                <p className="text-acero">
                  Una vez finalizada la relación, los datos serán bloqueados y conservados
                  únicamente durante los períodos legalmente establecidos para responder a
                  posibles responsabilidades legales.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-azul mb-4">8. Cookies y Tecnologías Similares</h2>

                <h3 className="text-xl font-bold text-azul mb-3">8.1. ¿Qué son las Cookies?</h3>
                <p className="text-acero mb-4">
                  Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo
                  cuando visitas nuestro sitio web.
                </p>

                <h3 className="text-xl font-bold text-azul mb-3">8.2. Tipos de Cookies que Utilizamos</h3>
                <ul className="list-disc pl-6 space-y-2 text-acero mb-4">
                  <li><strong>Cookies técnicas:</strong> Necesarias para el funcionamiento del sitio</li>
                  <li><strong>Cookies de autenticación:</strong> Mantienen tu sesión iniciada</li>
                  <li><strong>Cookies analíticas:</strong> Nos ayudan a mejorar el sitio</li>
                </ul>

                <h3 className="text-xl font-bold text-azul mb-3">8.3. Gestión de Cookies</h3>
                <p className="text-acero">
                  Puedes configurar tu navegador para rechazar cookies. Sin embargo, esto
                  puede afectar la funcionalidad del sitio.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-azul mb-4">9. Menores de Edad</h2>
                <p className="text-acero mb-4">
                  Nuestros servicios no están dirigidos a menores de 14 años. No recopilamos
                  intencionalmente datos personales de menores. Si detectamos que hemos
                  recopilado datos de un menor, procederemos a eliminarlos inmediatamente.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-azul mb-4">10. Transferencias Internacionales</h2>
                <p className="text-acero mb-4">
                  Algunos de nuestros proveedores de servicios (como Stripe y Vercel) pueden
                  transferir datos a países fuera del Espacio Económico Europeo. Todos
                  estos proveedores cumplen con el RGPD y tienen cláusulas contractuales
                  estándar de la UE aprobadas por la Comisión Europea.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-azul mb-4">11. Cambios en la Política</h2>
                <p className="text-acero mb-4">
                  Nos reservamos el derecho de modificar esta Política de Privacidad en
                  cualquier momento. Los cambios serán publicados en esta página y, cuando
                  proceda, te notificaremos por email.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-azul mb-4">12. Autoridad de Control</h2>
                <p className="text-acero mb-4">
                  Si consideras que el tratamiento de tus datos no se ajusta a la normativa
                  vigente, tienes derecho a presentar una reclamación ante la Agencia
                  Española de Protección de Datos (AEPD) en:
                </p>
                <ul className="list-none space-y-2 text-acero">
                  <li>• Web: www.aepd.es</li>
                  <li>• Email: info@aepd.es</li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
