import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// POST - Inizializza le categorie di servizi
export async function POST() {
  try {
    // Prima verifica se le categorie esistono già
    const { data: existingCategories, error: checkError } = await supabase
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

    // Se esistono già categorie, restituisci successo
    if (existingCategories && existingCategories.length > 0) {
      return NextResponse.json({
        message: 'Service categories already exist',
        data: existingCategories,
      });
    }

    // Categorie di servizi da inizializzare
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
        name: 'Advertising',
        images: [],
      },
      {
        slug: 'social-media-design',
        name: 'Social Media Design',
        images: [],
      },
    ];

    // Inserisci le categorie nel database
    const { data, error } = await supabase
      .from('service_categories')
      .upsert(serviceCategories, {
        onConflict: 'slug',
        ignoreDuplicates: false,
      })
      .select();

    if (error) {
      console.error('Error initializing service categories:', error);
      return NextResponse.json(
        {
          error: 'Failed to initialize service categories',
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Service categories initialized successfully',
      data,
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
