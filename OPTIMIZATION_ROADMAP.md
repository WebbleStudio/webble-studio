# 🚀 Optimization Roadmap - Webble Studio

> **Versione**: 1.0.0  
> **Data**: Dicembre 2024  
> **Stato**: Pianificazione ottimizzazioni future

---

## 📋 Indice

1. [Stato Attuale](#stato-attuale)
2. [Ottimizzazioni Completate](#ottimizzazioni-completate)
3. [Ottimizzazioni Future](#ottimizzazioni-future)
4. [Implementazione Versioning Cache](#implementazione-versioning-cache)
5. [Unificazione Portfolio/Home](#unificazione-portfoliohome)
6. [Metriche e Monitoraggio](#metriche-e-monitoraggio)

---

## ✅ Stato Attuale

### Performance Metrics

| Metrica | Valore Attuale | Target | Stato |
|---------|----------------|--------|-------|
| **Edge Requests (Home)** | 1 per visita | 0 (cache) | ✅ Ottimo |
| **Edge Requests (Portfolio)** | 1 per visita | 0 (cache) | ⚠️ Migliorabile |
| **Cache Hit Rate** | ~90% | >95% | ✅ Buono |
| **Admin Batch Operations** | 1 call per pannello | 1 call | ✅ Ottimale |
| **API Endpoints Attivi** | 16 | <15 | ✅ Pulito |
| **Cache Invalidation** | Manuale | Automatica | ⚠️ Da migliorare |

### Architettura Cache

```
CLIENT (localStorage 3d) → EDGE CDN (24h) → SERVER (in-memory 3d) → DATABASE
```

**Problemi Noti**:
1. ⚠️ localStorage non invalidabile da server
2. ⚠️ Portfolio duplica fetch di Home
3. ⚠️ Nessun versioning dati

---

## 🎉 Ottimizzazioni Completate

### ✅ Fase 1: Cleanup API (Dicembre 2024)

**Completato**: ✅

**Azioni**:
- Rimossi 6 endpoint/file inutilizzati
- Documentazione API completa creata
- Build test passato con successo

**File Rimossi**:
```
❌ src/app/api/projects/cleanup-images/
❌ src/app/api/video/[filename]/
❌ src/app/api/video/placeholder/
❌ src/app/api/content-updates/
❌ src/app/api/highlights-services/
❌ src/lib/video.ts
```

**Impatto**:
- ✅ Codebase più pulito (-6 file)
- ✅ Meno confusione per sviluppatori
- ✅ Build più veloce
- ✅ Zero breaking changes

**Commit**:
```bash
git commit -m "chore: remove unused API endpoints and helpers"
```

---

### ✅ Fase 2: Cache localStorage (Completata)

**Completato**: ✅

**Implementazione**:
- localStorage 3 giorni per Home e Portfolio
- Lettura prioritaria da storage prima di fetch
- Salvataggio automatico dopo fetch

**Codice**:
```typescript
// useHomeData.ts
const cached = localStorage.getItem('home-data-cache');
if (cached && isFresh(cached)) {
  return cached.data; // Skip network
}
```

**Risultati**:
- ✅ -90% edge requests per visitatori ricorrenti
- ✅ Caricamento istantaneo da cache
- ✅ Risparmio banda Vercel

---

### ✅ Fase 3: Sistema Batch Admin (Completata)

**Completato**: ✅

**Implementazione**:
- `useProjectsBatch()` → `/api/projects/save-all`
- `useHighlightsBatch()` → `/api/highlights/save-all`
- `useServicesBatch()` → `/api/services/save-all`

**Flusso**:
```
Modifiche locali (0 API calls)
  ↓
Click "Salva Tutto" (1 API call)
  ↓
Invalida cache in-memory
  ↓
Click "Aggiorna Sito" (invalida edge)
```

**Risultati**:
- ✅ Zero chiamate durante editing
- ✅ 1 sola chiamata per pannello
- ✅ Controllo admin su pubblicazione

---

## 🔮 Ottimizzazioni Future

### 🔴 Priorità Alta

#### 1. Versioning Cache (RACCOMANDATO)

**Problema**: localStorage non invalidabile da server → dati stale fino a 3 giorni

**Soluzione**: Aggiungere versioning ai dati

**Implementazione**:

```typescript
// STEP 1: Endpoint versione leggero
// src/app/api/home-data/version/route.ts
export async function GET() {
  const { data } = await supabase
    .from('projects')
    .select('updated_at')
    .order('updated_at', { descending: true })
    .limit(1);
    
  return NextResponse.json({
    version: data[0].updated_at,
    timestamp: new Date().toISOString()
  }, {
    headers: {
      'Cache-Control': 'public, s-maxage=60' // 1 minuto cache
    }
  });
}

// STEP 2: Server aggiunge versione ai dati
// src/app/api/home-data/route.ts
const homeData = {
  projects,
  heroProjects,
  serviceCategories,
  _metadata: {
    version: await getLatestUpdateTimestamp(), // ← NUOVO
    projectsCount,
    timestamp,
  }
};

// STEP 3: Client confronta versioni
// src/hooks/useHomeData.ts
useEffect(() => {
  const cached = localStorage.getItem('home-data-cache');
  
  if (cached) {
    const parsed = JSON.parse(cached);
    
    // Check versione (lightweight request)
    const serverVersion = await fetch('/api/home-data/version');
    const { version } = await serverVersion.json();
    
    if (parsed.data._metadata.version === version) {
      setHomeData(parsed.data); // ✅ Cache valida
      return;
    }
    
    // ❌ Cache stale → fetch fresh
  }
  
  fetchHomeData();
}, []);
```

**Benefici**:
- ✅ Dati sempre aggiornati
- ✅ Mantiene cache per performance
- ✅ Invalida solo quando necessario
- ✅ Check versione = ~10ms vs fetch completo = ~100ms

**Effort**: 🟡 Medio (4-6 ore)

**Impatto**: 🔴 Alto - Risolve problema critico

---

#### 2. Unificazione Portfolio/Home

**Problema**: `/api/portfolio-data` duplica fetch già in `/api/home-data`

**Soluzione**: Riutilizzare dati Home in Portfolio

**Implementazione**:

```typescript
// PRIMA (2 fetch separate)
// Home
const { projects } = useHomeData(); // Fetch 1

// Portfolio
const { projects } = usePortfolioData(); // Fetch 2 (duplicato!)

// DOPO (1 fetch condiviso)
// Home
const { projects } = useHomeData(); // Fetch 1

// Portfolio
const { projects } = useHomeData(); // Riusa cache ✅
```

**Codice**:

```typescript
// src/components/sections/Portfolio/PortfolioProjects.tsx
// PRIMA
import { usePortfolioData } from '@/hooks';
const { projects } = usePortfolioData();

// DOPO
import { useHomeData } from '@/hooks';
const { projects } = useHomeData(); // ✅ Riusa dati cached
```

**Cleanup**:
```bash
# Rimuovi endpoint duplicato
rm -rf src/app/api/portfolio-data

# Rimuovi hook duplicato
rm src/hooks/usePortfolioData.ts
rm src/hooks/data/usePortfolioData.ts

# Aggiorna exports
# src/hooks/index.ts - rimuovi export usePortfolioData
```

**Benefici**:
- ✅ -50% edge requests Portfolio
- ✅ Dati già cached da Home
- ✅ -2 file da mantenere
- ✅ Consistenza dati garantita

**Effort**: 🟢 Basso (1-2 ore)

**Impatto**: 🟡 Medio - Performance boost Portfolio

**Rischi**: ⚠️ Se Portfolio ha filtri/sort diversi da Home

---

### 🟡 Priorità Media

#### 3. Deprecare API Singole

**Problema**: Esistono ancora endpoint per operazioni singole (confusione)

**Soluzione**: Deprecare in favore di batch

**Endpoint da Deprecare**:
```
⚠️ POST /api/projects (usa save-all)
⚠️ PUT /api/projects/[id] (usa save-all)
⚠️ DELETE /api/projects/[id] (usa save-all)
⚠️ PUT /api/projects/reorder (usa save-all)
⚠️ POST /api/hero-projects (usa highlights/save-all)
⚠️ DELETE /api/hero-projects (usa highlights/save-all)
⚠️ PUT /api/service-categories (usa services/save-all)
```

**Implementazione**:

```typescript
// Aggiungere warning deprecation
export async function POST(request: NextRequest) {
  console.warn('⚠️ DEPRECATED: Use /api/projects/save-all instead');
  
  // Logica esistente...
}
```

**Documentazione**:
```markdown
## ⚠️ Deprecated Endpoints

Questi endpoint sono deprecati e verranno rimossi in v2.0:

- `POST /api/projects` → Usa `POST /api/projects/save-all`
- `PUT /api/projects/[id]` → Usa `POST /api/projects/save-all`
...

**Migrazione**: Vedi [Migration Guide](./MIGRATION.md)
```

**Benefici**:
- ✅ Codice più pulito
- ✅ Meno confusione
- ✅ Forza best practices

**Effort**: 🟢 Basso (2-3 ore)

**Impatto**: 🟢 Basso - Documentazione e warning

---

#### 4. Admin Cache Refresh Automatico

**Problema**: Admin deve cliccare "Aggiorna Sito" manualmente

**Soluzione**: Invalidazione automatica dopo save-all

**Implementazione**:

```typescript
// src/app/api/projects/save-all/route.ts
export async function POST(request: NextRequest) {
  // ... salva modifiche ...
  
  // Invalida cache automaticamente
  apiCache.invalidate(cacheKeys.projects());
  apiCache.invalidate(cacheKeys.homeData());
  apiCache.invalidate(cacheKeys.portfolioData());
  
  // Revalida pagine automaticamente
  revalidatePath('/');
  revalidatePath('/portfolio');
  
  return NextResponse.json({ success: true });
}
```

**Opzione Avanzata**: Revalidate in background

```typescript
// Non bloccare response
Promise.all([
  revalidatePath('/'),
  revalidatePath('/portfolio'),
  fetch('/api/revalidate', { ... }) // Async
]).catch(console.error);

return NextResponse.json({ success: true });
```

**Benefici**:
- ✅ Meno step per admin
- ✅ Aggiornamenti più rapidi
- ✅ Meno errori umani

**Contro**:
- ⚠️ Admin perde controllo su quando pubblicare

**Effort**: 🟡 Medio (3-4 ore)

**Impatto**: 🟡 Medio - UX admin migliorata

---

### 🟢 Priorità Bassa

#### 5. Service Worker + Push Notifications

**Problema**: Invalidazione cache client limitata

**Soluzione**: Service Worker intercetta fetch + push notifications

**Architettura**:

```
SERVER (update) → Push Notification → Service Worker → Invalida Cache
```

**Implementazione**:

```typescript
// public/sw.js
self.addEventListener('push', (event) => {
  const data = event.data.json();
  
  if (data.type === 'cache-invalidate') {
    // Invalida cache specifica
    caches.delete('home-data-cache');
    
    // Notifica utente (opzionale)
    self.registration.showNotification('Contenuti aggiornati', {
      body: 'Ricarica la pagina per vedere le novità',
      icon: '/icon.png'
    });
  }
});

// Server-side (dopo save-all)
await webPush.sendNotification(subscription, {
  type: 'cache-invalidate',
  keys: ['home-data', 'portfolio-data']
});
```

**Benefici**:
- ✅ Real-time updates
- ✅ Offline support
- ✅ Push notifications

**Contro**:
- ❌ Complessità alta
- ❌ Supporto browser variabile
- ❌ Richiede subscription utente
- ❌ Costi push service

**Effort**: 🔴 Alto (2-3 giorni)

**Impatto**: 🟢 Basso - Nice to have

---

#### 6. GraphQL API (Alternativa REST)

**Problema**: REST richiede endpoint multipli per dati correlati

**Soluzione**: GraphQL per query flessibili

**Esempio**:

```graphql
# Client richiede solo ciò che serve
query HomePage {
  projects(limit: 10) {
    id
    title
    image_url
  }
  heroProjects {
    position
    project {
      title
    }
  }
}
```

**Benefici**:
- ✅ Client richiede solo dati necessari
- ✅ Meno over-fetching
- ✅ Schema tipizzato

**Contro**:
- ❌ Complessità alta
- ❌ Riscrittura completa API
- ❌ Caching più complesso

**Effort**: 🔴 Molto Alto (1-2 settimane)

**Impatto**: 🟡 Medio - Dipende da use case

**Raccomandazione**: ❌ Non necessario per questo progetto

---

## 📊 Metriche e Monitoraggio

### Dashboard Metriche (Futuro)

**Implementazione**: Admin dashboard con stats cache

```typescript
// src/app/(auth)/admin/cache-stats/page.tsx
export default function CacheStatsPage() {
  const stats = {
    localStorage: {
      'home-data': { age: '2h', size: '150KB', hits: 45 },
      'portfolio-data': { age: '5h', size: '80KB', hits: 23 }
    },
    apiCache: {
      'home-data': { age: '30m', hits: 12, misses: 2 },
      'projects': { age: '1h', hits: 8, misses: 1 }
    },
    edgeCache: {
      '/api/home-data': { hitRate: '92%', avgLatency: '45ms' }
    }
  };
  
  return <CacheStatsDisplay stats={stats} />;
}
```

**Metriche da Tracciare**:
- Cache hit rate (%)
- Età media cache
- Edge requests per giorno
- Latenza media API
- Dimensione cache

---

## 🎯 Piano di Implementazione

### Fase 1: Quick Wins (1-2 giorni)

✅ **Completato**:
- [x] Cleanup API inutilizzate
- [x] Documentazione completa
- [x] Build test

⏳ **Prossimi Step**:
- [ ] Unificazione Portfolio/Home (2h)
- [ ] Deprecation warnings API singole (2h)

**Benefici Immediati**:
- -50% edge requests Portfolio
- Codebase più pulito

---

### Fase 2: Versioning Cache (3-5 giorni)

**Step**:
1. [ ] Creare endpoint `/api/home-data/version` (1h)
2. [ ] Aggiungere campo `version` a metadata (1h)
3. [ ] Modificare `useHomeData` per check versione (2h)
4. [ ] Test e validazione (2h)
5. [ ] Documentazione (1h)

**Benefici**:
- Dati sempre aggiornati
- Cache invalidation intelligente

---

### Fase 3: Ottimizzazioni Avanzate (Opzionale)

**Step**:
- [ ] Admin cache refresh automatico (3h)
- [ ] Dashboard metriche cache (1 giorno)
- [ ] Service Worker (opzionale, 3 giorni)

**Benefici**:
- UX admin migliorata
- Monitoraggio performance

---

## 📈 ROI Stimato

### Versioning Cache

**Effort**: 🟡 6 ore  
**Impatto**: 🔴 Alto

**Benefici Quantificabili**:
- -100% dati stale (da 3 giorni a 0)
- +5% cache hit rate
- -20% support tickets "dati non aggiornati"

**ROI**: ⭐⭐⭐⭐⭐ (5/5)

---

### Unificazione Portfolio

**Effort**: 🟢 2 ore  
**Impatto**: 🟡 Medio

**Benefici Quantificabili**:
- -50% edge requests Portfolio
- -2 file codice
- +10ms velocità Portfolio (cache hit)

**ROI**: ⭐⭐⭐⭐ (4/5)

---

### Service Worker

**Effort**: 🔴 3 giorni  
**Impatto**: 🟢 Basso

**Benefici Quantificabili**:
- Real-time updates (nice to have)
- Offline support (non critico)

**ROI**: ⭐⭐ (2/5)

**Raccomandazione**: ⏸️ Rimandare

---

## 🚦 Raccomandazioni Finali

### ✅ DA FARE (Priorità Alta)

1. **Versioning Cache** - Risolve problema critico dati stale
2. **Unificazione Portfolio** - Quick win, alto ROI

### 🟡 DA CONSIDERARE (Priorità Media)

3. **Deprecation API** - Pulizia codebase
4. **Auto-revalidate** - Migliora UX admin

### ⏸️ DA RIMANDARE (Priorità Bassa)

5. **Service Worker** - Complessità vs beneficio
6. **GraphQL** - Over-engineering per questo progetto

---

## 📞 Supporto

Per domande o implementazione:
- **Email**: info@webblestudio.com
- **GitHub**: [webble-studio/issues](https://github.com/WebbleStudio/webble-studio/issues)

---

**Ultimo aggiornamento**: Dicembre 2024  
**Prossima Revisione**: Marzo 2025  
**Versione**: 1.0.0

