import type { Metadata } from 'next';
import StructuredData from '@/components/seo/StructuredData';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.webblestudio.com';
const ogImageAbs = 'https://www.webblestudio.com/img/thumbnails/portfolio-thumbnail.png';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Progetti',
  description:
    'Scopri i nostri progetti di web design, UI/UX e strategie digitali. Progetti creativi di Webble Studio con soluzioni innovative e ad alte prestazioni. Case study e lavori realizzati.',
  keywords: [
    'progetti webble studio',
    'progetti web design milano',
    'progetti creativi',
    'progetti digitali',
    'case study web design',
    'lavori webble studio',
    'progetti agenzia digitale',
    'progetti web milano',
    'progetti ui ux design',
    'web design progetti milano',
    'agenzia web design progetti',
    'progetti siti web milano',
    'progetti web design creativi',
    'progetti digitali milano',
  ],
  openGraph: {
    title: 'Progetti - Webble Studio',
    description:
      'Scopri i nostri progetti di web design, UI/UX e strategie digitali. Progetti creativi di Webble Studio con soluzioni innovative e ad alte prestazioni. Case study e lavori realizzati.',
    type: 'website',
    url: `${siteUrl}/progetti`,
    siteName: 'Webble Studio',
    images: [
      {
        url: ogImageAbs,
        width: 1200,
        height: 630,
        alt: 'Webble Studio - Progetti - Web Design e UI/UX',
      },
    ],
    locale: 'it_IT',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Progetti - Webble Studio',
    description:
      'Scopri i nostri progetti di web design, UI/UX e strategie digitali. Progetti creativi di Webble Studio con soluzioni innovative e ad alte prestazioni. Case study e lavori realizzati.',
    images: [ogImageAbs],
    creator: '@webblestudio',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: `${siteUrl}/progetti`,
  },
};

export default function ProgettiLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <StructuredData type="CollectionPage" />
      {children}
    </>
  );
}

