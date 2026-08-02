"use client";

import { useEffect } from "react";

export default function LoginError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Login page error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-azul mb-2">Error</h1>
          <p className="text-acero">
            Ha ocurrido un problema al cargar la página de login
          </p>
        </div>

        <div className="bg-white rounded-sm shadow-card p-8">
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-sm">
            <p className="text-red-700 text-sm mb-4">
              Error: {error.message || "Error desconocido"}
            </p>
            {error.digest && (
              <p className="text-red-600 text-xs">
                Código de error: {error.digest}
              </p>
            )}
          </div>

          {process.env.NODE_ENV === "development" && error.stack && (
            <details className="mb-6">
              <summary className="cursor-pointer text-sm font-medium text-gray-900 mb-2">
                Ver detalles técnicos
              </summary>
              <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto max-h-60">
                {error.stack}
              </pre>
            </details>
          )}

          <div className="space-y-3">
            <button
              onClick={reset}
              className="w-full px-6 py-3 bg-coral text-white font-bold rounded-sm hover:bg-coral-dark transition-colors"
            >
              Intentar de nuevo
            </button>
            <a
              href="/"
              className="block w-full px-6 py-3 text-center border border-gray-300 rounded-sm hover:bg-gray-50 transition-colors"
            >
              ← Volver al inicio
            </a>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Si el problema persiste, contacta a{" "}
            <a href="mailto:olvidosdegranada@gmail.com" className="text-coral hover:underline">
              olvidosdegranada@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
