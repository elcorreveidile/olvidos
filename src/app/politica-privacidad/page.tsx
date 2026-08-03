import Link from "next/link";
import type { Metadata } from "next";
import { CategoryHeading } from "@/components/content/CategoryHeading";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description:
    "Política de privacidad de la Asociación Cultural Olvidos de Granada: qué datos tratamos, con qué fin, con qué base legal y cómo ejercer tus derechos (RGPD / LOPDGDD).",
};

const ACTUALIZACION = "Agosto de 2026";

function Apartado({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="mb-3 text-xl font-black text-tinta">
        <span className="text-coral">[</span>
        {title}
      </h2>
      <div className="prose-editorial text-tinta/80">{children}</div>
    </section>
  );
}

export default function PoliticaPrivacidadPage() {
  return (
    <div className="max-w-content mx-auto px-4 py-12">
      <header className="mb-12 border-b-2 border-tinta pb-8 text-center">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-coral">
          Protección de datos
        </p>
        <CategoryHeading>política de privacidad</CategoryHeading>
        <p className="mx-auto mt-6 max-w-2xl font-editorial text-tinta/60">
          Última actualización: {ACTUALIZACION}
        </p>
      </header>

      <div className="max-w-article">
        <p className="prose-editorial mb-10 text-tinta/80">
          En la Asociación Cultural Olvidos de Granada nos tomamos en serio tu
          privacidad. Esta política explica qué datos personales tratamos, con qué
          finalidad y bajo qué condiciones, de acuerdo con el Reglamento (UE)
          2016/679 (RGPD) y la Ley Orgánica 3/2018 de Protección de Datos y
          garantía de los derechos digitales (LOPDGDD).
        </p>

        <Apartado title="Responsable del tratamiento">
          <ul>
            <li>
              <strong>Responsable:</strong> Asociación Cultural Olvidos de Granada
            </li>
            <li>
              <strong>CIF:</strong> G-19648625
            </li>
            <li>
              <strong>Domicilio:</strong> C/ Carmen, 51 · 18198 Granada
            </li>
            <li>
              <strong>Correo de contacto:</strong> olvidosdegranada@gmail.com
            </li>
          </ul>
        </Apartado>

        <Apartado title="Qué datos tratamos">
          <p>Según tu relación con nosotros, podemos tratar:</p>
          <ul>
            <li>
              <strong>Cuenta de usuario:</strong> nombre y correo electrónico. Si
              accedes con Google o GitHub, recibimos los datos básicos de tu perfil
              (nombre, correo e imagen) necesarios para identificarte.
            </li>
            <li>
              <strong>Socios:</strong> nombre y apellidos, correo, teléfono, número
              de socio y datos de la membresía. Para el registro legal de socios y
              los envíos postales (por ejemplo, la revista impresa) tratamos también{" "}
              <strong>DNI y domicilio</strong>, que son de uso estrictamente interno
              y no se muestran en la web ni se ceden a terceros.
            </li>
            <li>
              <strong>Pagos de cuota:</strong> importe, fecha y estado de los pagos.
              El cobro se realiza a través de <strong>Stripe</strong>; los datos de
              la tarjeta los tratas directamente con Stripe y{" "}
              <strong>la Asociación no los almacena</strong>.
            </li>
            <li>
              <strong>Formulario de contacto:</strong> nombre, correo y el mensaje
              que nos envíes.
            </li>
            <li>
              <strong>Navegación:</strong> datos técnicos y estadísticos (dirección
              IP, tipo de dispositivo y páginas visitadas) mediante cookies, según
              se detalla más abajo.
            </li>
          </ul>
        </Apartado>

        <Apartado title="Con qué finalidad y base jurídica">
          <ul>
            <li>
              <strong>Gestionar la asociación y a sus socios</strong> (altas, carné,
              cuotas, comunicaciones y envío de la revista y publicaciones) — base:
              ejecución de la relación asociativa y tu consentimiento.
            </li>
            <li>
              <strong>Gestionar el cobro de cuotas y la contabilidad</strong> — base:
              relación asociativa y cumplimiento de obligaciones legales y contables.
            </li>
            <li>
              <strong>Atender tus consultas</strong> enviadas por el formulario o por
              correo — base: tu consentimiento e interés legítimo en responderte.
            </li>
            <li>
              <strong>Mantener la seguridad y mejorar la web</strong> mediante
              estadística agregada — base: interés legítimo.
            </li>
          </ul>
        </Apartado>

        <Apartado title="Destinatarios y encargados del tratamiento">
          <p>
            No vendemos ni cedemos tus datos a terceros. Solo se comparten con los
            proveedores necesarios para prestar el servicio, que actúan como
            encargados del tratamiento con las debidas garantías:
          </p>
          <ul>
            <li>
              <strong>Vercel</strong> — alojamiento de la web.
            </li>
            <li>
              <strong>Neon</strong> — base de datos.
            </li>
            <li>
              <strong>Stripe</strong> — procesamiento de los pagos.
            </li>
            <li>
              <strong>Resend</strong> — envío de correos (avisos, enlaces de acceso).
            </li>
            <li>
              <strong>Google</strong> y <strong>GitHub</strong> — autenticación, si
              eliges iniciar sesión con ellos.
            </li>
            <li>
              <strong>Google Analytics</strong> — estadística de uso de la web.
            </li>
          </ul>
          <p>
            Algunos proveedores pueden tratar datos fuera del Espacio Económico
            Europeo; en tal caso se aplican las garantías previstas en el RGPD
            (cláusulas contractuales tipo u otras). También podremos comunicar datos
            cuando exista una obligación legal.
          </p>
        </Apartado>

        <Apartado title="Durante cuánto tiempo">
          <p>
            Conservamos tus datos mientras mantengas la relación con la Asociación
            (cuenta o condición de socio) y, después, durante los plazos legalmente
            exigibles —en particular los contables y fiscales— para atender posibles
            responsabilidades. Cuando dejan de ser necesarios, se suprimen o
            anonimizan.
          </p>
        </Apartado>

        <Apartado title="Tus derechos">
          <p>
            Puedes ejercer en cualquier momento tus derechos de{" "}
            <strong>
              acceso, rectificación, supresión, oposición, limitación del
              tratamiento y portabilidad
            </strong>
            , así como retirar el consentimiento prestado, escribiendo a{" "}
            <a
              href="mailto:olvidosdegranada@gmail.com"
              className="font-bold text-coral hover:text-coral-dark"
            >
              olvidosdegranada@gmail.com
            </a>{" "}
            e indicando el derecho que deseas ejercer. Podemos pedirte que acredites
            tu identidad.
          </p>
          <p>
            Si consideras que no hemos atendido correctamente tu solicitud, tienes
            derecho a reclamar ante la Agencia Española de Protección de Datos
            (www.aepd.es).
          </p>
        </Apartado>

        <Apartado title="Cookies">
          <p>
            Utilizamos cookies técnicas, necesarias para el funcionamiento del sitio
            y el inicio de sesión, y cookies de analítica (Google Analytics) para
            conocer de forma agregada cómo se usa la web. Puedes configurar tu
            navegador para bloquear o eliminar las cookies, aunque ello puede afectar
            a algunas funciones.
          </p>
        </Apartado>

        <Apartado title="Menores de edad">
          <p>
            Este sitio no está dirigido a menores de 14 años. Si detectamos datos de
            un menor sin la autorización correspondiente, procederemos a eliminarlos.
          </p>
        </Apartado>

        <Apartado title="Cambios en esta política">
          <p>
            Podemos actualizar esta política para adaptarla a cambios legales o del
            servicio. La versión vigente será siempre la publicada en esta página,
            con su fecha de última actualización.
          </p>
        </Apartado>

        <p className="mt-12">
          <Link href="/aviso-legal" className="font-bold text-coral hover:text-coral-dark">
            ← Aviso legal
          </Link>
        </p>
      </div>
    </div>
  );
}
