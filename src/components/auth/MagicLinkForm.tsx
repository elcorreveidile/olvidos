"use client";

import { useRef, useState } from "react";
import {
  HumanCheckField,
  type HumanCheckHandle,
} from "@/components/shared/HumanCheckField";

type Status = "idle" | "sending" | "sent" | "error";

/**
 * Solicita un enlace mágico de acceso. Antes de enviarlo pide nombre + email y
 * una verificación humana (operación matemática + honeypot) que se revalida en
 * el servidor (POST /api/auth/magic-link). No revela si el email existe.
 */
export function MagicLinkForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const humanCheck = useRef<HumanCheckHandle>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    setStatus("sending");
    setMessage(null);

    try {
      const res = await fetch("/api/auth/magic-link", {
        method: "POST",
        body: formData,
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setStatus("sent");
        return;
      }

      setStatus("error");
      if (data?.error === "challenge") {
        setMessage("La verificación no es correcta. Prueba con la nueva operación.");
        humanCheck.current?.regenerate();
      } else {
        setMessage(
          typeof data?.error === "string"
            ? data.error
            : "No se pudo enviar el enlace. Inténtalo de nuevo."
        );
      }
    } catch {
      setStatus("error");
      setMessage("No se pudo enviar el enlace. Inténtalo de nuevo.");
    }
  }

  if (status === "sent") {
    return (
      <div
        role="status"
        className="rounded-sm border border-coral/40 bg-coral/5 p-4 text-center text-sm"
      >
        <p className="font-bold text-tinta">Revisa tu correo</p>
        <p className="mt-1 text-tinta/70">
          Si los datos son correctos, te hemos enviado un enlace para entrar.
          Caduca en 1 hora.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="ml-name"
          className="block text-sm font-medium text-acero mb-2"
        >
          Nombre
        </label>
        <input
          id="ml-name"
          name="name"
          type="text"
          required
          minLength={2}
          className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-coral focus:border-transparent"
          placeholder="Tu nombre"
        />
      </div>

      <div>
        <label
          htmlFor="ml-email"
          className="block text-sm font-medium text-acero mb-2"
        >
          Email
        </label>
        <input
          id="ml-email"
          name="email"
          type="email"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-coral focus:border-transparent"
          placeholder="tu@email.com"
        />
      </div>

      <HumanCheckField
        ref={humanCheck}
        onReadyChange={setReady}
        describedById={status === "error" ? "ml-error" : undefined}
      />

      {status === "error" && message && (
        <p id="ml-error" role="alert" className="text-sm text-teatro">
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={!ready || status === "sending"}
        className="w-full px-6 py-3 bg-coral text-white font-bold rounded-sm hover:bg-coral-dark transition-colors disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "sending" ? "Enviando…" : "Enviar enlace mágico"}
      </button>
    </form>
  );
}
