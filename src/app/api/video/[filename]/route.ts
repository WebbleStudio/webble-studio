import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  const range = request.headers.get('range');

  try {
    // Check if file exists first (lighter operation)
    const { data: fileData, error: checkError } = await supabase.storage
      .from('videos')
      .list('', { search: filename });

    if (checkError) {
      console.error('❌ Error checking video existence:', checkError);
      return NextResponse.json({ error: 'Storage error', details: checkError }, { status: 500 });
    }

    if (!fileData?.some((file) => file.name === filename)) {
      // Non loggare come errore - è normale che il file non esista
      return NextResponse.json(
        {
          error: 'Video not found',
          availableFiles: fileData?.map((f) => f.name) || [],
        },
        { status: 404 }
      );
    }

    // Download del video da Supabase
    const { data, error } = await supabase.storage.from('videos').download(filename);

    if (error) {
      console.error('❌ Error downloading video:', error);
      return NextResponse.json(
        {
          error: 'Failed to download video',
          details: error,
          filename,
        },
        { status: 500 }
      );
    }

    // Converti il blob in ArrayBuffer
    const arrayBuffer = await data.arrayBuffer();
    const fileSize = arrayBuffer.byteLength;

    // Determina il content type basato sull'estensione
    const contentType = filename.endsWith('.webm')
      ? 'video/webm'
      : filename.endsWith('.mp4')
        ? 'video/mp4'
        : 'video/mp4';

    // Supporto per Range requests (importante per video)
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = end - start + 1;
      const chunk = arrayBuffer.slice(start, end + 1);

      return new NextResponse(chunk, {
        status: 206,
        headers: {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunkSize.toString(),
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=31536000, immutable',
          ETag: `"${filename}-v1"`,
        },
      });
    }

    // Response completa per richieste senza range
    const response = new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable', // Cache 1 anno
        ETag: `"${filename}-v1"`, // ETag statico per cache efficiente
        Expires: new Date(Date.now() + 31536000 * 1000).toUTCString(), // Expires header
        Vary: 'Accept-Encoding', // Supporta compressione
        'X-Content-Type-Options': 'nosniff', // Sicurezza
        'Content-Length': arrayBuffer.byteLength.toString(),
        'Accept-Ranges': 'bytes', // Supporta range requests
      },
    });

    return response;
  } catch (error) {
    console.error('Failed to serve video:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
