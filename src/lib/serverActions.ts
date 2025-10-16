/**
 * Server Actions for data fetching
 * Queste funzioni vengono eseguite sul server, non su Edge Functions
 * Zero network overhead, chiamate dirette al database
 */
'use server';

import { supabase } from './supabaseClient';
import { unstable_cache } from 'next/cache';

// ============================================
// TYPES
// ============================================

export interface Project {
  id: string;
  title: string;
  title_en?: string;
  description: string;
  description_en?: string;
  image_url: string;
  link: string | null;
  categories: string[];
  order_position: number;
  created_at: string;
  updated_at: string; // Allineato con useProjects
}

export interface HeroProject {
  id: string;
  project_id: string;
  position: number;
  background_image: string;
  images: string[];
  descriptions: string[];
  descriptions_en?: string[];
  project_date?: string;
  home_filters?: string[]; // Filtri da mostrare in home (max 3)
  created_at: string;
  updated_at?: string;
}

export interface EnrichedHeroProject extends HeroProject {
  project: Project | null;
}

export interface ServiceCategory {
  id: string;
  name: string;
  name_en?: string;
  slug: string;
  images: string[];
  created_at: string;
  updated_at?: string;
}

export interface EnrichedServiceCategory extends ServiceCategory {
  projects: Project[];
}

// ============================================
// SERVER ACTIONS
// ============================================

/**
 * Get all projects
 * Cache: 1 ora
 */
export const getProjects = unstable_cache(
  async (): Promise<Project[]> => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('order_position', { ascending: true });

      if (error) {
        console.error('Error fetching projects:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Unexpected error fetching projects:', error);
      return [];
    }
  },
  ['projects'],
  {
    revalidate: 3600, // 1 ora
    tags: ['projects'],
  }
);

/**
 * Get all hero projects with enriched project data
 * Cache: 1 ora
 */
export const getHeroProjects = unstable_cache(
  async (): Promise<EnrichedHeroProject[]> => {
    try {
      // Fetch hero projects e projects in parallelo
      const [heroProjectsResult, projectsResult] = await Promise.all([
        supabase.from('hero-projects').select('*').order('position', { ascending: true }),
        supabase.from('projects').select('*'),
      ]);

      if (heroProjectsResult.error) {
        console.error('Error fetching hero projects:', heroProjectsResult.error);
        return [];
      }

      if (projectsResult.error) {
        console.error('Error fetching projects for hero:', projectsResult.error);
        return [];
      }

      const heroProjects = heroProjectsResult.data || [];
      const projects = projectsResult.data || [];

      // JOIN lato server: arricchisci hero projects con i dati completi dei progetti
      const enrichedHeroProjects = heroProjects.map((hp) => {
        const project = projects.find((p) => p.id === hp.project_id);
        return {
          ...hp,
          project: project || null,
        };
      });

      return enrichedHeroProjects;
    } catch (error) {
      console.error('Unexpected error fetching hero projects:', error);
      return [];
    }
  },
  ['hero-projects'],
  {
    revalidate: 3600, // 1 ora
    tags: ['hero-projects', 'projects'],
  }
);

/**
 * Get all service categories with enriched projects
 * Cache: 1 ora
 */
export const getServiceCategories = unstable_cache(
  async (): Promise<EnrichedServiceCategory[]> => {
    try {
      // Fetch service categories e projects in parallelo
      // Per operazioni pubbliche (lettura), usa client anonimo
      // Le policy RLS permettono SELECT pubblico
      const [categoriesResult, projectsResult] = await Promise.all([
        supabase.from('service_categories').select('*').order('created_at', { ascending: true }),
        supabase.from('projects').select('*'),
      ]);

      if (categoriesResult.error) {
        console.error('Error fetching service categories:', categoriesResult.error);
        return [];
      }

      if (projectsResult.error) {
        console.error('Error fetching projects for categories:', projectsResult.error);
        return [];
      }

      const categories = categoriesResult.data || [];
      const projects = projectsResult.data || [];

      // JOIN lato server: arricchisci service categories con i progetti completi
      const enrichedCategories = categories.map((category) => {
        const categoryProjects = projects.filter((project) => category.images.includes(project.id));
        return {
          ...category,
          projects: categoryProjects,
        };
      });

      return enrichedCategories;
    } catch (error) {
      console.error('Unexpected error fetching service categories:', error);
      return [];
    }
  },
  ['service-categories'],
  {
    revalidate: 3600, // 1 ora
    tags: ['service-categories', 'projects'],
  }
);

/**
 * Get aggregated home data (all data in one call)
 * Cache: 1 ora
 */
export const getHomeData = unstable_cache(
  async () => {
    try {
      // Fetch tutti i dati in parallelo per performance
      const [projects, heroProjects, serviceCategories] = await Promise.all([
        getProjects(),
        getHeroProjects(),
        getServiceCategories(),
      ]);

      return {
        projects,
        heroProjects,
        serviceCategories,
        _metadata: {
          projectsCount: projects.length,
          heroProjectsCount: heroProjects.length,
          serviceCategoriesCount: serviceCategories.length,
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      console.error('Unexpected error fetching home data:', error);
      return {
        projects: [],
        heroProjects: [],
        serviceCategories: [],
        _metadata: {
          projectsCount: 0,
          heroProjectsCount: 0,
          serviceCategoriesCount: 0,
          timestamp: new Date().toISOString(),
        },
      };
    }
  },
  ['home-data'],
  {
    revalidate: 3600, // 1 ora
    tags: ['home-data', 'projects', 'hero-projects', 'service-categories'],
  }
);

/**
 * Get portfolio data (projects only)
 * Cache: 1 ora
 */
export const getPortfolioData = unstable_cache(
  async () => {
    try {
      const projects = await getProjects();

      return {
        projects,
        _metadata: {
          projectsCount: projects.length,
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      console.error('Unexpected error fetching portfolio data:', error);
      return {
        projects: [],
        _metadata: {
          projectsCount: 0,
          timestamp: new Date().toISOString(),
        },
      };
    }
  },
  ['portfolio-data'],
  {
    revalidate: 3600, // 1 ora
    tags: ['portfolio-data', 'projects'],
  }
);

// ============================================
// CACHE UTILITIES
// ============================================

/**
 * Revalidate specific tags
 * Usa questa funzione dall'admin per invalidare la cache
 */
export async function revalidateTags(tags: string[]) {
  'use server';
  const { revalidateTag } = await import('next/cache');

  for (const tag of tags) {
    revalidateTag(tag);
  }

  console.log('✅ Revalidated tags:', tags);
}

/**
 * Revalidate all data
 */
export async function revalidateAll() {
  'use server';
  await revalidateTags([
    'projects',
    'hero-projects',
    'service-categories',
    'home-data',
    'portfolio-data',
  ]);

  console.log('✅ Revalidated all data');
}
