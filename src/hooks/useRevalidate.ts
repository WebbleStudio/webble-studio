import { useState, useCallback } from 'react';

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

  return {
    revalidate,
    revalidateAll,
    loading,
    error,
  };
}

