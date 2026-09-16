import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Only create client if environment variables are available
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export async function getMedicines(search?: string) {
  if (!supabase) {
    console.warn('Supabase not configured - returning empty array');
    return [];
  }

  let query = supabase
    .from('medicines')
    .select('*')
    .order('brand_name');

  if (search) {
    query = query.or(`brand_name.ilike.%${search}%,generic_name.ilike.%${search}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getMedicineById(id: string) {
  if (!supabase) {
    console.warn('Supabase not configured');
    return null;
  }

  const { data, error } = await supabase
    .from('medicines')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function getPharmacyBranches(medicineId: string, latitude?: number, longitude?: number) {
  if (!supabase) {
    console.warn('Supabase not configured - returning empty array');
    return [];
  }

  const { data, error } = await supabase
    .from('prices')
    .select(`
      *,
      branch:pharmacy_branches(*, chain:pharmacy_chains(*))
    `)
    .eq('medicine_id', medicineId)
    .order('price');

  if (error) throw error;
  return data;
}

export async function searchMedicinesByCondition(condition: string) {
  if (!supabase) {
    console.warn('Supabase not configured - returning empty array');
    return [];
  }

  const { data, error } = await supabase
    .from('medicines')
    .select('*')
    .contains('conditions', [condition]);

  if (error) throw error;
  return data;
}
