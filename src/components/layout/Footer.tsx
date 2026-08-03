import Link from "next/link";
import { auth } from "@/lib/auth";
import { Logo } from "./Logo";
import { DesarrolloCredit } from "@/components/shared/DesarrolloCredit";
import { ReconocimientoFooter } from "./ReconocimientoFooter";

export async function Footer() {
  const currentYear = new Date().getFullYear();
  // Extract only what we need to avoid serialization issues
  const hasUser = !!(await auth())?.user;
  const memberAreaHref = hasUser ? "/mi-cuenta" : "/login";

  return (
    <footer className="bg-azul text-white">
      <div className="max-w-content mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-block text-[1.5rem]" aria-label="Olvidos — inicio">
              <Logo />
            </Link>
            <p className="mt-2 text-sm text-acero-light leading-relaxed">
              Revista de acciones culturales
            </p>
            <p className="mt-1 text-xs text-acero-light">ISSN 2605-4515</p>
          </div>

          {/* Secciones */}
          <div>
            <h3 className="text-sm font-bold mb-4 text-coral-light">Secciones</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/articulos?categoria=editorial" className="text-sm text-acero-light hover:text-coral transition-colors">
                  Editoriales
                </Link>
              </li>
              <li>
                <Link href="/articulos?categoria=palabras" className="text-sm text-acero-light hover:text-coral transition-colors">
                  Palabras
                </Link>
              </li>
              <li>
                <Link href="/articulos?categoria=piezas-procesos" className="text-sm text-acero-light hover:text-coral transition-colors">
                  Piezas y Procesos
                </Link>
              </li>
              <li>
                <Link href="/articulos?categoria=apostillas" className="text-sm text-acero-light hover:text-coral transition-colors">
                  Apostillas
                </Link>
              </li>
              <li>
                <Link href="/articulos?categoria=sonetos" className="text-sm text-acero-light hover:text-coral transition-colors">
                  Soneto500
                </Link>
              </li>
            </ul>
          </div>

          {/* Enlaces */}
          <div>
            <h3 className="text-sm font-bold mb-4 text-coral-light">Información</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/sobre-nosotros" className="text-sm text-acero-light hover:text-coral transition-colors">
                  Sobre Olvidos
                </Link>
              </li>
              <li>
                <Link href="/junta-directiva" className="text-sm text-acero-light hover:text-coral transition-colors">
                  Junta Directiva
                </Link>
              </li>
              <li>
                <Link href="/revista" className="text-sm text-acero-light hover:text-coral transition-colors">
                  Archivo (revista impresa)
                </Link>
              </li>
              <li>
                <Link href="/actividades" className="text-sm text-acero-light hover:text-coral transition-colors">
                  Actividades
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-sm text-acero-light hover:text-coral transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Socios */}
          <div>
            <h3 className="text-sm font-bold mb-4 text-coral-light">Socios</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/hazte-socio" className="text-sm text-acero-light hover:text-coral transition-colors">
                  Hazte socio
                </Link>
              </li>
              <li>
                <Link href={memberAreaHref} className="text-sm text-acero-light hover:text-coral transition-colors">
                  Área de socios
                </Link>
              </li>
            </ul>
            <div className="mt-6">
              <Link
                href="/hazte-socio"
                className="inline-block px-6 py-2 bg-coral text-white text-sm font-bold rounded-sm hover:bg-coral-dark transition-colors"
              >
                Hazte socio
              </Link>
            </div>
          </div>
        </div>

        {/* Reconocimiento: patrocinadores · institucionales · mecenas */}
        <ReconocimientoFooter />

        {/* Créditos */}
        <div className="mt-12 border-t border-white/10 pt-6 text-xs text-acero-light">
          Diseño: <span className="text-white/80">Mesa 1</span>
          <span className="mx-2">·</span>
          Desarrollo: <DesarrolloCredit placement="top" />
        </div>

        {/* Copyright */}
        <div className="mt-4 flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-xs text-acero-light">
            &copy; {currentYear} Asociación Cultural Olvidos de Granada. Todos los derechos reservados.
          </p>
          <div className="flex gap-6">
            <Link href="/aviso-legal" className="text-xs text-acero-light hover:text-coral transition-colors">
              Aviso legal
            </Link>
            <Link href="/privacidad" className="text-xs text-acero-light hover:text-coral transition-colors">
              Política de privacidad
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
