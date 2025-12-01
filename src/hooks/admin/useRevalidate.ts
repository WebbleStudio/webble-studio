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
      let errorMessage = 'Unknown error';
      
      if (err instanceof TypeError && err.message === 'Failed to fetch') {
        // Errore di rete - potrebbe essere un problema di connessione o CORS
        errorMessage = 'Errore di connessione: impossibile raggiungere il server. Verifica la connessione e riprova.';
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      console.error('❌ Error in revalidate:', err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Revalida tutte le pagine principali E i loro layout
  const revalidateAll = useCallback(async () => {
    return revalidate([
      '/',
      '/portfolio',
      '/progetti',
      '/chi-siamo',
      '/contatti',
      '/portfolio/layout',
      '/chi-siamo/layout',
      '/contatti/layout',
    ]);
  }, [revalidate]);

  // Invalida tutte le cache e revalida tutto
  const invalidateAll = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. Invalida tutte le cache API + layout
      // Aggiungi timeout per evitare che il fetch si blocchi indefinitamente
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 secondi timeout
      
      console.log('🔄 Calling /api/revalidate...');
      let cacheResponse: Response;
      try {
        cacheResponse = await fetch('/api/revalidate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            Pragma: 'no-cache',
        },
        body: JSON.stringify({
            paths: [
              '/',
              '/portfolio',
              '/progetti',
              '/chi-siamo',
              '/contatti',
              '/portfolio/layout',
              '/chi-siamo/layout',
              '/contatti/layout',
            ],
          invalidateCache: true,
        }),
          signal: controller.signal,
      });
        clearTimeout(timeoutId);
        console.log('✅ Fetch completed, status:', cacheResponse.status);
      } catch (fetchError) {
        clearTimeout(timeoutId);
        console.error('❌ Fetch error:', fetchError);
        if (fetchError instanceof Error && fetchError.name === 'AbortError') {
          throw new Error('Timeout: la richiesta ha impiegato troppo tempo. Riprova.');
        }
        if (fetchError instanceof TypeError && fetchError.message === 'Failed to fetch') {
          throw new Error('Errore di connessione: impossibile raggiungere /api/revalidate. Verifica che il server sia avviato e riprova.');
        }
        throw fetchError;
      }

      if (!cacheResponse.ok) {
        let errorMessage = 'Failed to invalidate cache';
        try {
          const errorData = await cacheResponse.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          // Se non riesce a parsare il JSON, usa il testo della risposta
          try {
            const textError = await cacheResponse.text();
            errorMessage = textError || errorMessage;
          } catch (textError) {
            // Se anche questo fallisce, usa il messaggio di default
            errorMessage = `HTTP ${cacheResponse.status}: ${cacheResponse.statusText}`;
          }
        }
        throw new Error(errorMessage);
      }

      // 2. Invalida cache locale
      apiCache.invalidate(cacheKeys.projects());
      apiCache.invalidate(cacheKeys.heroProjects());
      apiCache.invalidate(cacheKeys.serviceCategories());
      apiCache.invalidate(cacheKeys.homeData());
      
      console.log('✅ API cache invalidated');

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

      // 5. Forza refresh delle pagine aperte e cache browser
      if (typeof window !== 'undefined') {
        // Aggiungi un timestamp per forzare il refresh
        const refreshTimestamp = Date.now();
        window.localStorage.setItem('force-refresh', refreshTimestamp.toString());

        // Notifica le altre tab che devono refreshare
        window.dispatchEvent(
          new CustomEvent('cache-invalidated', {
            detail: { timestamp: refreshTimestamp },
          })
        );

        // 6. FORCE RELOAD di tutti gli asset con cache-busting
        // Questo forza il browser a ricaricare anche le immagini
        try {
          const cacheBuster = `?cb=${refreshTimestamp}`;
          
          // Invalida service worker cache se presente
          if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({
              type: 'CLEAR_CACHE',
              timestamp: refreshTimestamp,
            });
          }

          // Pulisci cache HTTP del browser (non localStorage)
          if ('caches' in window) {
            caches.keys().then((names) => {
              names.forEach((name) => {
                caches.delete(name);
              });
            });
          }

          console.log('✅ Browser cache cleared with cache-buster:', cacheBuster);
        } catch (error) {
          console.warn('Failed to clear browser cache:', error);
        }
      }

      console.log('✅ All caches invalidated and pages revalidated');
      return { success: true };
    } catch (err) {
      let errorMessage = 'Unknown error';
      
      if (err instanceof TypeError && err.message === 'Failed to fetch') {
        // Errore di rete - potrebbe essere un problema di connessione o CORS
        errorMessage = 'Errore di connessione: impossibile raggiungere il server. Verifica la connessione e riprova.';
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      console.error('❌ Error in invalidateAll:', err);
      setError(errorMessage);
      throw new Error(errorMessage);
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
