import type { Metadata } from 'next';
import './globals.css';
import { fontVariables } from './fonts';
import ClientLayout from './ClientLayout';

export const metadata: Metadata = {
  title: 'Webble Studio: Scopri cosa significa essere unici',
  description:
    'Trova i professionisti giusti per il tuo progetto digitale. Designer, sviluppatori, copywriter e marketer pronti a trasformare le tue idee in realtà, garantendo risultati di alta qualità e un servizio personalizzato per ogni esigenza.',
  keywords: ['web design', 'sviluppo web', 'digital marketing', 'UI/UX design'],
  openGraph: {
    title: 'Webble Studio: Scopri cosa significa essere unici',
    description: 'Trova i professionisti giusti per il tuo progetto digitale.',
    type: 'website',
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
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
