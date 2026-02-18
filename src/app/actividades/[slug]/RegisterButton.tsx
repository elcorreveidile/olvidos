"use client";

import { useState } from "react";
import { registerForEvent, unregisterFromEvent } from "@/lib/actions/events";
import { useRouter } from "next/navigation";

interface RegisterButtonProps {
  eventId: string;
  isFull: boolean;
  isRegistered: boolean;
  registrationStatus: string | null;
  member: any;
  event: any;
}

export function RegisterButton({
  eventId,
  isFull,
  isRegistered,
  registrationStatus,
  member,
  event,
}: RegisterButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleRegister = async () => {
    setLoading(true);
    setMessage(null);

    const result = await registerForEvent(eventId);

    if (result.success) {
      setMessage({ type: "success", text: result.message || "Inscripción completada" });
      router.refresh();
    } else {
      setMessage({ type: "error", text: result.error || "Error al inscribirse" });
    }

    setLoading(false);
  };

  const handleUnregister = async () => {
    setLoading(true);
    setMessage(null);

    const result = await unregisterFromEvent(eventId);

    if (result.success) {
      setMessage({ type: "success", text: result.message || "Inscripción cancelada" });
      router.refresh();
    } else {
      setMessage({ type: "error", text: result.error || "Error al cancelar" });
    }

    setLoading(false);
  };

  // User not logged in
  if (!member) {
    return (
      <div>
        <p className="text-sm text-acero mb-4">
          Debes iniciar sesión para inscribirte en este evento.
        </p>
        <a
          href="/login"
          className="block w-full text-center px-6 py-3 bg-azul text-white font-bold rounded-sm hover:bg-azul/90 transition-colors"
        >
          Iniciar Sesión
        </a>
      </div>
    );
  }

  // Event is full
  if (isFull && !isRegistered) {
    return (
      <div>
        <p className="text-sm font-bold text-red-600 mb-4">
          Este evento está completo
        </p>
        <button
          disabled
          className="w-full px-6 py-3 bg-acero text-white font-bold rounded-sm cursor-not-allowed"
        >
          Evento Completo
        </button>
      </div>
    );
  }

  // User is already registered
  if (isRegistered) {
    return (
      <div>
        <p className="text-sm font-bold text-green-600 mb-4">
          {registrationStatus === "CONFIRMED" ? "✓ Inscripción confirmada" : "✓ Estás inscrito"}
        </p>
        <button
          onClick={handleUnregister}
          disabled={loading}
          className="w-full px-6 py-3 bg-red-500 text-white font-bold rounded-sm hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Cancelando..." : "Cancelar Inscripción"}
        </button>
      </div>
    );
  }

  // Register button
  const price = event.price && event.price > 0 ? `${event.price}€` : "gratis";

  return (
    <div>
      <button
        onClick={handleRegister}
        disabled={loading}
        className={`
          w-full px-6 py-3 text-white font-bold rounded-sm transition-colors
          ${loading ? "opacity-50 cursor-not-allowed" : ""}
          ${event.price && event.price > 0
            ? "bg-green-500 hover:bg-green-600"
            : "bg-coral hover:bg-coral/90"
          }
        `}
      >
        {loading ? "Inscribiendo..." : `Inscribirse ${price}`}
      </button>

      {event.membersOnly && (
        <p className="text-xs text-acero-light mt-2">
          Evento exclusivo para socios
        </p>
      )}

      {message && (
        <div
          className={`
            mt-4 p-3 rounded-sm text-sm
            ${message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
          `}
        >
          {message.text}
        </div>
      )}
    </div>
  );
}
