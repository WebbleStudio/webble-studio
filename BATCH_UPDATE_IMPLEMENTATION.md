# Batch Update Implementation Guide

## 📋 Obiettivo

Modificare la gestione progetti per avere una **singola chiamata API batch** che raccoglie tutte le modifiche e le invia insieme, invece di una chiamata per ogni singola modifica.

## ✅ Completato

- [x] Endpoint API `/api/projects/batch-update` creato
- [x] Hook `useProjectsBatch` creato
- [x] Componente `SaveAllButton` creato
- [x] Export hook in `src/hooks/index.ts`

## 🔧 Da Implementare

### 1. Modificare `src/app/(auth)/admin/page.tsx`

#### A. Import

```typescript
// Aggiungi dopo le altre importazioni (riga ~15)
import { useProjectsBatch } from '@/hooks/useProjectsBatch';
import SaveAllButton from '@/components/admin/SaveAllButton';
```

#### B. Hook Initialization

```typescript
// Aggiungi dopo useProjects (riga ~147)
const {
  hasChanges: hasBatchChanges,
  pendingChangesCount,
  saving: batchSaving,
  markAsModified,
  markAsDeleted,
  markAsReordered,
  saveAllChanges,
  resetBatch,
} = useProjectsBatch();
```

#### C. Modificare `handleInternalSubmit` (riga ~1040)

```typescript
// PRIMA (chiamata immediata)
await updateProject(editingProject.id, updates);
closeEditModal();

// DOPO (batch)
markAsModified(editingProject.id, updates);
closeEditModal();

// Aggiorna anche lo stato locale per preview
setLocalProjectsState((prev) => ({
  ...prev,
  projects: prev.projects.map((p) => (p.id === editingProject.id ? { ...p, ...updates } : p)),
  hasChanges: true,
}));
```

#### D. Modificare `removeProject` (riga ~408)

```typescript
// PRIMA (chiamata immediata a deleteProject)
const currentProjects = localProjectsState.hasChanges ? localProjectsState.projects : projects;
const filteredProjects = currentProjects.filter((p) => p.id !== id);

setLocalProjectsState((prev) => ({
  ...prev,
  projects: filteredProjects,
  deletedProjects: [...prev.deletedProjects, id],
  hasChanges: true,
}));

// DOPO (batch)
markAsDeleted(id);

// Mantieni aggiornamento locale per preview
const currentProjects = localProjectsState.hasChanges ? localProjectsState.projects : projects;
const filteredProjects = currentProjects.filter((p) => p.id !== id);

setLocalProjectsState((prev) => ({
  ...prev,
  projects: filteredProjects,
  deletedProjects: [...prev.deletedProjects, id],
  hasChanges: true,
}));
```

#### E. Modificare `handleDragEnd` (riga ~266)

```typescript
// DOPO il reorder locale, aggiungi:
markAsReordered(reorderedItems);
```

#### F. Aggiungere `SaveAllButton` nel render (riga ~1332)

```typescript
// Aggiungi prima del closing </ProtectedRoute>
{/* Save All Changes Button - Fixed Bottom */}
<SaveAllButton
  hasChanges={hasBatchChanges}
  pendingChangesCount={pendingChangesCount}
  saving={batchSaving}
  onSave={async () => {
    const result = await saveAllChanges();
    if (result.success) {
      // Refresh projects dopo save
      await fetchProjects();
      // Reset stato locale
      setLocalProjectsState({
        projects: [],
        deletedProjects: [],
        hasChanges: false,
      });
      alert('✅ Tutte le modifiche sono state salvate!');
    } else {
      alert(`❌ Errore: ${result.message}`);
    }
  }}
  onDiscard={() => {
    if (confirm('Annullare tutte le modifiche non salvate?')) {
      resetBatch();
      setLocalProjectsState({
        projects: [],
        deletedProjects: [],
        hasChanges: false,
      });
      fetchProjects(); // Ricarica dati originali
    }
  }}
/>
```

## 🚀 Come Funziona

### Flow Before (Attuale)

```
1. User modifica progetto
2. Click "Save" nel modal
3. ↓ API call immediata
4. DB updated
5. Modal chiuso
```

### Flow After (Batch)

```
1. User modifica progetto A
2. Click "Save" nel modal → salvato LOCALMENTE
3. Modal chiuso
4. User modifica progetto B
5. Click "Save" nel modal → salvato LOCALMENTE
6. User elimina progetto C → salvato LOCALMENTE
7. User riordina progetti → salvato LOCALMENTE
8. ↓ Click "Save All Changes" (bottom button)
9. ↓ UNA SOLA chiamata API batch
10. DB updated con tutte le modifiche insieme
11. Refresh & reset stato
```

## 🎯 Vantaggi

✅ **Meno API calls**: 10 modifiche = 1 chiamata invece di 10  
✅ **Più veloce**: No loading tra ogni modifica  
✅ **Transazionale**: Tutte le modifiche o nessuna  
✅ **Undo facile**: Pulsante "Annulla" scarta tutte le modifiche  
✅ **UI/UX migliore**: Indicatore modifiche pendenti

## 📝 Testing

1. Modifica 3 progetti diversi → pending changes = 3
2. Click "Save All" → 1 sola richiesta API
3. Verifica DB: tutti e 3 progetti aggiornati
4. Verifica portfolio: modifiche visibili

## 🐛 Rollback in caso di errore

L'endpoint `/api/projects/batch-update` ritorna:

- `status: 200` → Tutto ok
- `status: 207` (Multi-Status) → Alcuni errori, check `results.errors[]`
- `status: 500` → Errore totale

In caso di errore parziale, l'utente può:

1. Vedere quali modifiche sono fallite
2. Correggere e ritentare solo quelle
3. O annullare tutto e ricominciare

## 📊 API Debugger

Con il debugger attivo vedrai:

```
🔄 Batch Update Request: { updates: 3, deletes: 1, reorder: 1 }
✅ Batch Update Results: { updated: 3, deleted: 1, reordered: 11, errors: [] }
```

Invece di:

```
🌐 POST /api/projects/[id] (x3)
🌐 DELETE /api/projects/[id] (x1)
🌐 POST /api/projects/reorder (x1)
```

## 🎨 UI/UX

Il `SaveAllButton` appare in basso al centro quando ci sono modifiche pendenti:

```
┌─────────────────────────────────────────┐
│  🔴 3 modifiche in sospeso              │
│  [Annulla] [💾 Salva Tutto]             │
└─────────────────────────────────────────┘
```

Con animazione slide-up smooth e pulsating indicator.
