import Image from 'next/image';
import Link from 'next/link';
import styles from './EditorialPage.module.css';
import { sitePages, siteProfile } from '@/lib/site-pages';

export function EditorialPage({ page, slug }) {
  const related = Object.entries(sitePages)
    .filter(([key]) => key !== slug)
    .slice(0, 3);

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

        <section className={styles.reading}>
          <header>
            <p>INFORMATION BRIEF</p>
            <h2>What you should know.</h2>
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
