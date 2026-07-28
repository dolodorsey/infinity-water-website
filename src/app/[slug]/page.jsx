import { notFound } from 'next/navigation';
import { EditorialPage } from '@/components/EditorialPage';
import { sitePages } from '@/lib/site-pages';

export function generateStaticParams() {
  return Object.keys(sitePages).map(slug => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = sitePages[slug];
  if (!page) return {};
  return {
    title: `${page.title} — Infinity Water`,
    description: page.description,
    alternates: { canonical: `/${slug}` },
    openGraph: {
      title: `${page.title} — Infinity Water`,
      description: page.description,
      images: [{ url: page.hero }],
    },
  };
}

export default async function InformationPage({ params }) {
  const { slug } = await params;
  const page = sitePages[slug];
  if (!page) notFound();
  return <EditorialPage page={page} slug={slug} />;
}
