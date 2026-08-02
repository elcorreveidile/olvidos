import { Github } from "lucide-react";
import Link from "next/link";
import { loginWithGithub, loginWithGoogle, loginWithCredentials } from "./actions";
import { MagicLinkForm } from "@/components/auth/MagicLinkForm";

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z"
      />
    </svg>
  );
}

interface LoginPageProps {
  searchParams: { error?: string; registro?: string };
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  const errorMessage = getErrorMessage(searchParams.error);
  const registrationMessage = getRegistrationMessage(searchParams.registro);

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


        {/* Registration Message */}
        {registrationMessage && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-sm">
            <p className="text-green-700 text-sm">{registrationMessage}</p>
          </div>
        )}
        {/* Error Message */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-sm">
            <p className="text-red-700 text-sm">{errorMessage}</p>
          </div>
        )}

        {/* Login Card */}
        <div className="bg-white rounded-sm shadow-card p-8">
          {/* Google Button */}
          <form action={loginWithGoogle} className="mb-3">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-sm hover:bg-gray-50 transition-colors"
            >
              <GoogleIcon />
              <span className="font-medium text-acero">
                Continuar con Google
              </span>
            </button>
          </form>

          {/* GitHub Button */}
          <form action={loginWithGithub} className="mb-6">
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
          <form action={loginWithCredentials} className="space-y-4">
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
                href="/recuperar-contrasena"
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

          {/* Enlace mágico (sin contraseña) */}
          <details className="mt-6 border-t border-gray-200 pt-6 group">
            <summary className="cursor-pointer list-none text-center text-sm font-medium text-coral hover:text-coral/80">
              Entrar con un enlace mágico (sin contraseña)
            </summary>
            <div className="mt-4">
              <p className="mb-4 text-sm text-acero-light">
                Te enviamos un enlace de acceso a tu correo. No necesitas
                recordar ninguna contraseña.
              </p>
              <MagicLinkForm />
            </div>
          </details>
        </div>

        {/* Register Link */}
        <div className="text-center mt-6">
          <p className="text-acero">
            ¿No eres socio aún?{" "}
            <Link href="/hazte-socio" className="text-coral hover:text-coral/80 font-medium">
              Hazte socio
            </Link>
          </p>
        </div>


        <div className="text-center mt-3">
          <p className="text-sm text-acero-light">
            ¿Prefieres crear una cuenta gratuita primero?{" "}
            <Link href="/registro" className="text-coral hover:text-coral/80 font-medium">
              Regístrate como usuario
            </Link>
          </p>
        </div>
        {/* Back to Home */}
        <div className="text-center mt-4">
          <Link
            href="/"
            className="text-sm text-acero-light hover:text-acero transition-colors"
          >
            ← Volver al inicio
          </Link>
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

function getRegistrationMessage(registro: string | undefined): string | null {
  if (!registro) return null;

  if (registro === "usuario-ok") {
    return "Cuenta creada correctamente. Ya puedes iniciar sesión y luego hacerte socio.";
  }

  if (registro === "ok") {
    return "Registro de socio completado. Inicia sesión para acceder a tu cuenta.";
  }

  return null;
}
