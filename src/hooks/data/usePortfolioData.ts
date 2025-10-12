import { useState, useCallback, useEffect } from 'react';
import { apiCache, cacheKeys } from '@/lib/apiCache';
import { PERFORMANCE_CONFIG } from '@/lib/performance';
import { Project } from './useProjects';

// Struttura dati portfolio aggregata
export interface PortfolioData {
  projects: Project[];
  _metadata?: {
    projectsCount: number;
    timestamp: string;
  };
}

export function usePortfolioData() {
  const [portfolioData, setPortfolioData] = useState<PortfolioData>({
    projects: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch dati portfolio in una chiamata - con cache 12 ore
  const fetchPortfolioData = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    setError(null);

    try {
      const data = await apiCache.get(
        cacheKeys.portfolioData(),
        async () => {
          const url = forceRefresh ? `/api/portfolio-data?_t=${Date.now()}` : '/api/portfolio-data';
          const response = await fetch(url, {
            cache: 'default', // ✅ Usa cache browser
            headers: {
              'Cache-Control': 'max-age=3600', // ✅ Cache 1 ora
            },
          });

          if (!response.ok) {
            throw new Error('Failed to fetch portfolio data');
          }

          return response.json();
        },
        PERFORMANCE_CONFIG.CACHE_TTL_MS // Cache 3 giorni unificata
      );

      setPortfolioData(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error fetching portfolio data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Carica i dati automaticamente al mount - solo una volta
  useEffect(() => {
    fetchPortfolioData();
  }, []); // ✅ Dipendenze vuote per evitare loop

  return {
    portfolioData,
    projects: portfolioData.projects,
    loading,
    error,
    fetchPortfolioData,
  };
}
