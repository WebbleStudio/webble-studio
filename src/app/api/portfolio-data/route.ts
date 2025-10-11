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

    // Cache 3 giorni (259200 secondi) per performance ottimali
    // stale-while-revalidate 6 giorni per servire contenuto stale mentre rivalidata
    return NextResponse.json(portfolioData, {
      headers: {
        'Cache-Control': 'public, s-maxage=259200, stale-while-revalidate=518400',
      },
    });
  } catch (error) {
    console.error('Unexpected error in portfolio-data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

