"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { RefreshCw } from "lucide-react";

type Challenge = { a: number; b: number; op: "+" | "−"; answer: number };

/** Genera una operación sencilla con resultado no negativo. */
function makeChallenge(): Challenge {
  const a = 1 + Math.floor(Math.random() * 9); // 1..9
  const b = 1 + Math.floor(Math.random() * 9); // 1..9
  if (Math.random() < 0.5) return { a, b, op: "+", answer: a + b };
  const [hi, lo] = a >= b ? [a, b] : [b, a];
  return { a: hi, b: lo, op: "−", answer: hi - lo };
}

export type HumanCheckHandle = { regenerate: () => void };

/**
 * Verificación humana reutilizable: operación matemática (revalidada en
 * servidor con lib/human-check) + honeypot anti-bots. Renderiza el campo
 * visible, el campo trampa oculto y los campos ocultos del reto (chA/chB/chOp).
 * El reto se genera en cliente (useEffect) para evitar desajustes de hidratación.
 */
export const HumanCheckField = forwardRef<
  HumanCheckHandle,
  { describedById?: string; onReadyChange?: (ready: boolean) => void }
>(function HumanCheckField({ describedById, onReadyChange }, ref) {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const answerRef = useRef<HTMLInputElement>(null);

  const regenerate = useCallback(() => {
    setChallenge(makeChallenge());
    if (answerRef.current) answerRef.current.value = "";
  }, []);

  useEffect(() => {
    setChallenge(makeChallenge());
  }, []);

  useEffect(() => {
    onReadyChange?.(!!challenge);
  }, [challenge, onReadyChange]);

  useImperativeHandle(ref, () => ({ regenerate }), [regenerate]);

  return (
    <>
      {/* Honeypot anti-bots: oculto para humanos, tentador para bots. */}
      <div
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 overflow-hidden"
      >
        <label htmlFor="company">No rellenar</label>
        <input
          id="company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div>
        <label htmlFor="human" className="mb-2 block text-sm font-bold text-tinta">
          Verificación · ¿cuánto es{" "}
          <span aria-live="polite" className="text-coral">
            {challenge ? `${challenge.a} ${challenge.op} ${challenge.b}` : "…"}
          </span>
          ? *
        </label>
        <div className="flex items-center gap-2">
          <input
            ref={answerRef}
            type="number"
            id="human"
            name="human"
            inputMode="numeric"
            required
            autoComplete="off"
            aria-describedby={describedById}
            className="w-28 rounded-sm border border-acero-light px-4 py-2 focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/30"
            placeholder="Resultado"
          />
          <button
            type="button"
            onClick={regenerate}
            aria-label="Generar otra operación"
            className="rounded-sm border border-acero-light p-2 text-acero transition-colors hover:border-coral hover:text-coral"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Operación en campos ocultos para revalidar en servidor */}
      <input type="hidden" name="chA" value={challenge?.a ?? ""} readOnly />
      <input type="hidden" name="chB" value={challenge?.b ?? ""} readOnly />
      <input type="hidden" name="chOp" value={challenge?.op ?? ""} readOnly />
    </>
  );
});
