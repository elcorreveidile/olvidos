"use client";

import { useState } from "react";
import Link from "next/link";

export default function RecuperarContrasenaPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "No se pudo procesar la solicitud");
        return;
      }

      setSuccess(result.message || "Si existe una cuenta con ese correo, te enviaremos instrucciones.");
      setEmail("");
    } catch (err) {
      console.error("Error solicitando recuperación:", err);
      setError("No se pudo procesar la solicitud. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-sm shadow-card p-8">
        <h1 className="text-3xl font-black text-azul mb-4">Recuperar contraseña</h1>
        <p className="text-acero mb-6">
          Introduce tu email y te enviaremos un enlace para restablecer tu contraseña.
        </p>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-sm">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 rounded-sm">
            <p className="text-green-700 text-sm">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-acero mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-coral focus:border-transparent"
              placeholder="tu@email.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-coral text-white font-bold rounded-sm hover:bg-coral-dark transition-colors disabled:opacity-50"
          >
            {loading ? "Enviando..." : "Enviar enlace de recuperación"}
          </button>
        </form>

        <p className="text-sm text-acero-light mt-5">
          Si sigues teniendo problemas, escríbenos a{" "}
          <a className="text-coral hover:text-coral/80" href="mailto:olvidosdegranada@gmail.com">
            olvidosdegranada@gmail.com
          </a>
          .
        </p>

        <Link
          href="/login"
          className="inline-block mt-6 px-6 py-3 bg-gray-100 text-acero font-bold rounded-sm hover:bg-gray-200 transition-colors"
        >
          Volver a iniciar sesión
        </Link>
      </div>
    </div>
  );
}
