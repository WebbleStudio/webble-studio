'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/hooks/useTranslation';

interface CookieBannerProps {
  onAccept: () => void;
  onReject: () => void;
  forceShow?: boolean;
  onClose?: () => void;
  onSavePreferences?: (analyticsEnabled: boolean) => void;
}

export default function CookieBanner({ onAccept, onReject, forceShow = false, onClose, onSavePreferences }: CookieBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [expandedCookie, setExpandedCookie] = useState<string | null>(null);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    // Inizializza lo stato analyticsEnabled basato sul consenso esistente
    const cookieChoice = localStorage.getItem('cookie-consent');
    setAnalyticsEnabled(cookieChoice === 'accepted');

    // Se forceShow è true, mostra sempre il modal
    if (forceShow) {
      setShowDetails(true);
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      return;
    }

    // Controlla se l'utente ha già fatto una scelta sui cookie
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
    setShowDetails(false); // Chiudi il modal se aperto
    document.body.style.overflow = 'unset'; // Riabilita lo scroll
    onAccept();
    onClose?.(); // Chiudi il manager se aperto tramite pulsante
  };

  const handleReject = () => {
    setIsVisible(false);
    setShowDetails(false); // Chiudi il modal se aperto
    document.body.style.overflow = 'unset'; // Riabilita lo scroll
    onReject();
    onClose?.(); // Chiudi il manager se aperto tramite pulsante
  };

  const handleManage = () => {
    setShowDetails(true);
    // Blocca lo scroll del body (funziona anche su mobile)
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    // Riabilita lo scroll del body
    document.body.style.overflow = 'unset';
    document.body.style.position = 'unset';
    document.body.style.width = 'unset';
    // Se il modal è stato aperto tramite forceShow, chiudi anche il manager
    if (forceShow) {
      onClose?.();
    }
  };

  const handleSavePreferences = () => {
    if (analyticsEnabled) {
      onAccept();
    } else {
      onReject();
    }
    setIsVisible(false); // Chiudi il banner principale
    setShowDetails(false); // Chiudi il modal
    document.body.style.overflow = 'unset';
    document.body.style.position = 'unset';
    document.body.style.width = 'unset';
    onClose?.(); // Chiudi il manager se aperto tramite pulsante
  };

  // Gestisci l'apertura del modal tramite forceShow
  useEffect(() => {
    if (forceShow) {
      // Aggiorna lo stato analyticsEnabled quando si apre il modal
      const cookieChoice = localStorage.getItem('cookie-consent');
      setAnalyticsEnabled(cookieChoice === 'accepted');
      
      setShowDetails(true);
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    }
  }, [forceShow]);

  // Listener per aggiornare lo stato del toggle quando cambia il consenso
  useEffect(() => {
    const handleConsentChange = () => {
      const cookieChoice = localStorage.getItem('cookie-consent');
      setAnalyticsEnabled(cookieChoice === 'accepted');
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
                  <button
                    onClick={handleReject}
                    className="w-full sm:w-auto px-6 py-3 rounded-[12px] font-medium border border-gray-300 dark:border-[rgba(250,250,250,0.3)] text-gray-700 dark:text-[#fafafa] hover:bg-gray-50 dark:hover:bg-[rgba(250,250,250,0.1)] transition-colors duration-500 ease-out"
                  >
                    {t('cookies.banner.reject')}
                  </button>
                  <button
                    onClick={handleManage}
                    className="w-full sm:w-auto px-6 py-3 rounded-[12px] font-medium border border-gray-300 dark:border-[rgba(250,250,250,0.3)] text-gray-700 dark:text-[#fafafa] hover:bg-gray-50 dark:hover:bg-[rgba(250,250,250,0.1)] transition-colors duration-500 ease-out"
                  >
                    {t('cookies.banner.manage')}
                  </button>
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
                  <a 
                    href="/privacy-policy" 
                    className="text-[#F20352] hover:underline"
                  >
                    {t('cookies.banner.privacy_policy')}
                  </a>
                  {' '}e la nostra{' '}
                  <a 
                    href="/cookie-policy" 
                    className="text-[#F20352] hover:underline"
                  >
                    {t('cookies.banner.cookie_policy')}
                  </a>
                  .
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
              className="bg-white/95 dark:bg-[#0b0b0b]/95 backdrop-blur-md border border-[rgba(0,0,0,0.1)] dark:border-[rgba(250,250,250,0.1)] rounded-2xl p-6 md:p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto transition-colors duration-500 ease-out"
              onClick={(e) => e.stopPropagation()}
            >
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

              <div className="space-y-6">
                {/* Cookie Obbligatori */}
                <div className="border border-gray-200 dark:border-[rgba(250,250,250,0.1)] rounded-xl p-4 transition-colors duration-500 ease-out">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-[#fafafa] transition-colors duration-500 ease-out">
                      {t('cookies.modal.mandatory.title')}
                    </h3>
                    <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                      {t('cookies.modal.mandatory.status')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-[#fafafa]/80 mb-3 transition-colors duration-500 ease-out">
                    {t('cookies.modal.mandatory.description')}
                  </p>
                  <div className="space-y-2">
                    <div className="border border-gray-200 dark:border-[rgba(250,250,250,0.1)] rounded-lg p-3 transition-colors duration-500 ease-out">
                      <div 
                        className="flex justify-between items-center cursor-pointer"
                        onClick={() => setExpandedCookie(expandedCookie === 'vercel' ? null : 'vercel')}
                      >
                        <div>
                          <span className="text-sm font-medium text-gray-900 dark:text-[#fafafa] transition-colors duration-500 ease-out">{t('cookies.modal.mandatory.vercel.name')}</span>
                          <p className="text-xs text-gray-500 dark:text-[#fafafa]/60 transition-colors duration-500 ease-out">{t('cookies.modal.mandatory.vercel.provider')}</p>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-[#fafafa]/60 transition-colors duration-500 ease-out">
                          {expandedCookie === 'vercel' ? '−' : '+'}
                        </span>
                      </div>
                      {expandedCookie === 'vercel' && (
                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-[rgba(250,250,250,0.1)] space-y-2 transition-colors duration-500 ease-out">
                          <div>
                            <span className="text-xs font-medium text-gray-900 dark:text-[#fafafa] transition-colors duration-500 ease-out">{t('cookies.modal.mandatory.vercel.purpose')}</span>
                            <p className="text-xs text-gray-600 dark:text-[#fafafa]/80 transition-colors duration-500 ease-out">{t('cookies.modal.mandatory.vercel.purpose_text')}</p>
                          </div>
                          <div>
                            <span className="text-xs font-medium text-gray-900 dark:text-[#fafafa] transition-colors duration-500 ease-out">{t('cookies.modal.mandatory.vercel.data_collected')}</span>
                            <p className="text-xs text-gray-600 dark:text-[#fafafa]/80 transition-colors duration-500 ease-out">{t('cookies.modal.mandatory.vercel.data_text')}</p>
                          </div>
                          <div>
                            <span className="text-xs font-medium text-gray-900 dark:text-[#fafafa] transition-colors duration-500 ease-out">{t('cookies.modal.mandatory.vercel.description')}</span>
                            <p className="text-xs text-gray-600 dark:text-[#fafafa]/80 transition-colors duration-500 ease-out">{t('cookies.modal.mandatory.vercel.description_text')}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Cookie Analitici */}
                <div className="border border-gray-200 dark:border-[rgba(250,250,250,0.1)] rounded-xl p-4 transition-colors duration-500 ease-out">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-[#fafafa] transition-colors duration-500 ease-out">
                      {t('cookies.modal.analytics.title')}
                    </h3>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={analyticsEnabled}
                        onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F20352]"></div>
                    </label>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-[#fafafa]/80 mb-3 transition-colors duration-500 ease-out">
                    {t('cookies.modal.analytics.description')}
                  </p>
                  <div className="space-y-2">
                    <div className="border border-gray-200 dark:border-[rgba(250,250,250,0.1)] rounded-lg p-3 transition-colors duration-500 ease-out">
                      <div 
                        className="flex justify-between items-center cursor-pointer"
                        onClick={() => setExpandedCookie(expandedCookie === 'ga4' ? null : 'ga4')}
                      >
                        <div>
                          <span className="text-sm font-medium text-gray-900 dark:text-[#fafafa] transition-colors duration-500 ease-out">{t('cookies.modal.analytics.ga4.name')}</span>
                          <p className="text-xs text-gray-500 dark:text-[#fafafa]/60 transition-colors duration-500 ease-out">{t('cookies.modal.analytics.ga4.provider')}</p>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-[#fafafa]/60 transition-colors duration-500 ease-out">
                          {expandedCookie === 'ga4' ? '−' : '+'}
                        </span>
                      </div>
                      {expandedCookie === 'ga4' && (
                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-[rgba(250,250,250,0.1)] space-y-2 transition-colors duration-500 ease-out">
                          <div>
                            <span className="text-xs font-medium text-gray-900 dark:text-[#fafafa] transition-colors duration-500 ease-out">{t('cookies.modal.analytics.ga4.purpose')}</span>
                            <p className="text-xs text-gray-600 dark:text-[#fafafa]/80 transition-colors duration-500 ease-out">{t('cookies.modal.analytics.ga4.purpose_text')}</p>
                          </div>
                          <div>
                            <span className="text-xs font-medium text-gray-900 dark:text-[#fafafa] transition-colors duration-500 ease-out">{t('cookies.modal.analytics.ga4.data_collected')}</span>
                            <p className="text-xs text-gray-600 dark:text-[#fafafa]/80 transition-colors duration-500 ease-out">{t('cookies.modal.analytics.ga4.data_text')}</p>
                          </div>
                          <div>
                            <span className="text-xs font-medium text-gray-900 dark:text-[#fafafa] transition-colors duration-500 ease-out">{t('cookies.modal.analytics.ga4.description')}</span>
                            <p className="text-xs text-gray-600 dark:text-[#fafafa]/80 transition-colors duration-500 ease-out">{t('cookies.modal.analytics.ga4.description_text')}</p>
                          </div>
                          <div>
                            <span className="text-xs font-medium text-gray-900 dark:text-[#fafafa] transition-colors duration-500 ease-out">{t('cookies.modal.analytics.ga4.privacy')}</span>
                            <p className="text-xs text-gray-600 dark:text-[#fafafa]/80 transition-colors duration-500 ease-out">{t('cookies.modal.analytics.ga4.privacy_text')}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Pulsanti finali */}
              <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-[rgba(250,250,250,0.1)]">
                <button
                  onClick={() => {
                    setAnalyticsEnabled(false);
                    // Salva immediatamente il rifiuto
                    onReject();
                    setIsVisible(false); // Chiudi il banner principale
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

