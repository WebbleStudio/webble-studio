import { useState, useCallback, useEffect } from 'react';
import { apiCache, cacheKeys } from '@/lib/apiCache';
import { PERFORMANCE_CONFIG } from '@/lib/performance';
import { Project } from './data/useProjects';
import { HeroProject } from './data/useHeroProjects';
import { ServiceCategory } from './useServiceCategories';

// Hero project arricchito con progetto completo
export interface EnrichedHeroProject extends HeroProject {
  project: Project | null;
}

// Service category arricchita con progetti completi
export interface EnrichedServiceCategory extends ServiceCategory {
  projects: Project[];
}

// Struttura dati home aggregata
export interface HomeData {
  projects: Project[];
  heroProjects: EnrichedHeroProject[];
  serviceCategories: EnrichedServiceCategory[];
  _metadata?: {
    projectsCount: number;
    heroProjectsCount: number;
    serviceCategoriesCount: number;
    timestamp: string;
  };
}

export function useHomeData() {
  const [homeData, setHomeData] = useState<HomeData>({
    projects: [],
    heroProjects: [],
    serviceCategories: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const STORAGE_KEY = 'home-data-cache';
  const STORAGE_TTL_MS = PERFORMANCE_CONFIG.CACHE_TTL_MS;

  // Fetch tutti i dati home in una chiamata - con cache 3 giorni
  const fetchHomeData = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    setError(null);

    try {
      const data = await apiCache.get(
        cacheKeys.homeData(),
        async () => {
          const url = forceRefresh ? `/api/home-data?_t=${Date.now()}` : '/api/home-data';

          const response = await fetch(url);

          if (!response.ok) {
            throw new Error('Failed to fetch home data');
          }

          return response.json();
        },
        PERFORMANCE_CONFIG.CACHE_TTL_MS // Cache 3 giorni unificata
      );

      setHomeData(data);

      // Persist to sessionStorage for future navigations within tab
      if (typeof window !== 'undefined') {
        try {
          const payload = {
            timestamp: Date.now(),
            data,
          };
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
        } catch {
          // Ignore storage errors (quota/disabled)
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error fetching home data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Carica i dati automaticamente al mount - solo una volta
  useEffect(() => {
    // Try sessionStorage first to avoid edge requests
    if (typeof window !== 'undefined' && !window.location.search.includes('_t=')) {
      try {
        const raw = sessionStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as { timestamp: number; data: HomeData };
          const isFresh = Date.now() - parsed.timestamp < STORAGE_TTL_MS;
          if (isFresh && parsed?.data) {
            setHomeData(parsed.data);
            return; // Skip network fetch
          }
        }
      } catch {
        // Ignore parse errors and fall back to network fetch
      }
    }

    fetchHomeData();
  }, []); // ✅ Dipendenze vuote per evitare loop

  return {
    homeData,
    projects: homeData.projects,
    heroProjects: homeData.heroProjects,
    serviceCategories: homeData.serviceCategories,
    loading,
    error,
    fetchHomeData,
  };
}
