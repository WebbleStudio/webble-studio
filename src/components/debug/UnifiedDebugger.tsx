'use client';

import React, { useState, useEffect, useRef } from 'react';
import { apiCache } from '@/lib/apiCache';

interface ApiCall {
  id: string;
  timestamp: number;
  method: string;
  url: string;
  status?: number;
  duration?: number;
  size?: number;
  error?: string;
  isPending: boolean;
  cacheHit?: boolean;
  cacheSource?: 'memory' | 'localStorage' | 'edge' | 'network';
}

interface CacheInfo {
  key: string;
  age: number;
  size: number;
  hasPendingRequest: boolean;
  ttl: number;
  isExpired: boolean;
}

export default function UnifiedDebugger() {
  const [calls, setCalls] = useState<ApiCall[]>([]);
  const [isMinimized, setIsMinimized] = useState(true);
  const [activeTab, setActiveTab] = useState<'api' | 'cache'>('api');
  const [filter, setFilter] = useState<'all' | 'success' | 'error' | 'pending'>('all');
  const [cacheStats, setCacheStats] = useState<CacheInfo[]>([]);
  const callsEndRef = useRef<HTMLDivElement>(null);

  // Update cache stats periodically
  useEffect(() => {
    const updateCacheStats = () => {
      const stats = apiCache.getStats();
      const cacheInfo: CacheInfo[] = stats.entries.map((entry) => {
        const ttl = 3 * 24 * 60 * 60 * 1000; // 3 days default
        const isExpired = entry.age > ttl;
        return {
          key: entry.key,
          age: entry.age,
          size: 0, // We don't track size in apiCache
          hasPendingRequest: entry.hasPendingRequest,
          ttl,
          isExpired,
        };
      });
      setCacheStats(cacheInfo);
    };

    updateCacheStats();
    const interval = setInterval(updateCacheStats, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Override fetch globale con tracking cache
    const originalFetch = window.fetch;

    window.fetch = async (...args: Parameters<typeof fetch>) => {
      const [resource, config] = args;
      const url =
        typeof resource === 'string'
          ? resource
          : resource instanceof URL
            ? resource.href
            : resource.url;
      const method = config?.method || 'GET';

      const isValidUrl = url && typeof url === 'string';
      const isApiCall = isValidUrl && url.startsWith('/api/');
      const isExternalCall = isValidUrl && url.startsWith('http');
      const isUndefined = !url || url === 'undefined';

      const shouldTrack = isApiCall || isExternalCall || isUndefined;

      const callId = `${Date.now()}-${Math.random()}`;
      const startTime = Date.now();

      // Check if this might be a cache hit
      let cacheSource: 'memory' | 'localStorage' | 'edge' | 'network' = 'network';
      let cacheHit = false;

      if (shouldTrack && isApiCall) {
        // Check localStorage cache
        const storageKey = url.includes('home-data')
          ? 'home-data-cache'
          : url.includes('portfolio-data')
            ? 'portfolio-data-cache'
            : null;

        if (storageKey) {
          try {
            const cached = localStorage.getItem(storageKey);
            if (cached) {
              const parsed = JSON.parse(cached);
              const isFresh = Date.now() - parsed.timestamp < 3 * 24 * 60 * 60 * 1000;
              if (isFresh) {
                cacheSource = 'localStorage';
                cacheHit = true;
              }
            }
          } catch (e) {
            // Ignore parse errors
          }
        }

        // Check in-memory cache
        const cacheKey = url.includes('home-data')
          ? 'home-data'
          : url.includes('portfolio-data')
            ? 'portfolio-data'
            : null;

        if (cacheKey && !cacheHit) {
          const stats = apiCache.getStats();
          const entry = stats.entries.find((e) => e.key === cacheKey);
          if (entry && !entry.hasPendingRequest && entry.age < 3 * 24 * 60 * 60 * 1000) {
            cacheSource = 'memory';
            cacheHit = true;
          }
        }
      }

      if (shouldTrack) {
        setCalls(
          (prev) =>
            [
              {
                id: callId,
                timestamp: startTime,
                method,
                url: url || '⚠️ undefined',
                isPending: true,
                cacheHit,
                cacheSource,
              },
              ...prev,
            ].slice(0, 20) // Max 20 calls for compact view
        );
      }

      try {
        const response = await originalFetch(...args);
        const endTime = Date.now();
        const duration = endTime - startTime;

        // Determine actual cache source from response headers
        const xCache = response.headers.get('x-vercel-cache');
        if (xCache === 'HIT' || xCache === 'STALE') {
          cacheSource = 'edge';
          cacheHit = true;
        }

        let size = 0;
        try {
          const clonedResponse = response.clone();
          const blob = await clonedResponse.blob();
          size = blob.size;
        } catch (e) {
          // Ignore size reading errors
        }

        if (shouldTrack) {
          setCalls((prev) =>
            prev.map((call) =>
              call.id === callId
                ? {
                    ...call,
                    status: response.status,
                    duration,
                    size,
                    isPending: false,
                    cacheHit,
                    cacheSource,
                  }
                : call
            )
          );
        }

        return response;
      } catch (error) {
        const endTime = Date.now();
        const duration = endTime - startTime;

        if (shouldTrack) {
          setCalls((prev) =>
            prev.map((call) =>
              call.id === callId
                ? {
                    ...call,
                    error: error instanceof Error ? error.message : 'Network error',
                    duration,
                    isPending: false,
                    cacheHit: false,
                    cacheSource: 'network',
                  }
                : call
            )
          );
        }

        throw error;
      }
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  // Auto-scroll to bottom when new calls arrive
  useEffect(() => {
    if (!isMinimized && activeTab === 'api') {
      callsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [calls, isMinimized, activeTab]);

  const filteredCalls = calls.filter((call) => {
    if (filter === 'all') return true;
    if (filter === 'pending') return call.isPending;
    if (filter === 'error') return call.error || (call.status && call.status >= 400);
    if (filter === 'success') return !call.error && call.status && call.status < 400;
    return true;
  });

  const getStatusColor = (call: ApiCall) => {
    if (call.isPending) return 'text-yellow-400';
    if (call.error) return 'text-red-400';
    if (call.status && call.status >= 400) return 'text-red-400';
    if (call.status && call.status >= 300) return 'text-orange-400';
    return 'text-green-400';
  };

  const getCacheColor = (call: ApiCall) => {
    if (call.cacheHit) {
      switch (call.cacheSource) {
        case 'localStorage':
          return 'text-blue-400';
        case 'memory':
          return 'text-cyan-400';
        case 'edge':
          return 'text-purple-400';
        default:
          return 'text-green-400';
      }
    }
    return 'text-gray-400';
  };

  const getCacheIcon = (call: ApiCall) => {
    if (call.cacheHit) {
      switch (call.cacheSource) {
        case 'localStorage':
          return '💾';
        case 'memory':
          return '🧠';
        case 'edge':
          return '🌐';
        default:
          return '✅';
      }
    }
    return '🌐';
  };

  const formatUrl = (url: string) => {
    try {
      const urlObj = new URL(url, window.location.origin);
      const path = urlObj.pathname;
      if (path === '/api/home-data') return '🏠 home-data';
      if (path === '/api/portfolio-data') return '📁 portfolio-data';
      if (path.includes('/api/projects')) return '📦 projects';
      if (path.includes('/api/hero-projects')) return '⭐ highlights';
      if (path.includes('/api/service-categories')) return '🎨 services';
      if (path.includes('/api/contact')) return '📧 contact';
      if (path.includes('/api/booking')) return '📅 booking';
      return path;
    } catch {
      return url;
    }
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return '-';
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    if (diff < 1000) return 'now';
    if (diff < 60000) return `${Math.floor(diff / 1000)}s ago`;
    return new Date(timestamp).toLocaleTimeString('it-IT', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCacheAge = (age: number) => {
    if (age < 1000) return 'now';
    if (age < 60000) return `${Math.floor(age / 1000)}s`;
    if (age < 3600000) return `${Math.floor(age / 60000)}m`;
    return `${Math.floor(age / 3600000)}h`;
  };

  const totalCalls = calls.length;
  const successCalls = calls.filter((c) => !c.error && c.status && c.status < 400).length;
  const errorCalls = calls.filter((c) => c.error || (c.status && c.status >= 400)).length;
  const pendingCalls = calls.filter((c) => c.isPending).length;
  const cacheHits = calls.filter((c) => c.cacheHit).length;
  const cacheHitRate = totalCalls > 0 ? Math.round((cacheHits / totalCalls) * 100) : 0;

  return (
    <div className="fixed bottom-4 left-4 z-[9999] font-mono text-xs">
      <div
        className={`bg-black/95 backdrop-blur-sm text-white rounded-lg shadow-2xl border border-white/10 overflow-hidden transition-all duration-300 ${
          isMinimized ? 'w-48' : 'w-80'
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#F20352] to-[#D91848] px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <span className="font-bold text-sm">Debug</span>
            {isMinimized && (
              <span className="text-white/60 text-xs">
                {activeTab === 'api' ? `${totalCalls}` : `${cacheStats.length}`}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {!isMinimized && (
              <>
                <button
                  onClick={() => setCalls([])}
                  className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-[10px] transition-colors"
                  title="Clear API calls"
                >
                  Clear
                </button>
                <button
                  onClick={() => setActiveTab(activeTab === 'api' ? 'cache' : 'api')}
                  className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-[10px] transition-colors"
                  title="Switch tab"
                >
                  {activeTab === 'api' ? '💾' : '🌐'}
                </button>
              </>
            )}
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded transition-colors"
            >
              {isMinimized ? '▲' : '▼'}
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Tabs */}
            <div className="px-3 py-2 bg-white/5 border-b border-white/10 flex gap-2">
              <button
                onClick={() => setActiveTab('api')}
                className={`px-2 py-1 rounded text-[10px] transition-colors ${
                  activeTab === 'api'
                    ? 'bg-[#F20352] text-white'
                    : 'bg-white/5 hover:bg-white/10 text-white/60'
                }`}
              >
                API ({totalCalls})
              </button>
              <button
                onClick={() => setActiveTab('cache')}
                className={`px-2 py-1 rounded text-[10px] transition-colors ${
                  activeTab === 'cache'
                    ? 'bg-[#F20352] text-white'
                    : 'bg-white/5 hover:bg-white/10 text-white/60'
                }`}
              >
                Cache ({cacheStats.length})
              </button>
            </div>

            {/* API Tab */}
            {activeTab === 'api' && (
              <>
                {/* Filters */}
                <div className="px-3 py-2 bg-white/5 border-b border-white/10 flex gap-1">
                  {(['all', 'pending', 'success', 'error'] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-2 py-1 rounded text-[9px] transition-colors ${
                        filter === f
                          ? 'bg-[#F20352] text-white'
                          : 'bg-white/5 hover:bg-white/10 text-white/60'
                      }`}
                    >
                      {f.toUpperCase()}
                    </button>
                  ))}
                </div>

                {/* API Calls List */}
                <div className="max-h-[300px] overflow-y-auto">
                  {filteredCalls.length === 0 ? (
                    <div className="px-3 py-6 text-center text-white/40 text-xs">
                      No API calls yet
                    </div>
                  ) : (
                    <div className="divide-y divide-white/5">
                      {filteredCalls.map((call) => (
                        <div key={call.id} className="px-3 py-2 hover:bg-white/5 transition-colors">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <span className={`font-bold text-[10px] ${getStatusColor(call)}`}>
                                {call.method}
                              </span>
                              <span
                                className="text-white/80 text-[10px] truncate flex-1"
                                title={call.url}
                              >
                                {formatUrl(call.url)}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-[9px] text-white/40 shrink-0">
                              {call.isPending ? (
                                <span className="text-yellow-400 animate-pulse">⏳</span>
                              ) : (
                                <>
                                  <span className={getCacheColor(call)} title={call.cacheSource}>
                                    {getCacheIcon(call)}
                                  </span>
                                  {call.status && (
                                    <span className={getStatusColor(call)}>{call.status}</span>
                                  )}
                                  {call.duration && <span>{call.duration}ms</span>}
                                </>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-[9px] text-white/30">
                            <span>{formatTime(call.timestamp)}</span>
                            {call.error && <span className="text-red-400">❌</span>}
                          </div>
                        </div>
                      ))}
                      <div ref={callsEndRef} />
                    </div>
                  )}
                </div>

                {/* API Stats Footer */}
                <div className="px-3 py-2 bg-white/5 border-t border-white/10 text-[9px] text-white/60">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span>✅ {successCalls}</span>
                      <span>❌ {errorCalls}</span>
                      <span>⏳ {pendingCalls}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>💾 {cacheHitRate}%</span>
                      <span>
                        Avg:{' '}
                        {calls.filter((c) => c.duration).length > 0
                          ? Math.round(
                              calls
                                .filter((c) => c.duration)
                                .reduce((sum, c) => sum + (c.duration || 0), 0) /
                                calls.filter((c) => c.duration).length
                            )
                          : 0}
                        ms
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Cache Tab */}
            {activeTab === 'cache' && (
              <>
                {/* Cache Stats */}
                <div className="px-3 py-2 bg-white/5 border-b border-white/10 text-[10px] text-white/60">
                  <div className="flex items-center justify-between">
                    <span>In-Memory Cache</span>
                    <span>{cacheStats.length} entries</span>
                  </div>
                </div>

                {/* Cache Entries */}
                <div className="max-h-[300px] overflow-y-auto">
                  {cacheStats.length === 0 ? (
                    <div className="px-3 py-6 text-center text-white/40 text-xs">
                      No cache entries
                    </div>
                  ) : (
                    <div className="divide-y divide-white/5">
                      {cacheStats.map((entry) => (
                        <div
                          key={entry.key}
                          className="px-3 py-2 hover:bg-white/5 transition-colors"
                        >
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <span className="text-white/80 text-[10px] truncate flex-1">
                                {entry.key === 'home-data'
                                  ? '🏠 home-data'
                                  : entry.key === 'portfolio-data'
                                    ? '📁 portfolio-data'
                                    : entry.key === 'projects'
                                      ? '📦 projects'
                                      : entry.key === 'hero-projects'
                                        ? '⭐ highlights'
                                        : entry.key === 'service-categories'
                                          ? '🎨 services'
                                          : entry.key}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-[9px] text-white/40 shrink-0">
                              {entry.hasPendingRequest && (
                                <span className="text-yellow-400 animate-pulse">⏳</span>
                              )}
                              <span className={entry.isExpired ? 'text-red-400' : 'text-green-400'}>
                                {entry.isExpired ? '❌' : '✅'}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-[9px] text-white/30">
                            <span>Age: {formatCacheAge(entry.age)}</span>
                            <span>TTL: {Math.floor(entry.ttl / 1000 / 60 / 60)}h</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Cache Stats Footer */}
                <div className="px-3 py-2 bg-white/5 border-t border-white/10 text-[9px] text-white/60">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span>✅ {cacheStats.filter((e) => !e.isExpired).length}</span>
                      <span>❌ {cacheStats.filter((e) => e.isExpired).length}</span>
                      <span>⏳ {cacheStats.filter((e) => e.hasPendingRequest).length}</span>
                    </div>
                    <div>
                      <button
                        onClick={() => {
                          apiCache.invalidate();
                          setCacheStats([]);
                        }}
                        className="px-2 py-1 bg-red-500/20 hover:bg-red-500/30 rounded text-[9px] transition-colors"
                      >
                        Clear All
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
