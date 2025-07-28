import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'background' o 'navigation'
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!type || !['background', 'navigation'].includes(type)) {
      return NextResponse.json({ error: 'Invalid type. Must be "background" or "navigation"' }, { status: 400 });
    }

    // Verifica che sia un'immagine
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }

    // Limita dimensione file (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 });
    }

    // Genera nome file unico
    const fileExt = file.name.split('.').pop();
    const fileName = `${type}_${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `hero-projects/${fileName}`;

    // Upload file a Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('projects') // Usa lo stesso bucket dei progetti
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    // Genera URL pubblico
    const { data: urlData } = supabase.storage
      .from('projects')
      .getPublicUrl(filePath);

    return NextResponse.json({
      message: 'File uploaded successfully',
      url: urlData.publicUrl,
      fileName: fileName,
      filePath: filePath
    });

  } catch (error) {
    console.error('Error in POST /api/hero-projects/upload:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Elimina un'immagine dal storage
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get('filePath');

    if (!filePath) {
      return NextResponse.json({ error: 'filePath parameter is required' }, { status: 400 });
    }

    const { error } = await supabase.storage
      .from('projects')
      .remove([filePath]);

    if (error) {
      console.error('Error deleting file:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'File deleted successfully' });

  } catch (error) {
    console.error('Error in DELETE /api/hero-projects/upload:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 