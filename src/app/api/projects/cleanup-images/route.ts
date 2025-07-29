import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: NextRequest) {
  try {
    // 1. Ottieni tutte le immagini dal bucket
    const { data: bucketFiles, error: bucketError } = await supabase.storage
      .from('projects')
      .list('projects/', {
        limit: 1000,
        offset: 0,
      });

    if (bucketError) {
      console.error('Error listing bucket files:', bucketError);
      return NextResponse.json({ error: 'Failed to list bucket files' }, { status: 500 });
    }

    // 2. Ottieni tutti i progetti dal database
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('image_url');

    if (projectsError) {
      console.error('Error fetching projects:', projectsError);
      return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
    }

    // 4. Raccogli tutte le URL delle immagini utilizzate
    const usedImages = new Set<string>();

    // Aggiungi immagini dei progetti
    projects?.forEach((project) => {
      if (project.image_url) {
        // Estrai il path dal URL completo
        const urlParts = project.image_url.split('/');
        const projectsIndex = urlParts.findIndex((part: string) => part === 'projects');
        if (projectsIndex !== -1 && projectsIndex < urlParts.length - 1) {
          const imagePath = urlParts.slice(projectsIndex).join('/');
          usedImages.add(imagePath);
        }
      }
    });

    // 5. Trova le immagini non utilizzate (solo analisi, non eliminazione)
    const unusedFiles =
      bucketFiles?.filter((file) => !usedImages.has(`projects/${file.name}`)) || [];

    return NextResponse.json({
      success: true,
      analysis: {
        totalFiles: bucketFiles?.length || 0,
        usedImages: usedImages.size,
        unusedFiles: unusedFiles.length,
        usedImageNames: Array.from(usedImages),
        unusedFileNames: unusedFiles.map((file) => `projects/${file.name}`),
      },
      summary: {
        totalFiles: bucketFiles?.length || 0,
        usedImages: usedImages.size,
        unusedFiles: unusedFiles.length,
        spaceToSave: `${((unusedFiles.length / (bucketFiles?.length || 1)) * 100).toFixed(1)}%`,
      },
    });
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json({ error: 'Internal server error during analysis' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // 1. Ottieni tutte le immagini dal bucket
    const { data: bucketFiles, error: bucketError } = await supabase.storage
      .from('projects')
      .list('projects/', {
        limit: 1000,
        offset: 0,
      });

    if (bucketError) {
      console.error('Error listing bucket files:', bucketError);
      return NextResponse.json({ error: 'Failed to list bucket files' }, { status: 500 });
    }

    // 2. Ottieni tutti i progetti dal database
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('image_url');

    if (projectsError) {
      console.error('Error fetching projects:', projectsError);
      return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
    }

    // 4. Raccogli tutte le URL delle immagini utilizzate
    const usedImages = new Set<string>();

    // Aggiungi immagini dei progetti
    projects?.forEach((project) => {
      if (project.image_url) {
        // Estrai il path dal URL completo
        const urlParts = project.image_url.split('/');
        const projectsIndex = urlParts.findIndex((part: string) => part === 'projects');
        if (projectsIndex !== -1 && projectsIndex < urlParts.length - 1) {
          const imagePath = urlParts.slice(projectsIndex).join('/');
          usedImages.add(imagePath);
        }
      }
    });

    // 5. Trova le immagini non utilizzate
    const unusedFiles =
      bucketFiles?.filter((file) => !usedImages.has(`projects/${file.name}`)) || [];

    // 6. Elimina le immagini non utilizzate
    const deletedFiles: string[] = [];
    const errors: string[] = [];

    for (const file of unusedFiles) {
      try {
        const imagePath = `projects/${file.name}`;
        const { error: deleteError } = await supabase.storage.from('projects').remove([imagePath]);

        if (deleteError) {
          console.error(`Error deleting ${imagePath}:`, deleteError);
          errors.push(`${imagePath}: ${deleteError.message}`);
        } else {
          deletedFiles.push(imagePath);
        }
      } catch (error) {
        console.error(`Error deleting projects/${file.name}:`, error);
        errors.push(`projects/${file.name}: Unknown error`);
      }
    }

    return NextResponse.json({
      success: true,
      totalFiles: bucketFiles?.length || 0,
      usedImages: usedImages.size,
      unusedFiles: unusedFiles.length,
      deletedFiles,
      errors,
      summary: {
        totalFiles: bucketFiles?.length || 0,
        usedImages: usedImages.size,
        deletedFiles: deletedFiles.length,
        errors: errors.length,
      },
    });
  } catch (error) {
    console.error('Cleanup error:', error);
    return NextResponse.json({ error: 'Internal server error during cleanup' }, { status: 500 });
  }
}
