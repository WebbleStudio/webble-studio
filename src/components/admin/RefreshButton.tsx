/**
 * Refresh Button Component
 * Bottone per refresh manuale con indicatore cache age
 */

'use client';

import React from 'react';
import { getCacheAge } from '@/hooks';

interface RefreshButtonProps {
  onRefresh: () => Promise<any>;
  loading?: boolean;
  lastUpdate: number | null;
  className?: string;
}

export default function RefreshButton({
  onRefresh,
  loading = false,
  lastUpdate,
  className = '',
}: RefreshButtonProps) {
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Cache Age Indicator */}
      {lastUpdate && (
        <span className="text-xs text-neutral-500 dark:text-neutral-400">
          Updated {getCacheAge(lastUpdate)}
        </span>
      )}

      {/* Refresh Button */}
      <button
        onClick={handleRefresh}
        disabled={isRefreshing || loading}
        className="flex items-center gap-2 px-4 py-2 bg-[#F20352] hover:bg-[#D91848] text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title="Refresh data"
      >
        <svg
          className={`w-4 h-4 ${isRefreshing || loading ? 'animate-spin' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        {isRefreshing || loading ? 'Refreshing...' : 'Refresh'}
      </button>
    </div>
  );
}
