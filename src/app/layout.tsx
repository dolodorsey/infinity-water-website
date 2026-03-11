import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
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
      <body>{children}</body>
    </html>
  );
}
