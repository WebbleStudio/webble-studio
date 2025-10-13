import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// ISR Configuration: Revalidate ogni ora
export const revalidate = 3600;
export const runtime = 'edge';

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

    // Cache Edge ottimizzata: 1 ora cache, rivalidazione in background per 1 giorno
    return NextResponse.json(portfolioData, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        'CDN-Cache-Control': 'public, s-maxage=3600',
        'Vercel-CDN-Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Unexpected error in portfolio-data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
