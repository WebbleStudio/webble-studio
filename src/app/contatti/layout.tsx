import type { Metadata } from 'next';
import StructuredData from '@/components/seo/StructuredData';

// Force absolute canonical URL - always use production domain for SEO
const siteUrl = 'https://webblestudio.com';
const ogImageAbs = 'https://webblestudio.com/img/thumbnails/contatti-thumbnail.png';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Contatti',
  description:
    'Contatta Webble Studio per il tuo progetto digitale. Agenzia web design Milano specializzata in strategie digitali creative e ad alte prestazioni. Prenota una call gratuita con i nostri founder. Siamo sempre pronti a rispondere alle tue domande.',
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
    title: 'Contatti - Webble Studio | Richiedi un Preventivo Gratuito',
    description:
      'Contatta Webble Studio per il tuo progetto digitale. Agenzia web design Milano specializzata in strategie digitali creative e ad alte prestazioni. Prenota una call gratuita con i nostri founder. Siamo sempre pronti a rispondere alle tue domande.',
    type: 'website',
    url: `${siteUrl}/contatti`,
    siteName: 'Webble Studio',
    images: [
      {
        url: ogImageAbs,
        width: 1200,
        height: 630,
        alt: 'Webble Studio - Contatti - Richiedi un Preventivo Gratuito',
      },
    ],
    locale: 'it_IT',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contatti - Webble Studio | Richiedi un Preventivo Gratuito',
    description:
      'Contatta Webble Studio per il tuo progetto digitale. Agenzia web design Milano specializzata in strategie digitali creative e ad alte prestazioni. Prenota una call gratuita con i nostri founder. Siamo sempre pronti a rispondere alle tue domande.',
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
      {children}
    </>
  );
}
