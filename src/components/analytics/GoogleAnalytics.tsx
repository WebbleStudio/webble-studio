'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

const GA_TRACKING_ID = 'G-6K9QE0P35E';

// Funzione per disabilitare Google Analytics
const disableGoogleAnalytics = () => {
  if (typeof window !== 'undefined') {
    // Disabilita il tracking di Google Analytics
    if (window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied'
      });
    }
    
    // Rimuovi i cookie di Google Analytics se presenti
    const gaCookies = [
      '_ga',
      '_ga_' + GA_TRACKING_ID.replace('G-', ''),
      '_gid',
      '_gat',
      '_gat_gtag_' + GA_TRACKING_ID.replace('G-', '')
    ];
    
    gaCookies.forEach(cookieName => {
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname}`;
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });
    
    console.log('❌ Google Analytics disabilitato e cookie rimossi');
  }
};

export default function GoogleAnalytics() {
  const [hasConsent, setHasConsent] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Controlla il consenso ai cookie
    const checkConsent = () => {
      const cookieConsent = localStorage.getItem('cookie-consent');
      const consentDate = localStorage.getItem('cookie-consent-date');
      
      console.log('🔍 Checking cookie consent:', { cookieConsent, consentDate });
      
      // Verifica se il consenso è ancora valido (non scaduto)
      if (cookieConsent === 'accepted' && consentDate) {
        const savedDate = new Date(consentDate);
        const now = new Date();
        const daysDiff = (now.getTime() - savedDate.getTime()) / (1000 * 3600 * 24);
        
        // Se è passato più di 6 mesi, considera il consenso scaduto
        if (daysDiff > 180) {
          console.log('❌ Cookie consent expired (180+ days)');
          setHasConsent(false);
          // Disabilita Google Analytics se già caricato
          disableGoogleAnalytics();
        } else {
          console.log('✅ Cookie consent valid, enabling GA');
          setHasConsent(true);
        }
      } else {
        console.log('❌ No cookie consent found');
        setHasConsent(false);
        // Disabilita Google Analytics se già caricato
        disableGoogleAnalytics();
      }
    };

    checkConsent();

    // Listener per cambiamenti nel consenso
    const handleConsentChange = () => {
      console.log('🔄 Cookie consent changed, rechecking...');
      checkConsent();
    };

    window.addEventListener('storage', handleConsentChange);
    window.addEventListener('cookie-consent-changed', handleConsentChange);

    return () => {
      window.removeEventListener('storage', handleConsentChange);
      window.removeEventListener('cookie-consent-changed', handleConsentChange);
    };
  }, []);

  // ❌ NON caricare nulla se non c'è consenso
  if (!isClient || !hasConsent) {
    return null;
  }

  // ✅ Carica SOLO se accettato
  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            
            // Configura il consenso GDPR
            gtag('consent', 'default', {
              analytics_storage: 'granted',
              ad_storage: 'granted',
              ad_user_data: 'granted',
              ad_personalization: 'granted'
            });
            
            gtag('config', '${GA_TRACKING_ID}', {
              page_title: document.title,
              page_location: window.location.href,
              send_page_view: true,
              anonymize_ip: true,
              allow_google_signals: true,
              allow_ad_personalization_signals: true
            });
            
            // Invia evento di page view iniziale
            gtag('event', 'page_view', {
              page_title: document.title,
              page_location: window.location.href,
              page_path: window.location.pathname
            });
            
            console.log('✅ Google Analytics 4 attivato con consenso GDPR');
            console.log('📍 Page view sent:', window.location.href);
          `,
        }}
      />
    </>
  );
}
