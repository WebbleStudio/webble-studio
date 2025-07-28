import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// DELETE: Elimina progetto per ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id;

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    // Prima ottieni il progetto per avere l'URL dell'immagine
    const { data: project, error: fetchError } = await supabase
      .from('projects')
      .select('image_url')
      .eq('id', projectId)
      .single();

    if (fetchError || !project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Estrai il path dell'immagine dall'URL
    const imageUrl = project.image_url;
    const urlParts = imageUrl.split('/');
    const bucketIndex = urlParts.findIndex((part: string) => part === 'projects');
    
    if (bucketIndex !== -1 && bucketIndex < urlParts.length - 1) {
      const imagePath = urlParts.slice(bucketIndex + 1).join('/');
      
      // Elimina l'immagine dal storage
      const { error: storageError } = await supabase.storage
        .from('projects')
        .remove([`projects/${imagePath}`]);
      
      if (storageError) {
        console.warn('Warning: Failed to delete image from storage:', storageError);
      }
    }

    // Elimina il progetto dal database
    const { error: deleteError } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);

    if (deleteError) {
      console.error('Delete error:', deleteError);
      return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT: Aggiorna progetto
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id;
    const body = await request.json();
    const { title, categories, description, link } = body;

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    // Aggiorna il progetto
    const { data: updatedProject, error: updateError } = await supabase
      .from('projects')
      .update({
        ...(title && { title }),
        ...(categories && { categories }), // Ora gestisce array di categorie
        ...(description !== undefined && { description }),
        ...(link !== undefined && { link: link || null })
      })
      .eq('id', projectId)
      .select()
      .single();

    if (updateError) {
      console.error('Update error:', updateError);
      return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
    }

    if (!updatedProject) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 