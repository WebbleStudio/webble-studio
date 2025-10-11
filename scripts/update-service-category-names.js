const { createClient } = require('@supabase/supabase-js');

// Configurazione Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function updateServiceCategoryNames() {
  try {
    console.log('🔄 Updating service category names...');

    // Aggiorna Advertising
    const { data: advertisingData, error: advertisingError } = await supabase
      .from('service_categories')
      .update({ name: 'Advertising & SMM' })
      .eq('slug', 'advertising')
      .select();

    if (advertisingError) {
      console.error('❌ Error updating advertising category:', advertisingError);
    } else {
      console.log('✅ Updated advertising category:', advertisingData);
    }

    // Aggiorna Social Media Design
    const { data: socialMediaData, error: socialMediaError } = await supabase
      .from('service_categories')
      .update({ name: 'Developing Web/App' })
      .eq('slug', 'social-media-design')
      .select();

    if (socialMediaError) {
      console.error('❌ Error updating social media design category:', socialMediaError);
    } else {
      console.log('✅ Updated social media design category:', socialMediaData);
    }

    console.log('✅ Service category names updated successfully!');
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  }
}

// Esegui lo script
updateServiceCategoryNames();
