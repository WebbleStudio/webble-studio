'use client';

import { useState, useEffect } from 'react';

// Tipi per TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

type CookieConsent = 'accepted' | 'rejected' | null;

export function useCookieConsent() {
  const [consent, setConsent] = useState<CookieConsent>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Leggi la scelta salvata dal localStorage (usa marketing-consent come chiave unificata)
    const savedConsent = localStorage.getItem('marketing-consent') as CookieConsent;
    setConsent(savedConsent);
    setIsLoading(false);
  }, []);

  const acceptCookies = () => {
    const now = new Date().toISOString();
    localStorage.setItem('marketing-consent', 'accepted');
    localStorage.setItem('marketing-consent-date', now);
    // Mantieni anche cookie-consent per retrocompatibilità
    localStorage.setItem('cookie-consent', 'accepted');
    localStorage.setItem('cookie-consent-date', now);
    setConsent('accepted');

    // Abilita Google Analytics e altri tracking
    enableTracking();
  };

  const rejectCookies = () => {
    const now = new Date().toISOString();
    localStorage.setItem('marketing-consent', 'rejected');
    localStorage.setItem('marketing-consent-date', now);
    // Mantieni anche cookie-consent per retrocompatibilità
    localStorage.setItem('cookie-consent', 'rejected');
    localStorage.setItem('cookie-consent-date', now);
    setConsent('rejected');

    // Disabilita tutti i tracking
    disableTracking();
  };

  const enableTracking = () => {
    // Trigger evento per far caricare Google Analytics
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('cookie-consent-changed'));
    }

    console.log('✅ Cookie accettati - Google Analytics 4 verrà caricato');
  };

  const disableTracking = () => {
    // Trigger evento per mantenere GA e GTM bloccati
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('cookie-consent-changed'));

      // Disabilita immediatamente Google Analytics se già caricato
      if (window.gtag) {
        window.gtag('consent', 'update', {
          analytics_storage: 'denied',
          ad_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied',
        });
      }

      // Rimuovi i cookie di Google Analytics
      const GA_TRACKING_ID = 'G-6K9QE0P35E';
      const gaCookies = [
        '_ga',
        '_ga_' + GA_TRACKING_ID.replace('G-', ''),
        '_gid',
        '_gat',
        '_gat_gtag_' + GA_TRACKING_ID.replace('G-', ''),
      ];

      gaCookies.forEach((cookieName) => {
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname}`;
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      });

      // Pulisci dataLayer (usato da GTM)
      if ((window as any).dataLayer) {
        (window as any).dataLayer = [];
      }
    }

    console.log('❌ Cookie rifiutati - Google Analytics 4 e GTM disabilitati, cookie rimossi');
  };

  const resetConsent = () => {
    localStorage.removeItem('marketing-consent');
    localStorage.removeItem('marketing-consent-date');
    localStorage.removeItem('cookie-consent');
    localStorage.removeItem('cookie-consent-date');
    setConsent(null);
  };

  return {
    consent,
    isLoading,
    acceptCookies,
    rejectCookies,
    resetConsent,
    hasConsent: consent !== null,
    hasAccepted: consent === 'accepted',
    hasRejected: consent === 'rejected',
  };
}
