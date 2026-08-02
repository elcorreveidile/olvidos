import Link from "next/link";
import type { Metadata } from "next";
import { CategoryHeading } from "@/components/content/CategoryHeading";

export const metadata: Metadata = {
  title: "Memoria",
  description:
    "Memoria de Olvidos: el archivo de la revista impresa, la memoria de Olvidos y la memoria cultural de Granada.",
};

const BLOQUES = [
  {
    titulo: "Archivo",
    subtitulo: "La revista impresa",
    texto:
      "La colección completa desde su primera época, número a número, en PDF y en formato web.",
    href: "/revista",
  },
  {
    titulo: "Memoria de Olvidos",
    subtitulo: "La trayectoria de la revista",
    texto:
      "Textos y documentos sobre la historia de Olvidos de Granada y quienes la hicieron posible.",
    href: "/articulos?categoria=memoria-de-olvidos",
  },
  {
    titulo: "Memoria de Granada",
    subtitulo: "Historia cultural granadina",
    texto:
      "La ciudad y su cultura: la transición, sus voces, sus lugares y su literatura.",
    href: "/articulos?categoria=memoria-de-granada",
  },
];

export default function MemoriaPage() {
  return (
    <div className="max-w-content mx-auto px-4 py-12">
      <header className="mb-12 border-b-2 border-tinta pb-8 text-center">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-coral">
          Memoria
        </p>
        <CategoryHeading>memoria</CategoryHeading>
        <p className="mx-auto mt-6 max-w-2xl font-editorial text-lg leading-snug text-tinta/70">
          El archivo vivo de Olvidos: la revista impresa, su propia memoria y la
          memoria cultural de Granada.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {BLOQUES.map((b) => (
          <Link
            key={b.href}
            href={b.href}
            className="group flex flex-col justify-between rounded-sm border border-acero-light/50 p-8 transition-all hover:border-coral hover:shadow-card-hover"
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-acero">
                {b.subtitulo}
              </p>
              <h2 className="mt-2 text-2xl font-black text-tinta transition-colors group-hover:text-coral">
                <span className="text-coral">[</span>
                {b.titulo}
              </h2>
              <p className="mt-3 font-editorial text-tinta/70">{b.texto}</p>
            </div>
            <span className="mt-6 text-sm font-bold text-coral">Entrar →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
