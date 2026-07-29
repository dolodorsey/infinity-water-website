import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://infinitywaterco.com"),
  title: {
    default: "Infinity Water — Premium Belgian Water",
    template: "%s | Infinity Water",
  },
  description: "Premium Belgian water in three distinctive collections. Discover Infinity Water or connect with our hospitality and distribution team.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Infinity Water — Water Without an Ending",
    description: "Born in Belgium. Sculpted for unforgettable tables, rooms, and moments.",
    url: "/",
    siteName: "Infinity Water",
    type: "website",
    images: [{ url: "/hero-splash.png", width: 1200, height: 630, alt: "Infinity Water gold collection" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Infinity Water — Water Without an Ending",
    description: "Premium Belgian water, designed as an experience.",
    images: ["/hero-splash.png"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">Skip to main content</a>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
