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

    // Cache Edge DISABILITATA per evitare problemi con revalidation
    // Usa solo cache client-side (localStorage)
    return NextResponse.json(portfolioData, {
      headers: {
        'Cache-Control': 'public, max-age=0, must-revalidate',
        'CDN-Cache-Control': 'no-cache',
        'Vercel-CDN-Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('Unexpected error in portfolio-data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
