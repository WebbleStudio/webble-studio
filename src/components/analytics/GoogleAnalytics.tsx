'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

const GA_TRACKING_ID = 'G-6K9QE0P35E';
const GTM_ID = 'GTM-WPW7KFB6';

// Funzione per disabilitare Google Analytics
const disableGoogleAnalytics = () => {
  if (typeof window !== 'undefined') {
    // Disabilita il tracking di Google Analytics
    if (window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
      });
    }

    // Rimuovi i cookie di Google Analytics se presenti
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

    console.log('❌ Google Analytics disabilitato e cookie rimossi');
  }
};

export default function GoogleAnalytics() {
  const [hasMarketingConsent, setHasMarketingConsent] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // Controlla il consenso ai cookie marketing
    const checkConsent = () => {
      const marketingConsent = localStorage.getItem('marketing-consent');
      const consentDate = localStorage.getItem('marketing-consent-date');

      console.log('🔍 Checking marketing consent:', {
        consent: marketingConsent,
        date: consentDate,
      });

      // Verifica consenso Marketing (include GA + GTM)
      if (marketingConsent === 'accepted' && consentDate) {
        const savedDate = new Date(consentDate);
        const now = new Date();
        const daysDiff = (now.getTime() - savedDate.getTime()) / (1000 * 3600 * 24);

        if (daysDiff > 180) {
          console.log('❌ Marketing consent expired (180+ days)');
          setHasMarketingConsent(false);
          disableGoogleAnalytics();
        } else {
          console.log('✅ Marketing consent valid - enabling GA4 + GTM');
          setHasMarketingConsent(true);
        }
      } else {
        console.log('❌ No marketing consent found');
        setHasMarketingConsent(false);
        disableGoogleAnalytics();
      }
    };

    checkConsent();

    // Listener per cambiamenti nel consenso
    const handleConsentChange = () => {
      console.log('🔄 Consent changed, rechecking...');
      checkConsent();
    };

    window.addEventListener('storage', handleConsentChange);
    window.addEventListener('cookie-consent-changed', handleConsentChange);

    return () => {
      window.removeEventListener('storage', handleConsentChange);
      window.removeEventListener('cookie-consent-changed', handleConsentChange);
    };
  }, []);

  // ❌ NON caricare nulla se non c'è consenso marketing
  if (!isClient || !hasMarketingConsent) {
    return null;
  }

  // ✅ Carica GA4 + GTM con consenso marketing
  return (
    <>
      {/* Google Tag Manager */}
      <Script
        id="google-tag-manager"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');
            console.log('✅ Google Tag Manager attivato con consenso marketing');
          `,
        }}
      />

      {/* Google Analytics 4 */}
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
            
            console.log('✅ Google Analytics 4 attivato con consenso marketing');
            console.log('📍 Page view sent:', window.location.href);
          `,
        }}
      />
    </>
  );
}
