import { useState, useCallback } from 'react';

interface HighlightUpdate {
  id: string;
  project_id?: string;
  descriptions?: string[];
  images?: string[];
  background_image?: string;
  project_date?: string;
}

interface BatchState {
  highlightsUpdates: HighlightUpdate[];
}

export function useHighlightsBatch() {
  const [batchState, setBatchState] = useState<BatchState>({
    highlightsUpdates: [],
  });

  const [batchSaving, setBatchSaving] = useState(false);

  // Conta le modifiche totali
  const pendingChangesCount = batchState.highlightsUpdates.length;
  const hasBatchChanges = pendingChangesCount > 0;

  // Aggiungi modifica highlight
  const markHighlightAsModified = useCallback((update: HighlightUpdate) => {
    setBatchState((prev) => {
      const existingIndex = prev.highlightsUpdates.findIndex((u) => u.id === update.id);

      if (existingIndex >= 0) {
        // Aggiorna modifica esistente
        const updated = [...prev.highlightsUpdates];
        updated[existingIndex] = { ...updated[existingIndex], ...update };
        return {
          ...prev,
          highlightsUpdates: updated,
        };
      } else {
        // Aggiungi nuova modifica
        return {
          ...prev,
          highlightsUpdates: [...prev.highlightsUpdates, update],
        };
      }
    });
  }, []);

  // Salva tutte le modifiche
  const saveAllChanges = useCallback(async () => {
    if (!hasBatchChanges) {
      console.log('No highlights changes to save');
      return { success: true };
    }

    setBatchSaving(true);

    try {
      console.log('🔄 Saving highlights batch changes:', {
        highlights: batchState.highlightsUpdates.length,
      });

      const response = await fetch('/api/highlights/save-all', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
        body: JSON.stringify({
          highlightsUpdates: batchState.highlightsUpdates,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save changes');
      }

      const result = await response.json();
      console.log('✅ Highlights batch save successful:', result);

      // Reset batch state dopo successo
      setBatchState({
        highlightsUpdates: [],
      });

      return { success: true, result };
    } catch (error) {
      console.error('❌ Highlights batch save failed:', error);
      throw error;
    } finally {
      setBatchSaving(false);
    }
  }, [batchState, hasBatchChanges]);

  // Reset batch state
  const resetBatch = useCallback(() => {
    setBatchState({
      highlightsUpdates: [],
    });
  }, []);

  return {
    // State
    batchState,
    batchSaving,
    hasBatchChanges,
    pendingChangesCount,

    // Actions
    markHighlightAsModified,
    saveAllChanges,
    resetBatch,
  };
}
