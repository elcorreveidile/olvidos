import {
  CONTEXTOS_29N_DESCRIPTION,
  CONTEXTOS_29N_TITLE,
  CONTEXTOS_29N_URL,
} from "@/lib/con-textos/contextos-29n";

/**
 * Tarjeta destacada de «Con-textos 29N» (app externa) para la parte superior
 * del listado de la categoría Con-textos.
 */
export function Contextos29nCard() {
  return (
    <a
      href={CONTEXTOS_29N_URL}
      rel="noopener"
      className="group mb-10 flex items-center gap-5 rounded-sm bg-tinta px-6 py-6 text-white transition-colors hover:bg-tinta/90 sm:px-8"
    >
      <span
        aria-hidden
        className="font-editorial text-6xl font-black leading-none text-coral"
      >
        [
      </span>
      <span className="block">
        <span className="block text-[11px] font-bold uppercase tracking-[0.3em] text-coral">
          Especial · Elecciones 29N
        </span>
        <span className="mt-1 block font-editorial text-2xl font-extrabold leading-tight sm:text-3xl">
          {CONTEXTOS_29N_TITLE}
        </span>
        <span className="mt-2 block font-editorial text-base leading-snug text-white/80">
          {CONTEXTOS_29N_DESCRIPTION}
        </span>
        <span className="mt-3 block text-sm font-bold text-coral group-hover:text-white">
          Entrar →
        </span>
      </span>
    </a>
  );
}
