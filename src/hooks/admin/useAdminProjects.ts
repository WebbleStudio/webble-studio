/**
 * Admin Projects Hook
 * Wrapper di useProjects con cache 24h per admin
 */

import { useAdminCache } from './useAdminCache';
import { useProjects, Project } from '../data/useProjects';

export function useAdminProjects() {
  const {
    projects: liveProjects,
    loading: liveLoading,
    error: liveError,
    createProject,
    deleteProject,
    updateProject,
    reorderProjects,
    setError,
  } = useProjects();

  // Cache 24h per admin
  const {
    data: cachedProjects,
    loading: cacheLoading,
    error: cacheError,
    fetchData,
    refresh,
    invalidate,
    lastUpdate,
    isCached,
  } = useAdminCache<Project[]>('projects', async () => {
    const response = await fetch('/api/projects', {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache' },
    });
    if (!response.ok) throw new Error('Failed to fetch projects');
    return response.json();
  });

  // Wrapper per createProject che invalida cache
  const createProjectWithInvalidation = async (...args: Parameters<typeof createProject>) => {
    const result = await createProject(...args);
    invalidate();
    await fetchData(true); // Refresh dopo creazione
    return result;
  };

  // Wrapper per deleteProject che invalida cache
  const deleteProjectWithInvalidation = async (...args: Parameters<typeof deleteProject>) => {
    await deleteProject(...args);
    invalidate();
    await fetchData(true); // Refresh dopo eliminazione
  };

  // Wrapper per updateProject che invalida cache
  const updateProjectWithInvalidation = async (...args: Parameters<typeof updateProject>) => {
    const result = await updateProject(...args);
    invalidate();
    await fetchData(true); // Refresh dopo update
    return result;
  };

  // Wrapper per reorderProjects che invalida cache
  const reorderProjectsWithInvalidation = async (...args: Parameters<typeof reorderProjects>) => {
    await reorderProjects(...args);
    invalidate();
    await fetchData(true); // Refresh dopo reorder
  };

  return {
    projects: cachedProjects || [],
    loading: cacheLoading || liveLoading,
    error: cacheError || liveError,
    createProject: createProjectWithInvalidation,
    deleteProject: deleteProjectWithInvalidation,
    updateProject: updateProjectWithInvalidation,
    reorderProjects: reorderProjectsWithInvalidation,
    setError,
    // Admin-specific
    refresh,
    fetchData,
    lastUpdate,
    isCached,
  };
}
