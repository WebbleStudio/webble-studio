import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params;

    // 1. Recupera il progetto dal database per ottenere l'immagine
    const { data: project, error: fetchError } = await supabase
      .from('projects')
      .select('image_url')
      .eq('id', projectId)
      .single();

    if (fetchError) {
      console.error('Error fetching project:', fetchError);
      return NextResponse.json(
        { error: 'Project not found or error fetching project' },
        { status: 404 }
      );
    }

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // 2. Elimina l'immagine dal bucket se esiste
    if (project.image_url) {
      try {
        // Estrai il path dal URL completo
        const urlParts = project.image_url.split('/');
        const projectsIndex = urlParts.findIndex((part: string) => part === 'projects');
        if (projectsIndex !== -1 && projectsIndex < urlParts.length - 1) {
          // Estrai il path dopo 'projects'
          const imagePath = urlParts.slice(projectsIndex + 1).join('/');

          const { error: deleteImageError } = await supabase.storage
            .from('projects')
            .remove([imagePath]);

          if (deleteImageError) {
            console.error('Error deleting image:', deleteImageError);
            // Non blocchiamo la cancellazione del progetto se l'immagine non esiste
            console.warn('Image deletion failed, but continuing with project deletion');
          } else {
            console.log(`Image deleted successfully: ${imagePath}`);
          }
        }
      } catch (imageError) {
        console.error('Error during image deletion:', imageError);
        // Continua con la cancellazione del progetto
      }
    }

    // 3. Elimina il progetto dal database
    const { error: deleteProjectError } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);

    if (deleteProjectError) {
      console.error('Error deleting project:', deleteProjectError);
      return NextResponse.json(
        { error: 'Failed to delete project from database' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Project and associated image deleted successfully',
      deletedProjectId: projectId,
    });
  } catch (error) {
    console.error('Delete project error:', error);
    return NextResponse.json(
      { error: 'Internal server error during project deletion' },
      { status: 500 }
    );
  }
}

// PUT: Aggiorna progetto
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: projectId } = await params;
    const body = await request.json();
    const { title, categories, description, link } = body;

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    // Aggiorna il progetto
    const { data: updatedProject, error: updateError } = await supabase
      .from('projects')
      .update({
        ...(title && { title }),
        ...(categories && { categories }), // Ora gestisce array di categorie
        ...(description !== undefined && { description }),
        ...(link !== undefined && { link: link || null }),
      })
      .eq('id', projectId)
      .select()
      .single();

    if (updateError) {
      console.error('Update error:', updateError);
      return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
    }

    if (!updatedProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
