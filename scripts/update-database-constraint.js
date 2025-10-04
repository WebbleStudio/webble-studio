const { createClient } = require('@supabase/supabase-js');

// Leggi le variabili d'ambiente dal file .env.local
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');
let envContent = '';

try {
  envContent = fs.readFileSync(envPath, 'utf8');
} catch (error) {
  console.error('❌ Could not read .env.local file:', error.message);
  process.exit(1);
}

// Parse delle variabili d'ambiente
const envVars = {};
envContent.split('\n').forEach((line) => {
  const [key, value] = line.split('=');
  if (key && value) {
    envVars[key.trim()] = value.trim();
  }
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateHeroProjectsConstraint() {
  try {
    console.log('🔄 Updating hero-projects constraint...');

    // 1. Rimuovi il constraint esistente
    console.log('📝 Dropping existing constraint...');
    const { error: dropError } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE "hero-projects" DROP CONSTRAINT IF EXISTS "hero-projects_position_check";',
    });

    if (dropError) {
      console.log('⚠️  Warning dropping constraint (might not exist):', dropError.message);
    } else {
      console.log('✅ Existing constraint dropped successfully');
    }

    // 2. Aggiungi il nuovo constraint
    console.log('📝 Adding new constraint (position 1-4)...');
    const { error: addError } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE "hero-projects" ADD CONSTRAINT "hero-projects_position_check" CHECK (position >= 1 AND position <= 4);',
    });

    if (addError) {
      console.error('❌ Error adding new constraint:', addError);
      return;
    }

    console.log('✅ New constraint added successfully!');
    console.log('🎯 Hero projects can now have positions 1-4');

    // 3. Verifica il constraint
    console.log('🔍 Verifying constraint...');
    const { data: constraints, error: verifyError } = await supabase.rpc('exec_sql', {
      sql: `SELECT 
        conname as constraint_name,
        pg_get_constraintdef(oid) as constraint_definition
      FROM pg_constraint 
      WHERE conrelid = 'hero-projects'::regclass 
      AND contype = 'c';`,
    });

    if (verifyError) {
      console.log('⚠️  Could not verify constraint:', verifyError.message);
    } else {
      console.log('📋 Current constraints:');
      console.log(constraints);
    }
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Esegui lo script
updateHeroProjectsConstraint();
