const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Leggi le variabili d'ambiente dal file .env.local
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

async function setupServiceCategories() {
  try {
    console.log('🔄 Setting up service categories table...');

    // Leggi il file SQL
    const sqlPath = path.join(__dirname, 'create-service-categories-table.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');

    // Esegui il SQL
    console.log('📝 Creating table and inserting data...');
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: sqlContent,
    });

    if (error) {
      console.error('❌ Error executing SQL:', error);
      return;
    }

    console.log('✅ Service categories table setup completed!');

    // Verifica che le categorie siano state create
    const { data: categories, error: fetchError } = await supabase
      .from('service_categories')
      .select('*')
      .order('created_at');

    if (fetchError) {
      console.error('❌ Error fetching categories:', fetchError);
      return;
    }

    console.log('📊 Categories in database:');
    categories.forEach((category) => {
      console.log(`  - ${category.name} (${category.slug})`);
    });
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Esegui lo script
setupServiceCategories();
