import { useState, useCallback, useEffect } from 'react';

export interface Project {
  id: string;
  title: string;
  title_en?: string; // Titolo in inglese
  categories: string[]; // Solo il nuovo formato
  description: string;
  description_en?: string; // Descrizione in inglese
  image_url: string;
  link: string | null;
  order_position: number;
  created_at: string;
  updated_at: string;
}

export interface CreateProjectData {
  title: string;
  title_en?: string;
  categories: string[];
  description: string;
  description_en?: string;
  link?: string;
  file: File;
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cache client-side per progetti (24h TTL)
  const getCachedProjects = useCallback((): Project[] | null => {
    try {
      const cached = localStorage.getItem('projects_cache');
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached);
      const now = Date.now();
      const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24h

      // Controlla se la cache è scaduta
      if (now - timestamp > CACHE_DURATION) {
        localStorage.removeItem('projects_cache');
        return null;
      }

      return data;
    } catch (error) {
      console.warn('Error reading projects cache:', error);
      localStorage.removeItem('projects_cache');
      return null;
    }
  }, []);

  const setCachedProjects = useCallback((data: Project[]) => {
    try {
      localStorage.setItem('projects_cache', JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.warn('Error setting projects cache:', error);
    }
  }, []);

  // Controlla cache all'inizializzazione
  useEffect(() => {
    const cachedData = getCachedProjects();
    if (cachedData) {
      setProjects(cachedData);
    }
  }, [getCachedProjects]);

  // Fetch tutti i progetti (ordinati per order_position) - ora usa cache
  const fetchProjects = useCallback(async (forceRefresh = false) => {
    // Controlla cache se non è un refresh forzato
    if (!forceRefresh) {
      const cachedData = getCachedProjects();
      if (cachedData) {
        setProjects(cachedData);
        return;
      }
    }
    
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/projects');
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      const data = await response.json();
      setProjects(data);
      setCachedProjects(data); // Salva in cache
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [getCachedProjects, setCachedProjects]);

  // Riordina progetti (drag & drop)
  const reorderProjects = useCallback(
    async (reorderedProjects: Project[]) => {
      setLoading(true);
      setError(null);
      try {
        // Aggiorna lo stato locale immediatamente per UI responsiva
        setProjects(reorderedProjects);

        // Invia nuovo ordine al server
        const response = await fetch('/api/projects/reorder', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            projectIds: reorderedProjects.map((p) => p.id),
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to reorder projects');
        }

        // Invalida cache e ricarica
        localStorage.removeItem('projects_cache');
        await fetchProjects(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        // Ricarica i progetti in caso di errore
        localStorage.removeItem('projects_cache');
        await fetchProjects(true);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchProjects]
  );

  // Crea nuovo progetto
  const createProject = useCallback(async (projectData: CreateProjectData) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('title', projectData.title);
      if (projectData.title_en) {
        formData.append('title_en', projectData.title_en);
      }
      formData.append('categories', JSON.stringify(projectData.categories)); // Invia come JSON array
      formData.append('description', projectData.description);
      if (projectData.description_en) {
        formData.append('description_en', projectData.description_en);
      }
      formData.append('file', projectData.file);
      if (projectData.link) {
        formData.append('link', projectData.link);
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
      
      // Invalida cache e ricarica tutti i progetti
      localStorage.removeItem('projects_cache');
      await fetchProjects(true); // Force refresh per vedere i nuovi dati
      
      return newProject;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchProjects]);

  // Elimina progetto
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

      // Invalida cache e ricarica tutti i progetti
      localStorage.removeItem('projects_cache');
      await fetchProjects(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchProjects]);

  // Aggiorna progetto
  const updateProject = useCallback(
    async (
      projectId: string,
      updates: Partial<
        Pick<
          Project,
          | 'title'
          | 'title_en'
          | 'categories'
          | 'description'
          | 'description_en'
          | 'link'
          | 'image_url'
        >
      >
    ) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/projects/${projectId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updates),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to update project');
        }

        const updatedProject = await response.json();
        
        // Invalida cache e ricarica tutti i progetti
        localStorage.removeItem('projects_cache');
        await fetchProjects(true);
        
        return updatedProject;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    },
    [fetchProjects]
  );

  return {
    projects,
    loading,
    error,
    fetchProjects,
    createProject,
    deleteProject,
    updateProject,
    setError,
    reorderProjects,
  };
}
