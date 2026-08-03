import type { Metadata } from "next";
import { JUNTA_DIRECTIVA, JUNTA_NOTA } from "@/lib/junta";

export const metadata: Metadata = {
  title: "Junta Directiva",
};

export default function JuntaDirectivaSociosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-black text-tinta">Junta Directiva</h2>
        <p className="mt-1 font-editorial text-tinta/70">
          Órgano de gobierno y representación de la asociación, elegido por la
          Asamblea General de los socios.
        </p>
      </div>

      <div className="grid gap-px overflow-hidden rounded-lg border border-acero-light/50 bg-acero-light/40 sm:grid-cols-3">
        {JUNTA_DIRECTIVA.map((c) => (
          <div key={c.cargo} className="bg-white p-6 text-center">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-coral">
              {c.cargo}
            </p>
            <p className="font-editorial text-lg font-medium text-tinta">{c.nombre}</p>
            {c.memberNumber && (
              <p className="mt-1 text-sm text-tinta/50">Socio nº {c.memberNumber}</p>
            )}
          </div>
        ))}
      </div>

      <p className="max-w-2xl font-editorial text-sm text-tinta/60">{JUNTA_NOTA}</p>

      <div className="rounded-lg border border-acero-light/50 bg-white p-6">
        <p className="font-editorial text-tinta/80">
          La asociación honra la memoria de <strong>Mariano Maresca</strong>,
          fundador y director de <em>Olvidos de Granada</em>, primer socio de honor
          de la asociación.
        </p>
      </div>
    </div>
  );
}
