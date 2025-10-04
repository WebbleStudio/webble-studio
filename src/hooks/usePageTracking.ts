'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Hook per tracciare le page view con Google Analytics
export const usePageTracking = () => {
  const pathname = usePathname();

  useEffect(() => {
    // Verifica se Google Analytics è disponibile e se l'utente ha dato il consenso
    const hasConsent = localStorage.getItem('cookie-consent') === 'accepted';
    
    if (hasConsent && typeof window !== 'undefined' && window.gtag) {
      // Traccia la page view
      window.gtag('event', 'page_view', {
        page_title: document.title,
        page_location: window.location.href,
        page_path: pathname
      });
      
      console.log('📍 Page view tracked:', pathname);
    }
  }, [pathname]);
};

// Tipi per TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

