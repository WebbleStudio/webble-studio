import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// GET - Recupera tutti i hero projects
export async function GET() {
  try {
    const { data: heroProjects, error } = await supabase
      .from('hero-projects')
      .select(`
        *,
        projects:project_id (
          id,
          title,
          categories,
          description,
          image_url,
          link
        )
      `)
      .order('position', { ascending: true });

    if (error) {
      console.error('Error fetching hero projects:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(heroProjects);
  } catch (error) {
    console.error('Error in GET /api/hero-projects:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Salva la configurazione completa dei hero projects
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { heroProjects } = body;

    if (!heroProjects || !Array.isArray(heroProjects)) {
      return NextResponse.json({ error: 'heroProjects array is required' }, { status: 400 });
    }

    // Valida che ci siano massimo 3 progetti
    if (heroProjects.length > 3) {
      return NextResponse.json({ error: 'Maximum 3 hero projects allowed' }, { status: 400 });
    }

    // Prima elimina tutti i record esistenti
    const { error: deleteError } = await supabase
      .from('hero-projects')
      .delete()
      .gt('position', 0); // Elimina tutti i record

    if (deleteError) {
      console.error('Error deleting existing hero projects:', deleteError);
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    // Se non ci sono hero projects, restituisci successo
    if (heroProjects.length === 0) {
      return NextResponse.json({ 
        message: 'Hero projects cleared successfully', 
        data: [] 
      });
    }

    // Inserisci i nuovi hero projects uno alla volta per evitare conflitti
    const insertedData = [];
    
    for (let index = 0; index < heroProjects.length; index++) {
      const hp = heroProjects[index];
      const heroProjectData = {
        project_id: hp.projectId,
        position: index + 1,
        descriptions: hp.descriptions || ['', '', ''],
        images: hp.images || [],
        background_image: hp.backgroundImage || ''
      };

      const { data: insertData, error: insertError } = await supabase
        .from('hero-projects')
        .insert([heroProjectData])
        .select()
        .single();

      if (insertError) {
        console.error(`Error inserting hero project at position ${index + 1}:`, insertError);
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }

      if (insertData) {
        insertedData.push(insertData);
      }
    }

    const data = insertedData;

    return NextResponse.json({ 
      message: 'Hero projects saved successfully', 
      data 
    });

  } catch (error) {
    console.error('Error in POST /api/hero-projects:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Elimina tutti i hero projects
export async function DELETE() {
  try {
    const { error } = await supabase
      .from('hero-projects')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Elimina tutti i record

    if (error) {
      console.error('Error deleting hero projects:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'All hero projects deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/hero-projects:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 