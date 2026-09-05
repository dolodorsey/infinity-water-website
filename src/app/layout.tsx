import type { Metadata } from "next";
import InfinityExperienceLayer from "@/components/InfinityExperienceLayer";
import "./globals.css";
import "./experience-layer.css";
import "./clean-hero.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://infinity-water.vercel.app"),
  title: "Infinity Water — Premium Hydration",
  description: "Where industrial precision meets the ritual of hydration. Sourced. Filtered. Sculpted.",
  openGraph: {
    title: "Infinity Water — The Chamber of Infinity",
    description: "Premium hydration, sculpted for those who demand more.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body><InfinityExperienceLayer/>{children}</body>
    </html>
  );
}
