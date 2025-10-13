'use client';

// Hook per Google Analytics
export const useAnalytics = () => {
  const trackEvent = (action: string, category: string, label?: string, value?: number) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
      });
    }
  };

  const trackPageView = (url: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'G-6K9QE0P35E', {
        page_path: url,
      });
    }
  };

  return { trackEvent, trackPageView };
};

// Tipi per TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}
