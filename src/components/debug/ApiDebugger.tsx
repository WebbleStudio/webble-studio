'use client';

import React, { useState, useEffect, useRef } from 'react';

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
}

export default function ApiDebugger() {
  const [calls, setCalls] = useState<ApiCall[]>([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const [filter, setFilter] = useState<'all' | 'success' | 'error' | 'pending'>('all');
  const callsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Override fetch globale
    const originalFetch = window.fetch;

    window.fetch = async (...args: Parameters<typeof fetch>) => {
      const [resource, config] = args;
      const url = typeof resource === 'string' 
        ? resource 
        : resource instanceof URL 
          ? resource.href 
          : resource.url;
      const method = config?.method || 'GET';
      
      // Determina il tipo di chiamata
      const isValidUrl = url && typeof url === 'string';
      const isApiCall = isValidUrl && url.startsWith('/api/');
      const isExternalCall = isValidUrl && url.startsWith('http');
      const isUndefined = !url || url === 'undefined';
      
      // Traccia solo API calls e chiamate undefined (per debug)
      const shouldTrack = isApiCall || isExternalCall || isUndefined;
      
      const callId = `${Date.now()}-${Math.random()}`;
      const startTime = Date.now();

      // Aggiungi chiamata pending
      if (shouldTrack) {
        setCalls(prev => [{
          id: callId,
          timestamp: startTime,
          method,
          url: url || '⚠️ undefined',
          isPending: true,
        }, ...prev].slice(0, 50)); // Max 50 calls
      }

      try {
        const response = await originalFetch(...args);
        const endTime = Date.now();
        const duration = endTime - startTime;

        // Clona la response per leggere il body senza consumarlo
        const clonedResponse = response.clone();
        let size = 0;
        try {
          const blob = await clonedResponse.blob();
          size = blob.size;
        } catch (e) {
          // Ignora errori di lettura size
        }

        // Aggiorna chiamata con risultato
        if (shouldTrack) {
          setCalls(prev => prev.map(call => 
            call.id === callId
              ? { ...call, status: response.status, duration, size, isPending: false }
              : call
          ));
        }

        return response;
      } catch (error) {
        const endTime = Date.now();
        const duration = endTime - startTime;

        // Aggiorna chiamata con errore
        if (shouldTrack) {
          setCalls(prev => prev.map(call => 
            call.id === callId
              ? { ...call, error: error instanceof Error ? error.message : 'Network error', duration, isPending: false }
              : call
          ));
        }

        throw error;
      }
    };

    // Cleanup
    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  // Auto-scroll to bottom quando arrivano nuove chiamate
  useEffect(() => {
    if (!isMinimized) {
      callsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [calls, isMinimized]);

  const filteredCalls = calls.filter(call => {
    if (filter === 'all') return true;
    if (filter === 'pending') return call.isPending;
    if (filter === 'error') return call.error || (call.status && call.status >= 400);
    if (filter === 'success') return !call.error && call.status && call.status < 400;
    return true;
  });

  const getStatusColor = (call: ApiCall) => {
    if (call.isPending) return 'text-yellow-500';
    if (call.error) return 'text-red-500';
    if (call.status && call.status >= 400) return 'text-red-500';
    if (call.status && call.status >= 300) return 'text-orange-500';
    return 'text-green-500';
  };

  const getStatusBg = (call: ApiCall) => {
    if (call.isPending) return 'bg-yellow-500/10 border-yellow-500/30';
    if (call.error) return 'bg-red-500/10 border-red-500/30';
    if (call.status && call.status >= 400) return 'bg-red-500/10 border-red-500/30';
    if (call.status && call.status >= 300) return 'bg-orange-500/10 border-orange-500/30';
    return 'bg-green-500/10 border-green-500/30';
  };

  const formatUrl = (url: string) => {
    try {
      const urlObj = new URL(url, window.location.origin);
      return urlObj.pathname + urlObj.search;
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
    const date = new Date(timestamp);
    return date.toLocaleTimeString('it-IT', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      fractionalSecondDigits: 3
    });
  };

  return (
    <div className="fixed top-4 left-4 z-[9999] font-mono text-xs">
      <div className={`bg-black/95 backdrop-blur-sm text-white rounded-lg shadow-2xl border border-white/10 overflow-hidden transition-all duration-300 ${
        isMinimized ? 'w-64' : 'w-[600px]'
      }`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-[#F20352] to-[#D91848] px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <span className="font-bold">API Debugger</span>
            <span className="text-white/60">({filteredCalls.length} calls)</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCalls([])}
              className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-[10px] transition-colors"
              title="Clear all"
            >
              Clear
            </button>
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded transition-colors"
            >
              {isMinimized ? '▼' : '▲'}
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Filters */}
            <div className="px-4 py-2 bg-white/5 border-b border-white/10 flex gap-2">
              {(['all', 'pending', 'success', 'error'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-2 py-1 rounded text-[10px] transition-colors ${
                    filter === f
                      ? 'bg-[#F20352] text-white'
                      : 'bg-white/5 hover:bg-white/10 text-white/60'
                  }`}
                >
                  {f.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Calls List */}
            <div className="max-h-[500px] overflow-y-auto">
              {filteredCalls.length === 0 ? (
                <div className="px-4 py-8 text-center text-white/40">
                  No API calls yet
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {filteredCalls.map((call) => (
                    <div
                      key={call.id}
                      className={`px-4 py-3 hover:bg-white/5 transition-colors border-l-2 ${getStatusBg(call)}`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span className={`font-bold ${getStatusColor(call)}`}>
                            {call.method}
                          </span>
                          <span className="text-white/80 truncate flex-1" title={call.url}>
                            {formatUrl(call.url)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-white/40 shrink-0">
                          {call.isPending ? (
                            <span className="text-yellow-500 animate-pulse">⏳ Pending</span>
                          ) : (
                            <>
                              {call.status && (
                                <span className={getStatusColor(call)}>{call.status}</span>
                              )}
                              {call.duration && (
                                <span>{call.duration}ms</span>
                              )}
                              {call.size && (
                                <span>{formatSize(call.size)}</span>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-white/30">
                        <span>{formatTime(call.timestamp)}</span>
                        {call.error && (
                          <span className="text-red-400">❌ {call.error}</span>
                        )}
                      </div>
                    </div>
                  ))}
                  <div ref={callsEndRef} />
                </div>
              )}
            </div>

            {/* Stats Footer */}
            <div className="px-4 py-2 bg-white/5 border-t border-white/10 flex items-center justify-between text-[10px] text-white/60">
              <div className="flex items-center gap-4">
                <span>✅ {calls.filter(c => !c.error && c.status && c.status < 400).length}</span>
                <span>❌ {calls.filter(c => c.error || (c.status && c.status >= 400)).length}</span>
                <span>⏳ {calls.filter(c => c.isPending).length}</span>
              </div>
              <div>
                Avg: {calls.filter(c => c.duration).length > 0 
                  ? Math.round(calls.filter(c => c.duration).reduce((sum, c) => sum + (c.duration || 0), 0) / calls.filter(c => c.duration).length)
                  : 0}ms
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

