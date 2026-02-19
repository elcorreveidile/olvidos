"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console for debugging
    console.error("Error caught by error.tsx:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-sm shadow-card p-8">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Algo salió mal</h1>

        <div className="space-y-4">
          <p className="text-gray-700">
            Ha ocurrido un error inesperado. Por favor, intenta de nuevo.
          </p>

          {process.env.NODE_ENV === "development" && (
            <details className="mt-4">
              <summary className="cursor-pointer text-sm font-medium text-gray-900">
                Detalles del error (desarrollo)
              </summary>
              <pre className="mt-2 text-xs bg-gray-100 p-4 rounded overflow-auto">
                {error.message}
                {error.stack && (
                  <span className="block mt-2 text-gray-600">
                    {error.stack}
                  </span>
                )}
                {error.digest && (
                  <div className="mt-2 text-sm">
                    <strong>Digest:</strong> {error.digest}
                  </div>
                )}
              </pre>
            </details>
          )}

          <div className="flex gap-4 mt-6">
            <button
              onClick={reset}
              className="flex-1 px-4 py-2 bg-coral text-white rounded-sm hover:bg-coral-dark transition-colors"
            >
              Intentar de nuevo
            </button>
            <a
              href="/"
              className="flex-1 px-4 py-2 border border-gray-300 text-center rounded-sm hover:bg-gray-50 transition-colors"
            >
              Ir al inicio
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
