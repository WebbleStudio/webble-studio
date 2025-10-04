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

    // 1. Prova a creare la policy direttamente
    // Se esiste già, riceveremo un errore che gestiremo
    console.log('📝 Creating policy "Allow public contact insert"...');

    try {
      // Usa l'API REST di Supabase per creare la policy
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${supabaseKey}`,
          apikey: supabaseKey,
        },
        body: JSON.stringify({
          sql: `CREATE POLICY "Allow public contact insert" 
                ON "contacts" 
                FOR INSERT 
                TO public 
                WITH CHECK (true);`,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();

        // Se l'errore è che la policy esiste già, proviamo a rimuoverla prima
        if (errorData.message && errorData.message.includes('already exists')) {
          console.log('⚠️  Policy already exists, attempting to drop and recreate...');

          // Rimuovi la policy esistente
          const dropResponse = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${supabaseKey}`,
              apikey: supabaseKey,
            },
            body: JSON.stringify({
              sql: 'DROP POLICY IF EXISTS "Allow public contact insert" ON "contacts";',
            }),
          });

          if (dropResponse.ok) {
            console.log('✅ Existing policy dropped successfully');

            // Ricrea la policy
            const recreateResponse = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${supabaseKey}`,
                apikey: supabaseKey,
              },
              body: JSON.stringify({
                sql: `CREATE POLICY "Allow public contact insert" 
                      ON "contacts" 
                      FOR INSERT 
                      TO public 
                      WITH CHECK (true);`,
              }),
            });

            if (recreateResponse.ok) {
              console.log('✅ Policy recreated successfully!');
            } else {
              const recreateError = await recreateResponse.json();
              console.error('❌ Error recreating policy:', recreateError);
            }
          } else {
            const dropError = await dropResponse.json();
            console.error('❌ Error dropping existing policy:', dropError);
          }
        } else {
          console.error('❌ Error creating policy:', errorData);
        }
      } else {
        console.log('✅ Policy created successfully!');
      }
    } catch (fetchError) {
      console.error('❌ Network error:', fetchError.message);
    }

    console.log('🎯 Public users can now insert into contacts table');
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Esegui lo script
setupContactsPolicy();
