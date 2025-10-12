'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/hooks';

interface CookieBannerProps {
  onAccept: () => void;
  onReject: () => void;
  forceShow?: boolean;
  onClose?: () => void;
}

export default function CookieBanner({
  onAccept,
  onReject,
  forceShow = false,
  onClose,
}: CookieBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [marketingEnabled, setMarketingEnabled] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    // Inizializza lo stato marketingEnabled basato sul consenso esistente
    const marketingConsent = localStorage.getItem('marketing-consent');
    setMarketingEnabled(marketingConsent === 'accepted');

    // Se forceShow è true, mostra sempre il modal
    if (forceShow) {
      setShowDetails(true);
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      return;
    }

    // Controlla se l'utente ha già fatto una scelta sui cookie
    const cookieChoice = localStorage.getItem('cookie-consent');
    const consentDate = localStorage.getItem('cookie-consent-date');

    // Se non c'è una scelta salvata, mostra il banner
    if (!cookieChoice) {
      setIsVisible(true);
      return;
    }

    // Se c'è una scelta salvata, controlla se è scaduta (solo per rifiuti)
    if (cookieChoice === 'rejected' && consentDate) {
      const savedDate = new Date(consentDate);
      const now = new Date();
      const daysDiff = (now.getTime() - savedDate.getTime()) / (1000 * 3600 * 24);

      // Se è passato più di 5 giorni, mostra di nuovo il banner (solo per rifiuti)
      if (daysDiff > 5) {
        setIsVisible(true);
      }
    }

    // Cleanup: riabilita scroll quando il componente si smonta
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'unset';
      document.body.style.width = 'unset';
    };
  }, [forceShow]);

  const handleAccept = () => {
    setIsVisible(false);
    setShowDetails(false);
    document.body.style.overflow = 'unset';
    // Salva consenso marketing
    localStorage.setItem('marketing-consent', 'accepted');
    localStorage.setItem('marketing-consent-date', new Date().toISOString());
    onAccept();
    window.dispatchEvent(new Event('cookie-consent-changed'));
    onClose?.();
  };

  const handleReject = () => {
    setIsVisible(false);
    setShowDetails(false);
    document.body.style.overflow = 'unset';
    // Rifiuta consenso marketing
    localStorage.setItem('marketing-consent', 'rejected');
    localStorage.setItem('marketing-consent-date', new Date().toISOString());
    onReject();
    window.dispatchEvent(new Event('cookie-consent-changed'));
    onClose?.();
  };

  const handleManage = () => {
    setShowDetails(true);
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    document.body.style.overflow = 'unset';
    document.body.style.position = 'unset';
    document.body.style.width = 'unset';
    if (forceShow) {
      onClose?.();
    }
  };

  const handleSavePreferences = () => {
    // Salva preferenze marketing
    if (marketingEnabled) {
      localStorage.setItem('marketing-consent', 'accepted');
      localStorage.setItem('marketing-consent-date', new Date().toISOString());
      localStorage.setItem('cookie-consent', 'accepted');
      localStorage.setItem('cookie-consent-date', new Date().toISOString());
    } else {
      localStorage.setItem('marketing-consent', 'rejected');
      localStorage.setItem('marketing-consent-date', new Date().toISOString());
      localStorage.setItem('cookie-consent', 'rejected');
      localStorage.setItem('cookie-consent-date', new Date().toISOString());
    }

    // Trigger evento per aggiornare i componenti
    window.dispatchEvent(new Event('cookie-consent-changed'));

    setIsVisible(false);
    setShowDetails(false);
    document.body.style.overflow = 'unset';
    document.body.style.position = 'unset';
    document.body.style.width = 'unset';
    onClose?.();
  };

  // Gestisci l'apertura del modal tramite forceShow
  useEffect(() => {
    if (forceShow) {
      const marketingConsent = localStorage.getItem('marketing-consent');
      setMarketingEnabled(marketingConsent === 'accepted');

      setShowDetails(true);
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    }
  }, [forceShow]);

  // Listener per aggiornare lo stato del toggle quando cambia il consenso
  useEffect(() => {
    const handleConsentChange = () => {
      const marketingConsent = localStorage.getItem('marketing-consent');
      setMarketingEnabled(marketingConsent === 'accepted');
    };

    window.addEventListener('storage', handleConsentChange);
    window.addEventListener('cookie-consent-changed', handleConsentChange);

    return () => {
      window.removeEventListener('storage', handleConsentChange);
      window.removeEventListener('cookie-consent-changed', handleConsentChange);
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="cookie-banner"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6"
        >
          <div className="max-w-[1240px] mx-auto">
            <div className="bg-white/95 dark:bg-[#0b0b0b]/95 backdrop-blur-md border border-[rgba(0,0,0,0.1)] dark:border-[rgba(250,250,250,0.1)] rounded-2xl p-6 md:p-8 shadow-2xl transition-colors duration-500 ease-out">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* Contenuto del banner */}
                <div className="flex-1">
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-[#fafafa] mb-2 transition-colors duration-500 ease-out">
                    {t('cookies.banner.title')}
                  </h3>
                  <p className="text-sm md:text-base text-gray-700 dark:text-[#fafafa]/80 leading-relaxed transition-colors duration-500 ease-out">
                    {t('cookies.banner.description')}
                  </p>
                </div>

                {/* Pulsanti di azione */}
                <div className="flex flex-col sm:flex-row gap-3 md:ml-6">
                  {/* Wrapper per Rifiuta e Gestisci - affiancati su mobile */}
                  <div className="flex gap-3 sm:contents">
                    <button
                      onClick={handleReject}
                      className="w-1/2 sm:w-auto px-4 sm:px-6 py-3 rounded-[12px] font-medium border border-gray-300 dark:border-[rgba(250,250,250,0.3)] text-gray-700 dark:text-[#fafafa] hover:bg-gray-50 dark:hover:bg-[rgba(250,250,250,0.1)] transition-colors duration-500 ease-out"
                    >
                      {t('cookies.banner.reject')}
                    </button>
                    <button
                      onClick={handleManage}
                      className="w-1/2 sm:w-auto px-4 sm:px-6 py-3 rounded-[12px] font-medium border border-gray-300 dark:border-[rgba(250,250,250,0.3)] text-gray-700 dark:text-[#fafafa] hover:bg-gray-50 dark:hover:bg-[rgba(250,250,250,0.1)] transition-colors duration-500 ease-out"
                    >
                      {t('cookies.banner.manage')}
                    </button>
                  </div>
                  <button
                    onClick={handleAccept}
                    className="w-full sm:w-auto px-6 py-3 rounded-[12px] font-medium bg-[#F20352] hover:bg-[#d90247] text-white transition-all duration-200 ease-out"
                  >
                    {t('cookies.banner.accept_all')}
                  </button>
                </div>
              </div>

              {/* Link alla privacy policy */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-[rgba(250,250,250,0.1)] transition-colors duration-500 ease-out">
                <p className="text-xs text-gray-500 dark:text-[#fafafa]/60 transition-colors duration-500 ease-out">
                  {t('cookies.banner.privacy_text')}{' '}
                  <a href="/cookie-policy" className="text-[#F20352] hover:underline">
                    {t('cookies.banner.cookie_policy')}
                  </a>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Modal dettagli cookie */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            key="cookie-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={handleCloseDetails}
          >
            <motion.div
              key="cookie-modal-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white/95 dark:bg-[#0b0b0b]/95 backdrop-blur-md border border-[rgba(0,0,0,0.1)] dark:border-[rgba(250,250,250,0.1)] rounded-2xl max-w-2xl w-full max-h-[80vh] flex flex-col transition-colors duration-500 ease-out"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Contenuto scrollabile */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-[#fafafa] transition-colors duration-500 ease-out">
                    {t('cookies.modal.title')}
                  </h2>
                  <button
                    onClick={handleCloseDetails}
                    className="text-gray-500 dark:text-[#fafafa]/60 hover:text-gray-700 dark:hover:text-[#fafafa] transition-colors duration-500 ease-out"
                  >
                    ✕
                  </button>
                </div>

                {/* Paragrafo introduttivo */}
                <div className="mb-6 p-4 bg-gray-50 dark:bg-[rgba(250,250,250,0.05)] rounded-xl transition-colors duration-500 ease-out">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-[#fafafa] mb-3 transition-colors duration-500 ease-out">
                    {t('cookies.modal.intro_title')}
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-[#fafafa]/80 leading-relaxed transition-colors duration-500 ease-out">
                    {t('cookies.modal.intro_text')}{' '}
                    <a href="/cookie-policy" className="text-[#F20352] hover:underline font-medium">
                      {t('cookies.modal.intro_link')}
                    </a>
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Cookie Funzionali */}
                  <div className="border border-gray-200 dark:border-[rgba(250,250,250,0.1)] rounded-xl p-4 transition-colors duration-500 ease-out">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-[#fafafa] transition-colors duration-500 ease-out">
                        {t('cookies.modal.functional.title')}
                      </h3>
                      <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full font-medium">
                        {t('cookies.modal.functional.status')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-[#fafafa]/80 leading-relaxed transition-colors duration-500 ease-out">
                      {t('cookies.modal.functional.description')}
                    </p>
                  </div>

                  {/* Cookie Marketing */}
                  <div className="border border-gray-200 dark:border-[rgba(250,250,250,0.1)] rounded-xl p-4 transition-colors duration-500 ease-out">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-[#fafafa] transition-colors duration-500 ease-out">
                        {t('cookies.modal.marketing.title')}
                      </h3>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={marketingEnabled}
                          onChange={(e) => setMarketingEnabled(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#fafafa] after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F20352]"></div>
                      </label>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-[#fafafa]/80 leading-relaxed transition-colors duration-500 ease-out">
                      {t('cookies.modal.marketing.description')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Pulsanti fissi in fondo */}
              <div className="flex flex-col sm:flex-row gap-3 p-6 md:px-8 md:pb-8 border-t border-gray-200 dark:border-[rgba(250,250,250,0.1)] bg-white/95 dark:bg-[#0b0b0b]/95 rounded-b-2xl">
                <button
                  onClick={() => {
                    setMarketingEnabled(false);
                    localStorage.setItem('marketing-consent', 'rejected');
                    localStorage.setItem('marketing-consent-date', new Date().toISOString());
                    localStorage.setItem('cookie-consent', 'rejected');
                    localStorage.setItem('cookie-consent-date', new Date().toISOString());
                    window.dispatchEvent(new Event('cookie-consent-changed'));
                    onReject();
                    setIsVisible(false);
                    setShowDetails(false);
                    document.body.style.overflow = 'unset';
                    document.body.style.position = 'unset';
                    document.body.style.width = 'unset';
                    onClose?.();
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-[12px] font-medium border border-gray-300 dark:border-[rgba(250,250,250,0.3)] text-gray-700 dark:text-[#fafafa] hover:bg-gray-50 dark:hover:bg-[rgba(250,250,250,0.1)] transition-all duration-200 ease-out"
                >
                  {t('cookies.modal.buttons.reject_all')}
                </button>
                <button
                  onClick={handleSavePreferences}
                  className="w-full sm:w-auto px-6 py-3 rounded-[12px] font-medium bg-[#F20352] hover:bg-[#d90247] text-white transition-all duration-200 ease-out"
                >
                  {t('cookies.modal.buttons.save_preferences')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
}
