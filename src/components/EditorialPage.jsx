import Image from 'next/image';
import Link from 'next/link';
import styles from './EditorialPage.module.css';
import { sitePages, siteProfile } from '@/lib/site-pages';

const pageVisuals = {
  about: {
    eyebrow: 'DESIGNED FOR ARRIVAL',
    title: 'The bottle changes with the room. The standard does not.',
    items: [
      ['/luxury-hotel.png', 'Hospitality', 'A guest-facing object for suites, tables, and welcome rituals.'],
      ['/luxury-jet.png', 'Travel', 'A premium presentation for private aviation and transport.'],
      ['/lifestyle-club.png', 'Culture', 'A bottle designed to belong inside visible service moments.'],
    ],
  },
  collections: {
    eyebrow: 'THE COLLECTION WALL',
    title: 'Three distinct moods. One coordinated silhouette.',
    items: [
      ['/gold-trio.png', 'Gold', 'Formal sparkle, ceremony, and visible bottle service.'],
      ['/blue-trio.png', 'Blue', 'Cool still-water presentation for hospitality and travel.'],
      ['/black-trio.png', 'Black', 'High-contrast energy for nightlife, gifting, and performance spaces.'],
    ],
  },
  hospitality: {
    eyebrow: 'SERVICE WORLDS',
    title: 'Begin with where the guest meets the bottle.',
    items: [
      ['/luxury-hotel.png', 'Property', 'Suites, minibars, restaurants, conference, and gifting.'],
      ['/luxury-yacht.png', 'Journey', 'Yacht, aviation, and premium transport service.'],
      ['/luxury-jetbucket.png', 'Ritual', 'Presentation, storage, replenishment, and handoff as one program.'],
    ],
  },
  wholesale: {
    eyebrow: 'MARKET READINESS',
    title: 'A collection has to work beyond the campaign image.',
    items: [
      ['/gallery-lineup.png', 'Shelf presence', 'A coordinated family with a clear collection story.'],
      ['/v-formation.png', 'Channel planning', 'Territory, account reach, delivery, and launch support.'],
      ['/five-bottles.png', 'Replenishment', 'Recurring demand planned against real operating capability.'],
    ],
  },
  quality: {
    eyebrow: 'EVIDENCE BEFORE LANGUAGE',
    title: 'The product record governs the product claim.',
    items: [
      ['/gold-ice.png', 'Identity', 'Lifestyle and visual positioning belong to the brand layer.'],
      ['/gold-splash.png', 'Specification', 'Measurable language belongs to current technical records.'],
      ['/gallery-studio.png', 'Control', 'The quoted item, market, and production run define the evidence.'],
    ],
  },
  events: {
    eyebrow: 'THE PRODUCTION CANVAS',
    title: 'Hydration becomes part of the show—not an afterthought.',
    items: [
      ['/lifestyle-festival.png', 'Audience', 'Guest count, service areas, consumption, and timing.'],
      ['/lifestyle-picnic.png', 'Experience', 'Placement, gifting, talent, suites, and partner moments.'],
      ['/lifestyle-club.png', 'Rights', 'Supply, sponsorship, content, and exclusivity reviewed separately.'],
    ],
  },
  faq: {
    eyebrow: 'THE DECISION DESK',
    title: 'Six questions. Six direct routes to the truth.',
    items: [
      ['/all-bottles.png', 'Product', 'Finish and format availability are confirmed per request.'],
      ['/cool-lineup.png', 'Account', 'Samples and pricing follow commercial qualification.'],
      ['/spiral-grid.png', 'Program', 'Custom, event, and distribution scopes require separate review.'],
    ],
  },
};

export function EditorialPage({ page, slug }) {
  const related = Object.entries(sitePages)
    .filter(([key]) => key !== slug)
    .slice(0, 3);
  const visual = pageVisuals[slug];

  return (
    <div
      className={styles.site}
      style={{
        '--accent': siteProfile.accent,
        '--accent-soft': siteProfile.accentSoft,
        '--background': siteProfile.background,
        '--surface': siteProfile.surface,
        '--ink': siteProfile.ink,
        '--muted': siteProfile.muted,
      }}
    >
      <header className={styles.header}>
        <Link href="/" className={styles.logo} aria-label={`${siteProfile.name} home`}>
          <Image src={siteProfile.logo} alt={siteProfile.name} width={180} height={60} priority />
        </Link>
        <nav aria-label="Primary navigation">
          {siteProfile.nav.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
        </nav>
        <Link href="/forms" className={styles.headerAction}>Start an inquiry</Link>
      </header>

      <main>
        <section className={styles.hero}>
          <Image src={page.hero ?? siteProfile.hero} alt="" fill sizes="100vw" priority />
          <div className={styles.heroShade} />
          <div className={styles.heroCopy}>
            <p>{page.eyebrow}</p>
            <h1>{page.title}</h1>
            <span>{page.intro}</span>
          </div>
        </section>

        <section className={styles.facts} aria-label="Key facts">
          {page.facts.map(([value, label]) => (
            <article key={value}><strong>{value}</strong><span>{label}</span></article>
          ))}
        </section>

        {visual ? (
          <section className={`${styles.visualStory} ${styles[`visualStory_${slug}`]}`}>
            <header>
              <p>{visual.eyebrow}</p>
              <h2>{visual.title}</h2>
            </header>
            <div>
              {visual.items.map(([src, label, description], index) => (
                <article key={src}>
                  <div>
                    <Image src={src} alt="" fill sizes="(max-width: 720px) 100vw, 33vw" />
                  </div>
                  <span>{String(index + 1).padStart(2, '0')} / {label}</span>
                  <p>{description}</p>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        <section className={styles.reading}>
          <header>
            <p>INFORMATION BRIEF</p>
            <h2>{page.title}</h2>
          </header>
          <div className={styles.sections}>
            {page.sections.map((section, index) => (
              <article key={section.title}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h2>{section.title}</h2>
                  {section.body.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
                  {section.bullets?.length ? (
                    <ul>{section.bullets.map(item => <li key={item}>{item}</li>)}</ul>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.related}>
          <p>CONTINUE EXPLORING</p>
          <div>
            {related.map(([key, item]) => (
              <Link href={`/${key}`} key={key}>
                <span>{item.eyebrow}</span>
                <strong>{item.title}</strong>
                <b aria-hidden="true">↗</b>
              </Link>
            ))}
          </div>
        </section>

        <section className={styles.cta}>
          <p>READY FOR A COMMERCIAL CONVERSATION?</p>
          <h2>Tell us where Infinity needs to go.</h2>
          <div>
            <Link href="/forms">Choose an inquiry</Link>
            <Link href="/connect">View every contact path</Link>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <strong>{siteProfile.name}</strong>
        <nav>{siteProfile.nav.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</nav>
        <span>© 2026 Infinity Water. Product-specific terms are confirmed in writing.</span>
      </footer>
    </div>
  );
}
