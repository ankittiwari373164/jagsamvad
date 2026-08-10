import type { Metadata } from "next";
import Script from "next/script";
import { Playfair_Display, Lora, Special_Elite, Yatra_One } from "next/font/google";
import "./globals.css";
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/types";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["500", "700", "800", "900"],
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
});

const typewriter = Special_Elite({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-typewriter",
});

const yatraOne = Yatra_One({
  subsets: ["latin", "devanagari"],
  weight: "400",
  variable: "--font-yatra",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Bollywood, Hollywood, Korean Movies & OTT News`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Jagsamvad is your daily newspaper for movie news, reviews and OTT releases — covering Bollywood, Hollywood and Korean cinema.",
  keywords: [
    "Jagsamvad",
    "movie news",
    "Bollywood news",
    "Hollywood news",
    "Korean movies",
    "OTT release",
    "movie reviews",
  ],
  authors: [{ name: "Jagsamvad Editorial" }],
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description:
      "Daily coverage of Bollywood, Hollywood, Korean cinema and OTT releases.",
    url: SITE_URL,
    locale: "en_IN",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description:
      "Daily coverage of Bollywood, Hollywood, Korean cinema and OTT releases.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  // Add your real Google Search Console verification code via the
  // GOOGLE_SITE_VERIFICATION env var — until then this tag is simply
  // omitted rather than shipping a fake placeholder value.
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
  other: {
    "google-adsense-account": "ca-pub-8626192603675744",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description:
      "Jagsamvad covers Bollywood, Hollywood, Korean cinema and OTT releases.",
  };

  return (
    <html lang="en">
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8626192603675744"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body
        className={`${playfair.variable} ${lora.variable} ${typewriter.variable} ${yatraOne.variable} antialiased bg-paper text-ink`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}