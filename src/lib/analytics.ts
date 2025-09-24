// Configurazione Google Analytics
export const GA_TRACKING_ID = 'G-6K9QE0P35E';

// Eventi predefiniti per il sito
export const ANALYTICS_EVENTS = {
  // Eventi di contatto
  CONTACT_FORM_SUBMIT: 'contact_form_submit',
  BOOKING_FORM_SUBMIT: 'booking_form_submit',
  
  // Eventi di navigazione
  PORTFOLIO_VIEW: 'portfolio_view',
  SERVICE_VIEW: 'service_view',
  
  // Eventi di interazione
  BUTTON_CLICK: 'button_click',
  LINK_CLICK: 'link_click',
  
  // Eventi di conversione
  EMAIL_SENT: 'email_sent',
  PHONE_CALL: 'phone_call',
} as const;

// Helper per tracciare eventi specifici del sito
export const trackContactForm = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', ANALYTICS_EVENTS.CONTACT_FORM_SUBMIT, {
      event_category: 'engagement',
      event_label: 'contact_form',
    });
  }
};

export const trackBookingForm = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', ANALYTICS_EVENTS.BOOKING_FORM_SUBMIT, {
      event_category: 'conversion',
      event_label: 'booking_form',
    });
  }
};

export const trackPortfolioView = (projectName: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', ANALYTICS_EVENTS.PORTFOLIO_VIEW, {
      event_category: 'engagement',
      event_label: projectName,
    });
  }
};
