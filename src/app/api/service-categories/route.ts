import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabaseClient';
import { revalidatePath } from 'next/cache';

// GET - Recupera tutte le categorie di servizi
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const init = searchParams.get('init');

    // Se init=true, inizializza le categorie se non esistono
    if (init === 'true') {
      // Per inizializzazione, usa supabaseAdmin se disponibile
      const dbClient = supabaseAdmin || supabase;
      
      // Prima verifica se le categorie esistono già
      const { data: existingCategories, error: checkError } = await dbClient
        .from('service_categories')
        .select('slug')
        .limit(1);

      if (checkError) {
        console.error('Error checking existing categories:', checkError);
        return NextResponse.json(
          {
            error: 'Database connection error. Please check if the service_categories table exists.',
            details: checkError.message,
          },
          { status: 500 }
        );
      }

      // Se non esistono categorie, inizializza
      if (!existingCategories || existingCategories.length === 0) {
        // Verifica che abbiamo i permessi per inizializzare
        if (!supabaseAdmin) {
          return NextResponse.json(
            {
              error: 'Initialization requires admin privileges. Service role key not configured.',
            },
            { status: 403 }
          );
        }

        const serviceCategories = [
          {
            slug: 'ui-ux-design',
            name: 'UI/UX Design',
            images: [],
          },
          {
            slug: 'project-management',
            name: 'Project Management',
            images: [],
          },
          {
            slug: 'advertising',
            name: 'Advertising & SMM',
            images: [],
          },
          {
            slug: 'social-media-design',
            name: 'Developing Web/App',
            images: [],
          },
        ];

        const { data: initData, error: initError } = await supabaseAdmin
          .from('service_categories')
          .upsert(serviceCategories, {
            onConflict: 'slug',
            ignoreDuplicates: false,
          })
          .select();

        if (initError) {
          console.error('Error initializing service categories:', initError);
          return NextResponse.json(
            {
              error: 'Failed to initialize service categories',
              details: initError.message,
            },
            { status: 500 }
          );
        }

        return NextResponse.json({
          message: 'Service categories initialized successfully',
          data: initData,
        });
      }
    }

    const { data, error } = await supabase
      .from('service_categories')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching service categories:', error);
      return NextResponse.json({ error: 'Failed to fetch service categories' }, { status: 500 });
    }

    // Nessuna cache - aggiornamenti in tempo reale
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

    // Revalida le pagine che mostrano le service categories per aggiornare la cache
    // Invalida solo cache client-side (non revalida automaticamente le pagine)
    // Le pagine verranno revalidate solo quando l'admin preme "Aggiorna sito"

    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
