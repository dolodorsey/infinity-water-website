import type { Metadata } from "next";
import { TrustPage } from "@/components/TrustPage";
export const metadata: Metadata = { title: "Terms", description: "Terms governing use of the Infinity Water website." };
export default function TermsPage() { return <TrustPage eyebrow="Website terms" title="Use with clarity." intro="These terms govern use of this website. Commercial orders remain subject to written confirmation, availability, pricing, shipping, and any separate agreement.">
  <section><h2>Website use</h2><p>You may use this site for lawful personal or business inquiries. Do not interfere with the service, submit false information, or attempt unauthorized access.</p></section>
  <section><h2>Product information</h2><p>Images, origin details, packaging, availability, and other product information may change. Nothing on this site guarantees inventory, territory rights, delivery timing, or acceptance of an order.</p></section>
  <section><h2>Intellectual property</h2><p>The Infinity Water name, presentation, imagery, and site content are protected materials and may not be commercially reused without permission.</p></section>
  <section><h2>Responsibility</h2><p>The site is provided on an as-available basis. To the extent permitted by law, we are not responsible for indirect loss arising from use of, or inability to use, the site.</p></section>
  <section><h2>Updates</h2><p>These terms may change as the service develops. The version displayed here is effective July 27, 2026.</p></section>
</TrustPage>; }
