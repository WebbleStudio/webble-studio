import { useState, useCallback } from 'react';
import { apiCache, cacheKeys } from '@/lib/apiCache';

export interface Service {
  id: string;
  title: string;
  title_en?: string;
  description: string;
  description_en?: string;
  images: string[];
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface CreateServiceData {
  title: string;
  title_en?: string;
  description: string;
  description_en?: string;
  images?: string[];
  slug: string;
}

export function useServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch tutti i servizi
  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiCache.get(
        cacheKeys.services(),
        async () => {
          const response = await fetch('/api/services', {
            cache: 'no-store',
            headers: {
              'Cache-Control': 'no-cache',
            },
          });
          if (!response.ok) {
            throw new Error('Failed to fetch services');
          }
          return response.json();
        },
        30 * 60 * 1000, // 30 minuti cache
        true // isAdmin
      );

      setServices(data);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch services');
    } finally {
      setLoading(false);
    }
  }, []);

  // Crea un nuovo servizio
  const createService = useCallback(async (serviceData: CreateServiceData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(serviceData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create service');
      }

      const newService = await response.json();
      
      // Aggiorna cache e stato locale
      await apiCache.invalidate(cacheKeys.services());
      setServices(prev => [...prev, newService]);
      
      return newService;
    } catch (err) {
      console.error('Error creating service:', err);
      setError(err instanceof Error ? err.message : 'Failed to create service');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Aggiorna un servizio
  const updateService = useCallback(async (id: string, updates: Partial<CreateServiceData>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/services', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, ...updates }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update service');
      }

      const updatedService = await response.json();
      
      // Aggiorna cache e stato locale
      await apiCache.invalidate(cacheKeys.services());
      setServices(prev => prev.map(service => 
        service.id === id ? updatedService : service
      ));
      
      return updatedService;
    } catch (err) {
      console.error('Error updating service:', err);
      setError(err instanceof Error ? err.message : 'Failed to update service');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Elimina un servizio
  const deleteService = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/services?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete service');
      }

      // Aggiorna cache e stato locale
      await apiCache.invalidate(cacheKeys.services());
      setServices(prev => prev.filter(service => service.id !== id));
      
    } catch (err) {
      console.error('Error deleting service:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete service');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    services,
    loading,
    error,
    fetchServices,
    createService,
    updateService,
    deleteService,
  };
}
