import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// GET: Endpoint aggregato per portfolio - ritorna solo i progetti
export async function GET() {
  try {
    console.log('📁 Fetching portfolio data...');

    // Fetch progetti ordinati per posizione
    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .order('order_position', { ascending: true });

    // Gestione errori
    if (error) {
      console.error('Error fetching projects:', error);
      return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
    }

    const portfolioData = {
      projects: projects || [],
      _metadata: {
        projectsCount: projects?.length || 0,
        timestamp: new Date().toISOString(),
      },
    };

    console.log('✅ Portfolio data fetched:', {
      projects: projects?.length || 0,
    });

    // Cache Edge ottimizzata per Vercel
    return NextResponse.json(portfolioData, {
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800, max-age=3600',
        'CDN-Cache-Control': 'public, s-maxage=86400',
        'Vercel-CDN-Cache-Control': 'public, s-maxage=86400',
        'Vercel-Cache-Control': 'public, s-maxage=86400',
      },
    });
  } catch (error) {
    console.error('Unexpected error in portfolio-data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

