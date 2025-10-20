import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// GET - Recupera tutti gli highlights
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('highlights')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching highlights:', error);
      return NextResponse.json({ error: 'Failed to fetch highlights' }, { status: 500 });
    }

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

// POST - Crea un nuovo highlight
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { project_id, descriptions, descriptions_en, images, background_image, project_date } = body;

    if (!project_id) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('highlights')
      .insert({
        project_id,
        descriptions: descriptions || [],
        descriptions_en: descriptions_en || [],
        images: images || [],
        background_image,
        project_date,
      } as any)
      .select()
      .single();

    if (error) {
      console.error('Error creating highlight:', error);
      return NextResponse.json({ error: 'Failed to create highlight' }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Aggiorna un highlight
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, project_id, descriptions, descriptions_en, images, background_image, project_date } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (project_id !== undefined) updateData.project_id = project_id;
    if (descriptions !== undefined) updateData.descriptions = descriptions;
    if (descriptions_en !== undefined) updateData.descriptions_en = descriptions_en;
    if (images !== undefined) updateData.images = images;
    if (background_image !== undefined) updateData.background_image = background_image;
    if (project_date !== undefined) updateData.project_date = project_date;

    const { data, error } = await (supabase
      .from('highlights') as any)
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating highlight:', error);
      return NextResponse.json({ error: 'Failed to update highlight' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Elimina un highlight
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('highlights')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting highlight:', error);
      return NextResponse.json({ error: 'Failed to delete highlight' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Highlight deleted successfully' });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
