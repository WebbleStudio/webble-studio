-- Script per creare la tabella service_categories

-- Crea la tabella service_categories se non esiste
CREATE TABLE IF NOT EXISTS service_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  images TEXT[] DEFAULT '{}', -- Array di ID dei progetti
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crea un indice per migliorare le performance
CREATE INDEX IF NOT EXISTS idx_service_categories_slug ON service_categories(slug);

-- Inserisci le categorie di default
INSERT INTO service_categories (slug, name, images) VALUES
  ('ui-ux-design', 'UI/UX Design', '{}'),
  ('project-management', 'Project Management', '{}'),
  ('advertising', 'Advertising', '{}'),
  ('social-media-design', 'Social Media Design', '{}')
ON CONFLICT (slug) DO NOTHING;

-- Verifica che la tabella sia stata creata correttamente
SELECT * FROM service_categories ORDER BY created_at;
