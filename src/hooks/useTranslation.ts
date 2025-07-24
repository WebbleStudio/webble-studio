import { useState, useEffect } from 'react';
import { useTranslation as useI18nTranslation } from 'react-i18next';

type Language = 'it' | 'en';

export function useTranslation() {
  const { t, i18n } = useI18nTranslation('common');
  const [currentLanguage, setCurrentLanguage] = useState<Language>('it');
  const [mounted, setMounted] = useState(false);

  // Inizializza la lingua dal localStorage
  useEffect(() => {
    try {
      const savedLanguage = localStorage.getItem('i18nextLng') as Language;
      const initialLanguage = savedLanguage || 'it'; // Default sempre italiano

      setCurrentLanguage(initialLanguage);
      i18n.changeLanguage(initialLanguage);
      setMounted(true);
    } catch (error) {
      // Fallback se localStorage non è disponibile
      setCurrentLanguage('it');
      i18n.changeLanguage('it');
      setMounted(true);
    }
  }, [i18n]);

  const changeLanguage = (language: Language) => {
    try {
      setCurrentLanguage(language);
      i18n.changeLanguage(language);
      localStorage.setItem('i18nextLng', language);
    } catch (error) {
      console.warn('Unable to change language:', error);
    }
  };

  const toggleLanguage = () => {
    const newLanguage = currentLanguage === 'it' ? 'en' : 'it';
    changeLanguage(newLanguage);
  };

  return {
    t,
    currentLanguage,
    mounted,
    changeLanguage,
    toggleLanguage,
    isItalian: currentLanguage === 'it',
    isEnglish: currentLanguage === 'en',
  };
}
