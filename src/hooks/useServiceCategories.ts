import { useState, useCallback } from 'react';

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

  // Fetch service categories - sempre dal server, no cache
  const fetchServiceCategories = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/service-categories', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch service categories');
      }

      const data = await response.json();
      setServiceCategories(data);
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
  }, []);

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
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Aggiorna una categoria di servizio
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

        const data = await response.json();
        
        // Ricarica dal server
        await fetchServiceCategories(true);
        
        return data;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchServiceCategories]
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
