import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// GET: Endpoint aggregato per la home - ritorna tutti i dati in una chiamata
export async function GET() {
  try {
    console.log('🏠 Fetching aggregated home data...');

    // Esegui tutte le query in parallelo per performance
    const [projectsResult, heroProjectsResult, serviceCategoriesResult] = await Promise.all([
      supabase.from('projects').select('*').order('order_position', { ascending: true }),
      supabase.from('hero-projects').select('*').order('position', { ascending: true }),
      supabase.from('service_categories').select('*').order('created_at', { ascending: true }),
    ]);

    // Gestione errori
    if (projectsResult.error) {
      console.error('Error fetching projects:', projectsResult.error);
      return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
    }

    if (heroProjectsResult.error) {
      console.error('Error fetching hero projects:', heroProjectsResult.error);
      return NextResponse.json({ error: 'Failed to fetch hero projects' }, { status: 500 });
    }

    if (serviceCategoriesResult.error) {
      console.error('Error fetching service categories:', serviceCategoriesResult.error);
      return NextResponse.json({ error: 'Failed to fetch service categories' }, { status: 500 });
    }

    const projects = projectsResult.data || [];
    const heroProjects = heroProjectsResult.data || [];
    const serviceCategories = serviceCategoriesResult.data || [];

    // JOIN lato server: arricchisci hero projects con i dati completi dei progetti
    const enrichedHeroProjects = heroProjects.map((hp) => {
      const project = projects.find((p) => p.id === hp.project_id);
      return {
        ...hp,
        project: project || null, // Include l'intero progetto
      };
    });

    // JOIN lato server: arricchisci service categories con i progetti completi
    const enrichedServiceCategories = serviceCategories.map((category) => {
      const categoryProjects = projects.filter((project) =>
        category.images.includes(project.id)
      );
      return {
        ...category,
        projects: categoryProjects, // Include array di progetti completi
      };
    });

    // Risposta aggregata
    const homeData = {
      projects,
      heroProjects: enrichedHeroProjects,
      serviceCategories: enrichedServiceCategories,
      _metadata: {
        projectsCount: projects.length,
        heroProjectsCount: enrichedHeroProjects.length,
        serviceCategoriesCount: enrichedServiceCategories.length,
        timestamp: new Date().toISOString(),
      },
    };

    console.log('✅ Home data aggregated:', {
      projects: projects.length,
      heroProjects: enrichedHeroProjects.length,
      serviceCategories: enrichedServiceCategories.length,
    });

    // Cache 3 giorni (259200 secondi) per performance ottimali
    // stale-while-revalidate 6 giorni per servire contenuto stale mentre rivalidata
    return NextResponse.json(homeData, {
      headers: {
        'Cache-Control': 'public, s-maxage=259200, stale-while-revalidate=518400',
      },
    });
  } catch (error) {
    console.error('Unexpected error in home-data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

