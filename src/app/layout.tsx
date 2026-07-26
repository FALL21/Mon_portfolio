import type { Metadata, Viewport } from "next";
import { profile } from "@/data/portfolio";

// Polices auto-hébergées (aucune dépendance réseau au build → Docker reproductible)
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/plus-jakarta-sans/500.css";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";

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
    sameAs: [profile.linkedin],
    description: desc,
  };

  return (
    <html lang="fr">
      <body className="font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
