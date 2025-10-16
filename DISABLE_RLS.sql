-- ============================================
-- DISABILITA RLS (TEMPORANEO)
-- ============================================
-- Esegui in Supabase Dashboard > SQL Editor
-- ============================================

-- Disabilita RLS su contacts
ALTER TABLE contacts DISABLE ROW LEVEL SECURITY;

-- Disabilita RLS su service_categories
ALTER TABLE service_categories DISABLE ROW LEVEL SECURITY;

-- Rimuovi tutte le policy (opzionale, per pulizia)
DROP POLICY IF EXISTS "allow_public_insert_contacts" ON contacts;
DROP POLICY IF EXISTS "allow_admin_select_contacts" ON contacts;
DROP POLICY IF EXISTS "allow_admin_update_contacts" ON contacts;
DROP POLICY IF EXISTS "allow_admin_delete_contacts" ON contacts;
DROP POLICY IF EXISTS "Consenti INSERT anonimo per form contatti" ON contacts;
DROP POLICY IF EXISTS "Consenti SELECT solo agli admin" ON contacts;
DROP POLICY IF EXISTS "Consenti UPDATE solo agli admin" ON contacts;
DROP POLICY IF EXISTS "Consenti DELETE solo agli admin" ON contacts;

DROP POLICY IF EXISTS "allow_public_select_service_categories" ON service_categories;
DROP POLICY IF EXISTS "allow_admin_insert_service_categories" ON service_categories;
DROP POLICY IF EXISTS "allow_admin_update_service_categories" ON service_categories;
DROP POLICY IF EXISTS "allow_admin_delete_service_categories" ON service_categories;
DROP POLICY IF EXISTS "Consenti SELECT pubblico per service categories" ON service_categories;
DROP POLICY IF EXISTS "Consenti INSERT solo agli admin" ON service_categories;
DROP POLICY IF EXISTS "Consenti UPDATE solo agli admin" ON service_categories;
DROP POLICY IF EXISTS "Consenti DELETE solo agli admin" ON service_categories;

-- Verifica
SELECT tablename, rowsecurity as "RLS Attivo"
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('contacts', 'service_categories');

