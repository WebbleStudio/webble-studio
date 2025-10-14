# 🔍 Test: ISR vs Pure Static su Vercel

## Il Problema

Stai vedendo Edge requests anche con `runtime = 'nodejs'` e `revalidate = 43200`.

## Possibili Cause

### 1. ISR Richiede Serverless Functions su Vercel ⚠️

Anche con `runtime = 'nodejs'`, **ISR su Vercel usa Serverless Functions** per:
- Gestire revalidation
- Servire versioni stale
- Rigenerare pagine on-demand

**NON è Edge**, ma appare comunque come "request" nel dashboard.

### 2. Differenza tra Edge e Serverless

| Tipo | Cos'è | Mostra in Dashboard |
|------|-------|---------------------|
| **Edge Function** | Runtime Edge (V8) | "Edge Requests" |
| **Serverless Function** | Runtime Node.js | "Serverless Function Invocations" |
| **Pure Static** | File HTML statico | "Bandwidth" solo |

### 3. Cosa Vedi Tu

Se vedi **"Edge Requests"** nella lista, potrebbe essere:
- ❌ Pagine con `runtime = 'edge'` (vecchie API routes?)
- ⚠️ Vercel conta ISR revalidation come "Edge" per errore UI
- ❌ Ci sono ancora API calls nascoste

## Soluzione: Pure Static Export (ZERO Functions)

### Opzione A: Static Export Completo

```typescript
// next.config.ts
export default {
  output: 'export', // ← HTML puro, ZERO functions
}
```

**PRO:**
- ✅ ZERO Edge o Serverless Functions
- ✅ ZERO costi runtime
- ✅ Solo bandwidth CDN

**CONTRO:**
- ❌ NO ISR automatico
- ❌ NO Server Actions
- ❌ Devi rebuilda per aggiornare

### Opzione B: ISR con On-Demand Revalidation

```typescript
// Mantieni ISR attuale
export const revalidate = false; // ← Disabilita auto-revalidation
export const dynamic = 'force-static';
```

Poi aggiorna solo via API `/api/revalidate`

**PRO:**
- ✅ Aggiornamenti on-demand
- ✅ Niente auto-revalidation (meno requests)

**CONTRO:**
- ⚠️ Usa Serverless Functions (non Edge, ma conta nei logs)

### Opzione C: Verifica se sono vecchie API Routes

Controlla se `/api/home-data` e `/api/portfolio-data` sono ancora deployate su Vercel!

## Test da Fare

1. **Controlla Vercel Functions Dashboard**
   - Vai su: Dashboard → Functions
   - Vedi quali route sono attive
   - Cerca `/api/home-data`, `/api/portfolio-data`

2. **Controlla se sono Edge o Serverless**
   - Edge = Bad (costi alti)
   - Serverless = OK (costi bassi)
   - Static = Best (gratis)

3. **Test: Disabilita ISR temporaneamente**
   ```typescript
   export const revalidate = false;
   export const dynamic = 'force-static';
   ```
   
   Deploy e vedi se spariscono le "Edge Requests"

## Domanda per Te

**Nel dashboard Vercel, vedi esattamente "Edge Requests" o "Function Invocations"?**

Questo ci dirà se:
- Edge = Problema serio, c'è ancora Edge Runtime
- Serverless = OK, è solo ISR che usa Node.js functions
- Requests = Potrebbero essere solo CDN hits (gratis!)

