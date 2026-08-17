import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { siteProfile } from "@/lib/site-pages";
import styles from "./team.module.css";

export const metadata: Metadata = {
  title: "Leadership & Team — Infinity Water",
  description: "Meet the leadership, board, and executive team behind Infinity Water.",
};

export const revalidate = 60;

type Member = {
  id?: string;
  section: "leadership" | "board" | "executive" | "advisor";
  name: string;
  title?: string | null;
  bio?: string | null;
  photo_url?: string | null;
  photo_status?: "placeholder" | "temporary" | "approved";
  sort_order?: number;
};

type PlaceholderAsset =
  | { kind: "sprite"; index: number }
  | { kind: "image"; url: string; position?: string };

const fallbackMembers: Member[] = [
  { section: "leadership", name: "Bryan Dorsey", title: "Founder & CEO", bio: "Visionary entrepreneur and strategic leader focused on business development, partnerships, and scalable growth.", sort_order: 10 },
  { section: "leadership", name: "Michael Anderson, PE", title: "COO", sort_order: 20 },
  { section: "leadership", name: "Dr. Laura Hernandez", title: "Chief Engineer", sort_order: 30 },
  { section: "leadership", name: "David Walker", title: "CFO", sort_order: 40 },
  { section: "leadership", name: "Sarah Mitchell", title: "Chief Policy Officer", sort_order: 50 },
  { section: "leadership", name: "James Carter", title: "VP of Strategic Partnerships", sort_order: 60 },

  { section: "board", name: "Rick Wade", title: "Board Member", sort_order: 10 },
  { section: "board", name: "Bob Johnson", title: "Board Member", sort_order: 20 },
  { section: "board", name: "Coach Harris", title: "Board Member", sort_order: 30 },
  { section: "board", name: "Chief Lightfoot", title: "Board Member", sort_order: 40 },
  { section: "board", name: "Chief Andre", title: "Board Member", sort_order: 50 },
  { section: "board", name: "Chief Flyod", title: "Board Member", sort_order: 60 },
  { section: "board", name: "Chief Joseph", title: "Board Member", sort_order: 70 },
  { section: "board", name: "Brad Dorsey", title: "Board Member", sort_order: 80 },
  { section: "board", name: "Zen Dorsey", title: "Board Member", sort_order: 90 },
  { section: "board", name: "Joseph Siatta", title: "Board Member", sort_order: 100 },
  { section: "board", name: "Quintin", title: "Board Member", sort_order: 110 },

  { section: "executive", name: "JoJo", title: "Co-Chief Operating Officer, Enterprise Operations", sort_order: 10 },
  { section: "executive", name: "Quintin", title: "Co-Chief Operating Officer, Business Operations & Growth", sort_order: 20 },
  { section: "executive", name: "Sevant", title: "Chief Strategy & Activation Officer", sort_order: 30 },
  { section: "executive", name: "Grayson", title: "Director of Nightlife & Brand Activations", sort_order: 40 },
  { section: "executive", name: "Hartley", title: "Director of Nightlife & Venue Operations", sort_order: 50 },
  { section: "executive", name: "Raven", title: "Director of Products & Apparel", sort_order: 60 },
  { section: "executive", name: "Kay", title: "Director of Beverage Operations & Strategic Projects", sort_order: 70 },
  { section: "executive", name: "Scrolls", title: "Director of Digital Systems & Applications", sort_order: 80 },
  { section: "executive", name: "Lackey", title: "Director of Lifestyle Operations", sort_order: 90 },
  { section: "executive", name: "Alexis", title: "Executive Project Manager", sort_order: 100 },
  { section: "executive", name: "Coach Harris", title: "Executive Director of Strategic Development", sort_order: 110 },
  { section: "executive", name: "Bob Johnson", title: "Executive Director of Culture & Community Affairs", sort_order: 120 },
  { section: "executive", name: "Countryboy Dorsey", title: "Director of Community & Field Operations", sort_order: 130 },
  { section: "executive", name: "Suave", title: "Nightlife Operations & Activations", sort_order: 140 },
  { section: "executive", name: "Weezy", title: "Nightlife Operations & Activations", sort_order: 150 },
  { section: "executive", name: "Amarri", title: "Executive", sort_order: 160 },
  { section: "executive", name: "Omari", title: "Executive", sort_order: 170 },
  { section: "executive", name: "Kelz", title: "Executive", sort_order: 180 },
];

const PEOPLE_ROOT = "https://dzlmtvodpyhetvektfuo.supabase.co/storage/v1/object/public/brand-graphics/app/backgrounds";
const PEOPLE_BACKGROUNDS = Array.from({ length: 11 }, (_, index) => `${PEOPLE_ROOT}/app-background-${String(index + 1).padStart(2, "0")}.jpg`);
const TEAM_SPRITE = "https://doctordorsey.com/team-placeholder-sprite";
const DR_PLACEHOLDER_ROOT = "https://doctordorsey.com/team/placeholders";
const TEAM_ASSET_ROOT = "https://doctordorsey.com/team";

const APPROVED_PHOTOS: Record<string, string> = {
  JoJo: `${TEAM_ASSET_ROOT}/people/joseph.webp`,
  "Joseph Siatta": `${TEAM_ASSET_ROOT}/people/joseph.webp`,
  Quintin: `${TEAM_ASSET_ROOT}/people/quintin.webp`,
};

const PLACEHOLDER_ASSETS: Record<string, PlaceholderAsset> = {
  JoJo: { kind: "sprite", index: 0 },
  Quintin: { kind: "sprite", index: 1 },
  Sevant: { kind: "sprite", index: 2 },
  Grayson: { kind: "sprite", index: 3 },
  Hartley: { kind: "sprite", index: 4 },
  Raven: { kind: "sprite", index: 5 },
  Kay: { kind: "sprite", index: 6 },
  Scrolls: { kind: "sprite", index: 7 },
  Lackey: { kind: "sprite", index: 8 },
  Alexis: { kind: "sprite", index: 9 },
  "Coach Harris": { kind: "sprite", index: 10 },
  "Bob Johnson": { kind: "sprite", index: 11 },
  "Countryboy Dorsey": { kind: "sprite", index: 12 },
  Suave: { kind: "sprite", index: 13 },
  Weezy: { kind: "sprite", index: 14 },
  "Rick Wade": { kind: "sprite", index: 15 },
  "Chief Lightfoot": { kind: "sprite", index: 16 },
  "Chief Andre": { kind: "sprite", index: 17 },
  "Chief Flyod": { kind: "sprite", index: 18 },
  "Chief Joseph": { kind: "image", url: PEOPLE_BACKGROUNDS[0] },
  "Brad Dorsey": { kind: "image", url: PEOPLE_BACKGROUNDS[1] },
  "Zen Dorsey": { kind: "image", url: PEOPLE_BACKGROUNDS[2] },
  "Joseph Siatta": { kind: "image", url: PEOPLE_BACKGROUNDS[3] },
  "Bryan Dorsey": { kind: "image", url: PEOPLE_BACKGROUNDS[4] },
  "Michael Anderson, PE": { kind: "image", url: PEOPLE_BACKGROUNDS[5] },
  "Dr. Laura Hernandez": { kind: "image", url: PEOPLE_BACKGROUNDS[6] },
  "David Walker": { kind: "image", url: PEOPLE_BACKGROUNDS[7] },
  "Sarah Mitchell": { kind: "image", url: PEOPLE_BACKGROUNDS[8] },
  "James Carter": { kind: "image", url: PEOPLE_BACKGROUNDS[9] },
  Amarri: { kind: "image", url: PEOPLE_BACKGROUNDS[10] },
  Omari: { kind: "image", url: `${DR_PLACEHOLDER_ROOT}/portrait-01.webp` },
  Kelz: { kind: "image", url: `${DR_PLACEHOLDER_ROOT}/portrait-10.webp` },
};

function initials(name: string) {
  return name.replace(/\([^)]*\)/g, "").split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

function placeholderStyle(name: string): CSSProperties {
  const asset = PLACEHOLDER_ASSETS[name];
  if (!asset) {
    return {
      backgroundImage: `url(${PEOPLE_BACKGROUNDS[10]})`,
      backgroundSize: "cover",
      backgroundPosition: "center 25%",
      backgroundRepeat: "no-repeat",
    };
  }

  if (asset.kind === "image") {
    return {
      backgroundImage: `url(${asset.url})`,
      backgroundSize: "cover",
      backgroundPosition: asset.position || "center 25%",
      backgroundRepeat: "no-repeat",
    };
  }

  const column = asset.index % 5;
  const row = Math.floor(asset.index / 5);
  return {
    backgroundImage: `url(${TEAM_SPRITE})`,
    backgroundSize: "500% 400%",
    backgroundPosition: `${column * 25}% ${row * (100 / 3)}%`,
    backgroundRepeat: "no-repeat",
  };
}

async function getMembers(): Promise<Member[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return fallbackMembers;
  try {
    const endpoint = new URL(`${url}/rest/v1/leadership_members`);
    endpoint.searchParams.set("brand_key", "eq.infinity");
    endpoint.searchParams.set("is_published", "eq.true");
    endpoint.searchParams.set("select", "id,section,name,title,bio,photo_url,photo_status,sort_order");
    endpoint.searchParams.set("order", "sort_order.asc,name.asc");
    const response = await fetch(endpoint.toString(), {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      next: { revalidate: 60 },
    });
    if (!response.ok) return fallbackMembers;
    const data = (await response.json()) as Member[];
    return data.length ? data : fallbackMembers;
  } catch {
    return fallbackMembers;
  }
}

function Portrait({ member, mini = false }: { member: Member; mini?: boolean }) {
  const photoUrl = member.photo_url || APPROVED_PHOTOS[member.name];
  return (
    <div className={`${styles.portrait} ${mini ? styles.portraitMini : ""}`}>
      {photoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={photoUrl} alt={member.name} />
      ) : (
        <div
          className={styles.peopleFallback}
          aria-label={`${member.name} temporary placeholder portrait`}
          style={placeholderStyle(member.name)}
        >
          {!mini ? <small>TEMPORARY PLACEHOLDER</small> : null}
          <span>{initials(member.name)}</span>
        </div>
      )}
    </div>
  );
}

function LeadershipCard({ member, index }: { member: Member; index: number }) {
  return (
    <article className={styles.leadershipCard}>
      <Portrait member={member} />
      <div className={styles.cardCopy}>
        <span>{String(index + 1).padStart(2, "0")}</span>
        <h3>{member.name}</h3>
        {member.title ? <p className={styles.role}>{member.title}</p> : null}
        {member.bio ? <p className={styles.bio}>{member.bio}</p> : null}
      </div>
    </article>
  );
}

function ExecutiveCard({ member }: { member: Member }) {
  return (
    <article className={styles.executiveCard}>
      <Portrait member={member} />
      <div className={styles.executiveCopy}>
        <h3>{member.name}</h3>
        {member.title ? <p>{member.title}</p> : null}
      </div>
    </article>
  );
}

export default async function TeamPage() {
  const members = await getMembers();
  const leadership = members.filter((member) => member.section === "leadership");
  const board = members.filter((member) => member.section === "board");
  const executives = members.filter((member) => member.section === "executive");

  return (
    <div className={styles.site}>
      <header className={styles.header}>
        <Link href="/" className={styles.logo} aria-label="Infinity Water home">
          <Image src={siteProfile.logo} alt={siteProfile.name} width={180} height={60} priority />
        </Link>
        <nav aria-label="Primary navigation">
          {siteProfile.nav.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
          <Link href="/team" aria-current="page">Team</Link>
        </nav>
        <Link href="/forms" className={styles.headerAction}>Start an inquiry</Link>
      </header>

      <main>
        <section className={styles.hero} style={{ backgroundImage: `linear-gradient(90deg, rgba(4,18,31,.95), rgba(4,18,31,.70) 50%, rgba(4,18,31,.24)), url(https://dzlmtvodpyhetvektfuo.supabase.co/storage/v1/object/public/brand-graphics/app/backgrounds/app-background-03.jpg)` }}>
          <div className={styles.heroInner}>
            <div className={styles.heroCopy}>
              <p>INFINITY WATER / LEADERSHIP</p>
              <h1>The people moving water forward.</h1>
              <span>Leadership, governance and execution aligned around growth, distribution, partnerships and long-term market expansion.</span>
            </div>
            <div className={styles.heroMeta}>
              <div><strong>{leadership.length}</strong><span>Leadership</span></div>
              <div><strong>{board.length}</strong><span>Board</span></div>
              <div><strong>{executives.length}</strong><span>Executive team</span></div>
            </div>
          </div>
        </section>

        <section style={{ padding: "28px clamp(20px,5vw,76px)", background: "#071827", borderBottom: "1px solid rgba(53,179,255,.18)" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${TEAM_ASSET_ROOT}/infinity-leadership-overview.webp`}
            alt="Infinity Water leadership team overview"
            style={{ display: "block", width: "min(1500px,100%)", height: "auto", margin: "0 auto", border: "1px solid rgba(53,179,255,.22)" }}
          />
        </section>

        <section className={styles.leadershipSection}>
          <header className={styles.sectionIntro}>
            <p>LEADERSHIP TEAM</p>
            <h2>Experience at the top.</h2>
            <span>Senior leadership guiding operations, engineering, finance, policy and strategic partnerships.</span>
          </header>
          <div className={styles.leadershipGrid}>
            {leadership.map((member, index) => <LeadershipCard key={`${member.section}-${member.name}`} member={member} index={index} />)}
          </div>
        </section>

        <section className={styles.boardSection}>
          <header className={styles.sectionIntro}>
            <p>GOVERNANCE</p>
            <h2>The Board.</h2>
            <span>Institutional perspective, accountability and long-range stewardship.</span>
          </header>
          <div className={styles.boardList}>
            {board.map((member, index) => (
              <article key={`${member.section}-${member.name}`}>
                <span className={styles.boardIndex}>{String(index + 1).padStart(2, "0")}</span>
                <Portrait member={member} mini />
                <div><h3>{member.name}</h3><p>{member.title || "Board Member"}</p></div>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.executiveSection}>
          <header className={styles.sectionIntro}>
            <p>OPERATIONS & EXECUTION</p>
            <h2>The team that makes it move.</h2>
            <span>Cross-functional operators supporting enterprise execution across markets and initiatives.</span>
          </header>
          <div className={styles.executiveGrid}>
            {executives.map((member) => <ExecutiveCard key={`${member.section}-${member.name}`} member={member} />)}
          </div>
        </section>

        <section className={styles.cta}>
          <p>PARTNERSHIPS · HOSPITALITY · DISTRIBUTION</p>
          <h2>Build the next market with us.</h2>
          <div><Link href="/forms">Start an inquiry</Link><Link href="/about">About Infinity</Link></div>
        </section>
      </main>

      <footer className={styles.footer}>
        <strong>Infinity Water</strong>
        <nav>
          {siteProfile.nav.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
          <Link href="/team">Team</Link>
        </nav>
        <span>© 2026 Infinity Water · A Kollective Hospitality Group Brand</span>
      </footer>
    </div>
  );
}
