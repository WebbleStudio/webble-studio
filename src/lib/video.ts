import { supabase } from '@/lib/supabaseClient';

export async function getVideoUrl(filename: string): Promise<string> {
  try {
    const { data, error } = await supabase.storage.from('videos').createSignedUrl(filename, 3600); // 1 hour expiry

    if (error) {
      throw error;
    }

    return data.signedUrl;
  } catch (error) {
    throw error;
  }
}

// Funzione per ottenere URL pubblico ottimizzato con cache
export function getPublicVideoUrl(filename: string): string {
  // Usa il nostro API endpoint con cache ottimizzato invece di Supabase diretto
  return `/api/video/${filename}`;
}

// Funzione di fallback per URL Supabase diretto
export function getDirectVideoUrl(filename: string): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return `${supabaseUrl}/storage/v1/object/public/videos/${filename}`;
}

// Lista dei video disponibili (da aggiornare quando aggiungi video)
export const AVAILABLE_VIDEOS = [
  '1080p.mp4',
  '720p.mp4',
  'demo.mp4'
] as const;

export type VideoFilename = typeof AVAILABLE_VIDEOS[number];
