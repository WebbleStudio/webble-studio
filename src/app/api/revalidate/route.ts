import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

// POST - Revalida le pagine specificate
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paths } = body;

    // Validazione
    if (!paths || !Array.isArray(paths)) {
      return NextResponse.json(
        { error: 'paths array is required' },
        { status: 400 }
      );
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
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in revalidate route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

