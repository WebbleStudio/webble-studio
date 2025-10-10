'use client';

import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  apiCalls: number;
  imageLoads: number;
  cacheHits: number;
  loadTime: number;
}

/**
 * Component per monitorare performance in tempo reale
 * Mostra metriche di ottimizzazione
 */
export default function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    apiCalls: 0,
    imageLoads: 0,
    cacheHits: 0,
    loadTime: 0,
  });
  
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const startTime = performance.now();
    
    // Monitora API calls con dettagli
    const originalFetch = window.fetch;
    let apiCallCount = 0;
    const apiCalls: string[] = [];
    
    window.fetch = async (...args) => {
      const url = args[0]?.toString() || 'unknown';
      
      // Filtra solo chiamate API interne (escludi auth/session che è normale)
      if (url.includes('/api/') && !url.includes('/api/auth/')) {
        apiCallCount++;
        apiCalls.push(url);
        console.log(`🚨 API CALL #${apiCallCount}: ${url}`);
        setMetrics(prev => ({ ...prev, apiCalls: apiCallCount }));
      }
      
      return originalFetch(...args);
    };

    // Monitora cache hits
    const checkCacheHits = () => {
      const cacheKeys = ['projects_cache', 'hero_projects_cache', 'service_categories_cache'];
      const hits = cacheKeys.filter(key => localStorage.getItem(key)).length;
      setMetrics(prev => ({ ...prev, cacheHits: hits }));
    };

    // Monitora image loads
    const imageObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const imageEntries = entries.filter(entry => entry.name.includes('_next/image'));
      setMetrics(prev => ({ ...prev, imageLoads: imageEntries.length }));
    });

    imageObserver.observe({ entryTypes: ['resource'] });

    // Calcola load time
    const handleLoad = () => {
      const loadTime = performance.now() - startTime;
      setMetrics(prev => ({ ...prev, loadTime: Math.round(loadTime) }));
    };

    window.addEventListener('load', handleLoad);
    checkCacheHits();

    // Cleanup
    return () => {
      window.fetch = originalFetch;
      imageObserver.disconnect();
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  // Mostra solo in development e solo dopo hydration
  if (process.env.NODE_ENV !== 'development' || !isClient) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-3 rounded-lg text-xs font-mono z-50 max-w-xs">
      <div className="mb-2 font-bold">Performance Monitor</div>
      <div>API Calls: {metrics.apiCalls}</div>
      <div>Cache Hits: {metrics.cacheHits}/3</div>
      <div>Images: {metrics.imageLoads}</div>
      <div>Load Time: {metrics.loadTime}ms</div>
      <div className="mt-2 text-green-400">
        {metrics.cacheHits === 3 ? '✅ All cached' : '⚠️ Some API calls'}
      </div>
      <div className="mt-2 text-yellow-400 text-xs">
        Excludes /api/auth/ (normal)
      </div>
    </div>
  );
}
