import Link from "next/link";

/** Página 404 del sitio (la usan también los `notFound()` de artículos y números). */
export default function NotFound() {
  return (
    <div className="max-w-content mx-auto px-4 py-24 text-center">
      <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-coral">Error 404</p>
      <h1 className="text-4xl font-black tracking-tight text-tinta sm:text-5xl">
        <span className="text-coral">[</span>Esta página no existe
      </h1>
      <p className="mx-auto mt-6 max-w-xl font-editorial text-lg leading-snug text-tinta/75">
        Puede que el enlace sea antiguo, que el artículo aún no esté publicado o que la dirección
        tenga una errata.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link
          href="/"
          className="rounded-sm bg-coral px-5 py-2 font-bold text-white transition-colors hover:bg-coral-dark"
        >
          Ir a la portada
        </Link>
        <Link
          href="/articulos"
          className="rounded-sm border border-tinta px-5 py-2 font-bold text-tinta transition-colors hover:bg-tinta hover:text-white"
        >
          Ver los artículos
        </Link>
      </div>
    </div>
  );
}
