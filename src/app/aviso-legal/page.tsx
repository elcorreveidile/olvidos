import Link from "next/link";
import type { Metadata } from "next";
import { CategoryHeading } from "@/components/content/CategoryHeading";

export const metadata: Metadata = {
  title: "Aviso legal",
  description:
    "Aviso legal e información identificativa de la Asociación Cultural Olvidos de Granada, editora de la revista Olvidos de Granada (www.olvidos.es).",
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

export default function AvisoLegalPage() {
  return (
    <div className="max-w-content mx-auto px-4 py-12">
      <header className="mb-12 border-b-2 border-tinta pb-8 text-center">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-coral">
          Información legal
        </p>
        <CategoryHeading>aviso legal</CategoryHeading>
        <p className="mx-auto mt-6 max-w-2xl font-editorial text-tinta/60">
          Última actualización: {ACTUALIZACION}
        </p>
      </header>

      <div className="max-w-article">
        <Apartado title="Datos identificativos">
          <p>
            En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de
            Servicios de la Sociedad de la Información y de Comercio Electrónico
            (LSSI-CE), se informa de que el titular de este sitio web es:
          </p>
          <ul>
            <li>
              <strong>Titular:</strong> Asociación Cultural Olvidos de Granada
            </li>
            <li>
              <strong>CIF:</strong> G-19648625
            </li>
            <li>
              <strong>Domicilio:</strong> C/ Carmen, 51 · 18198 Granada
            </li>
            <li>
              <strong>Inscripción:</strong> Registro de Asociaciones de Andalucía,
              nº 10241, Sección 1
            </li>
            <li>
              <strong>Publicación:</strong> revista <em>Olvidos de Granada</em>,
              ISSN 2605-4515
            </li>
            <li>
              <strong>Correo electrónico:</strong> olvidosdegranada@gmail.com
            </li>
            <li>
              <strong>Sitio web:</strong> https://www.olvidos.es
            </li>
          </ul>
        </Apartado>

        <Apartado title="Objeto y finalidad">
          <p>
            Este sitio web tiene por objeto la difusión de las actividades
            culturales y literarias de la Asociación Cultural Olvidos de Granada,
            la protección y divulgación del legado de la revista{" "}
            <em>Olvidos de Granada</em>, la publicación de su edición digital y la
            gestión de la relación con sus socios.
          </p>
        </Apartado>

        <Apartado title="Condiciones de uso">
          <p>
            El acceso a este sitio web es gratuito, salvo en lo relativo al coste
            de la conexión. La persona usuaria se compromete a hacer un uso
            adecuado de los contenidos y servicios, y a no emplearlos para
            actividades ilícitas o contrarias a la buena fe y al orden público.
          </p>
          <p>
            Algunas secciones (área de socios) requieren registro y son de acceso
            restringido a las personas asociadas.
          </p>
        </Apartado>

        <Apartado title="Propiedad intelectual e industrial">
          <p>
            Los contenidos de este sitio (textos, imágenes, ilustraciones, logotipos,
            diseño y software) son titularidad de la Asociación Cultural Olvidos de
            Granada o de terceros que han autorizado su uso, y están protegidos por
            la normativa de propiedad intelectual e industrial.
          </p>
          <p>
            Los textos e imágenes procedentes de la revista impresa se reproducen
            con fines culturales y de archivo, respetando la autoría. Si eres autor
            o titular de derechos de algún material y deseas su corrección o
            retirada, escríbenos a olvidosdegranada@gmail.com.
          </p>
          <p>
            Queda prohibida la reproducción, distribución, comunicación pública o
            transformación de los contenidos sin autorización expresa del titular
            de los derechos, salvo los usos permitidos por la ley.
          </p>
        </Apartado>

        <Apartado title="Responsabilidad">
          <p>
            La Asociación procura que la información del sitio sea correcta y esté
            actualizada, pero no garantiza la inexistencia de errores ni la
            disponibilidad ininterrumpida del servicio. En la medida permitida por
            la ley, la Asociación no se responsabiliza de los daños derivados del
            uso del sitio ni de la presencia de virus u otros elementos dañinos.
          </p>
        </Apartado>

        <Apartado title="Enlaces a terceros">
          <p>
            Este sitio puede contener enlaces a páginas de terceros. La Asociación
            no controla dichos sitios ni responde de sus contenidos o políticas. La
            inclusión de un enlace no implica recomendación ni relación con el sitio
            enlazado.
          </p>
        </Apartado>

        <Apartado title="Protección de datos">
          <p>
            El tratamiento de los datos personales recogidos a través de este sitio
            se rige por nuestra{" "}
            <Link href="/privacidad" className="font-bold text-coral hover:text-coral-dark">
              Política de Privacidad
            </Link>
            , conforme al Reglamento (UE) 2016/679 (RGPD) y a la Ley Orgánica
            3/2018 (LOPDGDD).
          </p>
        </Apartado>

        <Apartado title="Legislación aplicable y jurisdicción">
          <p>
            Este aviso legal se rige por la legislación española. Para la resolución
            de cualquier controversia, y salvo que la normativa aplicable disponga
            otro fuero, las partes se someten a los Juzgados y Tribunales de Granada.
          </p>
        </Apartado>

        <Apartado title="Contacto">
          <p>
            Para cualquier cuestión relacionada con este sitio web puedes escribir a{" "}
            <a
              href="mailto:olvidosdegranada@gmail.com"
              className="font-bold text-coral hover:text-coral-dark"
            >
              olvidosdegranada@gmail.com
            </a>{" "}
            o usar el{" "}
            <Link href="/contacto" className="font-bold text-coral hover:text-coral-dark">
              formulario de contacto
            </Link>
            .
          </p>
        </Apartado>
      </div>
    </div>
  );
}
