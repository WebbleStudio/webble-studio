# 📚 API Documentation - Webble Studio

> **Versione**: 1.0.0  
> **Ultimo aggiornamento**: Dicembre 2024  
> **Stato**: Produzione

---

## 📋 Indice

1. [Panoramica](#panoramica)
2. [API Pubbliche](#api-pubbliche)
3. [API Admin](#api-admin)
4. [Sistema di Caching](#sistema-di-caching)
5. [Autenticazione](#autenticazione)
6. [Best Practices](#best-practices)
7. [Troubleshooting](#troubleshooting)

---

## 🌐 Panoramica

### Architettura API

Il progetto utilizza un'architettura API ottimizzata con:
- **Endpoint aggregati** per ridurre le chiamate al minimo
- **Sistema batch** per operazioni admin multiple
- **Cache multi-layer** (in-memory + localStorage + edge CDN)
- **Invalidazione manuale** controllata da admin

### Principi di Design

1. **Aggregazione**: Endpoint pubblici ritornano dati completi in una chiamata
2. **Batch Operations**: Admin modifica localmente e salva tutto insieme
3. **Zero Waste**: Nessuna chiamata API durante l'editing admin
4. **Cache Intelligente**: 3 giorni localStorage per visitatori, no-cache per admin

---

## 🌍 API Pubbliche

### 🏠 Home Data (Aggregato)

**Endpoint**: `GET /api/home-data`

**Descrizione**: Ritorna tutti i dati necessari per la homepage in una singola chiamata.

**Query Database** (parallele):
```sql
SELECT * FROM projects ORDER BY order_position ASC
SELECT * FROM hero-projects ORDER BY position ASC
SELECT * FROM service_categories ORDER BY created_at ASC
```

**Response**:
```typescript
{
  projects: Project[],              // Tutti i progetti
  heroProjects: EnrichedHeroProject[], // 4 highlights con progetto completo (JOIN server-side)
  serviceCategories: EnrichedServiceCategory[], // Categorie con progetti (JOIN server-side)
  _metadata: {
    projectsCount: number,
    heroProjectsCount: number,
    serviceCategoriesCount: number,
    timestamp: string
  }
}
```

**Caching**:
- **localStorage**: 3 giorni (`PERFORMANCE_CONFIG.CACHE_TTL_MS`)
- **Edge CDN**: 24 ore (`s-maxage=86400`)
- **Stale-while-revalidate**: 7 giorni
- **In-memory**: 3 giorni (apiCache)

**Utilizzo**:
```typescript
import { useHomeData } from '@/hooks';

function HomePage() {
  const { projects, heroProjects, serviceCategories, loading } = useHomeData();
  // Dati cached automaticamente
}
```

**Cache Busting**:
```typescript
// Force refresh (bypass cache)
const url = `/api/home-data?_t=${Date.now()}`;
```

---

### 📁 Portfolio Data (Aggregato)

**Endpoint**: `GET /api/portfolio-data`

**Descrizione**: Ritorna tutti i progetti per la pagina portfolio.

**Query Database**:
```sql
SELECT * FROM projects ORDER BY order_position ASC
```

**Response**:
```typescript
{
  projects: Project[],
  _metadata: {
    projectsCount: number,
    timestamp: string
  }
}
```

**Caching**: Identico a `/api/home-data`

**Utilizzo**:
```typescript
import { usePortfolioData } from '@/hooks';

function PortfolioPage() {
  const { projects, loading } = usePortfolioData();
}
```

**Note**: 
- ⚠️ Questo endpoint potrebbe essere unificato con `/api/home-data` per ridurre edge requests
- I dati `projects` sono identici in entrambi gli endpoint

---

### 📧 Contact Form

**Endpoint**: `POST /api/contact`

**Descrizione**: Gestisce l'invio del form contatti e invia email via Resend.

**Request Body**:
```typescript
{
  name: string,
  email: string,
  phone?: string,
  message: string
}
```

**Response**:
```typescript
{
  success: boolean,
  message: string
}
```

**Caching**: ❌ No cache (POST request)

**Email Inviate**:
- Email all'admin con dettagli contatto
- Email di conferma al cliente

**Rate Limiting**: Implementato lato Resend

---

### 📅 Booking Form

**Endpoint**: `POST /api/booking`

**Descrizione**: Gestisce le prenotazioni multi-step e invia email.

**Request Body**:
```typescript
{
  name: string,
  email: string,
  phone: string,
  company?: string,
  service: string,
  budget: string,
  timeline: string,
  message?: string,
  privacy_accepted: boolean
}
```

**Response**:
```typescript
{
  success: boolean,
  bookingId: string,
  message: string
}
```

**Caching**: ❌ No cache

**Database**: Salva in tabella `bookings`

**Email Inviate**:
- Email admin con dettagli prenotazione
- Email conferma cliente

---

## 🔧 API Admin

### 🔐 Autenticazione

Tutte le API admin richiedono autenticazione NextAuth.js.

**Verifica**:
```typescript
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const session = await getServerSession(authOptions);
if (!session) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

---

### 📦 Projects - Batch Save (RACCOMANDATO)

**Endpoint**: `POST /api/projects/save-all`

**Descrizione**: Gestisce tutte le operazioni sui progetti in una singola chiamata batch.

**Request Body**:
```typescript
{
  newProjects: Array<{
    title: string,
    title_en?: string,
    description: string,
    description_en?: string,
    categories: string[],
    link?: string,
    image_file?: string,  // Base64 data URL
    order_position: number
  }>,
  updates: Array<{
    id: string,
    title?: string,
    title_en?: string,
    description?: string,
    description_en?: string,
    categories?: string[],
    link?: string,
    image_url?: string,
    order_position?: number
  }>,
  deletes: string[],  // Array di ID da eliminare
  reorder: Array<{
    id: string,
    order_position: number
  }>
}
```

**Response**:
```typescript
{
  success: boolean,
  results: {
    newProjectsCreated: number,
    updated: number,
    deleted: number,
    reordered: number,
    errors: string[]
  },
  message: string
}
```

**Operazioni**:
1. Upload immagini nuovi progetti (Base64 → Supabase Storage)
2. Inserimento nuovi progetti
3. Eliminazione progetti
4. Aggiornamento progetti esistenti
5. Riordinamento posizioni

**Invalidazione Cache**:
- ✅ `apiCache` (in-memory)
- ❌ localStorage client (richiede "Aggiorna Sito")

**Utilizzo**:
```typescript
import { useProjectsBatch } from '@/hooks';

function AdminProjects() {
  const { 
    markAsModified, 
    markAsDeleted, 
    markAsReordered,
    saveAllChanges 
  } = useProjectsBatch();
  
  // Accumula modifiche localmente
  markAsModified(projectId, changes);
  markAsDeleted(projectId);
  markAsReordered(projects);
  
  // Salva tutto in una chiamata
  await saveAllChanges();
}
```

---

### ⭐ Highlights - Batch Save

**Endpoint**: `POST /api/highlights/save-all`

**Descrizione**: Aggiorna gli highlights (hero-projects) della homepage in batch.

**Request Body**:
```typescript
{
  highlightsUpdates: Array<{
    id: string,
    project_id?: string,
    position?: number,
    descriptions?: string[],  // [desc1, desc2, desc3]
    images?: string[],        // Array URL immagini
    background_image?: string,
    project_date?: string
  }>
}
```

**Response**:
```typescript
{
  success: boolean,
  message: string,
  summary: {
    highlightsUpdated: number
  }
}
```

**Invalidazione Cache**:
- ✅ `apiCache.invalidate('hero-projects')`
- ✅ `apiCache.invalidate('home-data')`

**Utilizzo**:
```typescript
import { useHighlightsBatch } from '@/hooks';

function AdminHighlights() {
  const { 
    markHighlightAsModified,
    saveAllChanges 
  } = useHighlightsBatch();
  
  markHighlightAsModified(highlightId, changes);
  await saveAllChanges();
}
```

---

### 🎨 Services - Batch Save

**Endpoint**: `POST /api/services/save-all`

**Descrizione**: Aggiorna le categorie di servizi in batch.

**Request Body**:
```typescript
{
  servicesUpdates: Array<{
    id: string,
    name?: string,
    slug?: string,
    images?: string[]  // Array di project IDs
  }>
}
```

**Response**:
```typescript
{
  success: boolean,
  message: string,
  summary: {
    servicesUpdated: number
  }
}
```

**Invalidazione Cache**:
- ✅ `apiCache.invalidate('service-categories')`
- ✅ `apiCache.invalidate('home-data')`

---

### 🔄 Revalidate (Aggiorna Sito)

**Endpoint**: `POST /api/revalidate`

**Descrizione**: Invalida tutte le cache e forza il refresh del sito pubblico.

**Request Body**:
```typescript
{
  paths: string[],           // Es. ['/', '/portfolio', '/chi-siamo']
  invalidateCache: boolean   // true per invalidare anche apiCache
}
```

**Response**:
```typescript
{
  revalidated: boolean,
  paths: string[],
  cacheInvalidated: boolean,
  timestamp: string
}
```

**Operazioni**:
1. Invalida `apiCache` (in-memory server)
2. Chiama `revalidatePath()` per ogni path (Next.js ISR)
3. Invalida edge cache (Vercel CDN)

**Note**:
- ❌ **Non invalida localStorage client** (limitazione browser)
- ✅ Nuovi visitatori vedono dati aggiornati immediatamente
- ⚠️ Visitatori con cache valida vedono aggiornamenti alla scadenza (3 giorni)

**Utilizzo**:
```typescript
import { useRevalidate } from '@/hooks';

function AdminDashboard() {
  const { revalidateAll } = useRevalidate();
  
  const handleRefreshSite = async () => {
    await revalidateAll(); // Invalida tutto
  };
}
```

---

### 📊 Bookings Management

#### Get All Bookings

**Endpoint**: `GET /api/bookings`

**Descrizione**: Ritorna tutte le prenotazioni per l'admin.

**Response**:
```typescript
{
  bookings: Array<{
    id: string,
    name: string,
    email: string,
    phone: string,
    company?: string,
    service: string,
    budget: string,
    timeline: string,
    message?: string,
    status: 'pending' | 'contacted' | 'completed',
    created_at: string
  }>
}
```

**Caching**: ❌ No cache (real-time data)

#### Delete Booking

**Endpoint**: `DELETE /api/bookings/[id]`

**Descrizione**: Elimina una prenotazione.

**Response**:
```typescript
{
  success: boolean,
  message: string
}
```

---

### 🖼️ Image Upload

#### Upload Project Image

**Endpoint**: `POST /api/projects/upload-image`

**Descrizione**: Upload immediato di un'immagine progetto su Supabase Storage.

**Request**: `multipart/form-data`
```typescript
{
  file: File,
  projectId?: string  // Opzionale, per associazione
}
```

**Response**:
```typescript
{
  success: boolean,
  url: string,        // URL pubblico immagine
  path: string        // Path in storage
}
```

**Storage**: `supabase.storage.from('projects')`

#### Upload Highlight Image

**Endpoint**: `POST /api/hero-projects/upload`

**Descrizione**: Upload immagine per highlight.

**Request**: `multipart/form-data`

**Response**: Identico a `/api/projects/upload-image`

---

### 📋 API Admin di Supporto (Uso Interno)

Questi endpoint esistono per operazioni specifiche ma sono **secondari** rispetto ai batch:

#### Get Projects (Admin)

**Endpoint**: `GET /api/projects`

**Descrizione**: Fetch iniziale progetti per admin dashboard.

**Caching**: ❌ `no-store` (dati real-time per admin)

**Utilizzo**: Chiamato da `useProjects()` all'ingresso admin

#### Get Hero Projects (Admin)

**Endpoint**: `GET /api/hero-projects`

**Descrizione**: Fetch highlights per configurazione admin.

**Caching**: ❌ `no-store`

#### Get Service Categories (Admin)

**Endpoint**: `GET /api/service-categories`

**Descrizione**: Fetch categorie servizi per admin.

**Caching**: ❌ `no-store`

**Note**: Include endpoint `/init` per inizializzazione tabella se vuota.

---

## 💾 Sistema di Caching

### Architettura Multi-Layer

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT                               │
├─────────────────────────────────────────────────────────────┤
│  Layer 1: localStorage (3 giorni)                           │
│  - home-data-cache                                          │
│  - portfolio-data-cache                                     │
│  - Persistente tra sessioni                                 │
│  - Invalidazione: solo scadenza TTL                         │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    EDGE CDN (Vercel)                        │
├─────────────────────────────────────────────────────────────┤
│  Layer 2: Edge Cache (24 ore)                               │
│  - Cache-Control: s-maxage=86400                            │
│  - Stale-while-revalidate: 604800 (7 giorni)               │
│  - Invalidazione: revalidatePath()                          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    SERVER (Next.js)                         │
├─────────────────────────────────────────────────────────────┤
│  Layer 3: In-Memory Cache (3 giorni)                        │
│  - apiCache (Map singleton)                                 │
│  - Request deduplication                                    │
│  - Invalidazione: apiCache.invalidate()                     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   DATABASE (Supabase)                       │
└─────────────────────────────────────────────────────────────┘
```

### Strategia di Lettura (Waterfall)

```typescript
// 1. Prova localStorage
const cached = localStorage.getItem('home-data-cache');
if (cached && isFresh(cached)) {
  return cached.data; // ✅ Cache hit - 0ms
}

// 2. Fetch API (passa per Edge CDN)
const response = await fetch('/api/home-data');
// Se Edge cache hit: ~50ms
// Se Edge miss: passa a server

// 3. Server controlla apiCache
const data = await apiCache.get('home-data', fetcher);
// Se in-memory hit: ~5ms
// Se miss: query database ~100ms

// 4. Salva in localStorage per prossima visita
localStorage.setItem('home-data-cache', JSON.stringify({
  data,
  timestamp: Date.now()
}));
```

### Configurazione Cache

**File**: `src/lib/performance.ts`

```typescript
export const PERFORMANCE_CONFIG = {
  CACHE_TTL_DAYS: 3,
  CACHE_TTL_MS: 3 * 24 * 60 * 60 * 1000, // 259200000ms
};
```

### Cache Keys

**File**: `src/lib/apiCache.ts`

```typescript
export const cacheKeys = {
  projects: () => 'projects',
  heroProjects: () => 'hero-projects',
  serviceCategories: () => 'service-categories',
  homeData: () => 'home-data',
  portfolioData: () => 'portfolio-data',
  project: (id: string) => `project-${id}`,
};
```

### Invalidazione Cache

#### Automatica (Batch Save)

```typescript
// Dopo save-all, invalida solo in-memory
apiCache.invalidate(cacheKeys.projects());
apiCache.invalidate(cacheKeys.homeData());
apiCache.invalidate(cacheKeys.portfolioData());
```

#### Manuale (Aggiorna Sito)

```typescript
// Admin clicca "Aggiorna Sito"
await fetch('/api/revalidate', {
  method: 'POST',
  body: JSON.stringify({
    paths: ['/', '/portfolio', '/chi-siamo'],
    invalidateCache: true
  })
});

// Invalida:
// ✅ apiCache (in-memory)
// ✅ Edge cache (Vercel CDN)
// ✅ Next.js cache (revalidatePath)
// ❌ localStorage client (limitazione browser)
```

#### Forzata (Client)

```typescript
// Force refresh bypass cache
const data = await fetchHomeData(true); // forceRefresh=true
// Aggiunge ?_t=timestamp per cache busting
```

---

## 🔐 Autenticazione

### NextAuth.js Configuration

**File**: `src/lib/auth.ts`

**Provider**: Credentials (email/password)

**Session**: JWT-based

**Protezione Route**:
```typescript
// Client-side
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function AdminPage() {
  return (
    <ProtectedRoute>
      {/* Contenuto admin */}
    </ProtectedRoute>
  );
}

// Server-side API
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Logica admin
}
```

---

## ✅ Best Practices

### Per Sviluppatori Frontend

1. **Usa sempre gli hook forniti**:
   ```typescript
   // ✅ Corretto
   const { projects } = useHomeData();
   
   // ❌ Evitare fetch diretto
   const response = await fetch('/api/home-data');
   ```

2. **Non bypassare la cache senza motivo**:
   ```typescript
   // ✅ Usa cache
   const { projects } = useHomeData();
   
   // ❌ Force refresh inutile
   const { projects } = useHomeData();
   fetchHomeData(true); // Spreca edge requests
   ```

3. **Batch operations in admin**:
   ```typescript
   // ✅ Accumula modifiche e salva tutto
   markAsModified(id1, changes1);
   markAsModified(id2, changes2);
   await saveAllChanges(); // 1 chiamata
   
   // ❌ Salva singolarmente
   await updateProject(id1, changes1);
   await updateProject(id2, changes2); // 2 chiamate
   ```

### Per Sviluppatori Backend

1. **Sempre validare input**:
   ```typescript
   if (!title || !categories.length) {
     return NextResponse.json({ error: 'Validation failed' }, { status: 400 });
   }
   ```

2. **Gestire errori gracefully**:
   ```typescript
   try {
     const { data, error } = await supabase.from('projects').select();
     if (error) throw error;
     return NextResponse.json(data);
   } catch (error) {
     console.error('Error:', error);
     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
   }
   ```

3. **Invalidare cache correlate**:
   ```typescript
   // Dopo modifica progetti, invalida anche home-data
   apiCache.invalidate(cacheKeys.projects());
   apiCache.invalidate(cacheKeys.homeData()); // Include progetti
   ```

4. **Header cache appropriati**:
   ```typescript
   // Pubblico: cache aggressiva
   return NextResponse.json(data, {
     headers: {
       'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
     }
   });
   
   // Admin: no cache
   return NextResponse.json(data, {
     headers: {
       'Cache-Control': 'no-store, no-cache, must-revalidate',
     }
   });
   ```

---

## 🐛 Troubleshooting

### Problema: Dati non aggiornati dopo modifica admin

**Sintomi**: Admin salva modifiche, ma il sito pubblico mostra ancora dati vecchi.

**Causa**: localStorage client ancora valido (TTL 3 giorni).

**Soluzione**:
1. Admin clicca "Aggiorna Sito" (invalida edge cache)
2. Visitatore hard refresh (Cmd+Shift+R) per bypassare localStorage
3. Oppure aspetta scadenza TTL (3 giorni)

**Soluzione Futura**: Implementare versioning (vedi sezione Roadmap)

---

### Problema: Admin vede dati cached invece di real-time

**Sintomi**: Modifiche non visibili immediatamente in admin.

**Causa**: Hook usa cache invece di no-store.

**Soluzione**: Verificare che hook admin usi `cache: 'no-store'`:
```typescript
const response = await fetch('/api/projects', {
  cache: 'no-store', // ✅ Forza fetch real-time
});
```

---

### Problema: Edge requests troppo alti

**Sintomi**: Vercel dashboard mostra molte richieste a `/api/home-data`.

**Causa Possibile**:
1. localStorage non funziona (browser privacy mode)
2. TTL troppo corto
3. Force refresh involontario

**Debug**:
```typescript
// Controlla localStorage in DevTools
console.log(localStorage.getItem('home-data-cache'));

// Verifica età cache
const cached = JSON.parse(localStorage.getItem('home-data-cache'));
const age = Date.now() - cached.timestamp;
console.log(`Cache age: ${age / 1000 / 60} minutes`);
```

---

### Problema: Upload immagini fallisce

**Sintomi**: Errore "Failed to upload image".

**Causa Possibile**:
1. File troppo grande (>5MB)
2. Formato non supportato
3. Permessi Supabase Storage

**Soluzione**:
```typescript
// Validare file prima di upload
if (file.size > 5 * 1024 * 1024) {
  throw new Error('File too large (max 5MB)');
}

const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
if (!allowedTypes.includes(file.type)) {
  throw new Error('Invalid file type');
}
```

---

## 🚀 Roadmap Ottimizzazioni

### Versioning Cache (Priorità Alta)

**Problema**: localStorage non invalidabile da server.

**Soluzione**:
```typescript
// Server aggiunge versione
_metadata: {
  version: "2024-12-15T10:30:00Z", // Ultimo update timestamp
  ...
}

// Client confronta versioni
const cached = localStorage.getItem('home-data-cache');
const serverVersion = await fetch('/api/home-data/version'); // Lightweight

if (cached.data._metadata.version !== serverVersion.version) {
  // Fetch fresh data
}
```

**Benefici**:
- ✅ Dati sempre aggiornati
- ✅ Mantiene cache per performance
- ✅ Invalida solo quando necessario

---

### Unificazione Portfolio/Home (Priorità Media)

**Problema**: `/api/portfolio-data` duplica dati già in `/api/home-data`.

**Soluzione**:
```typescript
// Invece di usePortfolioData()
const { projects } = useHomeData(); // Riusa dati cached

// Risparmio: -1 edge request per visita Portfolio
```

**Benefici**:
- ✅ -50% edge requests Portfolio
- ✅ Dati già cached da Home
- ✅ Meno endpoint da mantenere

---

### Service Worker + Push Notifications (Priorità Bassa)

**Problema**: Invalidazione cache client limitata.

**Soluzione**:
- Service Worker intercetta fetch
- Server push notification su update
- Client invalida cache automaticamente

**Benefici**:
- ✅ Real-time updates
- ✅ Offline support

**Contro**:
- ❌ Complessità alta
- ❌ Supporto browser variabile

---

## 📞 Supporto

Per domande o problemi:
- **Email**: info@webblestudio.com
- **GitHub Issues**: [webble-studio/issues](https://github.com/WebbleStudio/webble-studio/issues)
- **Documentazione**: `/docs` folder

---

**Ultimo aggiornamento**: Dicembre 2024  
**Versione**: 1.0.0  
**Autore**: Webble Studio Team

