# Google Analytics Setup

## Struttura
- `GoogleAnalytics.tsx` - Componente principale per l'inizializzazione
- `useAnalytics.ts` - Hook per tracciare eventi
- `analytics.ts` - Configurazione e helper

## Come usare

### 1. Tracciare eventi personalizzati
```tsx
import { useAnalytics } from '@/hooks/useAnalytics';

const { trackEvent } = useAnalytics();

// Traccia un evento
trackEvent('button_click', 'navigation', 'header_cta');
```

### 2. Tracciare eventi predefiniti
```tsx
import { trackContactForm, trackBookingForm } from '@/lib/analytics';

// Nel form di contatto
const handleSubmit = () => {
  trackContactForm();
  // ... resto della logica
};
```

### 3. Tracciare visualizzazioni portfolio
```tsx
import { trackPortfolioView } from '@/lib/analytics';

// Quando si visualizza un progetto
trackPortfolioView('Progetto XYZ');
```

## Eventi già configurati
- `contact_form_submit` - Invio form contatti
- `booking_form_submit` - Invio form prenotazioni
- `portfolio_view` - Visualizzazione progetti
- `button_click` - Click su bottoni
- `link_click` - Click su link

## Configurazione
Il tracking ID è configurato in `GoogleAnalytics.tsx` e `analytics.ts`.
Per cambiarlo, modifica `GA_TRACKING_ID` in entrambi i file.
