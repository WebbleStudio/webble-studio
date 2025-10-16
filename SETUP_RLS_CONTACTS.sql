-- ============================================
-- SCRIPT RLS PER contacts
-- ============================================
-- Esegui in Supabase Dashboard > SQL Editor
-- ============================================

-- 1. Abilita RLS
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- 2. INSERT PUBBLICO - Chiunque può inviare un contatto (form pubblico)
CREATE POLICY "Consenti INSERT anonimo per form contatti"
ON contacts
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- 3. SELECT ADMIN - Solo admin possono leggere i contatti
CREATE POLICY "Consenti SELECT solo agli admin"
ON contacts
FOR SELECT
TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'
  )
);

-- 4. UPDATE ADMIN - Solo admin possono modificare i contatti
CREATE POLICY "Consenti UPDATE solo agli admin"
ON contacts
FOR UPDATE
TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'
  )
)
WITH CHECK (
  auth.uid() IN (
    SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'
  )
);

-- 5. DELETE ADMIN - Solo admin possono eliminare i contatti
CREATE POLICY "Consenti DELETE solo agli admin"
ON contacts
FOR DELETE
TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'
  )
);

-- ============================================
-- VERIFICA
-- ============================================

-- Verifica RLS attivo
SELECT tablename, rowsecurity as "RLS Attivo"
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'contacts';

-- Verifica policy (dovresti vederne 4)
SELECT 
  policyname as "Nome Policy",
  cmd as "Comando",
  roles as "Ruoli"
FROM pg_policies 
WHERE tablename = 'contacts'
ORDER BY cmd;
