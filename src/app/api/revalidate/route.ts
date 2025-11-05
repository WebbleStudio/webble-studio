import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { apiCache, cacheKeys } from '@/lib/apiCache';

// POST - Revalida le pagine specificate
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paths, invalidateCache = false } = body;

    // Validazione
    if (!paths || !Array.isArray(paths)) {
      return NextResponse.json({ error: 'paths array is required' }, { status: 400 });
    }

    // Invalida tutte le cache se richiesto
    if (invalidateCache) {
      console.log('🔄 Invalidating all caches...');

      // Invalida cache API
      apiCache.invalidate(cacheKeys.projects());
      apiCache.invalidate(cacheKeys.heroProjects());
      apiCache.invalidate(cacheKeys.serviceCategories());
      apiCache.invalidate(cacheKeys.homeData());

      console.log('✅ All API caches invalidated');
    }

    // Revalida tutte le pagine specificate
    const revalidatedPaths: string[] = [];
    const failedPaths: { path: string; error: string }[] = [];

    for (const path of paths) {
      try {
        // Revalida sia la pagina che il layout
        revalidatePath(path, 'page');
        
        // Prova anche a revalidare il layout se è una pagina
        if (!path.includes('/layout')) {
          try {
            revalidatePath(path, 'layout');
          } catch (layoutError) {
            // Ignora errori di layout se non esiste
            console.log(`ℹ️ No layout to revalidate for: ${path}`);
          }
        }
        
        revalidatedPaths.push(path);
        console.log(`✅ Revalidated path: ${path}`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`❌ Error revalidating path ${path}:`, errorMessage);
        failedPaths.push({ path, error: errorMessage });
      }
    }

    // Se tutte le revalidazioni falliscono, restituisci un errore
    if (revalidatedPaths.length === 0 && paths.length > 0) {
      return NextResponse.json(
        {
          error: 'All path revalidations failed',
          failedPaths,
          cacheInvalidated: invalidateCache,
        },
        { status: 500 }
      );
    }

    // Se almeno una revalidazione è riuscita, restituisci successo (anche con alcuni fallimenti)
    return NextResponse.json(
      {
        revalidated: true,
        paths: revalidatedPaths,
        failedPaths: failedPaths.length > 0 ? failedPaths : undefined,
        cacheInvalidated: invalidateCache,
        timestamp: new Date().toISOString(),
      },
      {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
          'CDN-Cache-Control': 'no-cache',
          'Vercel-CDN-Cache-Control': 'no-cache',
        },
      }
    );
  } catch (error) {
    console.error('Error in revalidate route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

