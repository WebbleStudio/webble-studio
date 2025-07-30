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

  // Carica tutte le categorie di servizi
  const fetchServiceCategories = useCallback(async () => {
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
