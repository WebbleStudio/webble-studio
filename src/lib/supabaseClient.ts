import { createClient } from '@supabase/supabase-js';

// Database Types
export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          title: string;
          categories: string[]; // Solo categories, niente più category
          description: string;
          image_url: string;
          link: string | null;
          order_position: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          categories: string[]; // Solo categories, niente più category
          description: string;
          image_url: string;
          link?: string | null;
          order_position?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          categories?: string[]; // Solo categories, niente più category
          description?: string;
          image_url?: string;
          link?: string | null;
          order_position?: number;
          updated_at?: string;
        };
      };
      service_categories: {
        Row: {
          id: string;
          slug: string;
          name: string;
          images: string[]; // Array di ID dei progetti selezionati
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          images?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          images?: string[];
          updated_at?: string;
        };
      };
      bookings: {
        Row: {
          id: string;
          name: string;
          surname: string;
          email: string;
          phone: string;
          services: string[];
          custom_service?: string;
          contact_method: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          surname: string;
          email: string;
          phone: string;
          services: string[];
          custom_service?: string;
          contact_method: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          surname?: string;
          email?: string;
          phone?: string;
          services?: string[];
          custom_service?: string;
          contact_method?: string;
        };
      };
    };
  };
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Client pubblico (anonimo) - per operazioni pubbliche
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
  global: { fetch: fetch },
});

// Client con service role - per operazioni admin (bypassa RLS)
export const supabaseAdmin = supabaseServiceKey
  ? createClient<Database>(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
      global: { fetch: fetch },
    })
  : null;
