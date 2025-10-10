import { useState, useCallback, useEffect } from 'react';

export interface HeroProject {
  id: string;
  project_id: string;
  position: number;
  descriptions: string[];
  images: string[];
  background_image: string;
  project_date: string;
  created_at: string;
  updated_at: string;
}

export interface HeroProjectConfig {
  projectId: string;
  descriptions: string[];
  images: string[];
  backgroundImage: string;
  projectDate: string;
}

const ADMIN_CACHE_TTL = 5 * 60 * 1000; // 5 minuti per admin dashboard
const CACHE_KEY = 'admin_hero_projects_cache';

export const useHeroProjects = () => {
  const [heroProjects, setHeroProjects] = useState<HeroProject[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Cache localStorage per admin (5min TTL)
  const getCachedHeroProjects = useCallback((): HeroProject[] | null => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached);
      const age = Date.now() - timestamp;

      // Cache valida per 5 minuti
      if (age < ADMIN_CACHE_TTL) {
        return data;
      }

      // Cache scaduta
      localStorage.removeItem(CACHE_KEY);
      return null;
    } catch (error) {
      console.warn('[useHeroProjects] Error reading cache:', error);
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
  }, []);

  const setCachedHeroProjects = useCallback((data: HeroProject[]) => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.warn('[useHeroProjects] Error setting cache:', error);
    }
  }, []);

  // ✅ Fetch hero projects con cache intelligente
  const fetchHeroProjects = useCallback(async (forceRefresh = false) => {
    // 1. Controlla cache se non è force refresh
    if (!forceRefresh) {
      const cachedData = getCachedHeroProjects();
      if (cachedData) {
        console.log('[useHeroProjects] Cache hit - using cached data');
        setHeroProjects(cachedData);
        return;
      }
    }

    console.log('[useHeroProjects] Cache miss - fetching from server');
    setLoading(true);
    setError(null);

    try {
      // ✅ Usa cache HTTP normale (no no-store!)
      const response = await fetch('/api/hero-projects');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch hero projects');
      }

      setHeroProjects(data || []);
      setCachedHeroProjects(data || []); // Salva in cache
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('[useHeroProjects] Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [getCachedHeroProjects, setCachedHeroProjects]);

  // Inizializza da cache al mount
  useEffect(() => {
    const cachedData = getCachedHeroProjects();
    if (cachedData) {
      console.log('[useHeroProjects] Initial cache load');
      setHeroProjects(cachedData);
    }
  }, [getCachedHeroProjects]);

  // ✅ Salva hero projects configuration
  const saveHeroProjects = useCallback(
    async (configs: HeroProjectConfig[]) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/hero-projects', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            heroProjects: configs,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to save hero projects');
        }

        // ✅ Aggiorna state locale con nuovi dati (no re-fetch!)
        setHeroProjects(data.data || []);
        
        // ✅ Invalida cache
        localStorage.removeItem(CACHE_KEY);
        
        console.log('[useHeroProjects] Hero projects saved - updated local state');
        
        return data;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
        console.error('[useHeroProjects] Save error:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Upload image to hero project
  const uploadImage = useCallback(async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/hero-projects/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload image');
      }

      return data.imageUrl;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('[useHeroProjects] Upload error:', err);
      throw new Error(errorMessage);
    }
  }, []);

  // Delete image from storage
  const deleteImage = useCallback(async (imageUrl: string): Promise<void> => {
    try {
      const response = await fetch('/api/hero-projects/upload', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete image');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('[useHeroProjects] Delete image error:', err);
      throw new Error(errorMessage);
    }
  }, []);

  // ✅ Clear all hero projects
  const clearHeroProjects = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/hero-projects', {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to clear hero projects');
      }

      // ✅ Aggiorna state locale (no re-fetch!)
      setHeroProjects([]);
      
      // ✅ Invalida cache
      localStorage.removeItem(CACHE_KEY);
      
      console.log('[useHeroProjects] Hero projects cleared - updated local state');
      
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('[useHeroProjects] Clear error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    heroProjects,
    loading,
    error,
    fetchHeroProjects,
    saveHeroProjects,
    uploadImage,
    deleteImage,
    clearHeroProjects,
    setError,
  };
};
