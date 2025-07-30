'use client';

import Header from '@/components/layout/Header';
import AdminHeader from '@/components/layout/AdminHeader';
import Footer from '@/components/layout/Footer';
import { useDarkMode } from '@/hooks/useDarkMode';
import { usePathname } from 'next/navigation';
import '@/lib/i18n/config'; // Inizializza i18n

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  // Inizializza il theme system (il hook gestisce automaticamente l'applicazione delle classi)
  useDarkMode();

  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');
  const isAuthRoute = pathname?.startsWith('/auth');
  const isLoginRoute = pathname === '/login';

  return (
    <>
      {/* Admin Header per admin e login */}
      {(isAdminRoute || isLoginRoute) && <AdminHeader />}

      {/* Normal Header per altre pagine */}
      {!isAdminRoute && !isAuthRoute && !isLoginRoute && <Header />}

      {children}

      {/* Footer solo per pagine normali */}
      {!isAdminRoute && !isAuthRoute && !isLoginRoute && <Footer />}
    </>
  );
}
