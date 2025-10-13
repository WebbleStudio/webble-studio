import { useState, useCallback } from 'react';
import { apiCache, cacheKeys } from '@/lib/apiCache';

export function useRevalidate() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Revalida le pagine specificate
  const revalidate = useCallback(async (paths: string[]) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/revalidate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paths }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to revalidate');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Revalida tutte le pagine principali
  const revalidateAll = useCallback(async () => {
    return revalidate(['/', '/portfolio', '/chi-siamo', '/contatti']);
  }, [revalidate]);

  // Invalida tutte le cache e revalida tutto
  const invalidateAll = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. Invalida tutte le cache API
      const cacheResponse = await fetch('/api/revalidate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paths: ['/', '/portfolio', '/chi-siamo', '/contatti'],
          invalidateCache: true,
        }),
      });

      if (!cacheResponse.ok) {
        throw new Error('Failed to invalidate cache');
      }

      // 2. Invalida cache locale
      apiCache.invalidate(cacheKeys.projects());
      apiCache.invalidate(cacheKeys.heroProjects());
      apiCache.invalidate(cacheKeys.serviceCategories());
      apiCache.invalidate(cacheKeys.homeData());

      // 3. Invalida localStorage cache
      if (typeof window !== 'undefined') {
        try {
          localStorage.removeItem('home-data-cache');
          localStorage.removeItem('portfolio-data-cache');
          console.log('✅ LocalStorage cache cleared');
        } catch (error) {
          console.warn('Failed to clear localStorage cache:', error);
        }
      }

      // 4. Revalida tutte le pagine
      await revalidateAll();

      // 5. Forza refresh delle pagine aperte (opzionale)
      if (typeof window !== 'undefined') {
        // Aggiungi un timestamp per forzare il refresh
        const refreshTimestamp = Date.now();
        window.localStorage.setItem('force-refresh', refreshTimestamp.toString());
        
        // Notifica le altre tab che devono refreshare
        window.dispatchEvent(new CustomEvent('cache-invalidated', { 
          detail: { timestamp: refreshTimestamp } 
        }));
      }

      console.log('✅ All caches invalidated and pages revalidated');
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [revalidateAll]);

  return {
    revalidate,
    revalidateAll,
    invalidateAll,
    loading,
    error,
  };
}
