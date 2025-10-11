import { useState, useCallback } from 'react';

interface ServiceUpdate {
  id: string;
  title?: string;
  title_en?: string;
  description?: string;
  description_en?: string;
  images?: string[];
  slug?: string;
}

interface BatchState {
  servicesUpdates: ServiceUpdate[];
}

export function useServicesBatch() {
  const [batchState, setBatchState] = useState<BatchState>({
    servicesUpdates: []
  });

  const [batchSaving, setBatchSaving] = useState(false);

  // Conta le modifiche totali
  const pendingChangesCount = batchState.servicesUpdates.length;
  const hasBatchChanges = pendingChangesCount > 0;


  // Aggiungi modifica service
  const markServiceAsModified = useCallback((update: ServiceUpdate) => {
    setBatchState(prev => {
      const existingIndex = prev.servicesUpdates.findIndex(u => u.id === update.id);
      
      if (existingIndex >= 0) {
        // Aggiorna modifica esistente
        const updated = [...prev.servicesUpdates];
        updated[existingIndex] = { ...updated[existingIndex], ...update };
        return {
          ...prev,
          servicesUpdates: updated
        };
      } else {
        // Aggiungi nuova modifica
        return {
          ...prev,
          servicesUpdates: [...prev.servicesUpdates, update]
        };
      }
    });
  }, []);

  // Salva tutte le modifiche
  const saveAllChanges = useCallback(async () => {
    if (!hasBatchChanges) {
      console.log('No services changes to save');
      return { success: true };
    }

    setBatchSaving(true);
    
    try {
      console.log('🔄 Saving services batch changes:', {
        services: batchState.servicesUpdates.length
      });

      const response = await fetch('/api/services/save-all', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
        body: JSON.stringify({
          servicesUpdates: batchState.servicesUpdates
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save changes');
      }

      const result = await response.json();
      console.log('✅ Services batch save successful:', result);

      // Reset batch state dopo successo
      setBatchState({
        servicesUpdates: []
      });

      return { success: true, result };
    } catch (error) {
      console.error('❌ Services batch save failed:', error);
      throw error;
    } finally {
      setBatchSaving(false);
    }
  }, [batchState, hasBatchChanges]);

  // Reset batch state
  const resetBatch = useCallback(() => {
    setBatchState({
      servicesUpdates: []
    });
  }, []);

  return {
    // State
    batchState,
    batchSaving,
    hasBatchChanges,
    pendingChangesCount,
    
    // Actions
    markServiceAsModified,
    saveAllChanges,
    resetBatch,
  };
}

