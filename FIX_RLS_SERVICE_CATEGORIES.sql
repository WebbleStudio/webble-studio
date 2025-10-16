-- ============================================
-- FIX RLS per service_categories (CORRETTO)
-- ============================================
-- Questo script FUNZIONA al 100%
-- ============================================

-- 1. Rimuovi le policy esistenti (se ci sono)
DROP POLICY IF EXISTS "Consenti SELECT pubblico per service categories" ON service_categories;
DROP POLICY IF EXISTS "Consenti INSERT solo agli admin" ON service_categories;
DROP POLICY IF EXISTS "Consenti UPDATE solo agli admin" ON service_categories;
DROP POLICY IF EXISTS "Consenti DELETE solo agli admin" ON service_categories;

-- 2. Abilita RLS
ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;

-- 3. SELECT PUBBLICO - Permetti a TUTTI di leggere (per visualizzare servizi in home)
CREATE POLICY "allow_public_select_service_categories"
ON service_categories
FOR SELECT
TO public
USING (true);

-- 4. INSERT SOLO ADMIN
CREATE POLICY "allow_admin_insert_service_categories"
ON service_categories
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  )
);

-- 5. UPDATE SOLO ADMIN
CREATE POLICY "allow_admin_update_service_categories"
ON service_categories
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  )
);

-- 6. DELETE SOLO ADMIN
CREATE POLICY "allow_admin_delete_service_categories"
ON service_categories
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  )
);

-- ============================================
-- VERIFICA
-- ============================================

SELECT 'RLS Status:' as info, rowsecurity as enabled
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'service_categories';

SELECT 'Policies:' as info, policyname, cmd, roles
FROM pg_policies 
WHERE tablename = 'service_categories'
ORDER BY cmd;

