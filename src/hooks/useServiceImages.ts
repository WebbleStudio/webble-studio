import { useCallback, useMemo } from 'react';
import { useHomeData } from './useHomeData';
import { Project } from './useProjects';

export interface ServiceImage {
  categorySlug: string;
  projects: Project[];
}

/**
 * Hook ottimizzato per ottenere progetti per categoria.
 * Utilizza i dati aggregati da useHomeData con cache 12 ore e JOIN lato server.
 */
export function useServiceImages() {
  const { serviceCategories, loading } = useHomeData();

  // Converte enrichedServiceCategories in formato ServiceImage
  const serviceImages = useMemo<ServiceImage[]>(() => {
    return serviceCategories.map((category) => ({
      categorySlug: category.slug,
      projects: category.projects, // Già joinati dal server!
    }));
  }, [serviceCategories]);

  // Ottiene i progetti per una categoria specifica
  const getProjectsForCategory = useCallback(
    (categorySlug: string): Project[] => {
      const serviceImage = serviceImages.find((img) => img.categorySlug === categorySlug);
      return serviceImage?.projects || [];
    },
    [serviceImages]
  );

  return {
    serviceImages,
    loading,
    getProjectsForCategory,
  };
}
