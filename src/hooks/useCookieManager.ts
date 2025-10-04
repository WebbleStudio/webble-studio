import { useState, useEffect } from 'react';

export function useCookieManager() {
  const [isManagerOpen, setIsManagerOpen] = useState(false);

  const openManager = () => {
    setIsManagerOpen(true);
  };

  const closeManager = () => {
    setIsManagerOpen(false);
  };

  // Chiudi il manager quando l'utente clicca fuori o preme ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isManagerOpen) {
        closeManager();
      }
    };

    if (isManagerOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isManagerOpen]);

  return {
    isManagerOpen,
    openManager,
    closeManager,
  };
}

