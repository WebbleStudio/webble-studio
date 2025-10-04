import { useState, useCallback } from 'react';
import { useApiCall } from './useApiCall';

export interface Booking {
  id: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  services?: string[]; // Opzionale per compatibilità
  custom_service?: string;
  contact_method: string;
  created_at: string;
  updated_at: string;
  // Campi legacy per compatibilità
  service?: string;
}

export interface BookingFormData {
  name: string;
  surname: string;
  email: string;
  phone: string;
  services: string[];
  customService?: string;
  contactMethod: string;
}

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    loading: submitLoading,
    error: submitError,
    execute: submitBooking,
  } = useApiCall({
    onSuccess: () => {
      // Refresh bookings after successful submission
      fetchBookings();
    },
  });

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/bookings');
      if (!response.ok) {
        throw new Error('Errore nel caricamento dei booking');
      }

      const data = await response.json();
      setBookings(data.bookings || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto');
    } finally {
      setLoading(false);
    }
  }, []);

  const createBooking = useCallback(
    async (bookingData: BookingFormData) => {
      return await submitBooking(() =>
        fetch('/api/booking', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bookingData),
        })
      );
    },
    [submitBooking]
  );

  const deleteBooking = useCallback(async (bookingId: string) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error("Errore nell'eliminazione del booking");
      }

      // Rimuovi il booking dalla lista locale
      setBookings((prev) => prev.filter((booking) => booking.id !== bookingId));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto');
      return false;
    }
  }, []);

  const deleteBookings = useCallback(async (bookingIds: string[]) => {
    try {
      const response = await fetch('/api/bookings', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: bookingIds }),
      });

      if (!response.ok) {
        throw new Error("Errore nell'eliminazione dei booking");
      }

      // Rimuovi i booking dalla lista locale
      setBookings((prev) => prev.filter((booking) => !bookingIds.includes(booking.id)));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto');
      return false;
    }
  }, []);

  return {
    bookings,
    loading: loading || submitLoading,
    error: error || submitError,
    fetchBookings,
    createBooking,
    deleteBooking,
    deleteBookings,
  };
}
