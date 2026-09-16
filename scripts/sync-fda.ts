import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';

const supabaseUrl = process.env.SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'YOUR_SERVICE_ROLE_KEY';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface FDAProduct {
  registration_number: string;
  product_name: string;
  generic_name: string;
  dosage_form: string;
  strength: string;
  manufacturer: string;
  barcode?: string;
}

// Note: This is a placeholder script. The actual FDA Philippines API
// may have different endpoints and data format. You'll need to adjust
// this script based on the actual FDA Philippines data source.

async function fetchFDAData(): Promise<FDAProduct[]> {
  // TODO: Implement actual FDA Philippines API call
  // This could be:
  // 1. Direct API call to FDA Philippines
  // 2. Scraping their public registry
  // 3. Downloading a CSV/Excel file they publish
  // 4. Using their open data portal
  
  console.log('Fetching FDA data...');
  
  // Placeholder - replace with actual implementation
  const response = await fetch('https://www.fda.gov.ph/api/products');
  
  if (!response.ok) {
    throw new Error(`FDA API error: ${response.status}`);
  }
  
  const data = await response.json();
  return data.products || [];
}

async function syncFDAData() {
  try {
    const products = await fetchFDAData();
    
    console.log(`Found ${products.length} products from FDA`);
    
    for (const product of products) {
      // Check if medicine already exists
      const { data: existing } = await supabase
        .from('medicines')
        .select('id')
        .eq('fda_registration_number', product.registration_number)
        .single();

      if (existing) {
        // Update existing medicine
        const { error } = await supabase
          .from('medicines')
          .update({
            brand_name: product.product_name,
            generic_name: product.generic_name,
            dosage_form: product.dosage_form,
            strength: product.strength,
            manufacturer: product.manufacturer,
            barcode: product.barcode,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id);

        if (error) {
          console.error('Error updating medicine:', product.registration_number, error);
        }
      } else {
        // Insert new medicine
        const { error } = await supabase.from('medicines').insert({
          brand_name: product.product_name,
          generic_name: product.generic_name,
          dosage_form: product.dosage_form,
          strength: product.strength,
          manufacturer: product.manufacturer,
          fda_registration_number: product.registration_number,
          barcode: product.barcode,
        });

        if (error) {
          console.error('Error inserting medicine:', product.registration_number, error);
        }
      }
    }

    console.log('FDA sync complete!');
  } catch (error) {
    console.error('FDA sync failed:', error);
    process.exit(1);
  }
}

// Run the sync
syncFDAData();
