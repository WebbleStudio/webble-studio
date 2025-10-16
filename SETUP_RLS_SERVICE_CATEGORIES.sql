-- ============================================
-- SCRIPT RLS PER service_categories
-- ============================================
-- Esegui in Supabase Dashboard > SQL Editor
-- ============================================

-- 1. Abilita RLS
ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;

-- 2. SELECT PUBBLICO - Chiunque può vedere le categorie di servizi
CREATE POLICY "Consenti SELECT pubblico per service categories"
ON service_categories
FOR SELECT
TO anon, authenticated
USING (true);

-- 3. INSERT ADMIN - Solo admin possono creare nuove categorie
CREATE POLICY "Consenti INSERT solo agli admin"
ON service_categories
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() IN (
    SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'
  )
);

-- 4. UPDATE ADMIN - Solo admin possono modificare le categorie
CREATE POLICY "Consenti UPDATE solo agli admin"
ON service_categories
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

-- 5. DELETE ADMIN - Solo admin possono eliminare le categorie
CREATE POLICY "Consenti DELETE solo agli admin"
ON service_categories
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
WHERE schemaname = 'public' AND tablename = 'service_categories';

-- Verifica policy (dovresti vederne 4)
SELECT 
  policyname as "Nome Policy",
  cmd as "Comando",
  roles as "Ruoli"
FROM pg_policies 
WHERE tablename = 'service_categories'
ORDER BY cmd;
