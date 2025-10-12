import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { apiCache, cacheKeys } from '@/lib/apiCache';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { highlightsUpdates = [] } = body;

    console.log('🔄 Highlights Batch Save:', {
      highlights: highlightsUpdates.length,
    });

    // Salva modifiche Highlights
    if (highlightsUpdates.length > 0) {
      console.log('📝 Saving highlights updates...');

      for (const update of highlightsUpdates) {
        const { id, ...updateData } = update;

        const { error } = await supabase.from('hero-projects').update(updateData).eq('id', id);

        if (error) {
          console.error('Error updating highlight:', error);
          throw new Error(`Failed to update highlight ${id}: ${error.message}`);
        }
      }

      console.log(`✅ Updated ${highlightsUpdates.length} highlights`);
    }

    // Invalida solo cache client-side (non revalida automaticamente le pagine)
    apiCache.invalidate(cacheKeys.heroProjects());
    apiCache.invalidate(cacheKeys.homeData());

    console.log('🎉 All highlights changes saved successfully');

    return NextResponse.json({
      success: true,
      message: 'All highlights changes saved successfully',
      summary: {
        highlightsUpdated: highlightsUpdates.length,
      },
    });
  } catch (error) {
    console.error('❌ Error in highlights save-all:', error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
        success: false,
      },
      { status: 500 }
    );
  }
}
