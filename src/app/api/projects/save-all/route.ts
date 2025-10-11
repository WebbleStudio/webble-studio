import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { revalidatePath } from 'next/cache';

interface NewProject {
  title: string;
  title_en?: string;
  description: string;
  description_en?: string;
  categories: string[];
  link?: string | null;
  image_file?: string; // Base64 image data
  order_position: number;
}

interface ProjectUpdate {
  id: string;
  title?: string;
  title_en?: string;
  description?: string;
  description_en?: string;
  categories?: string[];
  link?: string | null;
  image_url?: string;
  order_position?: number;
}

interface SaveAllRequest {
  newProjects: NewProject[];
  updates: ProjectUpdate[];
  deletes: string[];
  reorder?: { id: string; order_position: number }[];
}

export async function POST(request: NextRequest) {
  try {
    const body: SaveAllRequest = await request.json();
    const { newProjects = [], updates = [], deletes = [], reorder = [] } = body;

    console.log('🚀 Save All Request:', {
      newProjects: newProjects.length,
      updates: updates.length,
      deletes: deletes.length,
      reorder: reorder.length,
    });

    const results = {
      newProjectsCreated: 0,
      updated: 0,
      deleted: 0,
      reordered: 0,
      errors: [] as string[],
    };

    // 1. UPLOAD IMMAGINI E CREA NUOVI PROGETTI
    if (newProjects.length > 0) {
      try {
        for (const project of newProjects) {
          let imageUrl = '';

          // Se c'è un'immagine base64, caricala
          if (project.image_file && project.image_file.startsWith('data:image/')) {
            try {
              // Converti base64 in blob
              const response = await fetch(project.image_file);
              const blob = await response.blob();
              const filename = `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.jpg`;

              // Upload nel bucket Supabase
              const { data: uploadData, error: uploadError } = await supabase.storage
                .from('projects')
                .upload(filename, blob, {
                  contentType: 'image/jpeg',
                  cacheControl: '3600',
                  upsert: false,
                });

              if (uploadError) {
                throw new Error(`Upload failed: ${uploadError.message}`);
              }

              // Ottieni URL pubblico
              const { data: urlData } = supabase.storage
                .from('projects')
                .getPublicUrl(uploadData.path);

              imageUrl = urlData.publicUrl;
            } catch (uploadError) {
              console.error('Error uploading image for new project:', uploadError);
              results.errors.push(`Image upload failed for "${project.title}"`);
              continue; // Skip this project
            }
          }

          // Inserisci il progetto
          const { error: insertError } = await supabase.from('projects').insert({
            title: project.title,
            title_en: project.title_en,
            description: project.description,
            description_en: project.description_en,
            categories: project.categories,
            link: project.link,
            image_url: imageUrl,
            order_position: project.order_position,
          });

          if (insertError) {
            console.error(`Insert error for ${project.title}:`, insertError);
            results.errors.push(`Insert failed for "${project.title}": ${insertError.message}`);
          } else {
            results.newProjectsCreated++;
          }
        }
      } catch (error) {
        console.error('New projects exception:', error);
        results.errors.push(`New projects exception: ${error}`);
      }
    }

    // 2. ELIMINAZIONI
    if (deletes.length > 0) {
      try {
        const { error: deleteError } = await supabase
          .from('projects')
          .delete()
          .in('id', deletes);

        if (deleteError) {
          console.error('Delete error:', deleteError);
          results.errors.push(`Delete failed: ${deleteError.message}`);
        } else {
          results.deleted = deletes.length;
          console.log(`✅ Deleted ${deletes.length} projects`);
        }
      } catch (error) {
        console.error('Delete exception:', error);
        results.errors.push(`Delete exception: ${error}`);
      }
    }

    // 3. AGGIORNAMENTI
    for (const update of updates) {
      try {
        const { id, ...updateData } = update;

        // Rimuovi campi undefined
        const cleanData = Object.fromEntries(
          Object.entries(updateData).filter(([_, v]) => v !== undefined)
        );

        const { error: updateError } = await supabase
          .from('projects')
          .update(cleanData)
          .eq('id', id);

        if (updateError) {
          console.error(`Update error for ${id}:`, updateError);
          results.errors.push(`Update failed for ${id}: ${updateError.message}`);
        } else {
          results.updated++;
        }
      } catch (error) {
        console.error(`Update exception for ${update.id}:`, error);
        results.errors.push(`Update exception for ${update.id}: ${error}`);
      }
    }

    // 4. RIORDINAMENTO
    if (reorder.length > 0) {
      for (const item of reorder) {
        try {
          const { error: reorderError } = await supabase
            .from('projects')
            .update({ order_position: item.order_position })
            .eq('id', item.id);

          if (reorderError) {
            console.error(`Reorder error for ${item.id}:`, reorderError);
            results.errors.push(`Reorder failed for ${item.id}: ${reorderError.message}`);
          } else {
            results.reordered++;
          }
        } catch (error) {
          console.error(`Reorder exception for ${item.id}:`, error);
          results.errors.push(`Reorder exception for ${item.id}: ${error}`);
        }
      }
    }

    console.log('✅ Save All Results:', results);

    // Revalida tutte le pagine e endpoint aggregati
    revalidatePath('/');
    revalidatePath('/portfolio');
    revalidatePath('/api/projects');
    revalidatePath('/api/home-data');
    revalidatePath('/api/portfolio-data');

    const success = results.errors.length === 0;

    return NextResponse.json(
      {
        success,
        results,
        message: success
          ? `Saved: ${results.newProjectsCreated} new, ${results.updated} updated, ${results.deleted} deleted, ${results.reordered} reordered`
          : `Completed with errors`,
      },
      {
        status: success ? 200 : 207,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  } catch (error) {
    console.error('Unexpected error in save-all:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

