import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { revalidatePath } from 'next/cache';
import { apiCache, cacheKeys } from '@/lib/apiCache';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { servicesUpdates = [] } = body;

    console.log('🔄 Services Batch Save:', {
      services: servicesUpdates.length,
    });

    // Salva modifiche Services
    if (servicesUpdates.length > 0) {
      console.log('📝 Saving services updates...');

      for (const update of servicesUpdates) {
        const { id, ...updateData } = update;

        const { error } = await supabase.from('service_categories').update(updateData).eq('id', id);

        if (error) {
          console.error('Error updating service:', error);
          throw new Error(`Failed to update service ${id}: ${error.message || 'Unknown error'}`);
        }
      }

      console.log(`✅ Updated ${servicesUpdates.length} services`);
    }

    // Revalida cache per tutte le pagine interessate
    revalidatePath('/');
    revalidatePath('/api/service-categories');
    revalidatePath('/api/home-data');

    // Invalida cache client-side
    apiCache.invalidate(cacheKeys.serviceCategories());
    apiCache.invalidate(cacheKeys.homeData());

    console.log('🎉 All services changes saved successfully');

    return NextResponse.json({
      success: true,
      message: 'All services changes saved successfully',
      summary: {
        servicesUpdated: servicesUpdates.length,
      },
    });
  } catch (error) {
    console.error('❌ Error in services save-all:', error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
        success: false,
      },
      { status: 500 }
    );
  }
}
