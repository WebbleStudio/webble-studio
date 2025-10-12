import { useState, useCallback, useEffect } from 'react';
import { apiCache, cacheKeys } from '@/lib/apiCache';
import { Project } from './useProjects';
import { HeroProject } from './useHeroProjects';
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

  // Fetch tutti i dati home in una chiamata - con cache 3 giorni
  const fetchHomeData = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    setError(null);

    try {
      const data = await apiCache.get(
        cacheKeys.homeData(),
        async () => {
          const url = forceRefresh 
            ? `/api/home-data?_t=${Date.now()}` 
            : '/api/home-data';
          
          const response = await fetch(url);
          
          if (!response.ok) {
            throw new Error('Failed to fetch home data');
          }
          
          return response.json();
        },
        3 * 24 * 60 * 60 * 1000 // Cache 3 giorni (259200000ms)
      );

      setHomeData(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error fetching home data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Carica i dati automaticamente al mount
  useEffect(() => {
    fetchHomeData();
  }, [fetchHomeData]);

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

