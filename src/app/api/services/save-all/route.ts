import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';
import { apiCache, cacheKeys } from '@/lib/apiCache';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
  try {
    // Verifica autenticazione admin
    const session = await auth();
    if (!session || !session.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Accesso non autorizzato', success: false },
        { status: 401 }
      );
    }

    // Verifica che supabaseAdmin sia configurato
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Service role key non configurata', success: false },
        { status: 500 }
      );
    }

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

        const { error } = await supabaseAdmin.from('service_categories').update(updateData as any).eq('id', id);

        if (error) {
          console.error('Error updating service:', error);
          throw new Error(`Failed to update service ${id}: ${error.message || 'Unknown error'}`);
        }
      }

      console.log(`✅ Updated ${servicesUpdates.length} services`);
    }

    // Invalida cache client-side
    apiCache.invalidate(cacheKeys.serviceCategories());
    apiCache.invalidate(cacheKeys.homeData());

    // Revalidazione automatica - Invalida cache delle pagine che mostrano services (homepage)
    try {
      console.log('🔄 Auto-revalidating paths after services changes...');
      revalidatePath('/', 'page');
      revalidatePath('/', 'layout');
      console.log('✅ Auto-revalidation completed');
    } catch (revalidateError) {
      console.error('⚠️ Auto-revalidation failed (non-critical):', revalidateError);
    }

    console.log('🎉 All services changes saved successfully');

    return NextResponse.json(
      {
        success: true,
        message: 'All services changes saved successfully',
        summary: {
          servicesUpdated: servicesUpdates.length,
        },
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      }
    );
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
