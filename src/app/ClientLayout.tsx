'use client';

import Header from '@/components/layout/Header';
import AdminHeader from '@/components/layout/AdminHeader';
import Footer from '@/components/layout/Footer';
import CookieBanner from '@/components/ui/CookieBanner';
import CookieManagerButton from '@/components/ui/CookieManagerButton';
import { useDarkMode, useCookieConsent, useCookieManager, usePageTracking } from '@/hooks';
import { usePathname } from 'next/navigation';
import { HeaderProvider, useHeader } from '@/contexts/HeaderContext';
import { motion, AnimatePresence } from 'framer-motion';
import '@/lib/i18n/config'; // Inizializza i18n

function ClientLayoutContent({ children }: { children: React.ReactNode }) {
  // Inizializza il theme system (il hook gestisce automaticamente l'applicazione delle classi)
  useDarkMode();
  const { isHeaderVisible, refreshKey } = useHeader();
  
  // Cookie consent management
  const { acceptCookies, rejectCookies } = useCookieConsent();
  const { isManagerOpen, openManager, closeManager } = useCookieManager();
  
  // Page tracking (si attiva automaticamente solo se c'è consenso)
  usePageTracking();

  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');
  const isAuthRoute = pathname?.startsWith('/auth');
  const isLoginRoute = pathname === '/login';

  return (
    <>
      {/* Admin Header per admin e login */}
      <AnimatePresence>
        {(isAdminRoute || isLoginRoute) && isHeaderVisible && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <AdminHeader />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Normal Header per altre pagine */}
      <AnimatePresence>
        {!isAdminRoute && !isAuthRoute && !isLoginRoute && isHeaderVisible && (
          <motion.div
            key={`header-${refreshKey}`}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <Header />
          </motion.div>
        )}
      </AnimatePresence>

      {children}

      {/* Footer solo per pagine normali */}
      {!isAdminRoute && !isAuthRoute && !isLoginRoute && <Footer />}
      
      {/* Cookie Banner - mostra su tutte le pagine */}
      <CookieBanner 
        onAccept={acceptCookies}
        onReject={rejectCookies}
        forceShow={isManagerOpen}
        onClose={closeManager}
      />
      
      {/* Cookie Manager Button - mostra su tutte le pagine */}
      <CookieManagerButton onOpenManager={openManager} />
    </>
  );
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <HeaderProvider>
      <ClientLayoutContent>{children}</ClientLayoutContent>
    </HeaderProvider>
  );
}
