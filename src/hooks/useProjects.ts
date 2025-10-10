import { useState, useCallback, useEffect } from 'react';

export interface Project {
  id: string;
  title: string;
  title_en?: string;
  description?: string;
  description_en?: string;
  image_url: string;
  categories: string[];
  order_position: number;
  project_url?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateProjectData {
  title: string;
  title_en?: string;
  description?: string;
  description_en?: string;
  image: File | string;
  categories: string[];
  project_url?: string;
}

const ADMIN_CACHE_TTL = 5 * 60 * 1000; // 5 minuti per admin dashboard
const CACHE_KEY = 'admin_projects_cache';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Cache localStorage per admin (5min TTL)
  const getCachedProjects = useCallback((): Project[] | null => {
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
      console.warn('[useProjects] Error reading cache:', error);
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
  }, []);

  const setCachedProjects = useCallback((data: Project[]) => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.warn('[useProjects] Error setting cache:', error);
    }
  }, []);

  // ✅ Fetch progetti con cache intelligente
  const fetchProjects = useCallback(async (forceRefresh = false) => {
    // 1. Controlla cache se non è force refresh
    if (!forceRefresh) {
      const cachedData = getCachedProjects();
      if (cachedData) {
        console.log('[useProjects] Cache hit - using cached data');
        setProjects(cachedData);
        return;
      }
    }

    console.log('[useProjects] Cache miss - fetching from server');
    setLoading(true);
    setError(null);

    try {
      // ✅ Usa cache HTTP normale (no no-store!)
      const response = await fetch('/api/projects');
      
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }

      const data = await response.json();
      setProjects(data);
      setCachedProjects(data); // Salva in cache
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('[useProjects] Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [getCachedProjects, setCachedProjects]);

  // Inizializza da cache al mount, poi fetch
  useEffect(() => {
    const cachedData = getCachedProjects();
    if (cachedData) {
      console.log('[useProjects] Initial cache load');
      setProjects(cachedData);
    }
    // Fetch sempre per avere dati aggiornati
    fetchProjects();
  }, [getCachedProjects, fetchProjects]);

  // ✅ Riordina progetti (drag & drop)
  const reorderProjects = useCallback(
    async (reorderedProjects: Project[]) => {
      setLoading(true);
      setError(null);

      try {
        const updates = reorderedProjects.map((project, index) => ({
          id: project.id,
          order_position: index,
        }));

        const response = await fetch('/api/projects/reorder', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ projects: updates }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to reorder projects');
        }

        // ✅ Aggiorna state locale (no re-fetch!)
        setProjects(reorderedProjects);
        setCachedProjects(reorderedProjects);
        
        console.log('[useProjects] Reorder successful - updated local state');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        // Ricarica in caso di errore
        await fetchProjects(true);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchProjects, setCachedProjects]
  );

  // ✅ Crea nuovo progetto
  const createProject = useCallback(async (projectData: CreateProjectData) => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('title', projectData.title);
      if (projectData.title_en) formData.append('title_en', projectData.title_en);
      if (projectData.description) formData.append('description', projectData.description);
      if (projectData.description_en) formData.append('description_en', projectData.description_en);
      if (projectData.project_url) formData.append('project_url', projectData.project_url);
      formData.append('categories', JSON.stringify(projectData.categories));

      if (typeof projectData.image === 'string') {
        formData.append('image', projectData.image);
      } else {
        formData.append('image', projectData.image);
      }

      const response = await fetch('/api/projects', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create project');
      }

      const newProject = await response.json();
      
      // ✅ Aggiorna state locale con nuovo progetto (no re-fetch!)
      setProjects(prev => [...prev, newProject]);
      
      // ✅ Invalida cache per prossimo mount
      localStorage.removeItem(CACHE_KEY);
      
      console.log('[useProjects] Project created - updated local state');
      
      return newProject;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Elimina progetto
  const deleteProject = useCallback(async (projectId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete project');
      }

      // ✅ Aggiorna state locale rimuovendo progetto (no re-fetch!)
      setProjects(prev => prev.filter(p => p.id !== projectId));
      
      // ✅ Invalida cache
      localStorage.removeItem(CACHE_KEY);
      
      console.log('[useProjects] Project deleted - updated local state');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Aggiorna progetto
  const updateProject = useCallback(
    async (projectId: string, updates: Partial<CreateProjectData>) => {
      setLoading(true);
      setError(null);

      try {
        const formData = new FormData();

        if (updates.title) formData.append('title', updates.title);
        if (updates.title_en) formData.append('title_en', updates.title_en);
        if (updates.description) formData.append('description', updates.description);
        if (updates.description_en) formData.append('description_en', updates.description_en);
        if (updates.project_url) formData.append('project_url', updates.project_url);
        if (updates.categories) formData.append('categories', JSON.stringify(updates.categories));

        if (updates.image) {
          if (typeof updates.image === 'string') {
            formData.append('image', updates.image);
          } else {
            formData.append('image', updates.image);
          }
        }

        const response = await fetch(`/api/projects/${projectId}`, {
          method: 'PUT',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to update project');
        }

        const updatedProject = await response.json();
        
        // ✅ Aggiorna state locale sostituendo progetto (no re-fetch!)
        setProjects(prev => prev.map(p => p.id === projectId ? updatedProject : p));
        
        // ✅ Invalida cache
        localStorage.removeItem(CACHE_KEY);
        
        console.log('[useProjects] Project updated - updated local state');
        
        return updatedProject;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    projects,
    loading,
    error,
    fetchProjects,
    createProject,
    deleteProject,
    updateProject,
    reorderProjects,
    setError,
  };
}
