# Unified Debugger

Un debugger unificato per monitorare API calls e cache in tempo reale durante lo sviluppo.

## Caratteristiche

### 📍 Posizione
- **Posizione**: Basso a sinistra (bottom-left)
- **Dimensioni**: Compatto (minimizzato di default)
- **Visibilità**: Solo in modalità development

### 🔄 Tab API
- **Tracciamento**: Tutte le chiamate API in tempo reale
- **Cache Detection**: Rileva cache hits da localStorage, memory, edge
- **Filtri**: All, Pending, Success, Error
- **Statistiche**: Success rate, cache hit rate, tempo medio
- **Icone Cache**:
  - 💾 localStorage
  - 🧠 memory cache
  - 🌐 edge cache
  - ✅ network

### 💾 Tab Cache
- **Monitoraggio**: Cache in-memory in tempo reale
- **Stato**: Valido, scaduto, pending
- **Età**: Tempo dall'ultimo aggiornamento
- **TTL**: Time-to-live rimanente
- **Pulizia**: Clear all cache

### 🎯 Funzionalità
- **Auto-scroll**: Scroll automatico alle nuove chiamate
- **Minimizzazione**: Toggle per ridurre ingombro
- **Clear**: Pulisce le chiamate API
- **Real-time**: Aggiornamento in tempo reale

## Utilizzo

Il debugger si attiva automaticamente in modalità development e fornisce:

1. **Monitoraggio API**: Vedi tutte le chiamate in tempo reale
2. **Cache Analysis**: Analizza l'efficacia della cache
3. **Performance**: Monitora tempi di risposta
4. **Debug**: Identifica problemi di cache o API

## Integrazione

```tsx
// In ClientLayout.tsx
{isDevelopment && <UnifiedDebugger />}
```

## Cache Sources

- **localStorage**: Cache persistente (3 giorni)
- **memory**: Cache in-memory (ApiCache)
- **edge**: Cache CDN (Vercel)
- **network**: Chiamata diretta al server

## Statistiche

- **Success Rate**: Percentuale di chiamate riuscite
- **Cache Hit Rate**: Percentuale di cache hits
- **Average Time**: Tempo medio di risposta
- **Pending**: Chiamate in corso
