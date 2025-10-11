/**
 * Admin Cache Hook
 * Cache localStorage con TTL 24h per dati admin
 * NO auto-fetch, solo refresh manuale o se cache vuota
 */

import { useState, useEffect, useCallback, useRef } from 'react';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 ore in millisecondi
const CACHE_PREFIX = 'admin_cache_';

/**
 * Hook per cache admin con TTL 24h
 */
export function useAdminCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  initialData?: T
) {
  const cacheKey = `${CACHE_PREFIX}${key}`;
  const [data, setData] = useState<T | undefined>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<number | null>(null);
  
  // Stabilizza il fetcher con useRef per evitare loop
  const fetcherRef = useRef(fetcher);
  useEffect(() => {
    fetcherRef.current = fetcher;
  }, [fetcher]);

  // Legge dalla cache localStorage
  const readCache = useCallback((): T | null => {
    try {
      const cached = localStorage.getItem(cacheKey);
      if (!cached) return null;

      const entry: CacheEntry<T> = JSON.parse(cached);
      const now = Date.now();
      const age = now - entry.timestamp;

      // Se cache scaduta (>24h), elimina e ritorna null
      if (age > CACHE_TTL) {
        localStorage.removeItem(cacheKey);
        return null;
      }

      setLastUpdate(entry.timestamp);
      return entry.data;
    } catch (err) {
      console.error(`Error reading cache for ${key}:`, err);
      return null;
    }
  }, [cacheKey, key]);

  // Scrive nella cache localStorage
  const writeCache = useCallback(
    (data: T) => {
      try {
        const entry: CacheEntry<T> = {
          data,
          timestamp: Date.now(),
        };
        localStorage.setItem(cacheKey, JSON.stringify(entry));
        setLastUpdate(entry.timestamp);
      } catch (err) {
        console.error(`Error writing cache for ${key}:`, err);
      }
    },
    [cacheKey, key]
  );

  // Fetch dati (solo se cache vuota/scaduta o refresh manuale)
  const fetchData = useCallback(
    async (force = false) => {
      // Se non è forzato, controlla cache
      if (!force) {
        const cached = readCache();
        if (cached) {
          setData(cached);
          return cached;
        }
      }

      // Cache vuota/scaduta o refresh forzato → fetch
      setLoading(true);
      setError(null);

      try {
        console.log(`🔄 Admin Cache: Fetching ${key}${force ? ' (manual refresh)' : ' (cache miss)'}...`);
        const result = await fetcherRef.current(); // Usa ref invece di fetcher diretto
        
        setData(result);
        writeCache(result);
        
        return result;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMsg);
        console.error(`Error fetching ${key}:`, err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [readCache, writeCache, key] // Rimosso fetcher dalle dependencies
  );

  // Invalida cache (quando si salvano modifiche)
  const invalidate = useCallback(() => {
    console.log(`🗑️ Admin Cache: Invalidating ${key}`);
    localStorage.removeItem(cacheKey);
    setLastUpdate(null);
  }, [cacheKey, key]);

  // Refresh manuale
  const refresh = useCallback(async () => {
    return fetchData(true);
  }, [fetchData]);

  // Carica cache all'avvio (NO auto-fetch!)
  useEffect(() => {
    const cached = readCache();
    if (cached) {
      setData(cached);
      console.log(`✅ Admin Cache: Loaded ${key} from cache`);
    } else {
      console.log(`⚠️ Admin Cache: No cache for ${key}, waiting for manual refresh`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Solo al mount!

  return {
    data,
    loading,
    error,
    fetchData,    // Fetch se cache vuota
    refresh,      // Refresh manuale (force)
    invalidate,   // Invalida cache
    lastUpdate,   // Timestamp ultimo update
    isCached: lastUpdate !== null,
  };
}

/**
 * Invalida tutte le cache admin
 */
export function clearAdminCache() {
  const keys = Object.keys(localStorage);
  keys.forEach((key) => {
    if (key.startsWith(CACHE_PREFIX)) {
      localStorage.removeItem(key);
    }
  });
  console.log('🗑️ Admin Cache: Cleared all admin caches');
}

/**
 * Ottieni età cache in formato leggibile
 */
export function getCacheAge(timestamp: number | null): string {
  if (!timestamp) return 'Never';
  
  const ageMs = Date.now() - timestamp;
  const ageMin = Math.floor(ageMs / 1000 / 60);
  const ageHour = Math.floor(ageMin / 60);
  
  if (ageHour > 0) {
    return `${ageHour}h ${ageMin % 60}m ago`;
  }
  return `${ageMin}m ago`;
}

