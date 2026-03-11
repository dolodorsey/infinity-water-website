"use client";

import { useState, useEffect, useRef, ReactNode } from "react";

// ═══════════════════════════════════════════════════════════════════
// INFINITY WATER — "LIQUID SCULPTURE"
// Aesthetic: Industrial water ritual meets museum gallery
// Material: Frosted glass, liquid mercury, polished concrete
// Motion Grammar: Slow, weighted, gravitational
// ONE Dominant Interaction: Video-to-sculpture morph on scroll
// ═══════════════════════════════════════════════════════════════════

const C = {
  void: "#0C1117",
  deep: "#24333F",
  water: "#4B6E9A",
  ice: "#F8F9F7",
  mist: "#C9D2D9",
  frost: "#ADB8C1",
  glow: "#7BA7CC",
  surface: "#E8ECF0",
  faint: "#1A2530",
};

// ─── SVG Grain ───
const GrainOverlay = () => (
  <div className="grain-overlay">
    <svg width="100%" height="100%">
      <filter id="grain">
        <feTurbulence baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain)" />
    </svg>
  </div>
);

// ─── Cursor Glow ───
function CursorGlow() {
  const [pos, setPos] = useState({ x: -400, y: -400 });
  useEffect(() => {
    const move = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return (
    <div
      className="cursor-glow"
      style={{ transform: `translate(${pos.x - 250}px, ${pos.y - 250}px)` }}
    />
  );
}

// ─── Preloader ───
function Preloader({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 100);
    const t2 = setTimeout(() => setPhase(2), 1800);
    const t3 = setTimeout(() => setPhase(3), 2600);
    const t4 = setTimeout(() => onComplete(), 3200);
    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4);
    };
  }, [onComplete]);

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 10000,
        background: C.void,
        display: "flex", alignItems: "center", justifyContent: "center",
        opacity: phase >= 3 ? 0 : 1,
        transition: "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        pointerEvents: phase >= 3 ? "none" : "all",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            width: 2,
            height: phase >= 1 ? 60 : 0,
            background: `linear-gradient(180deg, transparent, ${C.water})`,
            margin: "0 auto 32px",
            transition: "height 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
            borderRadius: 1,
          }}
        />
        <div
          style={{
            fontFamily: "'Cormorant', serif",
            fontSize: 13,
            letterSpacing: "0.5em",
            textTransform: "uppercase",
            color: C.mist,
            opacity: phase >= 2 ? 1 : 0,
            transform: phase >= 2 ? "translateY(0)" : "translateY(12px)",
            transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          Infinity Water
        </div>
      </div>
    </div>
  );
}

// ─── useInView ───
function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) { setVisible(true); obs.unobserve(el); }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible] as const;
}

// ─── Reveal wrapper ───
function R({
  children, delay = 0, direction = "up", style = {}, className = "",
}: {
  children: ReactNode; delay?: number; direction?: string;
  style?: React.CSSProperties; className?: string;
}) {
  const [ref, vis] = useInView();
  const transforms: Record<string, string> = {
    up: "translateY(60px)",
    down: "translateY(-40px)",
    left: "translateX(80px)",
    right: "translateX(-80px)",
    scale: "scale(0.92)",
  };
  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity: vis ? 1 : 0,
        transform: vis ? "translate(0) scale(1)" : transforms[direction] || transforms.up,
        transition: `all 1s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
        willChange: "transform, opacity",
      }}
    >
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// HERO
// ═══════════════════════════════════════════════════════════════════
function Hero() {
  const [ready, setReady] = useState(false);
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => { setTimeout(() => setReady(true), 3400); }, []);
  useEffect(() => {
    const fn = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <section
      onMouseMove={(e) =>
        setMouse({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight })
      }
      style={{
        height: "100vh", position: "relative", overflow: "hidden",
        background: C.void, cursor: "crosshair",
      }}
    >
      <video
        autoPlay muted loop playsInline
        style={{
          position: "absolute", inset: "-5%", width: "110%", height: "110%",
          objectFit: "cover",
          opacity: ready ? 0.7 : 0,
          filter: "brightness(0.6) contrast(1.1) saturate(0.8)",
          transition: "opacity 2.5s cubic-bezier(0.16, 1, 0.3, 1)",
          transform: `scale(${1.05 + scrollY * 0.0002}) translate(${(mouse.x - 0.5) * -15}px, ${(mouse.y - 0.5) * -15}px)`,
        }}
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>

      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${C.void}E0 0%, ${C.void}20 35%, ${C.void}10 55%, ${C.void}D0 100%)`, zIndex: 1 }} />
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at ${mouse.x * 100}% ${mouse.y * 100}%, ${C.water}12 0%, transparent 50%)`, zIndex: 1, transition: "background 1.5s ease" }} />

      <div style={{ position: "absolute", top: "50%", left: "8vw", right: "8vw", height: 1, background: `linear-gradient(90deg, transparent, ${C.frost}15, transparent)`, zIndex: 2, opacity: ready ? 1 : 0, transition: "opacity 2s ease 1s" }} />

      <div style={{ position: "absolute", bottom: "18vh", left: "8vw", zIndex: 3, maxWidth: "70vw" }}>
        <div style={{
          fontFamily: "'DM Mono', monospace", fontSize: "clamp(9px, 0.8vw, 11px)",
          letterSpacing: "0.5em", textTransform: "uppercase", color: C.water,
          marginBottom: 24, opacity: ready ? 1 : 0,
          transform: ready ? "translateX(0)" : "translateX(-30px)",
          transition: "all 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
        }}>
          Est. 2024 — Premium Hydration
        </div>

        <h1 style={{
          fontFamily: "'Cormorant', serif",
          fontSize: "clamp(56px, 14vw, 200px)", fontWeight: 300,
          lineHeight: 0.85, letterSpacing: "-0.04em", color: C.ice, margin: 0,
        }}>
          <span style={{
            display: "block", opacity: ready ? 1 : 0,
            transform: ready ? "translateY(0)" : "translateY(100%)",
            transition: "all 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.4s",
          }}>The</span>
          <span style={{
            display: "block", fontStyle: "italic", opacity: ready ? 1 : 0,
            transform: ready ? "translateY(0)" : "translateY(100%)",
            transition: "all 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.55s",
          }}>Chamber</span>
        </h1>

        <div style={{
          marginTop: 40, marginLeft: "clamp(80px, 12vw, 200px)",
          opacity: ready ? 1 : 0, transform: ready ? "translateY(0)" : "translateY(30px)",
          transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.9s",
        }}>
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(13px, 1.1vw, 16px)",
            fontWeight: 300, color: C.frost, lineHeight: 1.6, maxWidth: 340,
          }}>
            Where industrial precision meets the ritual of hydration. Sourced. Filtered. Sculpted.
          </p>
        </div>
      </div>

      <div style={{
        position: "absolute", right: "6vw", top: "50%",
        transform: "translateY(-50%) rotate(90deg)", transformOrigin: "center", zIndex: 3,
        fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: "0.4em",
        textTransform: "uppercase", color: C.frost,
        opacity: ready ? 0.3 : 0, transition: "opacity 1.5s ease 1.2s", whiteSpace: "nowrap",
      }}>
        Scroll to explore →
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════
// THESIS
// ═══════════════════════════════════════════════════════════════════
function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ borderLeft: `1px solid ${C.mist}`, paddingLeft: 16 }}>
      <div style={{ fontFamily: "'Cormorant', serif", fontSize: 32, fontWeight: 300, color: C.deep, lineHeight: 1 }}>{value}</div>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: "0.3em", textTransform: "uppercase", color: C.frost, marginTop: 6 }}>{label}</div>
    </div>
  );
}

function Thesis() {
  return (
    <section style={{ minHeight: "100vh", background: C.ice, display: "flex", alignItems: "center", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", right: "-8vw", top: "50%", transform: "translateY(-50%)", fontFamily: "'Cormorant', serif", fontSize: "clamp(300px, 45vw, 600px)", fontWeight: 300, fontStyle: "italic", color: C.mist, opacity: 0.08, lineHeight: 0.8, userSelect: "none" }}>∞</div>
      <div style={{ padding: "140px 8vw", maxWidth: "100%", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: "42vw" }}>
          <R><div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: "0.4em", textTransform: "uppercase", color: C.water, marginBottom: 40, display: "flex", alignItems: "center", gap: 16 }}><span style={{ width: 40, height: 1, background: C.water, display: "inline-block" }} />Philosophy</div></R>
          <R delay={0.12}><h2 style={{ fontFamily: "'Cormorant', serif", fontSize: "clamp(40px, 5.5vw, 80px)", fontWeight: 300, lineHeight: 1, letterSpacing: "-0.03em", color: C.deep, margin: "0 0 48px" }}>Water is not<br />a commodity.<br /><em style={{ color: C.water }}>It is architecture.</em></h2></R>
          <R delay={0.25}><p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(14px, 1.2vw, 17px)", fontWeight: 300, lineHeight: 1.8, color: C.deep, opacity: 0.55, maxWidth: 400, marginLeft: 56 }}>Every molecule filtered through seven stages of obsession. Every bottle presented as a finished object — not a container, but a commitment to purity.</p></R>
          <R delay={0.35}><div style={{ marginTop: 56, marginLeft: 56, display: "flex", gap: 32 }}><Metric label="pH" value="9.5" /><Metric label="TDS" value="< 30" /><Metric label="Stages" value="7" /></div></R>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════
// PRODUCTS
// ═══════════════════════════════════════════════════════════════════
function Products() {
  const [active, setActive] = useState(0);
  const products = [
    { name: "Still", sub: "Pure. Balanced. Essential.", ph: "7.4", tds: "45", vol: "750ml", desc: "The foundation. Seven-stage filtered, mineral-rebalanced, bottled at source. Nothing added. Nothing compromised.", grad: `linear-gradient(160deg, ${C.water}15, ${C.mist}30)` },
    { name: "Sparkling", sub: "Effervescent. Crisp. Refined.", ph: "5.5", tds: "52", vol: "750ml", desc: "Natural carbonation meets precision filtration. The sharpness of intention in every bubble.", grad: `linear-gradient(160deg, ${C.glow}15, ${C.mist}20)` },
    { name: "Alkaline", sub: "Elevated. Restorative. Infinite.", ph: "9.5+", tds: "< 30", vol: "1L", desc: "pH-elevated for those who optimize everything. The purest expression of what water should be.", grad: `linear-gradient(160deg, ${C.deep}10, ${C.water}15)` },
  ];
  const p = products[active];

  return (
    <section style={{ minHeight: "100vh", background: C.void, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 70% 40%, ${C.water}08, transparent 60%)` }} />
      <div style={{ padding: "120px 8vw", position: "relative", zIndex: 1 }}>
        <R><div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: "0.4em", textTransform: "uppercase", color: C.water, marginBottom: 64, display: "flex", alignItems: "center", gap: 16 }}><span style={{ width: 40, height: 1, background: C.water, display: "inline-block" }} />The Collection</div></R>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8vw", alignItems: "center" }}>
          <div>
            <R delay={0.1}><div style={{ display: "flex", gap: 0, marginBottom: 56 }}>
              {products.map((prod, i) => (
                <button key={prod.name} onClick={() => setActive(i)} style={{ fontFamily: "'Cormorant', serif", fontSize: "clamp(28px, 3vw, 44px)", fontWeight: active === i ? 400 : 300, color: active === i ? C.ice : C.frost, opacity: active === i ? 1 : 0.25, background: "none", border: "none", cursor: "pointer", padding: "8px 24px 8px 0", transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)", borderBottom: active === i ? `1px solid ${C.water}` : "1px solid transparent", letterSpacing: "-0.02em" }}>{prod.name}</button>
              ))}
            </div></R>

            <R delay={0.2}><div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 300, letterSpacing: "0.15em", textTransform: "uppercase", color: C.water, marginBottom: 24 }}>{p.sub}</div></R>
            <R delay={0.25}><p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(14px, 1.1vw, 16px)", fontWeight: 300, lineHeight: 1.8, color: C.frost, opacity: 0.6, maxWidth: 380, marginBottom: 48 }}>{p.desc}</p></R>

            <R delay={0.35}><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24, padding: "28px 0", borderTop: `1px solid ${C.faint}`, borderBottom: `1px solid ${C.faint}` }}>
              {[{ l: "pH Level", v: p.ph }, { l: "TDS (ppm)", v: p.tds }, { l: "Volume", v: p.vol }].map((s) => (
                <div key={s.l}><div style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: "0.25em", textTransform: "uppercase", color: C.frost, opacity: 0.4, marginBottom: 8 }}>{s.l}</div><div style={{ fontFamily: "'Cormorant', serif", fontSize: 28, fontWeight: 300, color: C.glow }}>{s.v}</div></div>
              ))}
            </div></R>

            <R delay={0.4}><a href="#contact" style={{ display: "inline-block", marginTop: 40, fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: C.void, background: C.ice, padding: "14px 40px", textDecoration: "none", transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)" }} onMouseEnter={(e) => { (e.target as HTMLElement).style.background = C.water; (e.target as HTMLElement).style.color = C.ice; }} onMouseLeave={(e) => { (e.target as HTMLElement).style.background = C.ice; (e.target as HTMLElement).style.color = C.void; }}>Order Now</a></R>
          </div>

          {/* Bottle sculpture */}
          <R delay={0.15} direction="left">
            <div style={{ position: "relative", height: "clamp(400px, 55vh, 700px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ position: "absolute", width: "clamp(220px, 18vw, 320px)", height: "clamp(220px, 18vw, 320px)", borderRadius: "50%", border: `1px solid ${C.water}12`, boxShadow: `0 0 120px ${C.water}08, inset 0 0 80px ${C.water}05` }} />
              <div style={{ width: "clamp(80px, 6vw, 100px)", height: "clamp(300px, 40vh, 480px)", background: p.grad, border: `1px solid ${C.water}18`, borderRadius: "12px 12px 6px 6px", position: "relative", transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)", boxShadow: `0 40px 80px ${C.void}80, 0 0 1px ${C.water}20` }}>
                <div style={{ position: "absolute", top: -40, left: "50%", transform: "translateX(-50%)", width: "clamp(24px, 2vw, 32px)", height: 44, background: `linear-gradient(180deg, ${C.water}08, ${C.water}15)`, border: `1px solid ${C.water}15`, borderBottom: "none", borderRadius: "6px 6px 0 0" }} />
                <div style={{ position: "absolute", top: -50, left: "50%", transform: "translateX(-50%)", width: "clamp(28px, 2.2vw, 36px)", height: 14, background: C.water, opacity: 0.2, borderRadius: "4px 4px 0 0" }} />
                <div style={{ position: "absolute", top: "35%", left: 12, right: 12, height: 80, borderTop: `1px solid ${C.water}10`, borderBottom: `1px solid ${C.water}10`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  <span style={{ fontFamily: "'Cormorant', serif", fontSize: 8, letterSpacing: "0.3em", textTransform: "uppercase", color: C.ice, opacity: 0.3 }}>Infinity</span>
                  <span style={{ fontFamily: "'Cormorant', serif", fontSize: 18, fontWeight: 300, fontStyle: "italic", color: C.ice, opacity: 0.15 }}>∞</span>
                </div>
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "65%", background: `linear-gradient(180deg, ${C.water}05, ${C.water}12)`, borderRadius: "0 0 6px 6px" }} />
              </div>
              <div style={{ position: "absolute", top: "15%", right: "10%", fontFamily: "'DM Mono', monospace", fontSize: 8, color: C.frost, opacity: 0.2, letterSpacing: "0.2em" }}>pH {p.ph}</div>
              <div style={{ position: "absolute", bottom: "20%", left: "8%", fontFamily: "'DM Mono', monospace", fontSize: 8, color: C.frost, opacity: 0.2, letterSpacing: "0.2em" }}>{p.vol}</div>
            </div>
          </R>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════
// PROOF
// ═══════════════════════════════════════════════════════════════════
function Proof() {
  const stats = [
    { v: "99.9", u: "%", l: "Purity Rating" },
    { v: "7", u: " Stage", l: "Filtration System" },
    { v: "48", u: "hr", l: "Batch Testing" },
    { v: "∞", u: "", l: "Standard" },
  ];
  return (
    <section style={{ padding: "160px 8vw", background: C.ice, position: "relative", overflow: "hidden" }}>
      {[25, 50, 75].map((p) => (
        <div key={p} style={{ position: "absolute", top: 0, bottom: 0, left: `${p}%`, width: 1, background: `${C.mist}30` }} />
      ))}
      <R><h2 style={{ fontFamily: "'Cormorant', serif", fontSize: "clamp(48px, 8vw, 120px)", fontWeight: 300, fontStyle: "italic", lineHeight: 0.9, letterSpacing: "-0.04em", color: C.deep, margin: "0 0 100px", position: "relative", zIndex: 1 }}>Proof.</h2></R>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", position: "relative", zIndex: 1 }}>
        {stats.map((s, i) => (
          <R key={s.l} delay={0.1 + i * 0.1}>
            <div style={{ padding: "40px 24px 40px 0" }}>
              <div style={{ fontFamily: "'Cormorant', serif", fontSize: "clamp(56px, 7vw, 96px)", fontWeight: 300, color: C.water, lineHeight: 1, display: "flex", alignItems: "baseline" }}>
                {s.v}<span style={{ fontSize: "clamp(16px, 2vw, 24px)", fontFamily: "'DM Mono', monospace", fontWeight: 300, marginLeft: 4 }}>{s.u}</span>
              </div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase", color: C.frost, opacity: 0.5, marginTop: 16 }}>{s.l}</div>
            </div>
          </R>
        ))}
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════
// PROCESS
// ═══════════════════════════════════════════════════════════════════
function Process() {
  const steps = [
    { n: "01", t: "Source", d: "Protected aquifers. Zero industrial contamination. Quarterly testing against 200+ parameters." },
    { n: "02", t: "Filter", d: "Reverse osmosis. UV purification. Mineral rebalancing. Seven stages between source and seal." },
    { n: "03", t: "Test", d: "48-hour batch quarantine. Nothing ships without passing every benchmark." },
    { n: "04", t: "Present", d: "Precision-engineered vessels. Designed to preserve purity and elevate the act of drinking." },
  ];
  return (
    <section style={{ minHeight: "100vh", background: C.void, padding: "140px 8vw", position: "relative" }}>
      <div style={{ position: "absolute", top: 0, left: "50%", bottom: 0, width: 1, background: `${C.faint}80` }} />
      <R><div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: "0.4em", textTransform: "uppercase", color: C.water, marginBottom: 80, display: "flex", alignItems: "center", gap: 16 }}><span style={{ width: 40, height: 1, background: C.water, display: "inline-block" }} />Process</div></R>
      {steps.map((step, i) => (
        <R key={step.n} delay={0.08 * i}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8vw", padding: "56px 0", borderBottom: i < steps.length - 1 ? `1px solid ${C.faint}` : "none", position: "relative" }}>
            <div style={{ textAlign: i % 2 === 0 ? "right" : "left", paddingRight: i % 2 === 0 ? "4vw" : 0, paddingLeft: i % 2 === 0 ? 0 : "4vw", order: i % 2 === 0 ? 0 : 1 }}>
              <span style={{ fontFamily: "'Cormorant', serif", fontSize: "clamp(56px, 6vw, 80px)", fontWeight: 300, color: C.faint }}>{step.n}</span>
            </div>
            <div style={{ paddingLeft: i % 2 === 0 ? "4vw" : 0, paddingRight: i % 2 === 0 ? 0 : "4vw", order: i % 2 === 0 ? 1 : 0, textAlign: i % 2 === 0 ? "left" : "right" }}>
              <h3 style={{ fontFamily: "'Cormorant', serif", fontSize: "clamp(28px, 3vw, 44px)", fontWeight: 400, color: C.ice, margin: "0 0 16px" }}>{step.t}</h3>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 300, lineHeight: 1.7, color: C.frost, opacity: 0.5, maxWidth: 360, marginLeft: i % 2 === 0 ? 0 : "auto" }}>{step.d}</p>
            </div>
          </div>
        </R>
      ))}
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════
// GEOGRAPHY
// ═══════════════════════════════════════════════════════════════════
function Geography() {
  const [hovered, setHovered] = useState<number | null>(null);
  const cities = ["Atlanta", "New York", "Miami", "Los Angeles", "Chicago", "Houston", "Pittsburgh", "Charlotte"];
  return (
    <section style={{ padding: "160px 8vw", background: C.ice, position: "relative" }}>
      <R><h2 style={{ fontFamily: "'Cormorant', serif", fontSize: "clamp(48px, 8vw, 120px)", fontWeight: 300, lineHeight: 0.9, letterSpacing: "-0.04em", color: C.deep, margin: "0 0 80px" }}>Available<br /><em>everywhere<br />it matters.</em></h2></R>
      <R delay={0.2}><div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", borderTop: `1px solid ${C.mist}` }}>
        {cities.map((city, i) => (
          <div key={city} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)} style={{ padding: "32px 16px", borderBottom: `1px solid ${C.mist}`, borderRight: (i + 1) % 4 !== 0 ? `1px solid ${C.mist}` : "none", cursor: "default", position: "relative", overflow: "hidden", transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)", background: hovered === i ? C.deep : "transparent" }}>
            <span style={{ fontFamily: "'Cormorant', serif", fontSize: "clamp(20px, 2vw, 28px)", fontWeight: 400, color: hovered === i ? C.ice : C.deep, transition: "color 0.4s ease" }}>{city}</span>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: "0.3em", textTransform: "uppercase", color: hovered === i ? C.water : C.frost, opacity: hovered === i ? 0.8 : 0.3, marginTop: 8, transition: "all 0.4s ease" }}>Available</div>
          </div>
        ))}
      </div></R>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════
// PARTNERSHIP
// ═══════════════════════════════════════════════════════════════════
function Partnership() {
  return (
    <section style={{ minHeight: "80vh", background: C.void, display: "flex", alignItems: "center", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: "-5vw", top: "50%", transform: "translateY(-50%)", fontFamily: "'Cormorant', serif", fontSize: "clamp(120px, 20vw, 300px)", fontWeight: 700, fontStyle: "italic", color: C.faint, opacity: 0.3, lineHeight: 0.85, userSelect: "none", whiteSpace: "nowrap" }}>Partner</div>
      <div style={{ padding: "120px 8vw", position: "relative", zIndex: 1, maxWidth: "55vw", marginLeft: "auto" }}>
        <R><div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: "0.4em", textTransform: "uppercase", color: C.water, marginBottom: 32, display: "flex", alignItems: "center", gap: 16 }}><span style={{ width: 40, height: 1, background: C.water, display: "inline-block" }} />Wholesale & White-Label</div></R>
        <R delay={0.1}><h2 style={{ fontFamily: "'Cormorant', serif", fontSize: "clamp(36px, 4.5vw, 64px)", fontWeight: 300, lineHeight: 1.05, color: C.ice, margin: "0 0 28px", letterSpacing: "-0.02em" }}>Elevate your menu.<br /><em style={{ color: C.glow }}>Elevate your brand.</em></h2></R>
        <R delay={0.2}><p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 300, lineHeight: 1.8, color: C.frost, opacity: 0.5, maxWidth: 420, marginBottom: 48 }}>Select hotels, restaurants, and retailers who share our standard. White-label and custom branding available for qualifying partners.</p></R>
        <R delay={0.3}><div style={{ display: "flex", gap: 16 }}>
          <a href="#contact" style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: C.void, background: C.ice, padding: "14px 36px", textDecoration: "none", transition: "all 0.4s ease" }} onMouseEnter={(e) => { (e.target as HTMLElement).style.background = C.water; (e.target as HTMLElement).style.color = C.ice; }} onMouseLeave={(e) => { (e.target as HTMLElement).style.background = C.ice; (e.target as HTMLElement).style.color = C.void; }}>Become a Partner</a>
          <a href="#" style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: C.ice, border: `1px solid ${C.frost}25`, padding: "14px 36px", textDecoration: "none", transition: "all 0.4s ease", background: "transparent" }} onMouseEnter={(e) => { (e.target as HTMLElement).style.borderColor = C.water; }} onMouseLeave={(e) => { (e.target as HTMLElement).style.borderColor = `${C.frost}25`; }}>Wholesale</a>
        </div></R>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════
// CONVERSION
// ═══════════════════════════════════════════════════════════════════
function Conversion() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  return (
    <section id="contact" style={{ minHeight: "80vh", background: C.ice, display: "flex", alignItems: "center", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", fontFamily: "'Cormorant', serif", fontSize: "clamp(300px, 50vw, 700px)", fontWeight: 300, fontStyle: "italic", color: C.mist, opacity: 0.06, userSelect: "none" }}>∞</div>
      <div style={{ padding: "100px 8vw", position: "relative", zIndex: 1, width: "100%" }}>
        <R><h2 style={{ fontFamily: "'Cormorant', serif", fontSize: "clamp(48px, 10vw, 160px)", fontWeight: 300, lineHeight: 0.88, letterSpacing: "-0.04em", color: C.deep, margin: "0 0 56px" }}>Enter<br /><em>Infinity.</em></h2></R>
        <R delay={0.15}><div style={{ maxWidth: 500 }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 300, lineHeight: 1.7, color: C.deep, opacity: 0.5, marginBottom: 40 }}>First access to new releases, partner announcements, and invitations.</p>
          {!done ? (
            <div style={{ display: "flex", border: `1px solid ${C.deep}20`, background: C.surface }}>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" style={{ flex: 1, padding: "18px 24px", fontFamily: "'DM Mono', monospace", fontSize: 13, fontWeight: 300, border: "none", outline: "none", background: "transparent", color: C.deep, letterSpacing: "0.03em" }} />
              <button onClick={() => email && setDone(true)} style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", padding: "18px 32px", background: C.deep, color: C.ice, border: "none", cursor: "pointer", transition: "background 0.3s ease" }} onMouseEnter={(e) => { (e.target as HTMLElement).style.background = C.water; }} onMouseLeave={(e) => { (e.target as HTMLElement).style.background = C.deep; }}>Join</button>
            </div>
          ) : (
            <div style={{ fontFamily: "'Cormorant', serif", fontSize: 28, fontWeight: 300, fontStyle: "italic", color: C.water }}>Welcome to Infinity.</div>
          )}
        </div></R>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════
// NAV
// ═══════════════════════════════════════════════════════════════════
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "24px 8vw", display: "flex", justifyContent: "space-between", alignItems: "center", background: scrolled ? `${C.ice}F0` : "transparent", backdropFilter: scrolled ? "blur(24px) saturate(1.2)" : "none", borderBottom: scrolled ? `1px solid ${C.mist}40` : "1px solid transparent", transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)" }}>
      <a href="#" style={{ fontFamily: "'Cormorant', serif", fontSize: 16, fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: scrolled ? C.deep : C.ice, textDecoration: "none", transition: "color 0.5s ease" }}>Infinity</a>
      <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
        {["Collection", "Process", "Partners"].map((item) => (
          <a key={item} href="#" style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: scrolled ? C.deep : C.frost, textDecoration: "none", opacity: 0.6, transition: "all 0.3s ease" }} onMouseEnter={(e) => { (e.target as HTMLElement).style.opacity = "1"; }} onMouseLeave={(e) => { (e.target as HTMLElement).style.opacity = "0.6"; }}>{item}</a>
        ))}
        <a href="#contact" style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: scrolled ? C.ice : C.void, background: scrolled ? C.deep : C.ice, padding: "8px 20px", textDecoration: "none", transition: "all 0.4s ease" }}>Order</a>
      </div>
    </nav>
  );
}

// ═══════════════════════════════════════════════════════════════════
// FOOTER
// ═══════════════════════════════════════════════════════════════════
function Footer() {
  return (
    <footer style={{ background: C.void, padding: "64px 8vw 48px", borderTop: `1px solid ${C.faint}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div style={{ fontFamily: "'Cormorant', serif", fontSize: 20, fontWeight: 400, color: C.ice, letterSpacing: "0.1em", marginBottom: 12 }}>Infinity<span style={{ fontWeight: 300, fontStyle: "italic" }}> Water</span></div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: C.frost, opacity: 0.25, letterSpacing: "0.1em" }}>© 2026 Infinity Water — A Kollective Hospitality Group Brand</div>
        </div>
        <div style={{ display: "flex", gap: 28 }}>
          {["Instagram", "Press", "Legal"].map((l) => (
            <a key={l} href="#" style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", color: C.frost, textDecoration: "none", opacity: 0.3, transition: "opacity 0.3s ease" }} onMouseEnter={(e) => { (e.target as HTMLElement).style.opacity = "1"; }} onMouseLeave={(e) => { (e.target as HTMLElement).style.opacity = "0.3"; }}>{l}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}

// ═══════════════════════════════════════════════════════════════════
// PAGE
// ═══════════════════════════════════════════════════════════════════
export default function HomePage() {
  const [loaded, setLoaded] = useState(false);
  return (
    <main style={{ overflowX: "hidden" }}>
      <GrainOverlay />
      <CursorGlow />
      {!loaded && <Preloader onComplete={() => setLoaded(true)} />}
      <Nav />
      <Hero />
      <Thesis />
      <Products />
      <Proof />
      <Process />
      <Geography />
      <Partnership />
      <Conversion />
      <Footer />
    </main>
  );
}
