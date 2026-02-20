import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

export const metadata: Metadata = {
  viewport: "width=device-width, initial-scale=1",
  title: {
    default: "[olvidos — Revista de acciones culturales",
    template: "%s | [olvidos",
  },
  description:
    "Olvidos de Granada — Revista de acciones culturales. Publicación de la Asociación Cultural Olvidos de Granada.",
  keywords: [
    "revista cultural",
    "Granada",
    "literatura",
    "poesía",
    "cultura",
    "Olvidos de Granada",
  ],
  authors: [{ name: "Asociación Cultural Olvidos de Granada" }],
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: "[olvidos — Revista de acciones culturales",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
