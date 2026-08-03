"use client";

import { useState } from "react";
import { Loader2, Heart } from "lucide-react";

const PLANES = [
  { id: "STANDARD", label: "Estándar", price: "50 €", desc: "Cuota anual de socio" },
  { id: "HONORARY", label: "Mecenas", price: "120 €", desc: "Mayor apoyo + revista impresa" },
  { id: "INSTITUTIONAL", label: "Institucional", price: "250 €", desc: "Entidades y empresas" },
] as const;

/**
 * Tarjeta para que el socio pague/renueve su cuota anual (o suba de nivel, p. ej.
 * a Mecenas). Crea una sesión de Stripe y redirige al pago.
 */
export function CuotaCard({ currentLevel }: { currentLevel?: string }) {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function pagar(plan: string) {
    setLoading(plan);
    setError(null);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || "No se pudo iniciar el pago.");
      }
      window.location.href = data.url;
    } catch (e) {
      setError((e as Error).message);
      setLoading(null);
    }
  }

  return (
    <div className="rounded-lg border border-coral/30 bg-coral/[0.04] p-6">
      <div className="mb-1 flex items-center gap-2">
        <Heart className="h-5 w-5 text-coral" />
        <h3 className="text-lg font-black text-tinta">Cuota de socio</h3>
      </div>
      <p className="mb-4 font-editorial text-tinta/70">
        Con tu cuota anual sostienes <em>Olvidos</em>: la web, la revista y las
        actividades de la asociación. Elige tu aportación:
      </p>

      <div className="grid gap-3 sm:grid-cols-3">
        {PLANES.map((p) => {
          const isCurrent = currentLevel === p.id;
          const busy = loading === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => pagar(p.id)}
              disabled={!!loading}
              className={`flex flex-col rounded-lg border p-4 text-left transition-colors disabled:opacity-60 ${
                p.id === "STANDARD"
                  ? "border-coral bg-coral text-white hover:bg-coral-dark"
                  : "border-acero-light/60 bg-white text-tinta hover:border-coral hover:bg-coral/5"
              }`}
            >
              <span className="flex items-center justify-between text-sm font-bold uppercase tracking-wide">
                {p.label}
                {isCurrent && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] ${
                      p.id === "STANDARD" ? "bg-white/25" : "bg-coral/10 text-coral"
                    }`}
                  >
                    Tu nivel
                  </span>
                )}
              </span>
              <span className="mt-1 text-2xl font-black">{p.price}</span>
              <span
                className={`mt-1 text-xs ${
                  p.id === "STANDARD" ? "text-white/80" : "text-tinta/60"
                }`}
              >
                {p.desc}
              </span>
              <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold">
                {busy ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Redirigiendo…
                  </>
                ) : isCurrent ? (
                  "Pagar / renovar"
                ) : (
                  "Elegir"
                )}
              </span>
            </button>
          );
        })}
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      <p className="mt-3 text-xs text-tinta/50">
        Pago seguro con tarjeta a través de Stripe. Puedes darte de baja cuando
        quieras.
      </p>
    </div>
  );
}
