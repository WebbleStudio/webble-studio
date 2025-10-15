import { useState, useCallback } from 'react';
import { apiCache, cacheKeys } from '@/lib/apiCache';

export interface Highlight {
  id: string;
  project_id: string;
  descriptions: string[];
  descriptions_en?: string[];
  images: string[];
  background_image?: string;
  project_date?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateHighlightData {
  project_id: string;
  descriptions?: string[];
  descriptions_en?: string[];
  images?: string[];
  background_image?: string;
  project_date?: string;
}

export function useHighlights() {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch tutti gli highlights
  const fetchHighlights = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiCache.get(
        cacheKeys.highlights(),
        async () => {
          const response = await fetch('/api/highlights', {
            cache: 'no-store',
            headers: {
              'Cache-Control': 'no-cache',
            },
          });
          if (!response.ok) {
            throw new Error('Failed to fetch highlights');
          }
          return response.json();
        },
        30 * 60 * 1000, // 30 minuti cache
        true // isAdmin
      );

      setHighlights(data);
    } catch (err) {
      console.error('Error fetching highlights:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch highlights');
    } finally {
      setLoading(false);
    }
  }, []);

  // Crea un nuovo highlight
  const createHighlight = useCallback(async (highlightData: CreateHighlightData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/highlights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(highlightData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create highlight');
      }

      const newHighlight = await response.json();
      
      // Aggiorna cache e stato locale
      await apiCache.invalidate(cacheKeys.highlights());
      setHighlights(prev => [...prev, newHighlight]);
      
      return newHighlight;
    } catch (err) {
      console.error('Error creating highlight:', err);
      setError(err instanceof Error ? err.message : 'Failed to create highlight');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Aggiorna un highlight
  const updateHighlight = useCallback(async (id: string, updates: Partial<CreateHighlightData>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/highlights', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, ...updates }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update highlight');
      }

      const updatedHighlight = await response.json();
      
      // Aggiorna cache e stato locale
      await apiCache.invalidate(cacheKeys.highlights());
      setHighlights(prev => prev.map(highlight => 
        highlight.id === id ? updatedHighlight : highlight
      ));
      
      return updatedHighlight;
    } catch (err) {
      console.error('Error updating highlight:', err);
      setError(err instanceof Error ? err.message : 'Failed to update highlight');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Elimina un highlight
  const deleteHighlight = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/highlights?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete highlight');
      }

      // Aggiorna cache e stato locale
      await apiCache.invalidate(cacheKeys.highlights());
      setHighlights(prev => prev.filter(highlight => highlight.id !== id));
      
    } catch (err) {
      console.error('Error deleting highlight:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete highlight');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    highlights,
    loading,
    error,
    fetchHighlights,
    createHighlight,
    updateHighlight,
    deleteHighlight,
  };
}
