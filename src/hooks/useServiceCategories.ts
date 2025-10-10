import { useState, useCallback, useEffect } from 'react';

export interface ServiceCategory {
  id: string;
  slug: string;
  name: string;
  images: string[]; // Array di ID dei progetti selezionati
  created_at: string;
  updated_at: string;
}

export function useServiceCategories() {
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cache client-side per service categories (24h TTL)
  const getCachedServiceCategories = useCallback((): ServiceCategory[] | null => {
    try {
      const cached = localStorage.getItem('service_categories_cache');
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached);
      const now = Date.now();
      const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24h

      // Controlla se la cache è scaduta
      if (now - timestamp > CACHE_DURATION) {
        localStorage.removeItem('service_categories_cache');
        return null;
      }

      return data;
    } catch (error) {
      console.warn('Error reading service categories cache:', error);
      localStorage.removeItem('service_categories_cache');
      return null;
    }
  }, []);

  const setCachedServiceCategories = useCallback((data: ServiceCategory[]) => {
    try {
      localStorage.setItem('service_categories_cache', JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.warn('Error setting service categories cache:', error);
    }
  }, []);

  // Controlla cache all'inizializzazione
  useEffect(() => {
    const cachedData = getCachedServiceCategories();
    if (cachedData) {
      setServiceCategories(cachedData);
    }
  }, [getCachedServiceCategories]);

  // Carica tutte le categorie di servizi - ora usa cache
  const fetchServiceCategories = useCallback(async (forceRefresh = false) => {
    // Controlla cache se non è un refresh forzato
    if (!forceRefresh) {
      const cachedData = getCachedServiceCategories();
      if (cachedData) {
        setServiceCategories(cachedData);
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/service-categories');

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch service categories');
      }

      const data = await response.json();
      setServiceCategories(data);
      setCachedServiceCategories(data); // Salva in cache
    } catch (err) {
      console.error('Error fetching service categories:', err);

      // Se l'errore indica che la tabella non esiste, prova a inizializzarla
      if (err instanceof Error && err.message.includes('Failed to fetch service categories')) {
        try {
          console.log('Attempting to initialize service categories...');
          const initResponse = await fetch('/api/service-categories/init', {
            method: 'POST',
          });

          if (initResponse.ok) {
            const initData = await initResponse.json();
            console.log('Service categories initialized:', initData);

            // Riprova a caricare le categorie
            const retryResponse = await fetch('/api/service-categories');
            if (retryResponse.ok) {
              const retryData = await retryResponse.json();
              setServiceCategories(retryData);
              setCachedServiceCategories(retryData); // Salva in cache
              return;
            }
          }
        } catch (initError) {
          console.error('Error initializing service categories:', initError);
        }
      }

      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [getCachedServiceCategories, setCachedServiceCategories]);

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
      console.log('Service categories initialized:', data);

      // Ricarica le categorie dopo l'inizializzazione
      await fetchServiceCategories();
    } catch (err) {
      console.error('Error initializing service categories:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [fetchServiceCategories]);

  // Aggiorna le immagini di una categoria
  const updateServiceCategoryImages = useCallback(async (slug: string, images: string[]) => {
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

      // Aggiorna lo stato locale
      setServiceCategories((prev) =>
        prev.map((category) => (category.slug === slug ? updatedCategory : category))
      );

      return updatedCategory;
    } catch (err) {
      console.error('Error updating service category:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    serviceCategories,
    loading,
    error,
    fetchServiceCategories,
    updateServiceCategoryImages,
    initializeServiceCategories,
    setError,
  };
}
