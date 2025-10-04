import { useState, useCallback } from 'react';

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

  // Fetch hero projects
  const fetchHeroProjects = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/hero-projects');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch hero projects');
      }

      setHeroProjects(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error fetching hero projects:', err);
    } finally {
      setLoading(false);
    }
  }, []);

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

        // Aggiorna i dati locali
        await fetchHeroProjects();

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
