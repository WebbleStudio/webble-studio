import type { Metadata } from 'next';
import './globals.css';
import '@fontsource/figtree';
import '@fontsource/figtree/500.css';
import '@fontsource/figtree/600.css';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import Header from '@/components/layout/Header';

export const metadata: Metadata = {
  title: 'Webble Studio: Scopri cosa significa essere unici',
  description: 'Trova i professionisti giusti per il tuo progetto digitale. Designer, sviluppatori, copywriter e marketer pronti a trasformare le tue idee in realtà, garantendo',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body className="font-sans antialiased">
        <Header />
        {children}
      </body>
    </html>
  );
}
