const { createClient } = require('@supabase/supabase-js');

// Configurazione Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function initServiceCategories() {
  try {
    console.log('🔄 Initializing service categories...');

    // Categorie di servizi da inizializzare
    const serviceCategories = [
      {
        slug: 'ui-ux-design',
        name: 'UI/UX Design',
        images: [],
      },
      {
        slug: 'project-management',
        name: 'Project Management',
        images: [],
      },
      {
        slug: 'advertising',
        name: 'Advertising & SMM',
        images: [],
      },
      {
        slug: 'social-media-design',
        name: 'Developing Web/App',
        images: [],
      },
    ];

    // Inserisci le categorie nel database
    const { data, error } = await supabase
      .from('service_categories')
      .upsert(serviceCategories, {
        onConflict: 'slug',
        ignoreDuplicates: false,
      })
      .select();

    if (error) {
      console.error('❌ Error initializing service categories:', error);
      process.exit(1);
    }

    console.log('✅ Service categories initialized successfully!');
    console.log('📊 Categories created:', data.length);

    data.forEach((category) => {
      console.log(`  - ${category.name} (${category.slug})`);
    });
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  }
}

// Esegui lo script
initServiceCategories();
