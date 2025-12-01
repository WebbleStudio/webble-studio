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
              const filename = `projects/project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.jpg`;

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
        // Prima recupera i progetti per ottenere gli URL delle immagini
        const { data: projectsToDelete, error: fetchError } = await supabase
          .from('projects')
          .select('id, image_url')
          .in('id', deletes);

        if (fetchError) {
          console.error('Error fetching projects to delete:', fetchError);
          results.errors.push(`Failed to fetch projects: ${fetchError.message}`);
        } else {
          // Elimina le immagini dallo storage
          for (const project of projectsToDelete || []) {
            if (project.image_url) {
              try {
                // Estrai il path dall'URL
                // URL format: https://xxx.supabase.co/storage/v1/object/public/projects/projects/project-xxx.jpg
                // Path da estrarre: projects/project-xxx.jpg (senza il primo 'projects/' perché il bucket è già specificato)
                const url = new URL(project.image_url);
                const pathParts = url.pathname.split('/').filter(p => p); // Rimuovi stringhe vuote
                const storageIndex = pathParts.indexOf('public');
                
                if (storageIndex !== -1 && storageIndex < pathParts.length - 1) {
                  // Prendi tutto dopo 'public/'
                  const fullPath = pathParts.slice(storageIndex + 1).join('/');
                  
                  // Se il path inizia con 'projects/', rimuovilo perché il bucket è già specificato in from('projects')
                  let filePath = fullPath;
                  if (filePath.startsWith('projects/')) {
                    filePath = filePath.substring('projects/'.length);
                  }
                  
                  console.log(`🗑️ Attempting to delete image for project ${project.id}:`, {
                    originalUrl: project.image_url,
                    extractedPath: filePath,
                    fullPath: fullPath
                  });

                  // Elimina il file dallo storage
                  const { error: deleteImageError } = await supabase.storage
                    .from('projects')
                    .remove([filePath]);

                  if (deleteImageError) {
                    console.error(`❌ Error deleting image for project ${project.id}:`, deleteImageError);
                    // Non blocchiamo l'eliminazione del progetto se l'immagine non viene trovata
                    if (!deleteImageError.message.includes('not found')) {
                      results.errors.push(`Image deletion failed for project ${project.id}: ${deleteImageError.message}`);
                    }
                  } else {
                    console.log(`✅ Deleted image for project ${project.id}: ${filePath}`);
                  }
                } else {
                  console.warn(`⚠️ Could not extract path from URL for project ${project.id}:`, project.image_url);
                }
              } catch (imageError) {
                console.error(`❌ Error processing image deletion for project ${project.id}:`, imageError);
                // Continua anche se c'è un errore con l'immagine
              }
            } else {
              console.log(`ℹ️ Project ${project.id} has no image_url to delete`);
            }
          }

          // Ora elimina i record dal database
        const { error: deleteError } = await supabase.from('projects').delete().in('id', deletes);

        if (deleteError) {
          console.error('Delete error:', deleteError);
          results.errors.push(`Delete failed: ${deleteError.message}`);
        } else {
          results.deleted = deletes.length;
          console.log(`✅ Deleted ${deletes.length} projects`);
          }
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

        // Se c'è un cambio di immagine (image_url è presente), elimina la vecchia
        if (updateData.image_url) {
          try {
            // Recupera il progetto corrente per ottenere la vecchia immagine
            const { data: currentProject, error: fetchError } = await supabase
              .from('projects')
              .select('image_url')
              .eq('id', id)
              .single();

            if (!fetchError && currentProject?.image_url) {
              // Estrai il path dell'immagine vecchia
              try {
                const url = new URL(currentProject.image_url);
                const pathParts = url.pathname.split('/').filter(p => p); // Rimuovi stringhe vuote
                const storageIndex = pathParts.indexOf('public');
                
                if (storageIndex !== -1 && storageIndex < pathParts.length - 1) {
                  const fullPath = pathParts.slice(storageIndex + 1).join('/');
                  
                  // Se il path inizia con 'projects/', rimuovilo perché il bucket è già specificato
                  let oldImagePath = fullPath;
                  if (oldImagePath.startsWith('projects/')) {
                    oldImagePath = oldImagePath.substring('projects/'.length);
                  }
                  
                  console.log(`🔄 Replacing image for project ${id}, deleting old:`, oldImagePath);
                  
                  // Elimina l'immagine vecchia
                  const { error: deleteOldImageError } = await supabase.storage
                    .from('projects')
                    .remove([oldImagePath]);

                  if (deleteOldImageError && !deleteOldImageError.message.includes('not found')) {
                    console.error(`❌ Error deleting old image for project ${id}:`, deleteOldImageError);
                  } else {
                    console.log(`✅ Deleted old image for project ${id}: ${oldImagePath}`);
                  }
                }
              } catch (imageError) {
                console.error(`❌ Error processing old image deletion for ${id}:`, imageError);
                // Continua anche se c'è un errore con l'eliminazione dell'immagine vecchia
              }
            }
          } catch (error) {
            console.error(`Error handling image replacement for ${id}:`, error);
            // Continua anche se c'è un errore
          }
        }

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

    // 5. REVALIDAZIONE AUTOMATICA - Invalida cache delle pagine che mostrano progetti
    try {
      console.log('🔄 Auto-revalidating paths after project changes...');
      revalidatePath('/portfolio', 'page');
      revalidatePath('/portfolio', 'layout');
      revalidatePath('/', 'page');
      revalidatePath('/', 'layout');
      console.log('✅ Auto-revalidation completed');
    } catch (revalidateError) {
      console.error('⚠️ Auto-revalidation failed (non-critical):', revalidateError);
      // Non bloccare la risposta se la revalidazione fallisce
    }

    // Le modifiche saranno visibili immediatamente perché le API non hanno cache server
    // La cache client-side (localStorage) viene invalidata quando l'admin preme "Aggiorna sito"

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
          Pragma: 'no-cache',
          Expires: '0',
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
