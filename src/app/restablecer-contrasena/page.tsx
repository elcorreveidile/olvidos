"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function RestablecerContrasenaContent() {
  const searchParams = useSearchParams();
  const email = useMemo(() => searchParams.get("email") || "", [searchParams]);
  const token = useMemo(() => searchParams.get("token") || "", [searchParams]);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const invalidLink = !email || !token;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "No se pudo restablecer la contraseña");
        return;
      }

      setSuccess("Contraseña actualizada. Ya puedes iniciar sesión.");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Error restableciendo contraseña:", err);
      setError("No se pudo restablecer la contraseña. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-sm shadow-card p-8">
        <h1 className="text-3xl font-black text-azul mb-4">Restablecer contraseña</h1>

        {invalidLink && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-sm">
            <p className="text-red-700 text-sm">Enlace inválido. Solicita una nueva recuperación.</p>
          </div>
        )}

        {!invalidLink && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-sm">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-sm">
                <p className="text-green-700 text-sm">{success}</p>
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-acero mb-2">
                Nueva contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-coral focus:border-transparent"
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-acero mb-2">
                Repite la contraseña
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-coral focus:border-transparent"
                placeholder="Repite la contraseña"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-coral text-white font-bold rounded-sm hover:bg-coral-dark transition-colors disabled:opacity-50"
            >
              {loading ? "Guardando..." : "Actualizar contraseña"}
            </button>
          </form>
        )}

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

export default function RestablecerContrasenaPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
          <div className="max-w-md w-full bg-white rounded-sm shadow-card p-8 text-center text-acero">
            Cargando formulario...
          </div>
        </div>
      }
    >
      <RestablecerContrasenaContent />
    </Suspense>
  );
}
