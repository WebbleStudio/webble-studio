'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useDarkMode } from '@/hooks/useDarkMode';
import '@/lib/i18n/config'; // Inizializza i18n

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  // Inizializza il theme system (il hook gestisce automaticamente l'applicazione delle classi)
  useDarkMode();

  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
