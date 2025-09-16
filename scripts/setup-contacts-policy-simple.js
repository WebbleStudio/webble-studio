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
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupContactsPolicy() {
  try {
    console.log('🔄 Setting up contacts table policy...');

    // 1. Rimuovi policy esistenti
    console.log('📝 Dropping existing policies...');
    const dropQueries = [
      'DROP POLICY IF EXISTS "Allow public contact insert" ON "public"."contacts";',
      'DROP POLICY IF EXISTS "Allow anonymous contact insert" ON "public"."contacts";',
    ];

    for (const query of dropQueries) {
      const { error } = await supabase.rpc('exec_sql', { sql: query });
      if (error) {
        console.log('⚠️  Warning (policy might not exist):', error.message);
      }
    }

    // 2. Crea la nuova policy
    console.log('📝 Creating new policy...');
    const createQuery = `
      CREATE POLICY "Allow public contact insert"
      ON "public"."contacts"
      AS PERMISSIVE
      FOR INSERT
      TO public
      WITH CHECK (true);
    `;

    const { error: createError } = await supabase.rpc('exec_sql', { sql: createQuery });

    if (createError) {
      console.error('❌ Error creating policy:', createError);
      return;
    }

    console.log('✅ Policy created successfully!');
    console.log('🎯 Public users can now insert into contacts table');

    // 3. Verifica la policy
    console.log('🔍 Verifying policy...');
    const { data: policies, error: verifyError } = await supabase.rpc('exec_sql', {
      sql: `SELECT 
        policyname,
        cmd,
        roles,
        qual,
        with_check
      FROM pg_policies 
      WHERE tablename = 'contacts' 
      AND schemaname = 'public';`,
    });

    if (verifyError) {
      console.log('⚠️  Could not verify policy:', verifyError.message);
    } else {
      console.log('📋 Current policies for contacts table:');
      console.log(policies);
    }
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Esegui lo script
setupContactsPolicy();
