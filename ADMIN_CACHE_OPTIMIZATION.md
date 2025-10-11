# 🚀 ADMIN CACHE OPTIMIZATION

## 📋 Problema Risolto

**Prima:**
- ❌ Fetch automatico ad ogni apertura pannello admin
- ❌ Richieste duplicate (projects x2, bookings x2, ecc.)
- ❌ Nessuna cache locale
- ❌ Spreco di edge requests

**Dopo:**
- ✅ Cache localStorage con TTL 24 ore
- ✅ NO fetch automatico (solo se cache vuota/scaduta)
- ✅ Refresh manuale con bottone
- ✅ Auto-invalidation su modifiche
- ✅ -90% richieste API admin

---

## 🏗️ ARCHITETTURA

### 1. useAdminCache Hook

Hook base per cache localStorage con TTL 24h:

```typescript
const {
  data,              // Dati dalla cache o fetch
  loading,           // Stato caricamento
  error,             // Errori
  fetchData,         // Fetch se cache vuota
  refresh,           // Refresh manuale (force)
  invalidate,        // Invalida cache
  lastUpdate,        // Timestamp ultimo update
  isCached,          // true se cache valida esiste
} = useAdminCache('key', async () => {
  // Fetcher function
  return await fetchData();
}, []);
```

**Features:**
- ✅ TTL 24 ore
- ✅ localStorage persistent
- ✅ Auto-expiry se scaduta
- ✅ NO auto-fetch al mount
- ✅ Timestamp tracking

### 2. Wrapper Hooks Admin

Hook specializzati per ogni risorsa admin:

```typescript
// useAdminBookings
const {
  bookings,           // Cached bookings
  loading,
  error,
  deleteBookings,     // Auto-invalidate cache
  refresh,            // Manual refresh
  fetchData,          // Fetch if empty
  lastUpdate,         // Last update timestamp
  isCached,           // Has cached data
} = useAdminBookings();

// useAdminProjects (future)
const {
  projects,
  loading,
  createProject,      // Auto-invalidate
  updateProject,      // Auto-invalidate
  deleteProject,      // Auto-invalidate
  reorderProjects,    // Auto-invalidate
  refresh,
} = useAdminProjects();
```

### 3. RefreshButton Component

Bottone riutilizzabile con cache age indicator:

```typescript
<RefreshButton
  onRefresh={refresh}
  loading={loading}
  lastUpdate={lastUpdate}
/>

// Mostra:
// "Updated 5m ago [Refresh]"
// "Updated 2h 30m ago [Refresh]"
```

---

## 🔄 FLUSSO DI LAVORO

### Scenario 1: Prima Apertura Admin

```
1. User apre /admin/bookings
2. useAdminBookings() controlla localStorage
3. Cache NON esiste → fetchData() triggered
4. Fetch API → salva in cache → mostra dati
5. lastUpdate = timestamp now
```

### Scenario 2: Riapertura Admin (<24h)

```
1. User apre /admin/bookings
2. useAdminBookings() controlla localStorage
3. Cache ESISTE e valida (<24h)
4. Mostra dati da cache (NO API call! 🎉)
5. Button mostra "Updated 2h ago"
```

### Scenario 3: Cache Scaduta (>24h)

```
1. User apre /admin/bookings
2. useAdminCache() controlla localStorage
3. Cache SCADUTA (>24h)
4. Elimina cache automaticamente
5. fetchData() triggered → nuova API call
6. Salva nuova cache
```

### Scenario 4: Modifica Dati

```
1. User elimina booking
2. deleteBookings() chiamato
3. Dopo delete success:
   - invalidate() rimuove cache
   - refresh() fetcha nuovi dati
   - Salva nuova cache
4. UI aggiornata con dati fresh
```

### Scenario 5: Refresh Manuale

```
1. User clicca bottone "Refresh"
2. refresh() chiamato (force=true)
3. Fetch API → ignora cache esistente
4. Salva nuova cache → mostra dati fresh
5. lastUpdate aggiornato
```

---

## 📊 STATISTICHE RISPARMIO

### Admin Usage Pattern (esempio)

**Scenario tipico:**
- Aperture admin/giorno: 10
- Pannelli visitati/sessione: 3 (projects, highlights, bookings)

**Prima (senza cache):**
```
10 sessioni × 3 pannelli × 1 richiesta = 30 richieste/giorno
30 × 30 giorni = 900 richieste/mese
```

**Dopo (con cache 24h):**
```
Prima sessione: 3 richieste (cache miss)
Successive 9 sessioni: 0 richieste (cache hit)
Refresh manuali: ~3/giorno = 90/mese

Totale: 3 + 90 = ~93 richieste/mese

RISPARMIO: 900 - 93 = 807 richieste/mese (-90%)!
```

---

## 🔧 IMPLEMENTAZIONE

### Step 1: Aggiornare Componente Admin

**Prima:**
```typescript
import { useBookings } from '@/hooks/useBookings';

export default function BookingManager() {
  const { bookings, fetchBookings } = useBookings();
  
  useEffect(() => {
    fetchBookings(); // ❌ Fetch automatico ogni volta
  }, [fetchBookings]);
  
  return (
    <div>
      <button onClick={fetchBookings}>Refresh</button>
      {/* ... */}
    </div>
  );
}
```

**Dopo:**
```typescript
import { useAdminBookings } from '@/hooks/useAdminBookings';
import RefreshButton from '@/components/admin/RefreshButton';

export default function BookingManager() {
  const { 
    bookings, 
    refresh, 
    fetchData,
    lastUpdate,
    isCached,
  } = useAdminBookings();
  
  // ✅ Fetch solo se cache vuota
  useEffect(() => {
    if (!isCached) {
      fetchData();
    }
  }, [isCached, fetchData]);
  
  return (
    <div>
      <RefreshButton
        onRefresh={refresh}
        loading={loading}
        lastUpdate={lastUpdate}
      />
      {/* ... */}
    </div>
  );
}
```

### Step 2: Creare Hook Wrapper (se necessario)

```typescript
// src/hooks/useAdminBookings.ts
import { useAdminCache } from './useAdminCache';
import { useBookings, Booking } from './useBookings';

export function useAdminBookings() {
  const { deleteBookings } = useBookings();

  const {
    data: cachedBookings,
    loading,
    error,
    fetchData,
    refresh,
    invalidate,
    lastUpdate,
    isCached,
  } = useAdminCache<Booking[]>('bookings', async () => {
    const response = await fetch('/api/booking');
    if (!response.ok) throw new Error('Failed to fetch');
    return response.json();
  }, []);

  // Wrapper con auto-invalidation
  const deleteBookingsWithInvalidation = async (...args) => {
    const result = await deleteBookings(...args);
    invalidate();
    await fetchData(true); // Refresh dopo delete
    return result;
  };

  return {
    bookings: cachedBookings || [],
    loading,
    error,
    deleteBookings: deleteBookingsWithInvalidation,
    refresh,
    fetchData,
    lastUpdate,
    isCached,
  };
}
```

---

## 🧪 TESTING

### Test 1: Cache Hit

```bash
1. Apri admin/bookings
2. Console log: "🔄 Admin Cache: Fetching bookings (cache miss)"
3. Chiudi tab
4. Riapri admin/bookings (<24h)
5. Console log: "✅ Admin Cache: Loaded bookings from cache (age: 5min)"
6. ✅ Nessuna richiesta API nel network tab
```

### Test 2: Refresh Manuale

```bash
1. Apri admin/bookings (cache caricata)
2. Clicca bottone "Refresh"
3. Console log: "🔄 Admin Cache: Fetching bookings (manual refresh)"
4. ✅ Vedi nuova richiesta API
5. Timestamp aggiornato: "Updated 0m ago"
```

### Test 3: Auto-Invalidation

```bash
1. Apri admin/bookings
2. Seleziona e elimina un booking
3. Console log: "🗑️ Admin Cache: Invalidating bookings"
4. Console log: "🔄 Admin Cache: Fetching bookings (manual refresh)"
5. ✅ Lista aggiornata automaticamente
```

### Test 4: Cache Expiry

```bash
1. Imposta cache TTL a 10 secondi (test)
2. Apri admin/bookings (cache salvata)
3. Aspetta 11 secondi
4. Ricarica pagina
5. Console log: "⚠️ Admin Cache: No cache for bookings, waiting for manual refresh"
6. ✅ Cache auto-eliminata perché scaduta
```

---

## 🎯 TODO

### ✅ Completato
- [x] Hook `useAdminCache` base
- [x] Hook `useAdminBookings` wrapper
- [x] Componente `RefreshButton`
- [x] Update `BookingManager` component

### ⏳ Da Fare
- [ ] Hook `useAdminProjects` wrapper
- [ ] Update admin `page.tsx` per projects
- [ ] Hook `useAdminHeroProjects` wrapper (future)
- [ ] Hook `useAdminServiceCategories` wrapper (future)
- [ ] Update `ServiceImageManager` component (future)

---

## 🔐 SICUREZZA

### localStorage vs sessionStorage

**Scelta: localStorage**

✅ Vantaggi:
- Persiste tra chiusure tab
- Riduce richieste API anche dopo restart browser
- Cache 24h efficace

❌ Svantaggi:
- Dati leggibili da JS (ma sono public data comunque)
- Max 5-10MB storage

### Mitigazioni:
- ✅ Dati NON sensibili (bookings, projects sono public/admin-only)
- ✅ Expire automatico dopo 24h
- ✅ Auto-clear su modifiche
- ✅ Prefix `admin_cache_` per evitare conflitti

---

## 📈 METRICHE

### Console Logs

Il sistema logga automaticamente:

```
✅ Admin Cache: Loaded bookings from cache (age: 15min)
🔄 Admin Cache: Fetching bookings (cache miss)
🔄 Admin Cache: Fetching bookings (manual refresh)
🗑️ Admin Cache: Invalidating bookings
🗑️ Admin Cache: Cleared all admin caches
```

### Monitoraggio

```typescript
// Check cache status
import { getCacheAge } from '@/hooks/useAdminCache';

const cacheTimestamp = localStorage.getItem('admin_cache_bookings');
console.log('Cache age:', getCacheAge(timestamp));

// Clear all admin caches (debug)
import { clearAdminCache } from '@/hooks/useAdminCache';
clearAdminCache();
```

---

## 🎉 RISULTATO

**Admin Dashboard Ottimizzato:**
- ✅ -90% richieste API
- ✅ Caricamento istantaneo (cache)
- ✅ Controllo manuale refresh
- ✅ Auto-update su modifiche
- ✅ UX migliore (no spinner ad ogni nav)

**Per l'utente:**
- ⚡ Admin più veloce e reattivo
- 🎯 Controllo esplicito su quando aggiornare
- 📊 Visibilità età dati ("Updated 5m ago")
- 💾 Dati persistenti tra sessioni

**Per il progetto:**
- 💰 Meno edge requests = più margine free tier
- 🚀 Scalabilità migliore
- 🔧 Facile estendere ad altre risorse
- 📦 Pattern riutilizzabile

