import Link from "next/link";
import { redirect } from "next/navigation";
import { signIn } from "@/lib/auth";

export const metadata = {
  title: "Entrar con enlace mágico",
  robots: { index: false, follow: false },
};

interface PageProps {
  searchParams: { token?: string; email?: string };
}

export default function MagicLinkVerifyPage({ searchParams }: PageProps) {
  const token = searchParams.token ?? "";
  const email = searchParams.email ?? "";
  const validLink = Boolean(token && email);

  // Server action: valida el token (provider "magic-link") y crea la sesión.
  // Se dispara con un botón (no auto-GET) para que un prefetch o un escáner de
  // correo no consuman el enlace de un solo uso.
  async function entrar() {
    "use server";
    if (!token || !email) redirect("/login?error=Verification");
    try {
      await signIn("magic-link", {
        token,
        email,
        redirectTo: "/post-login",
      });
    } catch (error) {
      // signIn lanza NEXT_REDIRECT cuando tiene éxito: hay que re-lanzarlo.
      if (error instanceof Error && error.message === "NEXT_REDIRECT") {
        throw error;
      }
      redirect("/login?error=EmailSignin");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-3xl font-black text-azul mb-2">Enlace mágico</h1>

        {validLink ? (
          <>
            <p className="text-acero mb-6">
              Pulsa el botón para entrar en tu cuenta de Olvidos de Granada.
            </p>
            <form action={entrar}>
              <button
                type="submit"
                className="w-full px-6 py-3 bg-coral text-white font-bold rounded-sm hover:bg-coral-dark transition-colors"
              >
                Entrar
              </button>
            </form>
            <p className="text-xs text-acero-light mt-4">
              El enlace caduca en 1 hora y solo puede usarse una vez.
            </p>
          </>
        ) : (
          <>
            <p className="text-acero mb-6">
              Este enlace no es válido o está incompleto. Solicita uno nuevo desde
              la página de acceso.
            </p>
            <Link
              href="/login"
              className="inline-block px-6 py-3 bg-coral text-white font-bold rounded-sm hover:bg-coral-dark transition-colors"
            >
              Volver al acceso
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
