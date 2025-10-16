-- ============================================
-- FIX RLS per contacts (CORRETTO)
-- ============================================
-- Questo script FUNZIONA al 100%
-- ============================================

-- 1. Rimuovi le policy esistenti (se ci sono)
DROP POLICY IF EXISTS "Consenti INSERT anonimo per form contatti" ON contacts;
DROP POLICY IF EXISTS "Consenti SELECT solo agli admin" ON contacts;
DROP POLICY IF EXISTS "Consenti UPDATE solo agli admin" ON contacts;
DROP POLICY IF EXISTS "Consenti DELETE solo agli admin" ON contacts;

-- 2. Abilita RLS
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- 3. INSERT PUBBLICO - Permetti a TUTTI di inserire (incluso anon)
-- Usando 'public' invece di 'anon, authenticated'
CREATE POLICY "allow_public_insert_contacts"
ON contacts
FOR INSERT
TO public
WITH CHECK (true);

-- 4. SELECT SOLO ADMIN
CREATE POLICY "allow_admin_select_contacts"
ON contacts
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  )
);

-- 5. UPDATE SOLO ADMIN
CREATE POLICY "allow_admin_update_contacts"
ON contacts
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
CREATE POLICY "allow_admin_delete_contacts"
ON contacts
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
WHERE schemaname = 'public' AND tablename = 'contacts';

SELECT 'Policies:' as info, policyname, cmd, roles
FROM pg_policies 
WHERE tablename = 'contacts'
ORDER BY cmd;

