/**
 * Admin Bookings Hook
 * Wrapper di useBookings con cache 24h per admin
 */

import { useAdminCache } from './useAdminCache';
import { useBookings, Booking } from './useBookings';

export function useAdminBookings() {
  const {
    bookings: liveBookings,
    loading: liveLoading,
    error: liveError,
    deleteBookings,
  } = useBookings();

  // Cache 24h per admin
  const {
    data: cachedBookings,
    loading: cacheLoading,
    error: cacheError,
    fetchData,
    refresh,
    invalidate,
    lastUpdate,
    isCached,
  } = useAdminCache<Booking[]>('bookings', async () => {
    const response = await fetch('/api/bookings', {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache' },
    });
    if (!response.ok) throw new Error('Failed to fetch bookings');
    const data = await response.json();
    return data.bookings || []; // Estrai array bookings dalla risposta
  });

  // Wrapper per deleteBookings che invalida cache
  const deleteBookingsWithInvalidation = async (...args: Parameters<typeof deleteBookings>) => {
    const result = await deleteBookings(...args);
    invalidate();
    await fetchData(true); // Refresh dopo eliminazione
    return result;
  };

  return {
    bookings: cachedBookings || [],
    loading: cacheLoading || liveLoading,
    error: cacheError || liveError,
    deleteBookings: deleteBookingsWithInvalidation,
    // Admin-specific
    refresh,
    fetchData,
    lastUpdate,
    isCached,
  };
}

