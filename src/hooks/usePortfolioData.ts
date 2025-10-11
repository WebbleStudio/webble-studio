import { useState, useCallback } from 'react';
import { apiCache, cacheKeys } from '@/lib/apiCache';
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
  const fetchPortfolioData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await apiCache.get(
        cacheKeys.portfolioData(),
        async () => {
          const response = await fetch('/api/portfolio-data', {
            cache: 'no-store',
            headers: {
              'Cache-Control': 'no-cache',
            },
          });
          
          if (!response.ok) {
            throw new Error('Failed to fetch portfolio data');
          }
          
          return response.json();
        },
        24 * 60 * 60 * 1000 // Cache 24 ore (86400000ms)
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

  return {
    portfolioData,
    projects: portfolioData.projects,
    loading,
    error,
    fetchPortfolioData,
  };
}

