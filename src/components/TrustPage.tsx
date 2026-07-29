import type { ReactNode } from "react";

export function TrustPage({ eyebrow, title, intro, children }: {
  eyebrow: string;
  title: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <main id="main-content" className="trust-page">
      <a className="trust-home" href="/">Infinity Water</a>
      <header><p>{eyebrow}</p><h1>{title}</h1><div>{intro}</div></header>
      <article>{children}</article>
      <nav aria-label="Trust and support"><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/contact">Contact</a></nav>
    </main>
  );
}
