import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import delle traduzioni
import itTranslations from '../../locales/it/common.json';
import enTranslations from '../../locales/en/common.json';

const resources = {
  it: {
    common: itTranslations,
  },
  en: {
    common: enTranslations,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'it', // Lingua di default
    fallbackLng: 'it', // Fallback su italiano
    debug: process.env.NODE_ENV === 'development',

    detection: {
      // Configurazione per la rilevazione della lingua
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },

    interpolation: {
      escapeValue: false, // React già fa l'escape
    },

    ns: ['common'], // Namespace
    defaultNS: 'common',
  });

export default i18n;
