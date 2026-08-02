import Image from "next/image";
import Link from "next/link";
import {
  PATROCINADORES,
  SOCIOS_INSTITUCIONALES,
  MECENAS,
  type Reconocimiento,
} from "@/lib/patrocinadores";

/**
 * Banda de reconocimiento del footer: patrocinadores, socios institucionales y
 * mecenas, en jerarquía de mayor a menor prominencia. Cada bloque se oculta si
 * no tiene datos; si no hay nada en ninguno, la banda entera no se renderiza.
 */
export function ReconocimientoFooter() {
  return (
    <div className="mt-12 border-t border-white/10 pt-8">
      {/* Apoyo de Olvidos a la candidatura de Granada (siempre visible) */}
      <div className="mb-8 flex flex-col items-center gap-3 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-coral-light">
          Apoyamos
        </p>
        <Link
          href="/granada-2031"
          aria-label="Por qué Olvidos de Granada apoya la candidatura Granada 2031"
          className="inline-block rounded-md bg-white px-5 py-4 transition-transform hover:-translate-y-0.5"
        >
          <Image
            src="/granada-2031/marca-firma.png"
            alt="Granada 2031 · Capital Europea de la Cultura · Ciudad finalista"
            width={80}
            height={90}
            className="h-auto w-auto"
            style={{ maxHeight: 92 }}
          />
        </Link>
        <p className="max-w-md text-sm text-acero-light">
          <em>Olvidos de Granada</em> apoya la candidatura de Granada a Capital
          Europea de la Cultura 2031.{" "}
          <Link
            href="/granada-2031"
            className="font-semibold text-coral-light underline decoration-coral-light/40 underline-offset-4 hover:text-coral"
          >
            Por qué lo apoyamos →
          </Link>
        </p>
      </div>

      {PATROCINADORES.length > 0 && (
        <Bloque titulo="Con la colaboración de">
          <LogoFila items={PATROCINADORES} alto={76} />
        </Bloque>
      )}

      {SOCIOS_INSTITUCIONALES.length > 0 && (
        <Bloque titulo="Socios institucionales">
          <LogoFila items={SOCIOS_INSTITUCIONALES} alto={40} />
        </Bloque>
      )}

      {MECENAS.length > 0 && (
        <Bloque titulo="Mecenas">
          <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-acero-light">
            {MECENAS.map((m) => (
              <li key={m.nombre}>
                {m.url ? (
                  <a
                    href={m.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-coral transition-colors"
                  >
                    {m.nombre}
                  </a>
                ) : (
                  m.nombre
                )}
              </li>
            ))}
          </ul>
        </Bloque>
      )}
    </div>
  );
}

function Bloque({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6 text-center last:mb-0">
      <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-coral-light">
        {titulo}
      </h3>
      {children}
    </div>
  );
}

function LogoFila({ items, alto }: { items: Reconocimiento[]; alto: number }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      {items.map((item) => {
        // Los logos van sobre tarjeta blanca para que se lean sobre el footer
        // oscuro sea cual sea su color; los que no tienen logo, en texto.
        const contenido = item.logo ? (
          <span className="inline-flex items-center rounded-md bg-white px-4 py-3">
            <Image
              src={item.logo}
              alt={item.nombre}
              height={alto}
              width={alto * 3}
              className="h-auto w-auto"
              style={{ maxHeight: alto }}
            />
          </span>
        ) : (
          <span className="text-base font-bold text-white/90">{item.nombre}</span>
        );

        return item.url ? (
          <a
            key={item.nombre}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={item.nombre}
            className="transition-transform hover:-translate-y-0.5"
          >
            {contenido}
          </a>
        ) : (
          <div key={item.nombre}>{contenido}</div>
        );
      })}
    </div>
  );
}
