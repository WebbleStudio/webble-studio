import type { Metadata } from 'next';
import './globals.css';
import { fontVariables } from './fonts';
import ClientLayout from './ClientLayout';
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';
import PerformanceOptimizer from '@/components/analytics/PerformanceOptimizer';
import StructuredData from '@/components/seo/StructuredData';
import LenisProvider from '@/components/ui/LenisProvider';
import ReCaptchaProvider from '@/components/ui/ReCaptchaProvider';

// Build absolute base URL from env for all environments (prod/preview/local)
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
// Force absolute OG/Twitter image to primary domain to avoid preview/redirect content-type issues
const ogImageAbs = 'https://webblestudio.com/img/thumbnails/webble-thumbnail.jpg';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Webble Studio: Scopri cosa significa essere unici',
    template: '%s | Webble Studio',
  },
  description:
    'Web design, social e advertising: Webble Studio trasforma idee in strategie digitali creative e ad alte prestazioni. Scopri di più su Webble ora',
  keywords: [
    'web design',
    'social media',
    'advertising',
    'UI/UX design',
    'web agency',
    'web design milano',
    'agenzia digitale',
    'strategie digitali',
    'web design studio',
    'creazione siti web',
  ],
  authors: [{ name: 'Webble Studio' }],
  category: 'Web Design',
  classification: 'Web Design Agency',
  openGraph: {
    title: 'Webble Studio: Scopri cosa significa essere unici',
    description:
      'Web design, social e advertising: Webble Studio trasforma idee in strategie digitali creative e ad alte prestazioni.',
    type: 'website',
    url: siteUrl,
    siteName: 'Webble Studio',
    images: [
      {
        url: ogImageAbs,
        width: 1200,
        height: 630,
        alt: 'Webble Studio - Featured Image',
      },
    ],
    locale: 'it_IT',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Webble Studio: Scopri cosa significa essere unici',
    description:
      'Web design, social e advertising: Webble Studio trasforma idee in strategie digitali creative e ad alte prestazioni.',
    images: [ogImageAbs],
    creator: '@webblestudio',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className={fontVariables}>
      <head>
        {/* Preload immagini critiche per migliorare LCP */}
        {/* webble-thumbnail.jpg: usata solo per Open Graph, non critica per LCP */}
        {/* radial.png e radial2.png: background images, non critiche per LCP */}
        {/* Preload critical static images to avoid edge requests */}
        <link rel="preload" as="image" href="/img/webble-white-logo.svg" type="image/svg+xml" />
        {/* webble-3d.webp: usata in KeyPoints, non critica per LCP */}
        {/* Hero images: CRITICHE per LCP - preload per migliorare performance - WebP ottimizzate */}
        <link rel="preload" as="image" href="/img/hero-desktop-proj.webp" type="image/webp" media="(min-width: 768px)" />
        <link rel="preload" as="image" href="/img/hero-mobile-proj.webp" type="image/webp" media="(max-width: 767px)" />
        {/* bubble-background.jpg: usata in Payoff, non critica per LCP */}
        <link rel="preload" as="image" href="/icons/diagonal-arrow.svg" type="image/svg+xml" />
        {/* Preload fonts to avoid edge requests */}
        <link
          rel="preload"
          href="/_next/static/media/figtree-latin-600-normal.e8bd9fc0.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/_next/static/media/poppins-latin-500-normal.7777133e.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className="antialiased">
        <StructuredData type="Organization" />
        <StructuredData type="WebSite" />
        <GoogleAnalytics />
        <LenisProvider />
        <ReCaptchaProvider>
          <PerformanceOptimizer>
            <ClientLayout>{children}</ClientLayout>
          </PerformanceOptimizer>
        </ReCaptchaProvider>
      </body>
    </html>
  );
}
