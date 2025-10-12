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
      return NextResponse.json(
        { error: 'paths array is required' },
        { status: 400 }
      );
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
    
    for (const path of paths) {
      try {
        revalidatePath(path);
        revalidatedPaths.push(path);
      } catch (error) {
        console.error(`Error revalidating path ${path}:`, error);
      }
    }

    return NextResponse.json({
      revalidated: true,
      paths: revalidatedPaths,
      cacheInvalidated: invalidateCache,
      timestamp: new Date().toISOString(),
    }, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'CDN-Cache-Control': 'no-cache',
        'Vercel-CDN-Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('Error in revalidate route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

