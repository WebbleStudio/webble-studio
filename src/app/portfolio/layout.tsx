import type { Metadata } from 'next';
import StructuredData from '@/components/seo/StructuredData';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.webblestudio.com';
const ogImageAbs = 'https://www.webblestudio.com/img/thumbnails/portfolio-thumbnail.png';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Portfolio',
  description:
    'Scopri i nostri progetti di web design, UI/UX e strategie digitali. Portfolio creativo di Webble Studio con progetti innovativi e ad alte prestazioni. Case study e lavori realizzati.',
  keywords: [
    'portfolio webble studio',
    'progetti web design milano',
    'portfolio creativo',
    'progetti digitali',
    'case study web design',
    'lavori webble studio',
    'portfolio agenzia digitale',
    'progetti web milano',
    'portfolio ui ux design',
    'web design portfolio milano',
    'agenzia web design portfolio',
    'portfolio siti web milano',
    'progetti web design creativi',
    'portfolio digitale milano',
  ],
  openGraph: {
    title: 'Portfolio - Webble Studio',
    description:
      'Scopri i nostri progetti di web design, UI/UX e strategie digitali. Portfolio creativo di Webble Studio con progetti innovativi e ad alte prestazioni. Case study e lavori realizzati.',
    type: 'website',
    url: `${siteUrl}/portfolio`,
    siteName: 'Webble Studio',
    images: [
      {
        url: ogImageAbs,
        width: 1200,
        height: 630,
        alt: 'Webble Studio - Portfolio - Progetti di Web Design e UI/UX',
      },
    ],
    locale: 'it_IT',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portfolio - Webble Studio',
    description:
      'Scopri i nostri progetti di web design, UI/UX e strategie digitali. Portfolio creativo di Webble Studio con progetti innovativi e ad alte prestazioni. Case study e lavori realizzati.',
    images: [ogImageAbs],
    creator: '@webblestudio',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: `${siteUrl}/portfolio`,
  },
};

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <StructuredData type="CollectionPage" />
      {children}
    </>
  );
}
