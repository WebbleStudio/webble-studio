import { useState, useCallback, useEffect } from 'react';
import { useServiceCategories } from './useServiceCategories';
import { useProjects, Project } from './useProjects';

export interface ServiceImage {
  categorySlug: string;
  projects: Project[];
}

export function useServiceImages() {
  const { serviceCategories, fetchServiceCategories } = useServiceCategories();
  const { projects, fetchProjects } = useProjects();
  const [serviceImages, setServiceImages] = useState<ServiceImage[]>([]);
  const [loading, setLoading] = useState(true);

  // Carica le immagini dei servizi
  const loadServiceImages = useCallback(async () => {
    setLoading(true);

    try {
      await Promise.all([fetchServiceCategories(), fetchProjects()]);
    } catch (error) {
      console.error('Error loading service images:', error);
    } finally {
      setLoading(false);
    }
  }, [fetchServiceCategories, fetchProjects]);

  // Aggiorna le immagini quando cambiano le categorie o i progetti
  useEffect(() => {
    if (serviceCategories.length > 0 && projects.length > 0) {
      const images: ServiceImage[] = serviceCategories.map((category) => {
        const categoryProjects = projects.filter((project) => category.images.includes(project.id));

        return {
          categorySlug: category.slug,
          projects: categoryProjects,
        };
      });

      setServiceImages(images);
    }
  }, [serviceCategories, projects]);

  // Carica le immagini all'avvio
  useEffect(() => {
    loadServiceImages();
  }, [loadServiceImages]);

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
    loadServiceImages,
  };
}
