import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function ArticleNotFound() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-content mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-h1-article text-azul font-bold mb-6">404</h1>
          <h2 className="text-2xl text-azul font-bold mb-4">Artículo no encontrado</h2>
          <p className="text-acero mb-8 leading-relaxed">
            Lo sentimos, el artículo que buscas no existe o ha sido eliminado.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/articulos"
              className="inline-block px-6 py-3 bg-coral text-white text-sm font-bold rounded-sm hover:bg-coral-dark transition-colors"
            >
              Ver todos los artículos
            </Link>
            <Link
              href="/"
              className="inline-block px-6 py-3 border-2 border-azul text-azul text-sm font-bold rounded-sm hover:bg-azul hover:text-white transition-colors"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
