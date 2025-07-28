import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// PUT: Riordina progetti
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectIds } = body;

    if (!projectIds || !Array.isArray(projectIds)) {
      return NextResponse.json({ error: 'Project IDs array is required' }, { status: 400 });
    }

    console.log('Reordering projects:', projectIds);

    // Aggiorna order_position per ogni progetto
    const updatePromises = projectIds.map((projectId: string, index: number) => {
      return supabase.from('projects').update({ order_position: index }).eq('id', projectId);
    });

    // Esegui tutti gli aggiornamenti in parallelo
    const results = await Promise.all(updatePromises);

    // Controlla se ci sono stati errori
    const errors = results.filter((result) => result.error);
    if (errors.length > 0) {
      console.error('Errors during reorder:', errors);
      return NextResponse.json(
        { error: 'Failed to reorder some projects', details: errors },
        { status: 500 }
      );
    }

    // Verifica che tutti gli aggiornamenti siano andati a buon fine
    const successfulUpdates = results.filter((result) => !result.error);
    console.log(`Successfully reordered ${successfulUpdates.length} projects`);

    return NextResponse.json({
      message: 'Projects reordered successfully',
      updated: successfulUpdates.length,
    });
  } catch (error) {
    console.error('Unexpected error during reorder:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
