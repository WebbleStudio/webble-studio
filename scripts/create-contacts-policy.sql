-- Script per creare la policy corretta per la tabella contacts
-- Esegui questo script nell'SQL Editor di Supabase

-- 1. Rimuovi eventuali policy esistenti
DROP POLICY IF EXISTS "Allow public contact insert" ON "public"."contacts";
DROP POLICY IF EXISTS "Allow anonymous contact insert" ON "public"."contacts";

-- 2. Crea la policy corretta per permettere inserimenti pubblici
CREATE POLICY "Allow public contact insert"
ON "public"."contacts"
AS PERMISSIVE
FOR INSERT
TO public
WITH CHECK (true);

-- 3. Verifica che la policy sia stata creata
SELECT 
    policyname,
    cmd,
    roles,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'contacts' 
AND schemaname = 'public';
