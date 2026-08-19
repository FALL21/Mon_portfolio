import type { Metadata, Viewport } from "next";
import { profile } from "@/data/portfolio";
import { LocaleProvider } from "@/context/LocaleContext";

import "@fontsource/inter/latin-400.css";
import "@fontsource/plus-jakarta-sans/latin-600.css";
import "@fontsource/plus-jakarta-sans/latin-700.css";
import "@fontsource/plus-jakarta-sans/latin-800.css";
import "@fontsource/jetbrains-mono/latin-400.css";

import "./globals.css";

const url = "https://mameboufall.com";
const desc =
  "Ingénieur IA & Big Data et Développeur Full Stack. Je conçois et déploie des solutions d'Intelligence Artificielle, de Computer Vision et des plateformes SaaS de production.";

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title: `${profile.name} · ${profile.title}`,
  description: desc,
  keywords: [
    "Mame Bou FALL",
    "Ingénieur IA",
    "Big Data",
    "Développeur Full Stack",
    "Computer Vision",
    "Reconnaissance faciale",
    "Next.js",
    "Dakar",
    "Sénégal",
  ],
  authors: [{ name: profile.name }],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url,
    title: `${profile.name} · ${profile.title}`,
    description: desc,
    siteName: profile.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} · ${profile.title}`,
    description: desc,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#071A10",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.title,
    email: `mailto:${profile.email}`,
    address: { "@type": "PostalAddress", addressLocality: "Dakar", addressCountry: "SN" },
    sameAs: [profile.linkedin, profile.github],
    description: desc,
  };

  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
}
