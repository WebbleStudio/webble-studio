import type { Metadata } from 'next';
import StructuredData from '@/components/seo/StructuredData';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://webblestudio.com';
const ogImageAbs = 'https://webblestudio.com/img/thumbnails/chi-siamo-thumbnail.png';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Chi siamo',
  description:
    'Scopri il team di Webble Studio: creativi, designer e sviluppatori appassionati di web design, UI/UX e strategie digitali. Conosci la nostra storia e la nostra mission.',
  keywords: [
    'team webble studio',
    'chi siamo webble',
    'web agency team',
    'team creativo milano',
    'designer web milano',
    'sviluppatori web',
    'agenzia digitale team',
    'storia webble studio',
    'mission webble',
  ],
  openGraph: {
    title: 'Chi Siamo',
    description:
      'Scopri il team di Webble Studio: creativi, designer e sviluppatori appassionati di web design, UI/UX e strategie digitali. Conosci la nostra storia e la nostra mission.',
    type: 'website',
    url: `${siteUrl}/chi-siamo`,
    siteName: 'Webble Studio',
    images: [
      {
        url: ogImageAbs,
        width: 1200,
        height: 630,
        alt: 'Webble Studio - Chi Siamo',
      },
    ],
    locale: 'it_IT',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chi Siamo - Webble Studio',
    description:
      'Scopri il team di Webble Studio: creativi, designer e sviluppatori appassionati di web design, UI/UX e strategie digitali. Conosci la nostra storia e la nostra mission.',
    images: [ogImageAbs],
    creator: '@webblestudio',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: `${siteUrl}/chi-siamo`,
  },
};

export default function ChiSiamoLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <StructuredData type="AboutPage" />
      {children}
    </>
  );
}
