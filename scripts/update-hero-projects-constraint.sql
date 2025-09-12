-- Script per aggiornare il constraint della tabella hero-projects
-- da massimo 3 a massimo 4 progetti

-- 1. Rimuovi il constraint esistente
ALTER TABLE "hero-projects" DROP CONSTRAINT IF EXISTS "hero-projects_position_check";

-- 2. Aggiungi il nuovo constraint che permette posizioni da 1 a 4
ALTER TABLE "hero-projects" ADD CONSTRAINT "hero-projects_position_check" 
CHECK (position >= 1 AND position <= 4);

-- 3. Verifica che il constraint sia stato applicato correttamente
-- (Questo comando mostrerà i constraint della tabella)
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'hero-projects'::regclass 
AND contype = 'c';
