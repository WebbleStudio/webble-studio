import type { Metadata } from 'next';
import StructuredData from '@/components/seo/StructuredData';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://webblestudio.com';
const ogImageAbs = 'https://webblestudio.com/img/thumbnails/webble-thumbnail.jpg';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Contatti',
  description:
    'Contattaci per discutere il tuo progetto digitale. Webble Studio trasforma le tue idee in strategie digitali creative e ad alte prestazioni. Richiedi un preventivo gratuito.',
  keywords: [
    'contatti webble studio',
    'richiedi preventivo web design',
    'web agency contatti',
    'consulenza digitale',
    'preventivo sito web',
    'contattaci webble',
    'web design milano',
    'agenzia digitale contatti',
  ],
  openGraph: {
    title: 'Contatti',
    description:
      'Contattaci per discutere il tuo progetto digitale. Webble Studio trasforma le tue idee in strategie digitali creative e ad alte prestazioni. Richiedi un preventivo gratuito.',
    type: 'website',
    url: `${siteUrl}/contatti`,
    siteName: 'Webble Studio',
    images: [
      {
        url: ogImageAbs,
        width: 1200,
        height: 630,
        alt: 'Webble Studio - Contatti',
      },
    ],
    locale: 'it_IT',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contatti - Webble Studio',
    description:
      'Contattaci per discutere il tuo progetto digitale. Webble Studio trasforma le tue idee in strategie digitali creative e ad alte prestazioni. Richiedi un preventivo gratuito.',
    images: [ogImageAbs],
    creator: '@webblestudio',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: `${siteUrl}/contatti`,
  },
};

export default function ContattiLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <StructuredData type="ContactPage" />
      <StructuredData type="FAQPage" />
      {children}
    </>
  );
}
