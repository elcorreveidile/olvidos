import type { Metadata, Viewport } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CurtainIntro } from "@/components/home/CurtainIntro";
import { ChromeGate } from "@/components/layout/ChromeGate";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import {
  SITE_URL,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_DESCRIPTION,
  ORGANIZATION,
} from "@/lib/site";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ff6261",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "revista cultural",
    "Granada",
    "literatura",
    "poesía",
    "cultura",
    "Olvidos de Granada",
    "hemeroteca",
  ],
  authors: [{ name: ORGANIZATION.name, url: SITE_URL }],
  creator: ORGANIZATION.name,
  publisher: ORGANIZATION.name,
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
  },
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: ORGANIZATION.name,
  url: SITE_URL,
  email: ORGANIZATION.email,
  description: SITE_DESCRIPTION,
  address: {
    "@type": "PostalAddress",
    streetAddress: "C/ Carmen, 51",
    postalCode: "18198",
    addressLocality: "Granada",
    addressCountry: "ES",
  },
};

/**
 * El layout no lee la sesión: hacerlo (`auth()` usa las cookies) volvía
 * dinámica toda la web y anulaba la caché. La cabecera y el pie deciden en el
 * navegador si hay sesión (`useSesionActiva`).
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased min-h-screen flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <ChromeGate
          curtain={<CurtainIntro />}
          header={<Header />}
          footer={<Footer />}
        >
          {children}
        </ChromeGate>
        <ScrollToTop />
      </body>
    </html>
  );
}
