import { useState, useCallback, useEffect } from 'react';

export interface HeroProject {
  id: string;
  project_id: string;
  position: number;
  descriptions: string[];
  images: string[];
  background_image: string;
  project_date?: string;
  created_at: string;
  updated_at: string;
  projects?: {
    id: string;
    title: string;
    title_en?: string;
    categories: string[];
    description: string;
    description_en?: string;
    image_url: string;
    link: string;
  };
}

export interface HeroProjectConfig {
  projectId: string;
  descriptions: string[];
  images: string[];
  backgroundImage: string;
  projectDate?: string;
}

export const useHeroProjects = () => {
  const [heroProjects, setHeroProjects] = useState<HeroProject[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cache client-side per hero projects (24h TTL)
  const getCachedHeroProjects = useCallback((): HeroProject[] | null => {
    try {
      const cached = localStorage.getItem('hero_projects_cache');
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached);
      const now = Date.now();
      const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24h

      // Controlla se la cache è scaduta
      if (now - timestamp > CACHE_DURATION) {
        localStorage.removeItem('hero_projects_cache');
        return null;
      }

      return data;
    } catch (error) {
      console.warn('Error reading hero projects cache:', error);
      localStorage.removeItem('hero_projects_cache');
      return null;
    }
  }, []);

  const setCachedHeroProjects = useCallback((data: HeroProject[]) => {
    try {
      localStorage.setItem('hero_projects_cache', JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.warn('Error setting hero projects cache:', error);
    }
  }, []);

  // Controlla cache all'inizializzazione
  useEffect(() => {
    const cachedData = getCachedHeroProjects();
    if (cachedData) {
      setHeroProjects(cachedData);
    }
  }, [getCachedHeroProjects]);

  // Fetch hero projects - ora usa cache
  const fetchHeroProjects = useCallback(async (forceRefresh = false) => {
    // Controlla cache se non è un refresh forzato
    if (!forceRefresh) {
      const cachedData = getCachedHeroProjects();
      if (cachedData) {
        setHeroProjects(cachedData);
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
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
      console.error('Error fetching hero projects:', err);
    } finally {
      setLoading(false);
    }
  }, [getCachedHeroProjects, setCachedHeroProjects]);

  // Save hero projects configuration
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
          body: JSON.stringify({ heroProjects: configs }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to save hero projects');
        }

        // Aggiorna i dati locali e invalida cache
        await fetchHeroProjects(true); // Force refresh per invalidare cache

        return data;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
        console.error('Error saving hero projects:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchHeroProjects]
  );

  // Upload image for hero projects
  const uploadImage = useCallback(async (file: File, type: 'background' | 'navigation') => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const response = await fetch('/api/hero-projects/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload image');
      }

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error uploading image:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete image from storage
  const deleteImage = useCallback(async (filePath: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/hero-projects/upload?filePath=${encodeURIComponent(filePath)}`,
        {
          method: 'DELETE',
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete image');
      }

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error deleting image:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Clear all hero projects
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

      setHeroProjects([]);
      // Invalida cache quando si cancellano tutti i hero projects
      localStorage.removeItem('hero_projects_cache');
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error clearing hero projects:', err);
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
