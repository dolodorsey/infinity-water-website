import type { Metadata } from "next";
import InfinityExperienceLayer from "@/components/InfinityExperienceLayer";
import InfinityConversionLayer from "@/components/InfinityConversionLayer";
import "./globals.css";
import "./experience-layer.css";
import "./clean-hero.css";
import "./conversion-seo.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://watertoinfinity.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "Infinity Water",
  title: {
    default: "Infinity Water — Premium Hydration",
    template: "%s — Infinity Water",
  },
  description: "Premium water designed for hospitality, travel, events, retail and elevated everyday service. Explore Infinity Water collections, wholesale, hospitality and distribution programs.",
  keywords: [
    "Infinity Water",
    "premium water",
    "luxury bottled water",
    "hospitality water",
    "wholesale water",
    "water distribution",
    "event water",
    "premium hydration",
  ],
  category: "Food & Beverage",
  creator: "Infinity Water",
  publisher: "Infinity Water",
  alternates: { canonical: `${SITE_URL}/` },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  openGraph: {
    title: "Infinity Water — Premium Hydration",
    description: "Premium hydration built for hospitality, travel, events, retail and commercial programs.",
    type: "website",
    url: `${SITE_URL}/`,
    siteName: "Infinity Water",
    locale: "en_US",
    images: [{ url: "/lineup-full.png", alt: "Infinity Water collections" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Infinity Water — Premium Hydration",
    description: "Premium hydration built for hospitality, travel, events, retail and commercial programs.",
    images: ["/lineup-full.png"],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: "Infinity Water",
      description: "Premium water designed for hospitality, travel, events, retail and elevated everyday service.",
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "en-US",
    },
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Infinity Water",
      url: `${SITE_URL}/`,
      description: "Premium hydration brand serving hospitality, wholesale, distribution, travel and event programs.",
      image: `${SITE_URL}/lineup-full.png`,
    },
    {
      "@type": "Brand",
      "@id": `${SITE_URL}/#brand`,
      name: "Infinity Water",
      url: `${SITE_URL}/`,
      description: "Premium water and hydration brand.",
      image: `${SITE_URL}/lineup-full.png`,
    },
    {
      "@type": "Product",
      "@id": `${SITE_URL}/#product`,
      name: "Infinity Water",
      description: "Premium water presented across coordinated collections for hospitality, travel, events, retail and commercial programs.",
      category: "Premium Water",
      brand: { "@id": `${SITE_URL}/#brand` },
      image: `${SITE_URL}/lineup-full.png`,
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
        <InfinityExperienceLayer/>
        {children}
        <InfinityConversionLayer/>
      </body>
    </html>
  );
}
