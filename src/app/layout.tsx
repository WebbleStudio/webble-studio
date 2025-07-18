import type { Metadata } from 'next';
import './globals.css';
import '@fontsource/figtree';
import '@fontsource/figtree/500.css';
import '@fontsource/figtree/600.css';
import '@fontsource/poppins/400.css';
import Header from '@/components/layout/Header';

export const metadata: Metadata = {
  title: 'Webble Studio',
  description: 'Scopri cosa significa essere unici',
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
