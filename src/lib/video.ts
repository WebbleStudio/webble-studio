import { supabase } from '@/app/lib/supabaseClient';

export async function getVideoUrl(filename: string): Promise<string> {
  try {
    const { data, error } = await supabase.storage.from('videos').createSignedUrl(filename, 3600); // 1 hour expiry

    if (error) {
      console.error('Error getting video URL:', error);
      throw error;
    }

    return data.signedUrl;
  } catch (error) {
    console.error('Failed to get video URL:', error);
    throw error;
  }
}

// Funzione per ottenere URL pubblico (se il bucket è pubblico)
export function getPublicVideoUrl(filename: string): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return `${supabaseUrl}/storage/v1/object/public/videos/${filename}`;
}
