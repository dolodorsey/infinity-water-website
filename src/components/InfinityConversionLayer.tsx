"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export default function InfinityConversionLayer() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    try {
      const response = await fetch("/api/forms", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          brand_key: "infinity_water",
          formType: "email_updates",
          name: "Email subscriber",
          email,
          source: "Infinity Water website conversion layer",
          fields: {
            intent: "Launch and availability updates",
            consent: true,
            company_website: String(form.get("company_website") ?? ""),
          },
        }),
      });
      if (!response.ok) throw new Error("submit");
      event.currentTarget.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <aside className="infinity-conversion" aria-label="Infinity Water commercial actions">
      <div className="infinity-conversion__links">
        <Link href="/hospitality">Hospitality</Link>
        <Link href="/wholesale">Wholesale</Link>
        <Link className="infinity-conversion__primary" href="/connect">Start a conversation</Link>
      </div>
      <form className="infinity-conversion__email" onSubmit={submit}>
        <label htmlFor="infinity-updates-email">Launch + placement updates</label>
        <div>
          <input id="infinity-updates-email" name="email" type="email" autoComplete="email" placeholder="you@company.com" required />
          <input className="infinity-honeypot" name="company_website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
          <button disabled={status === "sending"}>{status === "sending" ? "…" : status === "sent" ? "✓" : "Join ↗"}</button>
        </div>
        <span aria-live="polite">{status === "error" ? "Try again" : status === "sent" ? "You’re on the list." : ""}</span>
      </form>
    </aside>
  );
}
