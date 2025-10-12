/**
 * Hook for batch project updates
 * Gestisce modifiche locali multiple e le salva tutte insieme
 */

import { useState, useCallback } from 'react';
import { Project } from './useProjects';
import { apiCache, cacheKeys } from '@/lib/apiCache';

interface ProjectUpdate {
  id: string;
  title?: string;
  title_en?: string;
  description?: string;
  description_en?: string;
  categories?: string[];
  link?: string | null;
  image_url?: string;
  order_position?: number;
}

interface BatchState {
  modifiedProjects: Map<string, Partial<Project>>;
  deletedIds: Set<string>;
  reorderedProjects: Project[];
  hasChanges: boolean;
}

export function useProjectsBatch() {
  const [batchState, setBatchState] = useState<BatchState>({
    modifiedProjects: new Map(),
    deletedIds: new Set(),
    reorderedProjects: [],
    hasChanges: false,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Segna un progetto come modificato
  const markAsModified = useCallback((projectId: string, changes: Partial<Project>) => {
    setBatchState((prev) => {
      const newModified = new Map(prev.modifiedProjects);

      // Merge con modifiche esistenti
      const existing = newModified.get(projectId) || {};
      newModified.set(projectId, { ...existing, ...changes });

      return {
        ...prev,
        modifiedProjects: newModified,
        hasChanges: true,
      };
    });
  }, []);

  // Segna un progetto per eliminazione
  const markAsDeleted = useCallback((projectId: string) => {
    setBatchState((prev) => {
      const newDeleted = new Set(prev.deletedIds);
      newDeleted.add(projectId);

      // Rimuovi anche dalle modifiche se presente
      const newModified = new Map(prev.modifiedProjects);
      newModified.delete(projectId);

      return {
        ...prev,
        modifiedProjects: newModified,
        deletedIds: newDeleted,
        hasChanges: true,
      };
    });
  }, []);

  // Salva l'ordine riorganizzato
  const markAsReordered = useCallback((reorderedProjects: Project[]) => {
    setBatchState((prev) => ({
      ...prev,
      reorderedProjects,
      hasChanges: true,
    }));
  }, []);

  // Reset stato
  const resetBatch = useCallback(() => {
    setBatchState({
      modifiedProjects: new Map(),
      deletedIds: new Set(),
      reorderedProjects: [],
      hasChanges: false,
    });
    setError(null);
  }, []);

  // Salva tutte le modifiche in un'unica chiamata
  const saveAllChanges = useCallback(async () => {
    if (!batchState.hasChanges) {
      console.log('No changes to save');
      return { success: true, message: 'No changes to save' };
    }

    setSaving(true);
    setError(null);

    try {
      // Prepara payload
      const updates: ProjectUpdate[] = Array.from(batchState.modifiedProjects.entries()).map(
        ([id, changes]) => ({
          id,
          ...changes,
        })
      );

      const deletes = Array.from(batchState.deletedIds);

      const reorder = batchState.reorderedProjects.map((project, index) => ({
        id: project.id,
        order_position: index,
      }));

      console.log('🚀 Batch Save:', {
        updates: updates.length,
        deletes: deletes.length,
        reorder: reorder.length,
      });

      // Chiamata batch API
      const response = await fetch('/api/projects/batch-update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
        body: JSON.stringify({
          updates,
          deletes,
          reorder,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Batch update failed');
      }

      const result = await response.json();

      console.log('✅ Batch Save Result:', result);

      // Invalida cache
      apiCache.invalidate(cacheKeys.projects());
      apiCache.invalidate(cacheKeys.homeData());
      apiCache.invalidate(cacheKeys.portfolioData());

      // Reset stato
      resetBatch();

      return {
        success: true,
        message: result.message,
        results: result.results,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Batch save error:', err);

      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setSaving(false);
    }
  }, [batchState, resetBatch]);

  // Conta modifiche pendenti
  const pendingChangesCount =
    batchState.modifiedProjects.size +
    batchState.deletedIds.size +
    (batchState.reorderedProjects.length > 0 ? 1 : 0);

  return {
    // State
    hasChanges: batchState.hasChanges,
    pendingChangesCount,
    saving,
    error,
    batchState, // Esposto per accesso diretto

    // Actions
    markAsModified,
    markAsDeleted,
    markAsReordered,
    saveAllChanges,
    resetBatch,
  };
}
