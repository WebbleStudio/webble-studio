import { useState, useCallback, useEffect } from 'react';
import { apiCache, cacheKeys } from '@/lib/apiCache';
import { PERFORMANCE_CONFIG } from '@/lib/performance';
import { Project } from './data/useProjects';

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

  const STORAGE_KEY = 'portfolio-data-cache';
  const STORAGE_TTL_MS = PERFORMANCE_CONFIG.CACHE_TTL_MS; // 3 giorni

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

      // Persist to localStorage (3 giorni)
      if (typeof window !== 'undefined') {
        try {
          const payload = { timestamp: Date.now(), data };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
        } catch {
          // ignore storage errors
        }
      }
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
    // Try localStorage first
    if (typeof window !== 'undefined' && !window.location.search.includes('_t=')) {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as { timestamp: number; data: PortfolioData };
          const isFresh = Date.now() - parsed.timestamp < STORAGE_TTL_MS;
          if (isFresh && parsed?.data) {
            setPortfolioData(parsed.data);
            return; // Skip network fetch
          }
        }
      } catch {
        // ignore parse errors
      }
    }

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
