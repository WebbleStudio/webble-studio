'use client';

import { useState, useEffect, useCallback } from 'react';

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

interface UseClientCacheOptions {
  ttl?: number; // Default 24 hours
  key: string;
}

/**
 * Hook per cache client-side con TTL (Time To Live)
 * Evita chiamate API ripetute per dati statici
 */
export function useClientCache<T>(
  fetchFn: () => Promise<T>,
  options: UseClientCacheOptions
) {
  const { ttl = 24 * 60 * 60 * 1000, key } = options; // Default 24h
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCachedData = useCallback((): T | null => {
    try {
      const cached = localStorage.getItem(key);
      if (!cached) return null;

      const cacheItem: CacheItem<T> = JSON.parse(cached);
      const now = Date.now();
      
      // Controlla se la cache è scaduta
      if (now - cacheItem.timestamp > cacheItem.ttl) {
        localStorage.removeItem(key);
        return null;
      }

      return cacheItem.data;
    } catch (error) {
      console.warn(`Error reading cache for key ${key}:`, error);
      localStorage.removeItem(key);
      return null;
    }
  }, [key]);

  const setCachedData = useCallback((newData: T) => {
    try {
      const cacheItem: CacheItem<T> = {
        data: newData,
        timestamp: Date.now(),
        ttl,
      };
      localStorage.setItem(key, JSON.stringify(cacheItem));
    } catch (error) {
      console.warn(`Error setting cache for key ${key}:`, error);
    }
  }, [key, ttl]);

  const fetchData = useCallback(async (forceRefresh = false) => {
    // Controlla cache se non è un refresh forzato
    if (!forceRefresh) {
      const cachedData = getCachedData();
      if (cachedData) {
        setData(cachedData);
        return cachedData;
      }
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetchFn();
      setData(result);
      setCachedData(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchFn, getCachedData, setCachedData]);

  const clearCache = useCallback(() => {
    localStorage.removeItem(key);
    setData(null);
  }, [key]);

  // Carica dati all'inizializzazione
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: () => fetchData(true),
    clearCache,
  };
}
