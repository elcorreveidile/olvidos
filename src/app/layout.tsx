import type { Metadata } from "next";
import { Libre_Franklin, Crimson_Text } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

// Fuentes de Google Fonts
const libreFranklin = Libre_Franklin({
  subsets: ["latin"],
  variable: "--font-libre-franklin",
  display: "swap",
  weight: ["400", "600", "700", "800", "900"],
});

const crimsonText = Crimson_Text({
  subsets: ["latin"],
  variable: "--font-crimson-text",
  display: "swap",
  weight: ["400"],
  style: ["normal", "italic"],
});

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
    <html lang="es" className={`${libreFranklin.variable} ${crimsonText.variable}`}>
      <body className={`${libreFranklin.className} antialiased min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
