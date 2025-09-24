'use client';

import { useEffect, useState } from 'react';

interface PerformanceOptimizerProps {
  children: React.ReactNode;
}

export default function PerformanceOptimizer({ children }: PerformanceOptimizerProps) {
  const [isSlowConnection, setIsSlowConnection] = useState(false);
  const [isLowEndDevice, setIsLowEndDevice] = useState(false);

  useEffect(() => {
    // Rileva connessione lenta
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    
    if (connection) {
      const isSlow = connection.effectiveType === 'slow-2g' || 
                   connection.effectiveType === '2g' || 
                   connection.saveData === true;
      setIsSlowConnection(isSlow);
    }

    // Rileva device a bassa potenza
    const isLowEnd = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2;
    setIsLowEndDevice(isLowEnd);

    // Aggiungi classi CSS per ottimizzazioni
    if (isSlowConnection || isLowEndDevice) {
      document.documentElement.classList.add('performance-mode');
    }
  }, []);

  return <>{children}</>;
}
