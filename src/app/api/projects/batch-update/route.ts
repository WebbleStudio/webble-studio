import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { revalidatePath } from 'next/cache';

interface ProjectUpdate {
  id: string;
  title?: string;
  title_en?: string;
  description?: string;
  description_en?: string;
  categories?: string[];
  link?: string | null;
  image_url?: string;
  order_position?: number;
}

interface BatchUpdateRequest {
  updates: ProjectUpdate[];
  deletes: string[];
  reorder?: { id: string; order_position: number }[];
}

export async function POST(request: NextRequest) {
  try {
    const body: BatchUpdateRequest = await request.json();
    const { updates = [], deletes = [], reorder = [] } = body;

    console.log('🔄 Batch Update Request:', {
      updates: updates.length,
      deletes: deletes.length,
      reorder: reorder.length,
    });

    const results = {
      updated: 0,
      deleted: 0,
      reordered: 0,
      errors: [] as string[],
    };

    // 1. ELIMINAZIONI
    if (deletes.length > 0) {
      try {
        const { error: deleteError } = await supabase.from('projects').delete().in('id', deletes);

        if (deleteError) {
          console.error('Delete error:', deleteError);
          results.errors.push(`Delete failed: ${deleteError.message}`);
        } else {
          results.deleted = deletes.length;
          console.log(`✅ Deleted ${deletes.length} projects`);
        }
      } catch (error) {
        console.error('Delete exception:', error);
        results.errors.push(`Delete exception: ${error}`);
      }
    }

    // 2. AGGIORNAMENTI
    for (const update of updates) {
      try {
        const { id, ...updateData } = update;

        // Rimuovi campi undefined
        const cleanData = Object.fromEntries(
          Object.entries(updateData).filter(([_, v]) => v !== undefined)
        );

        const { error: updateError } = await supabase
          .from('projects')
          .update(cleanData)
          .eq('id', id);

        if (updateError) {
          console.error(`Update error for ${id}:`, updateError);
          results.errors.push(`Update failed for ${id}: ${updateError.message}`);
        } else {
          results.updated++;
        }
      } catch (error) {
        console.error(`Update exception for ${update.id}:`, error);
        results.errors.push(`Update exception for ${update.id}: ${error}`);
      }
    }

    // 3. RIORDINAMENTO (se specificato)
    if (reorder.length > 0) {
      for (const item of reorder) {
        try {
          const { error: reorderError } = await supabase
            .from('projects')
            .update({ order_position: item.order_position })
            .eq('id', item.id);

          if (reorderError) {
            console.error(`Reorder error for ${item.id}:`, reorderError);
            results.errors.push(`Reorder failed for ${item.id}: ${reorderError.message}`);
          } else {
            results.reordered++;
          }
        } catch (error) {
          console.error(`Reorder exception for ${item.id}:`, error);
          results.errors.push(`Reorder exception for ${item.id}: ${error}`);
        }
      }
    }

    console.log('✅ Batch Update Results:', results);

    // Revalida tutte le pagine e endpoint aggregati
    // Invalida solo cache client-side (non revalida automaticamente le pagine)
    // Le pagine verranno revalidate solo quando l'admin preme "Aggiorna sito"

    // Restituisci risultato
    const success = results.errors.length === 0;

    return NextResponse.json(
      {
        success,
        results,
        message: success
          ? `Batch update completed: ${results.updated} updated, ${results.deleted} deleted, ${results.reordered} reordered`
          : `Batch update completed with errors`,
      },
      {
        status: success ? 200 : 207, // 207 Multi-Status se ci sono errori parziali
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  } catch (error) {
    console.error('Unexpected error in batch-update:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
