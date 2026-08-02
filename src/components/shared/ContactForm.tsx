"use client";

import { useEffect, useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { sendContactMessage, type ContactState } from "@/lib/actions/contact";
import {
  HumanCheckField,
  type HumanCheckHandle,
} from "@/components/shared/HumanCheckField";

const INITIAL: ContactState = { status: "idle" };

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={disabled || pending}
      className="w-full rounded-sm bg-coral px-6 py-3 font-bold text-white transition-colors hover:bg-coral-dark disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Enviando…" : "Enviar mensaje"}
    </button>
  );
}

/**
 * Formulario de contacto con verificación humana (operación matemática).
 * La operación se REVALIDA en el servidor (server action + Resend). El reto se
 * genera en cliente y viaja en campos ocultos; incluye honeypot anti-bots.
 */
export function ContactForm() {
  const [state, formAction] = useFormState(sendContactMessage, INITIAL);
  const [done, setDone] = useState(false);
  const [checkReady, setCheckReady] = useState(false);
  const humanCheck = useRef<HumanCheckHandle>(null);

  // Reacciona al resultado del servidor: éxito o regenerar la operación.
  useEffect(() => {
    if (state.status === "success") {
      setDone(true);
    } else if (state.status === "error" && state.regenerate) {
      humanCheck.current?.regenerate();
    }
  }, [state]);

  if (done) {
    return (
      <div
        role="status"
        className="rounded-sm border border-coral/40 bg-coral/5 p-8 text-center"
      >
        <p className="text-lg font-bold text-tinta">¡Gracias por escribirnos!</p>
        <p className="mt-2 font-editorial text-tinta/70">
          Hemos recibido tu mensaje y te responderemos lo antes posible.
        </p>
        <button
          type="button"
          onClick={() => {
            setDone(false);
            humanCheck.current?.regenerate();
          }}
          className="mt-6 text-sm font-bold text-coral hover:text-tinta"
        >
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  return (
    <form className="space-y-5" action={formAction}>
      <div>
        <label htmlFor="name" className="mb-2 block text-sm font-bold text-tinta">
          Nombre *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          className="w-full rounded-sm border border-acero-light px-4 py-2 focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/30"
          placeholder="Tu nombre"
        />
      </div>

      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-bold text-tinta">
          Email *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="w-full rounded-sm border border-acero-light px-4 py-2 focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/30"
          placeholder="tu@email.com"
        />
      </div>

      <div>
        <label
          htmlFor="message"
          className="mb-2 block text-sm font-bold text-tinta"
        >
          Mensaje *
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          className="w-full resize-none rounded-sm border border-acero-light px-4 py-2 focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/30"
          placeholder="Escribe tu mensaje aquí…"
        />
      </div>

      <HumanCheckField
        ref={humanCheck}
        describedById={state.status === "error" ? "form-error" : undefined}
        onReadyChange={setCheckReady}
      />

      {state.status === "error" && state.message && (
        <p id="form-error" role="alert" className="text-sm text-teatro">
          {state.message}
        </p>
      )}

      <SubmitButton disabled={!checkReady} />
      <p className="text-center text-sm text-acero">* Campos obligatorios</p>
    </form>
  );
}
