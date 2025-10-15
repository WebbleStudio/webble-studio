'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';

interface SessionWarningProps {
  className?: string;
}

export default function SessionWarning({ className = '' }: SessionWarningProps) {
  const { data: session, update } = useSession();
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [showWarning, setShowWarning] = useState(false);
  const [isExtending, setIsExtending] = useState(false);

  useEffect(() => {
    if (!session?.expires) return;

    const checkSessionExpiry = () => {
      const now = new Date().getTime();
      const expiry = new Date(session.expires).getTime();
      const remaining = expiry - now;

      // Mostra avviso quando rimangono meno di 30 minuti
      const warningThreshold = 30 * 60 * 1000; // 30 minuti in millisecondi

      if (remaining <= 0) {
        // Sessione scaduta, disconnetti
        signOut({ callbackUrl: '/login' });
        return;
      }

      if (remaining <= warningThreshold) {
        setShowWarning(true);
        setTimeLeft(remaining);
      } else {
        setShowWarning(false);
      }
    };

    // Controlla immediatamente
    checkSessionExpiry();

    // Controlla ogni minuto
    const interval = setInterval(checkSessionExpiry, 60000);

    return () => clearInterval(interval);
  }, [session?.expires]);

  const formatTimeLeft = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleExtendSession = async () => {
    setIsExtending(true);
    try {
      // Aggiorna la sessione per estendere la scadenza
      await update();
      setShowWarning(false);
    } catch (error) {
      console.error("Errore nell'estensione della sessione:", error);
    } finally {
      setIsExtending(false);
    }
  };

  const handleLogout = () => {
    signOut({ callbackUrl: '/login' });
  };

  if (!showWarning) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className={`fixed top-4 right-4 z-50 ${className}`}
      >
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-4 shadow-lg max-w-sm">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-amber-800 dark:text-amber-200">
                Sessione in scadenza
              </h3>
              <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
                La tua sessione scadrà tra{' '}
                <span className="font-mono font-semibold">{formatTimeLeft(timeLeft)}</span>
              </p>
              <div className="mt-3 flex space-x-2">
                <button
                  onClick={handleExtendSession}
                  disabled={isExtending}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-amber-800 bg-amber-100 hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isExtending ? 'Estendendo...' : 'Estendi sessione'}
                </button>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-3 py-1.5 border border-amber-300 text-xs font-medium rounded text-amber-700 bg-transparent hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                >
                  Disconnetti
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
