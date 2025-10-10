import { supabase } from './supabaseClient';
import { useState, useEffect } from 'react';

export interface PrefetchData {
  projects: any[];
  heroProjects: any[];
  serviceCategories: any[];
}

/**
 * Pre-fetch data per migliorare performance homepage
 * Viene chiamato a build time o on-demand
 */
export async function prefetchHomepageData(): Promise<PrefetchData> {
  try {
    // Fetch parallelo di tutti i dati necessari
    const [projectsResult, heroProjectsResult, serviceCategoriesResult] = await Promise.all([
      // Projects
      supabase
        .from('projects')
        .select('*')
        .order('order_position', { ascending: true }),
      
      // Hero Projects
      supabase
        .from('hero-projects')
        .select('*')
        .order('position', { ascending: true }),
      
      // Service Categories
      supabase
        .from('service-categories')
        .select('*')
        .order('order_position', { ascending: true }),
    ]);

    // Controlla errori
    if (projectsResult.error) {
      console.error('Error fetching projects:', projectsResult.error);
    }
    if (heroProjectsResult.error) {
      console.error('Error fetching hero projects:', heroProjectsResult.error);
    }
    if (serviceCategoriesResult.error) {
      console.error('Error fetching service categories:', serviceCategoriesResult.error);
    }

    return {
      projects: projectsResult.data || [],
      heroProjects: heroProjectsResult.data || [],
      serviceCategories: serviceCategoriesResult.data || [],
    };
  } catch (error) {
    console.error('Error in prefetchHomepageData:', error);
    return {
      projects: [],
      heroProjects: [],
      serviceCategories: [],
    };
  }
}

/**
 * Hook per utilizzare dati pre-fetchati
 */
export function usePrefetchedData(initialData?: PrefetchData) {
  const [data, setData] = useState<PrefetchData | null>(initialData || null);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!initialData) {
      prefetchHomepageData()
        .then(setData)
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [initialData]);

  return { data, loading, error };
}
