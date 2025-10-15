// Sistema di caching in-memory per le API
// Evita chiamate duplicate nella stessa sessione

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  promise?: Promise<T>;
}

class ApiCache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private defaultTTL = 5 * 60 * 1000; // 5 minuti default
  private adminTTL = 30 * 60 * 1000; // 30 minuti per admin

  /**
   * Ottiene i dati dalla cache o esegue il fetcher
   * Previene chiamate simultanee duplicate (deduplication)
   */
  async get<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl: number = this.defaultTTL,
    isAdmin: boolean = false
  ): Promise<T> {
    // Usa TTL più lungo per admin
    const effectiveTTL = isAdmin ? this.adminTTL : ttl;
    const cached = this.cache.get(key);
    const now = Date.now();

    // Se c'è una chiamata in corso, aspetta quella invece di farne un'altra
    if (cached?.promise) {
      console.log(`🔄 ApiCache: Reusing pending request for "${key}"`);
      return cached.promise;
    }

    // Se la cache è valida, ritorna i dati cached
    if (cached && now - cached.timestamp < effectiveTTL) {
      console.log(
        `✅ ApiCache: Cache hit for "${key}" (age: ${Math.round((now - cached.timestamp) / 1000)}s)`
      );
      return cached.data;
    }

    // Esegui il fetcher e salva la promise per deduplicare chiamate simultanee
    console.log(`🌐 ApiCache: Fetching "${key}"...`);
    const promise = fetcher();

    // Salva la promise in corso
    this.cache.set(key, {
      data: cached?.data, // Mantieni i vecchi dati se ci sono
      timestamp: cached?.timestamp || 0,
      promise,
    });

    try {
      const data = await promise;

      // Salva i dati nella cache
      this.cache.set(key, {
        data,
        timestamp: now,
      });

      console.log(`✅ ApiCache: Cached "${key}"`);
      return data;
    } catch (error) {
      // Rimuovi la promise fallita dalla cache
      this.cache.delete(key);
      throw error;
    }
  }

  /**
   * Invalida la cache per una o più chiavi
   */
  invalidate(...keys: string[]) {
    if (keys.length === 0) {
      // Invalida tutta la cache
      this.cache.clear();
      console.log(`🗑️ ApiCache: Cleared all cache`);
    } else {
      keys.forEach((key) => {
        this.cache.delete(key);
        console.log(`🗑️ ApiCache: Invalidated "${key}"`);
      });
    }
  }

  /**
   * Ottiene info sulla cache per debugging
   */
  getStats() {
    const entries = Array.from(this.cache.entries());
    return {
      size: this.cache.size,
      entries: entries.map(([key, entry]) => ({
        key,
        age: Date.now() - entry.timestamp,
        hasPendingRequest: !!entry.promise,
      })),
    };
  }
}

// Singleton instance
export const apiCache = new ApiCache();

// Helper per creare chiavi di cache consistenti
export const cacheKeys = {
  projects: () => 'projects',
  heroProjects: () => 'hero-projects',
  serviceCategories: () => 'service-categories',
  services: () => 'services',
  highlights: () => 'highlights',
  homeData: () => 'home-data', // Endpoint aggregato home
  portfolioData: () => 'portfolio-data', // Endpoint aggregato portfolio
  project: (id: string) => `project-${id}`,
} as const;
