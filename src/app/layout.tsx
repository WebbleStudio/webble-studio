import type { Metadata } from 'next';
import './globals.css';
import { fontVariables } from './fonts';
import ClientLayout from './ClientLayout';
import { SessionProvider } from 'next-auth/react';
import { auth } from '@/lib/auth';
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';
import PerformanceOptimizer from '@/components/analytics/PerformanceOptimizer';

// Build absolute base URL from env for all environments (prod/preview/local)
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
// Force absolute OG/Twitter image to primary domain to avoid preview/redirect content-type issues
const ogImageAbs = 'https://webblestudio.com/img/thumbnails/webble-thumbnail.jpg';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Webble Studio: Scopri cosa significa essere unici',
  description:
    'Trova i professionisti giusti per il tuo progetto digitale. Designer, sviluppatori, copywriter e marketer pronti a trasformare le tue idee in realtà, garantendo risultati di alta qualità e un servizio personalizzato per ogni esigenza.',
  keywords: ['web design', 'sviluppo web', 'digital marketing', 'UI/UX design'],
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  openGraph: {
    title: 'Webble Studio: Scopri cosa significa essere unici',
    description: 'Trova i professionisti giusti per il tuo progetto digitale.',
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
    description: 'Trova i professionisti giusti per il tuo progetto digitale.',
    images: [ogImageAbs],
    creator: '@webblestudio',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className={fontVariables}>
      <body className="antialiased">
        <GoogleAnalytics />
        <PerformanceOptimizer>
          <SessionProvider>
            <ClientLayout>{children}</ClientLayout>
          </SessionProvider>
        </PerformanceOptimizer>
      </body>
    </html>
  );
}
