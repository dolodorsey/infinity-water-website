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

function initials(name: string) {
  return name
    .replace(/\([^)]*\)/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

async function getMembers(): Promise<Member[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return fallbackMembers;

  try {
    const endpoint = new URL(`${url}/rest/v1/leadership_members`);
    endpoint.searchParams.set("brand_key", "eq.infinity");
    endpoint.searchParams.set("is_published", "eq.true");
    endpoint.searchParams.set("select", "id,section,name,title,bio,photo_url,photo_status,sort_order");
    endpoint.searchParams.set("order", "sort_order.asc,name.asc");

    const response = await fetch(endpoint.toString(), {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
      next: { revalidate: 60 },
    });

    if (!response.ok) return fallbackMembers;
    const data = (await response.json()) as Member[];
    return data.length ? data : fallbackMembers;
  } catch {
    return fallbackMembers;
  }
}

function MemberCard({ member, featured = false }: { member: Member; featured?: boolean }) {
  return (
    <article className={`${styles.card} ${featured ? styles.featuredCard : ""}`}>
      <div className={styles.portrait}>
        {member.photo_url ? (
          // Plain img keeps future Supabase/CDN portrait URLs flexible without a deploy-time domain allowlist.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={member.photo_url} alt={member.name} />
        ) : (
          <div className={styles.initials} aria-label={`${member.name} portrait placeholder`}>
            <span>{initials(member.name)}</span>
            <small style={{ position: "absolute", right: 12, bottom: 10, color: "rgba(197,165,90,.68)", fontFamily: "DM Mono, monospace", fontSize: 8, letterSpacing: ".16em" }}>
              PHOTO PLACEHOLDER
            </small>
          </div>
        )}
      </div>
      <div className={styles.cardCopy}>
        <h3>{member.name}</h3>
        {member.title ? <p className={styles.role}>{member.title}</p> : null}
        {member.bio ? <p className={styles.bio}>{member.bio}</p> : null}
      </div>
    </article>
  );
}

function TeamSection({
  eyebrow,
  title,
  members,
  featured = false,
}: {
  eyebrow: string;
  title: string;
  members: Member[];
  featured?: boolean;
}) {
  if (!members.length) return null;

  return (
    <section className={styles.teamSection}>
      <header className={styles.sectionHeader}>
        <p>{eyebrow}</p>
        <h2>{title}</h2>
        <span>{String(members.length).padStart(2, "0")}</span>
      </header>
      <div className={featured ? styles.leadershipGrid : styles.rosterGrid}>
        {members.map((member) => (
          <MemberCard
            key={`${member.section}-${member.name}`}
            member={member}
            featured={featured}
          />
        ))}
      </div>
    </section>
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
          {siteProfile.nav.map(([label, href]) => (
            <Link key={href} href={href}>{label}</Link>
          ))}
          <Link href="/team" aria-current="page">Team</Link>
        </nav>
        <Link href="/forms" className={styles.headerAction}>Start an inquiry</Link>
      </header>

      <main>
        <section className={styles.hero}>
          <div className={styles.heroTexture} />
          <div className={styles.heroCopy}>
            <p>THE PEOPLE BEHIND INFINITY</p>
            <h1>Experienced leaders.<br /><em>One infinite standard.</em></h1>
            <span>
              Leadership, governance, operations, partnerships, and execution aligned around the long-term growth of Infinity Water.
            </span>
          </div>
          <div className={styles.heroStats}>
            <div><strong>{leadership.length}</strong><span>Leadership</span></div>
            <div><strong>{board.length}</strong><span>Board</span></div>
            <div><strong>{executives.length}</strong><span>Executives</span></div>
          </div>
        </section>

        <TeamSection eyebrow="LEADERSHIP TEAM" title="Deep expertise. Shared vision." members={leadership} featured />
        <TeamSection eyebrow="GOVERNANCE" title="The Board." members={board} />
        <TeamSection eyebrow="OPERATIONS & EXECUTION" title="Executive team." members={executives} />

        <section className={styles.cta}>
          <p>PARTNERSHIPS · HOSPITALITY · DISTRIBUTION</p>
          <h2>Build the next market with us.</h2>
          <div>
            <Link href="/forms">Start an inquiry</Link>
            <Link href="/about">About Infinity</Link>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <strong>{siteProfile.name}</strong>
        <nav>
          {siteProfile.nav.map(([label, href]) => (
            <Link key={href} href={href}>{label}</Link>
          ))}
          <Link href="/team">Team</Link>
        </nav>
        <span>© 2026 Infinity Water · A Kollective Hospitality Group Brand</span>
      </footer>
    </div>
  );
}