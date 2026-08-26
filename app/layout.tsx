import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { siteUrl } from "@/lib/site";
import SiteAnalytics from "./_components/analytics";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const TITULO = "Cumple RSVP";
const DESCRIPCION =
  "Invitá con un link y mirá quién confirma. Gratis, y tus invitados no tienen que crear cuenta.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: TITULO,
    template: `%s · ${TITULO}`,
  },
  description: DESCRIPCION,
  openGraph: {
    type: "website",
    siteName: TITULO,
    locale: "es_UY",
    title: TITULO,
    description: DESCRIPCION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITULO,
    description: DESCRIPCION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${fraunces.variable} ${inter.variable} font-body bg-paper text-ink antialiased`}>
        {children}
        <SiteAnalytics />
      </body>
    </html>
  );
}
