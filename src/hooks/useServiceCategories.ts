import { useState, useCallback, useEffect } from 'react';

export interface ServiceCategory {
  id: string;
  slug: string;
  name: string;
  images: string[]; // Array di ID dei progetti selezionati
  created_at: string;
  updated_at: string;
}

const ADMIN_CACHE_TTL = 5 * 60 * 1000; // 5 minuti per admin dashboard
const CACHE_KEY = 'admin_service_categories_cache';

export function useServiceCategories() {
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Cache localStorage per admin (5min TTL)
  const getCachedServiceCategories = useCallback((): ServiceCategory[] | null => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached);
      const age = Date.now() - timestamp;

      // Cache valida per 5 minuti
      if (age < ADMIN_CACHE_TTL) {
        return data;
      }

      // Cache scaduta
      localStorage.removeItem(CACHE_KEY);
      return null;
    } catch (error) {
      console.warn('[useServiceCategories] Error reading cache:', error);
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
  }, []);

  const setCachedServiceCategories = useCallback((data: ServiceCategory[]) => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.warn('[useServiceCategories] Error setting cache:', error);
    }
  }, []);

  // ✅ Fetch service categories con cache intelligente
  const fetchServiceCategories = useCallback(async (forceRefresh = false) => {
    // 1. Controlla cache se non è force refresh
    if (!forceRefresh) {
      const cachedData = getCachedServiceCategories();
      if (cachedData) {
        console.log('[useServiceCategories] Cache hit - using cached data');
        setServiceCategories(cachedData);
        return;
      }
    }

    console.log('[useServiceCategories] Cache miss - fetching from server');
    setLoading(true);
    setError(null);

    try {
      // ✅ Usa cache HTTP normale (no no-store!)
      const response = await fetch('/api/service-categories');

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch service categories');
      }

      const data = await response.json();
      setServiceCategories(data);
      setCachedServiceCategories(data); // Salva in cache
    } catch (err) {
      console.error('[useServiceCategories] Fetch error:', err);

      // Se l'errore indica che la tabella non esiste, prova a inizializzarla
      if (err instanceof Error && err.message.includes('Failed to fetch service categories')) {
        try {
          console.log('[useServiceCategories] Attempting to initialize service categories...');
          const initResponse = await fetch('/api/service-categories/init', {
            method: 'POST',
          });

          if (initResponse.ok) {
            const initData = await initResponse.json();
            console.log('[useServiceCategories] Service categories initialized:', initData);

            // Riprova a caricare le categorie
            const retryResponse = await fetch('/api/service-categories');
            if (retryResponse.ok) {
              const retryData = await retryResponse.json();
              setServiceCategories(retryData);
              setCachedServiceCategories(retryData);
              return;
            }
          }
        } catch (initError) {
          console.error('[useServiceCategories] Error initializing service categories:', initError);
        }
      }

      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [getCachedServiceCategories, setCachedServiceCategories]);

  // Inizializza da cache al mount
  useEffect(() => {
    const cachedData = getCachedServiceCategories();
    if (cachedData) {
      console.log('[useServiceCategories] Initial cache load');
      setServiceCategories(cachedData);
    }
  }, [getCachedServiceCategories]);

  // Inizializza le categorie di servizi
  const initializeServiceCategories = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/service-categories/init', {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to initialize service categories');
      }

      const data = await response.json();
      setServiceCategories(data);
      setCachedServiceCategories(data);
      
      console.log('[useServiceCategories] Service categories initialized');
      
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setCachedServiceCategories]);

  // ✅ Aggiorna una categoria di servizio
  const updateServiceCategory = useCallback(
    async (slug: string, images: string[]) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/service-categories', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ slug, images }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to update service category');
        }

        const updatedCategory = await response.json();
        
        // ✅ Aggiorna state locale sostituendo categoria (no re-fetch!)
        setServiceCategories(prev => 
          prev.map(cat => cat.slug === slug ? updatedCategory : cat)
        );
        
        // ✅ Invalida cache
        localStorage.removeItem(CACHE_KEY);
        
        console.log('[useServiceCategories] Service category updated - updated local state');
        
        return updatedCategory;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    serviceCategories,
    loading,
    error,
    fetchServiceCategories,
    initializeServiceCategories,
    updateServiceCategory,
  };
}
