import type { Metadata } from "next";
import { TrustPage } from "@/components/TrustPage";
export const metadata: Metadata = { title: "Contact", description: "Contact Infinity Water for private orders, hospitality, distribution, or support." };
export default function ContactPage() { return <TrustPage eyebrow="Concierge" title="Begin the conversation." intro="Choose the route that best fits your request. Our team will respond using the details you provide.">
  <section><h2>Private orders and support</h2><p>For product questions, an existing request, or a private order.</p><a className="trust-cta" href="/forms/inquiry?interest=customer-support">Contact the concierge</a></section>
  <section><h2>Hospitality and distribution</h2><p>For restaurants, hotels, events, retail, wholesale, and territory conversations.</p><a className="trust-cta" href="/forms/group_pricing?interest=trade">Start a trade inquiry</a></section>
  <section><h2>Response expectations</h2><p>Please include the market, intended use, approximate volume, and timing when known. Submitting a request does not confirm inventory, pricing, or delivery.</p></section>
</TrustPage>; }
