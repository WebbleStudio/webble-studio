import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// GET: Ottieni tutti i progetti ordinati per posizione
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('order_position', { ascending: true }); // Ordina per posizione

    if (error) {
      console.error('Error fetching projects:', error);
      return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST: Crea nuovo progetto con upload immagine
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const categoriesJson = formData.get('categories') as string;
    const description = formData.get('description') as string;
    const link = formData.get('link') as string;
    const file = formData.get('file') as File;

    // Parse categories array
    let categories: string[] = [];
    try {
      categories = JSON.parse(categoriesJson);
    } catch (error) {
      return NextResponse.json({ error: 'Invalid categories format' }, { status: 400 });
    }

    // Validazione input
    if (!title || !categories.length || !file) {
      return NextResponse.json(
        { error: 'Title, categories, and file are required' },
        { status: 400 }
      );
    }

    // Ottieni la prossima posizione disponibile
    const { data: maxOrderData, error: maxOrderError } = await supabase
      .from('projects')
      .select('order_position')
      .order('order_position', { ascending: false })
      .limit(1);

    if (maxOrderError) {
      console.error('Error getting max order:', maxOrderError);
      return NextResponse.json({ error: 'Failed to determine project position' }, { status: 500 });
    }

    const nextOrderPosition =
      maxOrderData && maxOrderData.length > 0 ? maxOrderData[0].order_position + 1 : 0;

    // Genera nome file unico
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `projects/${fileName}`;

    // Upload immagine su Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('projects')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
    }

    // Ottieni URL pubblico dell'immagine
    const {
      data: { publicUrl },
    } = supabase.storage.from('projects').getPublicUrl(filePath);

    // Salva progetto nel database con categorie multiple e ordine
    console.log('Attempting to insert project with data:', {
      title,
      categories,
      description,
      link,
      order_position: nextOrderPosition,
    });

    const { data: projectData, error: dbError } = await supabase
      .from('projects')
      .insert({
        title,
        categories,
        description,
        image_url: publicUrl,
        link: link || null,
        order_position: nextOrderPosition,
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error details:', dbError);
      console.error('Error code:', dbError.code);
      console.error('Error message:', dbError.message);
      console.error('Error details:', dbError.details);
      // Se salvataggio DB fallisce, elimina l'immagine
      await supabase.storage.from('projects').remove([filePath]);
      return NextResponse.json(
        {
          error: 'Failed to save project',
          details: dbError.message,
          code: dbError.code,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(projectData, { status: 201 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
