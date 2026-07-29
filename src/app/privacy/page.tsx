import type { Metadata } from "next";
import { TrustPage } from "@/components/TrustPage";
export const metadata: Metadata = { title: "Privacy", description: "How Infinity Water handles information submitted through this website." };
export default function PrivacyPage() { return <TrustPage eyebrow="Trust" title="Privacy" intro="We collect only the information needed to answer requests, coordinate orders, and improve the experience.">
  <section><h2>Information you provide</h2><p>When you submit an inquiry, we may receive your name, contact details, organization, location, order interests, and any message you choose to share.</p></section>
  <section><h2>How it is used</h2><p>We use submitted information to respond, qualify and fulfill requests, provide customer support, maintain business records, prevent misuse, and understand website performance.</p></section>
  <section><h2>Service providers</h2><p>Information may be processed by trusted hosting, form, communications, analytics, and customer-management providers working on our behalf. We do not sell personal information.</p></section>
  <section><h2>Your choices</h2><p>You may request access, correction, or deletion through our contact page. Some records may be retained where required for security, legal, or transaction purposes.</p></section>
  <section><h2>Updates</h2><p>This notice may change as the service develops. The version displayed here is effective July 27, 2026.</p></section>
</TrustPage>; }
