'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import OptimizedImage from '@/components/ui/OptimizedImage';
import AnimatedText from '@/components/ui/AnimatedText';
import { useHeader } from '@/contexts/HeaderContext';
import { useTranslation } from '@/hooks/useTranslation';

export default function ChiSiamoHero() {
  const [expandedPerson, setExpandedPerson] = useState<string | null>(null);
  const [showCV, setShowCV] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isDebouncing, setIsDebouncing] = useState(false);
  const { hideHeader, showHeader } = useHeader();
  const { t } = useTranslation();

  // Rileva se è mobile e se è un dispositivo touch
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    const checkTouchDevice = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };

    checkMobile();
    checkTouchDevice();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Gestione tasto ESC per accessibilità
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (isZoomed) {
          // Se siamo in zoom, disattiva SOLO lo zoom (non chiudere il container)
          setIsZoomed(false);
          setMousePosition({ x: 0, y: 0 });
        } else if (expandedPerson && !isDebouncing) {
          // Se abbiamo un container aperto ma NON siamo in zoom e NON siamo in debounce, chiudilo
          handleCloseExpansion();
        }
      }
    };

    // Aggiungi listener solo quando abbiamo un container aperto
    if (expandedPerson) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [expandedPerson, isZoomed, isDebouncing]);

  // Cleanup per evitare problemi WebGL
  React.useEffect(() => {
    return () => {
      // Cleanup quando il componente viene smontato
      if (expandedPerson) {
        setExpandedPerson(null);
        setShowCV(false);
        // Riabilita lo scroll completamente
        const scrollY = document.body.style.top;
        document.body.style.overflow = 'auto';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.top = '';
        if (scrollY) {
          window.scrollTo(0, parseInt(scrollY || '0') * -1);
        }
        // Mostra l'header dopo il cleanup
        setTimeout(() => {
          showHeader();
        }, 50);
      }
    };
  }, [expandedPerson, showHeader]);

  // Gestione scroll quando si espande
  React.useEffect(() => {
    if (expandedPerson) {
      // Disabilita lo scroll quando si espande
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${window.scrollY}px`;
    } else {
      // Riabilita lo scroll quando si chiude
      const scrollY = document.body.style.top;
      document.body.style.overflow = 'auto';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }
  }, [expandedPerson]);

  const handlePercorsoClick = (person: string) => {
    // Se è in corso un debounce, ignora il click
    if (isDebouncing) {
      return;
    }

    // Attiva il debounce per 0.7 secondi
    setIsDebouncing(true);
    setTimeout(() => {
      setIsDebouncing(false);
    }, 700);

    // Reset stato precedente se necessario
    if (expandedPerson) {
      setShowCV(false);
      setIsZoomed(false);
    }

    setExpandedPerson(person);
    // Nascondi tutto l'header
    hideHeader();

    // Mostra il CV dopo l'animazione di espansione
    const timer = setTimeout(() => {
      setShowCV(true);
    }, 800);

    // Cleanup timer se il componente viene smontato
    return () => clearTimeout(timer);
  };

  const handleCloseExpansion = () => {
    // Se è in corso un debounce, ignora il click
    if (isDebouncing) {
      return;
    }

    // Attiva il debounce per 0.7 secondi
    setIsDebouncing(true);
    setTimeout(() => {
      setIsDebouncing(false);
    }, 700);

    setShowCV(false);
    setExpandedPerson(null);
    setIsZoomed(false);
    setMousePosition({ x: 0, y: 0 });

    // Riabilita lo scroll immediatamente
    const scrollY = document.body.style.top;
    document.body.style.overflow = 'auto';
    document.body.style.position = '';
    document.body.style.width = '';
    document.body.style.top = '';
    if (scrollY) {
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }

    // Mostra di nuovo l'header con un delay per assicurarsi che le animazioni siano complete
    setTimeout(() => {
      showHeader();
    }, 200);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isZoomed) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2; // -1 to 1
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2; // -1 to 1
      setMousePosition({ x, y });
    }
  };

  return (
    <section className="h-screen w-full flex flex-col md:flex-row relative overflow-hidden">
      {/* Container Vadim */}
      <motion.div
        className="w-full md:w-1/2 relative cursor-pointer"
        onClick={() => !isDebouncing && handlePercorsoClick('vadim')}
        animate={{
          height: isMobile
            ? expandedPerson === 'vadim'
              ? '100vh'
              : expandedPerson === 'gabriele'
                ? '0vh'
                : '50vh'
            : '100vh',
          width: isMobile
            ? '100%'
            : expandedPerson === 'vadim'
              ? '100%'
              : expandedPerson === 'gabriele'
                ? '0%'
                : '50%',
        }}
        transition={{
          duration: 0.8,
          ease: [0.4, 0, 0.2, 1],
        }}
      >
        <OptimizedImage
          src="/img/vadim.png"
          alt="Vadim"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className={`object-cover transition-all duration-500 ${
            expandedPerson === 'vadim' ? 'blur-sm scale-105' : ''
          }`}
        />
        {/* Nome e ruolo Vadim */}
        <motion.div
          className="absolute bottom-0 left-0 p-6 w-full flex items-end justify-between"
          animate={{
            opacity: expandedPerson === 'vadim' ? 0 : expandedPerson === 'gabriele' ? 0 : 1,
          }}
          transition={{
            duration: 0.3,
            delay: expandedPerson === 'vadim' ? 0 : expandedPerson === 'gabriele' ? 0 : 0.4,
          }}
        >
          <div>
            <h2 className="text-white text-2xl md:text-3xl font-medium -mb-1">Vadim</h2>
            <AnimatedText as="h4" className="text-white text-lg md:text-xl opacity-80">
              {t('about.founder')}
            </AnimatedText>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePercorsoClick('vadim');
            }}
            className={`text-sm md:text-lg font-medium transition-colors flex items-center gap-2 pb-1 ${
              isDebouncing ? 'text-gray-500' : 'text-white hover:text-gray-300'
            }`}
            disabled={isDebouncing}
            title={isDebouncing ? 'Attendere...' : t('about.path')}
          >
            <AnimatedText as="span">{t('about.path')}</AnimatedText>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 12H19M19 12L12 5M19 12L12 19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </motion.div>
      </motion.div>

      {/* Container Gabriele */}
      <motion.div
        className="w-full md:w-1/2 relative cursor-pointer"
        onClick={() => !isDebouncing && handlePercorsoClick('gabriele')}
        animate={{
          height: isMobile
            ? expandedPerson === 'gabriele'
              ? '100vh'
              : expandedPerson === 'vadim'
                ? '0vh'
                : '50vh'
            : '100vh',
          width: isMobile
            ? '100%'
            : expandedPerson === 'gabriele'
              ? '100%'
              : expandedPerson === 'vadim'
                ? '0%'
                : '50%',
        }}
        transition={{
          duration: 0.8,
          ease: [0.4, 0, 0.2, 1],
        }}
      >
        <OptimizedImage
          src="/img/gabriele.png"
          alt="Gabriele"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className={`object-cover transition-all duration-500 ${
            expandedPerson === 'gabriele' ? 'blur-sm scale-105' : ''
          }`}
        />
        {/* Nome e ruolo Gabriele */}
        <motion.div
          className="absolute bottom-0 left-0 p-6 w-full flex items-end justify-between"
          animate={{
            opacity: expandedPerson === 'gabriele' ? 0 : expandedPerson === 'vadim' ? 0 : 1,
          }}
          transition={{
            duration: 0.3,
            delay: expandedPerson === 'gabriele' ? 0 : expandedPerson === 'vadim' ? 0 : 0.4,
          }}
        >
          <div>
            <h2 className="text-white text-2xl md:text-3xl font-medium -mb-1">Gabriele</h2>
            <AnimatedText as="h4" className="text-white text-lg md:text-xl opacity-80">
              {t('about.founder')}
            </AnimatedText>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePercorsoClick('gabriele');
            }}
            className={`text-sm md:text-lg font-medium transition-colors flex items-center gap-2 pb-1 ${
              isDebouncing ? 'text-gray-500' : 'text-white hover:text-gray-300'
            }`}
            disabled={isDebouncing}
            title={isDebouncing ? 'Attendere...' : t('about.path')}
          >
            <AnimatedText as="span">{t('about.path')}</AnimatedText>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 12H19M19 12L12 5M19 12L12 19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </motion.div>
      </motion.div>

      {/* Overlay scuro - appare dopo l'espansione */}
      <AnimatePresence>
        {expandedPerson && (
          <motion.div
            className="fixed inset-0 z-30 bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>

      {/* CV Overlay - appare dopo l'animazione */}
      <AnimatePresence>
        {showCV && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cv-title"
            tabIndex={-1}
          >
            {/* Titolo nascosto per accessibilità */}
            <h2 id="cv-title" className="sr-only">
              CV di {expandedPerson === 'gabriele' ? 'Gabriele' : 'Vadim'}
            </h2>

            {/* Close button */}
            <motion.button
              onClick={handleCloseExpansion}
              className={`absolute top-6 right-6 text-2xl transition-colors z-10 ${
                isDebouncing ? 'text-gray-500' : 'text-white hover:text-gray-300'
              }`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              aria-label="Chiudi CV"
              title={isDebouncing ? 'Attendere...' : 'Chiudi CV'}
              disabled={isDebouncing}
            >
              ✕
            </motion.button>

            {/* Indicatore zoom - solo per dispositivi non touch e schermi > 768px */}
            {!isTouchDevice && !isMobile && (
              <motion.div
                className="absolute top-6 left-6 text-white text-sm bg-black/50 px-3 py-1 rounded-full z-10 flex items-center gap-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
              >
                {/* Icona lente elegante */}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="flex-shrink-0"
                >
                  <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
                  <path
                    d="m21 21-4.35-4.35"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {isZoomed && (
                    <path d="M8 11h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  )}
                </svg>
                <span>
                  {isZoomed
                    ? 'Zoom attivo - Muovi il mouse per esplorare • ESC per disattivare zoom'
                    : 'Clicca per zoommare'}
                </span>
              </motion.div>
            )}

            {/* CV Container */}
            <motion.div
              className="w-full h-full flex items-center justify-center p-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4, ease: 'easeOut' }}
            >
              {expandedPerson === 'gabriele' ? (
                <div className="w-full h-full flex items-center justify-center p-4">
                  <motion.div
                    animate={
                      !isTouchDevice && !isMobile
                        ? {
                            scale: isZoomed ? 1.5 : 1,
                            x: isZoomed ? Math.max(-200, Math.min(200, -mousePosition.x * 250)) : 0,
                            y: isZoomed ? Math.max(-200, Math.min(200, -mousePosition.y * 250)) : 0,
                            transition: {
                              scale: { duration: 0.3, ease: 'easeOut' },
                              x: { duration: 0.1, ease: 'linear' },
                              y: { duration: 0.1, ease: 'linear' },
                            },
                          }
                        : {}
                    }
                    className={`w-full h-full flex items-center justify-center rounded-2xl overflow-hidden ${
                      !isTouchDevice && !isMobile
                        ? isZoomed
                          ? 'cursor-zoom-out'
                          : 'cursor-zoom-in'
                        : ''
                    }`}
                    onClick={!isTouchDevice && !isMobile ? () => setIsZoomed(!isZoomed) : undefined}
                    onMouseMove={!isTouchDevice && !isMobile ? handleMouseMove : undefined}
                  >
                    <OptimizedImage
                      src="/img/cv-gabriele.png"
                      alt="CV Gabriele"
                      width={800}
                      height={1000}
                      className="max-w-full max-h-full object-contain rounded-2xl"
                    />
                  </motion.div>
                </div>
              ) : expandedPerson === 'vadim' ? (
                <div className="w-full h-full flex items-center justify-center p-4">
                  <motion.div
                    animate={
                      !isTouchDevice && !isMobile
                        ? {
                            scale: isZoomed ? 1.5 : 1,
                            x: isZoomed ? Math.max(-200, Math.min(200, -mousePosition.x * 250)) : 0,
                            y: isZoomed ? Math.max(-200, Math.min(200, -mousePosition.y * 250)) : 0,
                            transition: {
                              scale: { duration: 0.3, ease: 'easeOut' },
                              x: { duration: 0.1, ease: 'linear' },
                              y: { duration: 0.1, ease: 'linear' },
                            },
                          }
                        : {}
                    }
                    className={`w-full h-full flex items-center justify-center rounded-2xl overflow-hidden ${
                      !isTouchDevice && !isMobile
                        ? isZoomed
                          ? 'cursor-zoom-out'
                          : 'cursor-zoom-in'
                        : ''
                    }`}
                    onClick={!isTouchDevice && !isMobile ? () => setIsZoomed(!isZoomed) : undefined}
                    onMouseMove={!isTouchDevice && !isMobile ? handleMouseMove : undefined}
                  >
                    <OptimizedImage
                      src="/img/cv-vadim.png"
                      alt="CV Vadim"
                      width={800}
                      height={1000}
                      className="max-w-full max-h-full object-contain rounded-2xl"
                    />
                  </motion.div>
                </div>
              ) : (
                <div className="text-white text-center">
                  <h3 className="text-2xl mb-4">CV non disponibile</h3>
                  <p>CV non ancora disponibile</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
