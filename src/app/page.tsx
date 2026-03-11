"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

const C = {
  void: "#0C1117", deep: "#24333F", water: "#4B6E9A", ice: "#F8F9F7",
  mist: "#C9D2D9", frost: "#ADB8C1", glow: "#7BA7CC", surface: "#E8ECF0",
  faint: "#1A2530", gold: "#C5A55A"
};

/* ─── Hooks ─── */
function useInView(t = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setV(true); obs.unobserve(el); }
    }, { threshold: t });
    obs.observe(el);
    return () => obs.disconnect();
  }, [t]);
  return [ref, v] as const;
}

function R({ children, delay = 0, dir = "up", style = {} }: {
  children: React.ReactNode; delay?: number; dir?: string; style?: React.CSSProperties;
}) {
  const [ref, vis] = useInView();
  const t: Record<string, string> = {
    up: "translateY(60px)", left: "translateX(80px)", right: "translateX(-80px)", scale: "scale(0.92)"
  };
  return (
    <div ref={ref} style={{
      ...style, opacity: vis ? 1 : 0,
      transform: vis ? "none" : t[dir] || t.up,
      transition: `all 1s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
      willChange: "transform,opacity"
    }}>{children}</div>
  );
}

/* ─── Ambient layers ─── */
const Grain = () => (
  <div style={{ position: "fixed", inset: 0, zIndex: 9999, pointerEvents: "none", mixBlendMode: "overlay", opacity: 0.03 }}>
    <svg width="100%" height="100%">
      <filter id="g"><feTurbulence baseFrequency="0.6" numOctaves="3" stitchTiles="stitch" /></filter>
      <rect width="100%" height="100%" filter="url(#g)" />
    </svg>
  </div>
);

function CursorGlow() {
  const [pos, setPos] = useState({ x: -400, y: -400 });
  useEffect(() => {
    const m = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", m);
    return () => window.removeEventListener("mousemove", m);
  }, []);
  return (
    <div style={{
      position: "fixed", zIndex: 9998, pointerEvents: "none",
      width: 500, height: 500, borderRadius: "50%",
      background: `radial-gradient(circle,${C.water}08 0%,transparent 70%)`,
      transform: `translate(${pos.x - 250}px,${pos.y - 250}px)`,
      transition: "transform 0.15s cubic-bezier(0.16,1,0.3,1)"
    }} />
  );
}

function Preloader({ onComplete }: { onComplete: () => void }) {
  const [p, setP] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setP(1), 100);
    const t2 = setTimeout(() => setP(2), 1600);
    const t3 = setTimeout(() => setP(3), 2200);
    const t4 = setTimeout(() => onComplete(), 2800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [onComplete]);
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 10000, background: C.void,
      display: "flex", alignItems: "center", justifyContent: "center",
      opacity: p >= 3 ? 0 : 1, transition: "opacity 0.6s ease",
      pointerEvents: p >= 3 ? "none" : "all"
    }}>
      <div style={{ textAlign: "center" }}>
        <div style={{
          width: 2, height: p >= 1 ? 60 : 0,
          background: `linear-gradient(180deg,transparent,${C.gold})`,
          margin: "0 auto 32px", transition: "height 1.2s cubic-bezier(0.16,1,0.3,1)", borderRadius: 1
        }} />
        <div style={{
          fontFamily: "'Cormorant',serif", fontSize: 13, letterSpacing: "0.5em",
          textTransform: "uppercase", color: C.mist,
          opacity: p >= 2 ? 1 : 0, transform: p >= 2 ? "translateY(0)" : "translateY(12px)",
          transition: "all 0.8s ease"
        }}>Infinity Water</div>
      </div>
    </div>
  );
}

/* ─── NAV ─── */
function Nav() {
  const [s, setS] = useState(false);
  useEffect(() => {
    const fn = () => setS(window.scrollY > 100);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      padding: "24px 8vw", display: "flex", justifyContent: "space-between", alignItems: "center",
      background: s ? `${C.ice}F0` : "transparent",
      backdropFilter: s ? "blur(24px) saturate(1.2)" : "none",
      borderBottom: s ? `1px solid ${C.mist}40` : "1px solid transparent",
      transition: "all 0.6s ease"
    }}>
      <a href="#" style={{
        fontFamily: "'Cormorant',serif", fontSize: 16, fontWeight: 500,
        letterSpacing: "0.15em", textTransform: "uppercase",
        color: s ? C.deep : C.ice, textDecoration: "none", transition: "color 0.5s ease"
      }}>Infinity</a>
      <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
        {["Collections", "Lifestyle", "Partners"].map(i => (
          <a key={i} href="#" className="nav-link-hide" style={{
            fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: "0.2em",
            textTransform: "uppercase", color: s ? C.deep : C.frost,
            textDecoration: "none", opacity: 0.6, transition: "all 0.3s ease"
          }}
            onMouseEnter={e => { (e.target as HTMLElement).style.opacity = "1"; }}
            onMouseLeave={e => { (e.target as HTMLElement).style.opacity = "0.6"; }}
          >{i}</a>
        ))}
        <a href="#order" style={{
          fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: "0.2em",
          textTransform: "uppercase", color: s ? C.ice : C.void,
          background: s ? C.deep : C.gold, padding: "8px 20px",
          textDecoration: "none", transition: "all 0.4s ease"
        }}>Order</a>
      </div>
    </nav>
  );
}

/* ─── HERO ─── */
function Hero() {
  const [ready, setReady] = useState(false);
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => { setTimeout(() => setReady(true), 3000); }, []);
  useEffect(() => {
    const fn = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <section
      onMouseMove={e => setMouse({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight })}
      style={{ height: "100vh", position: "relative", overflow: "hidden", background: C.void, cursor: "crosshair" }}
    >
      {/* Hero video — vignette masked to dissolve edges */}
      <div style={{
        position: "absolute", inset: "-5%", width: "110%", height: "110%",
        WebkitMaskImage: "radial-gradient(ellipse 72% 68% at 50% 50%, black 35%, transparent 100%)",
        maskImage: "radial-gradient(ellipse 72% 68% at 50% 50%, black 35%, transparent 100%)",
      }}>
        <video autoPlay muted loop playsInline style={{
          width: "100%", height: "100%", objectFit: "cover",
          opacity: ready ? 0.55 : 0, filter: "brightness(0.5) contrast(1.15) saturate(0.7)",
          transition: "opacity 2.5s cubic-bezier(0.16,1,0.3,1)",
          transform: `scale(${1.05 + scrollY * 0.0002}) translate(${(mouse.x - 0.5) * -12}px,${(mouse.y - 0.5) * -12}px)`
        }}>
          <source src="/hero.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Mouse-following gold glow */}
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse at ${mouse.x * 100}% ${mouse.y * 100}%,${C.gold}08 0%,transparent 50%)`,
        zIndex: 1, transition: "background 1.5s ease"
      }} />

      {/* Horizontal accent line */}
      <div style={{
        position: "absolute", top: "50%", left: "8vw", right: "8vw", height: 1,
        background: `linear-gradient(90deg,transparent,${C.gold}18,transparent)`,
        zIndex: 2, opacity: ready ? 1 : 0, transition: "opacity 2s ease 1s"
      }} />

      {/* Hero text */}
      <div style={{ position: "absolute", bottom: "16vh", left: "8vw", zIndex: 3, maxWidth: "70vw" }}>
        <div style={{
          fontFamily: "'DM Mono',monospace", fontSize: "clamp(9px,0.8vw,11px)",
          letterSpacing: "0.5em", textTransform: "uppercase", color: C.gold, marginBottom: 24,
          opacity: ready ? 1 : 0, transform: ready ? "translateX(0)" : "translateX(-30px)",
          transition: "all 1.2s cubic-bezier(0.16,1,0.3,1) 0.2s",
          display: "flex", alignItems: "center", gap: 12
        }}>
          <span style={{ width: 32, height: 1, background: C.gold, display: "inline-block" }} />
          Premium Hydration — 9 Collections
        </div>
        <h1 style={{
          fontFamily: "'Cormorant',serif", fontSize: "clamp(56px,14vw,200px)",
          fontWeight: 300, lineHeight: 0.85, letterSpacing: "-0.04em", color: C.ice, margin: 0
        }}>
          <span style={{
            display: "block", opacity: ready ? 1 : 0,
            transform: ready ? "translateY(0)" : "translateY(100%)",
            transition: "all 1.4s cubic-bezier(0.16,1,0.3,1) 0.4s"
          }}>Infinity</span>
          <span style={{
            display: "block", fontStyle: "italic", color: C.gold,
            opacity: ready ? 1 : 0, transform: ready ? "translateY(0)" : "translateY(100%)",
            transition: "all 1.4s cubic-bezier(0.16,1,0.3,1) 0.55s",
            textShadow: `0 0 80px ${C.gold}15`
          }}>Water</span>
        </h1>
        <div style={{
          marginTop: 40, marginLeft: "clamp(80px,12vw,200px)",
          opacity: ready ? 1 : 0, transform: ready ? "translateY(0)" : "translateY(30px)",
          transition: "all 1s cubic-bezier(0.16,1,0.3,1) 0.9s"
        }}>
          <p style={{
            fontFamily: "'DM Sans',sans-serif", fontSize: "clamp(13px,1.1vw,16px)",
            fontWeight: 300, color: C.frost, lineHeight: 1.6, maxWidth: 340
          }}>Sculpted for those who demand more. Nine metallic collections. One infinite standard.</p>
        </div>
      </div>
    </section>
  );
}

/* ─── HERO PRODUCT — spiral image edge-blended ─── */
function HeroProduct() {
  return (
    <section style={{ position: "relative", overflow: "hidden", background: C.ice }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "90vh" }}>
        <div style={{ display: "flex", alignItems: "center", padding: "100px 6vw 100px 8vw" }}>
          <div>
            <R><div style={{
              fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: "0.4em",
              textTransform: "uppercase", color: C.water, marginBottom: 40,
              display: "flex", alignItems: "center", gap: 12
            }}><span style={{ width: 40, height: 1, background: C.water, display: "inline-block" }} />The Vessel</div></R>
            <R delay={0.12}><h2 style={{
              fontFamily: "'Cormorant',serif", fontSize: "clamp(40px,5.5vw,80px)",
              fontWeight: 300, lineHeight: 1, letterSpacing: "-0.03em", color: C.deep, margin: "0 0 32px"
            }}>Not a bottle.<br /><em style={{ color: C.gold }}>A sculpture.</em></h2></R>
            <R delay={0.25}><p style={{
              fontFamily: "'DM Sans',sans-serif", fontSize: "clamp(14px,1.2vw,17px)",
              fontWeight: 300, lineHeight: 1.8, color: C.deep, opacity: 0.55, maxWidth: 400
            }}>Brushed metallic finish. Wine-bottle silhouette. Every color a statement. Precision-engineered to preserve purity and elevate the act of drinking.</p></R>
            <R delay={0.35}><div style={{ marginTop: 48, display: "flex", gap: 32 }}>
              {[{ n: "9", l: "Colors" }, { n: "750", l: "ml" }, { n: "∞", l: "Standard" }].map(s => (
                <div key={s.l} style={{ borderLeft: `1px solid ${C.mist}`, paddingLeft: 16 }}>
                  <div style={{ fontFamily: "'Cormorant',serif", fontSize: 32, fontWeight: 300, color: C.deep }}>{s.n}</div>
                  <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 8, letterSpacing: "0.3em", textTransform: "uppercase", color: C.frost, marginTop: 4 }}>{s.l}</div>
                </div>
              ))}
            </div></R>
          </div>
        </div>
        {/* Spiral image — edge-dissolved into light background */}
        <R delay={0.1} dir="left" style={{ position: "relative", minHeight: 500 }}>
          <div style={{
            position: "absolute", inset: 0,
            WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 15%, black 100%), linear-gradient(to bottom, black 0%, black 85%, transparent 100%)",
            maskImage: "linear-gradient(to right, transparent 0%, black 15%, black 100%), linear-gradient(to bottom, black 0%, black 85%, transparent 100%)",
            WebkitMaskComposite: "intersect" as unknown as string,
            maskComposite: "intersect",
          }}>
            <Image src="/hero-spiral.png" alt="Infinity Water Gold bottle with water spiral" fill style={{ objectFit: "cover", objectPosition: "center" }} priority />
          </div>
        </R>
      </div>
    </section>
  );
}

/* ─── COLLECTIONS — product images blended ─── */
function Collections() {
  const [active, setActive] = useState(0);
  const cols = [
    { name: "Gold Collection", sub: "Champagne · Bronze · 24K", img: "/gold-collection.jpg", desc: "The original. Brushed gold, champagne shimmer, and deep bronze. For those who set the standard." },
    { name: "Blue Collection", sub: "Aqua · Navy · Cobalt", img: "/blue-collection.jpg", desc: "Ocean depth meets precision engineering. Three blues that command attention." },
    { name: "Black Collection", sub: "Silver · Gunmetal · Obsidian", img: "/black-collection.png", desc: "The understated power move. Polished silver to matte obsidian. Elegance without explanation." },
  ];
  const c = cols[active];

  return (
    <section style={{ background: C.void, position: "relative", overflow: "hidden" }}>
      <div style={{ padding: "120px 8vw 0" }}>
        <R><div style={{
          fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: "0.4em",
          textTransform: "uppercase", color: C.gold, marginBottom: 48,
          display: "flex", alignItems: "center", gap: 12
        }}><span style={{ width: 40, height: 1, background: C.gold, display: "inline-block" }} />Three Collections</div></R>
        <R delay={0.1}><div style={{ display: "flex", gap: 0, marginBottom: 48 }}>
          {cols.map((col, i) => (
            <button key={col.name} onClick={() => setActive(i)} style={{
              fontFamily: "'Cormorant',serif", fontSize: "clamp(24px,2.5vw,40px)",
              fontWeight: active === i ? 400 : 300, color: active === i ? C.ice : C.frost,
              opacity: active === i ? 1 : 0.25, background: "none", border: "none",
              cursor: "pointer", padding: "12px 28px 12px 0",
              transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)",
              borderBottom: active === i ? `1px solid ${C.gold}` : "1px solid transparent",
              letterSpacing: "-0.02em"
            }}>{col.name}</button>
          ))}
        </div></R>
        <R delay={0.15}><p style={{
          fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 300,
          lineHeight: 1.7, color: C.frost, opacity: 0.5, maxWidth: 420, marginBottom: 24
        }}>{c.desc}</p></R>
        <R delay={0.2}><div style={{
          fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: "0.2em",
          textTransform: "uppercase", color: C.gold, marginBottom: 8
        }}>{c.sub}</div></R>
      </div>
      {/* Collection image — edge-dissolved, no hard rectangle */}
      <R delay={0.1}>
        <div style={{
          position: "relative", width: "100%", height: "clamp(400px,50vh,700px)", marginTop: 32,
          WebkitMaskImage: "radial-gradient(ellipse 80% 75% at 50% 48%, black 45%, transparent 100%)",
          maskImage: "radial-gradient(ellipse 80% 75% at 50% 48%, black 45%, transparent 100%)",
        }}>
          <Image src={c.img} alt={c.name} fill style={{ objectFit: "contain", objectPosition: "center", transition: "opacity 0.5s ease" }} />
        </div>
      </R>
      <div style={{ padding: "40px 8vw 100px", textAlign: "center" }}>
        <R delay={0.25}>
          <a href="#order" style={{
            display: "inline-block", fontFamily: "'DM Mono',monospace", fontSize: 10,
            letterSpacing: "0.25em", textTransform: "uppercase",
            color: C.void, background: C.gold, padding: "14px 40px",
            textDecoration: "none", transition: "all 0.4s ease"
          }}
            onMouseEnter={e => { (e.target as HTMLElement).style.background = C.ice; }}
            onMouseLeave={e => { (e.target as HTMLElement).style.background = C.gold; }}
          >Shop Collection</a>
        </R>
      </div>
    </section>
  );
}

/* ─── CINEMATIC SECTION — video edge-dissolved ─── */
function CinematicSection() {
  const [ref, vis] = useInView(0.3);
  return (
    <section ref={ref} style={{ position: "relative", height: "80vh", overflow: "hidden", background: C.void }}>
      {/* Video with vignette mask */}
      <div style={{
        position: "absolute", inset: "-5%", width: "110%", height: "110%",
        WebkitMaskImage: "radial-gradient(ellipse 70% 65% at 50% 50%, black 35%, transparent 100%)",
        maskImage: "radial-gradient(ellipse 70% 65% at 50% 50%, black 35%, transparent 100%)",
      }}>
        <video autoPlay muted loop playsInline style={{
          width: "100%", height: "100%", objectFit: "cover",
          opacity: vis ? 0.75 : 0, filter: "brightness(0.65) contrast(1.1) saturate(0.85)",
          transition: "opacity 2s cubic-bezier(0.16,1,0.3,1)"
        }}>
          <source src="/commercial.mp4" type="video/mp4" />
        </video>
      </div>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2 }}>
        <div style={{ textAlign: "center" }}>
          <R><div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: "0.5em", textTransform: "uppercase", color: C.gold, marginBottom: 24 }}>The Ritual</div></R>
          <R delay={0.15}><h2 style={{ fontFamily: "'Cormorant',serif", fontSize: "clamp(40px,7vw,100px)", fontWeight: 300, fontStyle: "italic", lineHeight: 0.9, letterSpacing: "-0.03em", color: C.ice, margin: 0 }}>Water, elevated<br />to an art form.</h2></R>
          <R delay={0.3}><p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 300, color: C.frost, opacity: 0.5, marginTop: 24, maxWidth: 400, marginLeft: "auto", marginRight: "auto" }}>Every pour is intentional. Every sip, a statement.</p></R>
        </div>
      </div>
    </section>
  );
}

/* ─── FULL LINEUP — edge-blended on light bg ─── */
function FullLineup() {
  return (
    <section style={{ position: "relative", background: C.ice, overflow: "hidden" }}>
      <div style={{ padding: "100px 8vw 40px" }}>
        <R><h2 style={{
          fontFamily: "'Cormorant',serif", fontSize: "clamp(48px,8vw,120px)",
          fontWeight: 300, fontStyle: "italic", lineHeight: 0.9,
          letterSpacing: "-0.04em", color: C.deep, margin: 0
        }}>The Full<br />Collection.</h2></R>
      </div>
      {/* All bottles — soft edge fade */}
      <R delay={0.15}>
        <div style={{
          position: "relative", width: "100%", height: "clamp(350px,45vh,600px)",
          WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 75%, transparent 100%), linear-gradient(to right, transparent 2%, black 10%, black 90%, transparent 98%)",
          maskImage: "linear-gradient(to bottom, black 0%, black 75%, transparent 100%), linear-gradient(to right, transparent 2%, black 10%, black 90%, transparent 98%)",
          WebkitMaskComposite: "intersect" as unknown as string,
          maskComposite: "intersect",
        }}>
          <Image src="/all-bottles.png" alt="All Infinity Water bottles" fill style={{ objectFit: "contain", objectPosition: "center" }} />
        </div>
      </R>
      <div style={{ padding: "40px 8vw 100px", display: "flex", justifyContent: "center", gap: 48, flexWrap: "wrap" }}>
        {["Silver", "Aqua", "Navy", "Gold", "Bronze", "Cobalt", "Gunmetal", "Obsidian", "24K"].map((color, i) => (
          <R key={color} delay={0.05 * i}>
            <span style={{
              fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: "0.2em",
              textTransform: "uppercase", color: C.frost, padding: "8px 0",
              borderBottom: `1px solid ${C.mist}40`
            }}>{color}</span>
          </R>
        ))}
      </div>
    </section>
  );
}

/* ─── LIFESTYLE GALLERY — vignette-masked images ─── */
function LifestyleGallery() {
  const scenes = [
    { img: "/lifestyle-picnic.png", label: "Golden Hour" },
    { img: "/lifestyle-club.png", label: "After Dark" },
    { img: "/lifestyle-festival.png", label: "Festival Season" },
    { img: "/lifestyle-gym.png", label: "Performance" },
    { img: "/lifestyle-beachgroup.png", label: "Coastline" },
    { img: "/luxury-yacht.png", label: "On Deck" },
  ];
  return (
    <section style={{ padding: "120px 8vw", background: C.void }}>
      <R><div style={{
        fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: "0.4em",
        textTransform: "uppercase", color: C.gold, marginBottom: 48,
        display: "flex", alignItems: "center", gap: 12
      }}><span style={{ width: 40, height: 1, background: C.gold, display: "inline-block" }} />Lifestyle</div></R>
      <R delay={0.1}><h2 style={{
        fontFamily: "'Cormorant',serif", fontSize: "clamp(40px,6vw,80px)",
        fontWeight: 300, lineHeight: 0.95, color: C.ice, margin: "0 0 64px"
      }}>Where Infinity<br /><em style={{ color: C.gold }}>lives.</em></h2></R>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 4 }}>
        {scenes.map((s, i) => (
          <R key={s.label} delay={0.06 * i}>
            <div style={{
              position: "relative", aspectRatio: i === 0 || i === 4 ? "4/5" : "3/4",
              overflow: "hidden", cursor: "pointer",
              /* Vignette mask — dissolves edges into dark void */
              WebkitMaskImage: "radial-gradient(ellipse 78% 72% at 50% 45%, black 45%, transparent 100%)",
              maskImage: "radial-gradient(ellipse 78% 72% at 50% 45%, black 45%, transparent 100%)",
              transition: "all 0.6s cubic-bezier(0.16,1,0.3,1)",
            }}
              onMouseEnter={e => {
                const img = e.currentTarget.querySelector("img") as HTMLElement;
                if (img) img.style.transform = "scale(1.06)";
                const st = e.currentTarget.style as unknown as Record<string, string>;
                st.webkitMaskImage = "radial-gradient(ellipse 88% 82% at 50% 45%, black 55%, transparent 100%)";
                st.maskImage = "radial-gradient(ellipse 88% 82% at 50% 45%, black 55%, transparent 100%)";
              }}
              onMouseLeave={e => {
                const img = e.currentTarget.querySelector("img") as HTMLElement;
                if (img) img.style.transform = "scale(1)";
                const st = e.currentTarget.style as unknown as Record<string, string>;
                st.webkitMaskImage = "radial-gradient(ellipse 78% 72% at 50% 45%, black 45%, transparent 100%)";
                st.maskImage = "radial-gradient(ellipse 78% 72% at 50% 45%, black 45%, transparent 100%)";
              }}
            >
              <Image src={s.img} alt={s.label} fill style={{ objectFit: "cover", transition: "transform 0.8s cubic-bezier(0.16,1,0.3,1)" }} />
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                padding: "40px 20px 16px",
                background: "linear-gradient(transparent,rgba(0,0,0,0.5))"
              }}>
                <span style={{
                  fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: "0.25em",
                  textTransform: "uppercase", color: C.ice, opacity: 0.8
                }}>{s.label}</span>
              </div>
            </div>
          </R>
        ))}
      </div>
    </section>
  );
}

/* ─── ANIMATION BREAK — video edge-dissolved ─── */
function AnimationBreak() {
  const [ref, vis] = useInView(0.3);
  return (
    <section ref={ref} style={{ position: "relative", height: "70vh", overflow: "hidden", background: C.void }}>
      <div style={{
        position: "absolute", inset: "-5%", width: "110%", height: "110%",
        WebkitMaskImage: "radial-gradient(ellipse 68% 62% at 50% 50%, black 30%, transparent 100%)",
        maskImage: "radial-gradient(ellipse 68% 62% at 50% 50%, black 30%, transparent 100%)",
      }}>
        <video autoPlay muted loop playsInline style={{
          width: "100%", height: "100%", objectFit: "cover",
          opacity: vis ? 0.6 : 0, filter: "brightness(0.5) contrast(1.2) saturate(0.75)",
          transition: "opacity 2s cubic-bezier(0.16,1,0.3,1)"
        }}>
          <source src="/animation.mp4" type="video/mp4" />
        </video>
      </div>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", zIndex: 2, padding: "0 8vw" }}>
        <div>
          <R><div style={{
            fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: "0.4em",
            textTransform: "uppercase", color: C.gold, marginBottom: 32,
            display: "flex", alignItems: "center", gap: 12
          }}><span style={{ width: 40, height: 1, background: C.gold, display: "inline-block" }} />Premium Partners</div></R>
          <R delay={0.12}><h2 style={{
            fontFamily: "'Cormorant',serif", fontSize: "clamp(36px,5vw,72px)",
            fontWeight: 300, lineHeight: 1, color: C.ice, margin: 0
          }}>The world&apos;s finest<br />venues choose<br /><em style={{ color: C.gold }}>Infinity.</em></h2></R>
        </div>
      </div>
    </section>
  );
}

/* ─── LUXURY CONTEXT — vignette-masked images ─── */
function LuxuryContext() {
  return (
    <section style={{ background: C.void, position: "relative", overflow: "hidden" }}>
      <div style={{ padding: "120px 8vw 60px" }}>
        <R><h2 style={{
          fontFamily: "'Cormorant',serif", fontSize: "clamp(40px,6vw,80px)",
          fontWeight: 300, lineHeight: 0.95, color: C.ice, margin: "0 0 16px"
        }}>Everywhere<br /><em style={{ color: C.gold }}>that matters.</em></h2></R>
        <R delay={0.1}><p style={{
          fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 300,
          color: C.frost, opacity: 0.5, maxWidth: 400, marginBottom: 48
        }}>Private aviation. Five-star suites. Yacht decks. Infinity Water is the standard for premium hospitality worldwide.</p></R>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 3 }}>
        {[
          { img: "/luxury-jet.png", label: "Private Aviation" },
          { img: "/luxury-hotel.png", label: "Five-Star Suites" },
          { img: "/luxury-jetbucket.png", label: "First Class" },
        ].map((s, i) => (
          <R key={s.label} delay={0.08 * i}>
            <div style={{
              position: "relative", aspectRatio: "4/3", overflow: "hidden",
              /* Vignette dissolve into void */
              WebkitMaskImage: "radial-gradient(ellipse 80% 75% at 50% 45%, black 45%, transparent 100%)",
              maskImage: "radial-gradient(ellipse 80% 75% at 50% 45%, black 45%, transparent 100%)",
            }}>
              <Image src={s.img} alt={s.label} fill style={{ objectFit: "cover" }} />
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                padding: "48px 20px 16px",
                background: "linear-gradient(transparent,rgba(0,0,0,0.5))"
              }}>
                <span style={{
                  fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: "0.25em",
                  textTransform: "uppercase", color: C.ice, opacity: 0.8
                }}>{s.label}</span>
              </div>
            </div>
          </R>
        ))}
      </div>
    </section>
  );
}

/* ─── GALLERY STUDIO — edge-dissolved on light bg ─── */
function GalleryStudio() {
  return (
    <section style={{ position: "relative", background: C.ice, overflow: "hidden" }}>
      <div style={{ padding: "100px 8vw 40px" }}>
        <R><div style={{
          fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: "0.4em",
          textTransform: "uppercase", color: C.water, marginBottom: 32,
          display: "flex", alignItems: "center", gap: 12
        }}><span style={{ width: 40, height: 1, background: C.water, display: "inline-block" }} />Studio</div></R>
        <R delay={0.1}><h2 style={{
          fontFamily: "'Cormorant',serif", fontSize: "clamp(36px,5vw,64px)",
          fontWeight: 300, lineHeight: 1.05, color: C.deep
        }}>Designed to be<br /><em>displayed.</em></h2></R>
      </div>
      {/* Studio shot — bottom edge dissolved */}
      <R delay={0.15}>
        <div style={{
          position: "relative", width: "100%", height: "clamp(350px,45vh,600px)",
          WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 70%, transparent 100%), linear-gradient(to right, transparent 3%, black 12%, black 88%, transparent 97%)",
          maskImage: "linear-gradient(to bottom, black 0%, black 70%, transparent 100%), linear-gradient(to right, transparent 3%, black 12%, black 88%, transparent 97%)",
          WebkitMaskComposite: "intersect" as unknown as string,
          maskComposite: "intersect",
        }}>
          <Image src="/gallery-studio.png" alt="Infinity Water studio" fill style={{ objectFit: "contain" }} />
        </div>
      </R>
      <div style={{ height: 80 }} />
    </section>
  );
}

/* ─── CONVERSION ─── */
function Conversion() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  return (
    <section id="order" style={{
      minHeight: "80vh", background: C.void,
      display: "flex", alignItems: "center", position: "relative", overflow: "hidden"
    }}>
      {/* Background image — vignette masked */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.08,
        WebkitMaskImage: "radial-gradient(ellipse 75% 70% at 50% 50%, black 30%, transparent 100%)",
        maskImage: "radial-gradient(ellipse 75% 70% at 50% 50%, black 30%, transparent 100%)",
      }}>
        <Image src="/hero-ice.png" alt="" fill style={{ objectFit: "cover" }} />
      </div>
      <div style={{ padding: "100px 8vw", position: "relative", zIndex: 1 }}>
        <R><h2 style={{
          fontFamily: "'Cormorant',serif", fontSize: "clamp(48px,10vw,160px)",
          fontWeight: 300, lineHeight: 0.88, letterSpacing: "-0.04em",
          color: C.ice, margin: "0 0 48px"
        }}>Enter<br /><em style={{ color: C.gold }}>Infinity.</em></h2></R>
        <R delay={0.15}><div style={{ maxWidth: 500 }}>
          <p style={{
            fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 300,
            lineHeight: 1.7, color: C.frost, opacity: 0.5, marginBottom: 40
          }}>First access to new collections. Partner announcements. Invitations.</p>
          {!done ? (
            <div style={{ display: "flex", border: `1px solid ${C.faint}`, background: `${C.faint}40` }}>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com" style={{
                  flex: 1, padding: "18px 24px", fontFamily: "'DM Mono',monospace", fontSize: 13,
                  fontWeight: 300, border: "none", outline: "none", background: "transparent",
                  color: C.ice, letterSpacing: "0.03em"
                }} />
              <button onClick={() => email && setDone(true)} style={{
                fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: "0.2em",
                textTransform: "uppercase", padding: "18px 32px", background: C.gold,
                color: C.void, border: "none", cursor: "pointer", transition: "background 0.3s ease"
              }}
                onMouseEnter={e => { (e.target as HTMLElement).style.background = C.ice; }}
                onMouseLeave={e => { (e.target as HTMLElement).style.background = C.gold; }}
              >Join</button>
            </div>
          ) : (
            <div style={{
              fontFamily: "'Cormorant',serif", fontSize: 28, fontWeight: 300,
              fontStyle: "italic", color: C.gold
            }}>Welcome to Infinity.</div>
          )}
        </div></R>
      </div>
    </section>
  );
}

/* ─── FOOTER ─── */
function Footer() {
  return (
    <footer style={{ background: C.void, padding: "64px 8vw 48px", borderTop: `1px solid ${C.faint}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 24 }}>
        <div>
          <div style={{ fontFamily: "'Cormorant',serif", fontSize: 20, fontWeight: 400, color: C.ice, letterSpacing: "0.1em", marginBottom: 12 }}>
            Infinity<span style={{ fontWeight: 300, fontStyle: "italic", color: C.gold }}> Water</span>
          </div>
          <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: C.frost, opacity: 0.25 }}>
            © 2026 Infinity Water — A Kollective Hospitality Group Brand
          </div>
        </div>
        <div style={{ display: "flex", gap: 28 }}>
          {["Instagram", "Press", "Legal"].map(l => (
            <a key={l} href="#" style={{
              fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: "0.15em",
              textTransform: "uppercase", color: C.frost, textDecoration: "none",
              opacity: 0.3, transition: "opacity 0.3s"
            }}
              onMouseEnter={e => { (e.target as HTMLElement).style.opacity = "1"; }}
              onMouseLeave={e => { (e.target as HTMLElement).style.opacity = "0.3"; }}
            >{l}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}

/* ─── MAIN ─── */
export default function HomePage() {
  const [loaded, setLoaded] = useState(false);
  return (
    <main style={{ overflowX: "hidden" }}>
      <style>{`
        @media(max-width:900px){
          div[style*="grid-template-columns: 1fr 1fr 1fr"]{grid-template-columns:1fr 1fr!important}
          div[style*="grid-template-columns: 1fr 1fr"]{grid-template-columns:1fr!important}
          h1{font-size:52px!important}
          .nav-link-hide{display:none}
        }
      `}</style>
      <Grain />
      <CursorGlow />
      {!loaded && <Preloader onComplete={() => setLoaded(true)} />}
      <Nav />
      <Hero />
      <HeroProduct />
      <Collections />
      <CinematicSection />
      <FullLineup />
      <LifestyleGallery />
      <AnimationBreak />
      <LuxuryContext />
      <GalleryStudio />
      <Conversion />
      <Footer />
    </main>
  );
}
