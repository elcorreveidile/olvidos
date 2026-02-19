import { signIn } from "@/lib/auth";
import { Github } from "lucide-react";
import { redirect } from "next/navigation";

interface LoginPageProps {
  searchParams: { error?: string };
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  const errorMessage = getErrorMessage(searchParams.error);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-azul mb-2">Iniciar Sesión</h1>
          <p className="text-acero">
            Accede a tu área de socio
          </p>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-sm">
            <p className="text-red-700 text-sm">{errorMessage}</p>
          </div>
        )}

        {/* Login Card */}
        <div className="bg-white rounded-sm shadow-card p-8">
          {/* GitHub Button */}
          <form
            action={async (formData: FormData) => {
              "use server";
              await signIn("github", { redirectTo: "/" });
            }}
            className="mb-6"
          >
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-sm hover:bg-gray-50 transition-colors"
            >
              <Github className="w-5 h-5" />
              <span className="font-medium text-acero">
                Continuar con GitHub
              </span>
            </button>
          </form>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-acero-light">o</span>
            </div>
          </div>

          {/* Credentials Form */}
          <form
            action={async (formData: FormData) => {
              "use server";
              const email = formData.get("email") as string;
              const password = formData.get("password") as string;

              await signIn("credentials", {
                email,
                password,
                redirectTo: "/admin",
              });
            }}
            className="space-y-4"
          >
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-acero mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-coral focus:border-transparent"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-acero mb-2">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-coral focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <div>
              <a
                href="#"
                className="text-sm text-coral hover:text-coral/80 transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 bg-coral text-white font-bold rounded-sm hover:bg-coral-dark transition-colors"
            >
              Iniciar Sesión
            </button>
          </form>
        </div>

        {/* Register Link */}
        <div className="text-center mt-6">
          <p className="text-acero">
            ¿No eres socio aún?{" "}
            <a href="/hazte-socio" className="text-coral hover:text-coral/80 font-medium">
              Hazte socio
            </a>
          </p>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-4">
          <a
            href="/"
            className="text-sm text-acero-light hover:text-acero transition-colors"
          >
            ← Volver al inicio
          </a>
        </div>
      </div>
    </div>
  );
}

function getErrorMessage(error: string | undefined): string | null {
  if (!error) return null;

  const errorMessages: Record<string, string> = {
    CredentialsSignin: "Email o contraseña incorrectos",
    Configuration: "Error de configuración del servidor. Contacta al administrador.",
    AccessDenied: "Acceso denegado",
    Verification: "Error de verificación",
    Default: "Error al iniciar sesión. Inténtalo de nuevo.",
    OAuthSignin: "Error al iniciar sesión con GitHub",
    OAuthCallbackError: "Error durante la autenticación con GitHub",
    OAuthCreateAccountError: "Error al crear la cuenta con GitHub",
    EmailCreateAccountError: "Error al crear la cuenta",
    EmailSignin: "Error al iniciar sesión con email",
  };

  return errorMessages[error] || errorMessages.Default;
}
