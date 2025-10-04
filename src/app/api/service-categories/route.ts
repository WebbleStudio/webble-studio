import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// GET - Recupera tutte le categorie di servizi
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('service_categories')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching service categories:', error);
      return NextResponse.json({ error: 'Failed to fetch service categories' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Aggiorna le immagini di una categoria di servizio
export async function PUT(request: NextRequest) {
  try {
    const { slug, images } = await request.json();

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    if (!Array.isArray(images)) {
      return NextResponse.json({ error: 'Images must be an array' }, { status: 400 });
    }

    // Verifica che non ci siano più di 3 immagini
    if (images.length > 3) {
      return NextResponse.json({ error: 'Maximum 3 images allowed per category' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('service_categories')
      .update({
        images,
        updated_at: new Date().toISOString(),
      })
      .eq('slug', slug)
      .select()
      .single();

    if (error) {
      console.error('Error updating service category:', error);
      return NextResponse.json({ error: 'Failed to update service category' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
