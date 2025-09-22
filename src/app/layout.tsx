import type { Metadata } from 'next';
import { headers } from 'next/headers';
import './globals.css';
import { fontVariables } from './fonts';
import ClientLayout from './ClientLayout';
import { SessionProvider } from 'next-auth/react';
import { auth } from '@/lib/auth';

export const metadata: Metadata = {
  metadataBase: new URL('https://webble.studio'),
  title: 'Webble Studio: Scopri cosa significa essere unici',
  description:
    'Trova i professionisti giusti per il tuo progetto digitale. Designer, sviluppatori, copywriter e marketer pronti a trasformare le tue idee in realtà, garantendo risultati di alta qualità e un servizio personalizzato per ogni esigenza.',
  keywords: ['web design', 'sviluppo web', 'digital marketing', 'UI/UX design'],
  openGraph: {
    title: 'Webble Studio: Scopri cosa significa essere unici',
    description: 'Trova i professionisti giusti per il tuo progetto digitale.',
    type: 'website',
    url: 'https://webble.studio',
    siteName: 'Webble Studio',
    images: [
      {
        url: '/img/thumbnails/webble-thumbnail.jpg',
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
    images: ['/img/thumbnails/webble-thumbnail.jpg'],
    creator: '@webblestudio',
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Ensure absolute URLs for previews across environments (prod, preview, local)
export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const forwardedHost = requestHeaders.get('x-forwarded-host');
  const host = requestHeaders.get('host');
  const proto = requestHeaders.get('x-forwarded-proto') || 'https';
  const domain = forwardedHost || host || 'webble.studio';
  const base = new URL(`${proto}://${domain}`);

  const imagePath = '/img/thumbnails/webble-thumbnail.jpg';

  return {
    metadataBase: base,
    openGraph: {
      images: [
        {
          url: imagePath,
          width: 1200,
          height: 630,
          alt: 'Webble Studio - Featured Image',
        },
      ],
    },
    twitter: {
      images: [imagePath],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className={fontVariables}>
      <body className="antialiased">
        <SessionProvider>
          <ClientLayout>{children}</ClientLayout>
        </SessionProvider>
      </body>
    </html>
  );
}
