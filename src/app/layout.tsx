import type { Metadata } from "next";
import "./globals.css";
import "leaflet/dist/leaflet.css";

export const metadata: Metadata = {
  title: {
    default: "Chicago Pools Fildair",
    template: "%s | Chicago Pools Fildair",
  },
  description:
    "Chicago Pools Fildair vous propose des services complets pour vos projets de piscines : construction sur mesure, rénovation, entretien annuel, vente en gros de matériel.",
  keywords: [
    "piscines Tunisie",
    "équipements piscines",
    "Chicago Pools Fildair",
    "piscines hors sol",
    "piscines en Tunisie",
  ],
  authors: [{ name: "Chicago Pools Fildair", url: "https://piscinesfildairfrerestunisie.com" }],
  openGraph: {
    title: "Chicago Pools Fildair",
    description:
      "Chicago Pools Fildair vous propose des services complets pour vos projets de piscines : construction sur mesure, rénovation, entretien annuel, vente en gros de matériel.",
    url: "https://piscinesfildairfrerestunisie.com",
    siteName: "Chicago Pools Fildair",
    images: [
      {
        url: "https://www.piscinesfildairfrerestunisie.com/_next/image?url=%2Flogo.png&w=640&q=75",
        width: 1200,
        height: 630,
        alt: "Chicago Pools Fildair",
      },
    ],
    locale: "fr_TN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chicago Pools Fildair",
    description:
      "Chicago Pools Fildair vous propose des services complets pour vos projets de piscines : construction sur mesure, rénovation, entretien annuel, vente en gros de matériel.",
    images: ["https://www.piscinesfildairfrerestunisie.com/_next/image?url=%2Flogo.png&w=640&q=75"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  metadataBase: new URL("https://piscinesfildairfrerestunisie.com"),
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Chicago Pools Fildair",
    image: "https://www.piscinesfildairfrerestunisie.com/_next/image?url=%2Flogo.png&w=640&q=75",
    description:
      "Chicago Pools Fildair vous propose des services complets pour vos projets de piscines : construction sur mesure, rénovation, entretien annuel, vente en gros de matériel.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "km 13 av Fatouma Bourguiba",
      addressLocality: "La Soukra",
      postalCode: "2036",
      addressCountry: "Tunisia",
    },
    telephone: "+216 71 865 319",
    email: "fildairfreres@gmail.com",
    url: "https://piscinesfildairfrerestunisie.com",
    sameAs: [
      "https://www.facebook.com/profile.php?id=100007108443086&ref=ig_profile_ac",
      "https://www.instagram.com/fildair_bilel_abassi/",
      "https://www.tiktok.com/@fildairbilelabass",
    ],
  };

  return (
    <html lang="fr">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#274e9d" />

        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Chicago Pools Fildair" />
        <meta name="application-name" content="Chicago Pools Fildair" />

        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />

        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}