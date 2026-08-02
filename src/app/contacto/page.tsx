import Link from "next/link";
import type { Metadata } from "next";
import { ContactForm } from "@/components/shared/ContactForm";
import { CategoryHeading } from "@/components/content/CategoryHeading";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Ponte en contacto con la Asociación Cultural Olvidos de Granada: sugerencias, colaboraciones y consultas.",
};

export default function ContactoPage() {
  return (
    <div className="max-w-content mx-auto px-4 py-12">
      {/* Cabecera editorial */}
      <header className="mb-12 border-b-2 border-tinta pb-8 text-center">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-coral">
          Hablemos
        </p>
        <CategoryHeading>contacto</CategoryHeading>
        <p className="mx-auto mt-6 max-w-2xl font-editorial text-lg leading-snug text-tinta/70">
          ¿Tienes una sugerencia, una propuesta de colaboración o una consulta?
          Estaremos encantados de leerte.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Información de contacto */}
        <div>
          <h2 className="mb-6 text-2xl font-black text-tinta">
            <span className="text-coral">[</span>Ponte en contacto
          </h2>

          <dl className="space-y-6 font-editorial text-lg text-tinta/80">
            <div>
              <dt className="font-sans text-sm font-bold uppercase tracking-wide text-acero">
                Correo
              </dt>
              <dd>
                <a
                  href="mailto:olvidosdegranada@gmail.com"
                  className="text-coral underline decoration-coral-light underline-offset-2 transition-colors hover:text-tinta"
                >
                  olvidosdegranada@gmail.com
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-sans text-sm font-bold uppercase tracking-wide text-acero">
                Sede
              </dt>
              <dd>
                Asociación Cultural Olvidos de Granada
                <br />
                C/ Carmen, 51 · 18198 Granada
              </dd>
            </div>
            <div>
              <dt className="font-sans text-sm font-bold uppercase tracking-wide text-acero">
                Publicación
              </dt>
              <dd>ISSN 2605-4515</dd>
            </div>
          </dl>
        </div>

        {/* Formulario de contacto */}
        <div className="rounded-sm p-8 shadow-card">
          <h2 className="mb-6 text-2xl font-black text-tinta">
            <span className="text-coral">[</span>Escríbenos
          </h2>
          <ContactForm />
        </div>
      </div>

      {/* CTA socio */}
      <section className="mt-16 curtain-velvet rounded-sm p-10 text-center">
        <h2 className="mb-3 text-2xl font-bold text-white">
          <span className="text-coral">[</span>¿Quieres hacerte socio?
        </h2>
        <p className="mx-auto mb-6 max-w-xl font-editorial text-white/80">
          Únete a la asociación y apoya la cultura y la literatura de Granada.
        </p>
        <Link
          href="/hazte-socio"
          className="inline-block rounded-sm bg-coral px-8 py-3 font-bold text-white transition-colors hover:bg-coral-dark"
        >
          Hazte socio
        </Link>
      </section>
    </div>
  );
}
