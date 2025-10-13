import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// GET: Ottieni tutti i progetti ordinati per posizione
// NOTA: Questa API è mantenuta per compatibilità ma non è più utilizzata
// I progetti vengono ora serviti tramite /api/portfolio-data (aggregazione)
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('order_position', { ascending: true });

    if (error) {
      console.error('Error fetching projects:', error);
      return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
    }

    // Nessuna cache - aggiornamenti in tempo reale
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
