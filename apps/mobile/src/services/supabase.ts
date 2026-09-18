import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getMedicinesCached,
  setMedicinesCached,
  getMedicineDetailCached,
  setMedicineDetailCached,
  getPricesCached,
  setPricesCached,
} from '../utils/cache';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Warning: EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY must be set in your .env file');
}

export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder', {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export async function getMedicines(search?: string) {
  const cached = await getMedicinesCached(search);
  if (cached) return cached;

  let query = supabase
    .from('medicines')
    .select('*')
    .order('brand_name');

  if (search) {
    query = query.or(`brand_name.ilike.%${search}%,generic_name.ilike.%${search}%`);
  }

  const { data, error } = await query;
  if (error) throw error;

  if (data) {
    await setMedicinesCached(data, search);
  }

  return data;
}

export async function getMedicineById(id: string) {
  const cached = await getMedicineDetailCached(id);
  if (cached) return cached;

  const { data, error } = await supabase
    .from('medicines')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;

  if (data) {
    await setMedicineDetailCached(id, data);
  }

  return data;
}

export async function getPricesForMedicine(medicineId: string) {
  const cached = await getPricesCached(medicineId);
  if (cached) return cached;

  const { data, error } = await supabase
    .from('prices')
    .select(`
      *,
      branch:pharmacy_branches(*, chain:pharmacy_chains(*))
    `)
    .eq('medicine_id', medicineId)
    .order('price');

  if (error) throw error;

  if (data) {
    await setPricesCached(medicineId, data);
  }

  return data;
}

export async function verifyMedicine(scannedCode: string) {
  try {
    // Try to find medicine by barcode first
    const barcodeResult = await supabase
      .from('medicines')
      .select('*')
      .eq('barcode', scannedCode)
      .single();

    if (barcodeResult.error && barcodeResult.error.code !== 'PGRST116') {
      throw barcodeResult.error;
    }

    if (barcodeResult.data) {
      await logVerification(supabase, scannedCode, barcodeResult.data.id, 'found');
      return {
        status: 'found',
        message: 'Product verified as FDA-registered',
        medicine: barcodeResult.data,
      };
    }

    // If not found by barcode, try by FDA registration number
    const fdaResult = await supabase
      .from('medicines')
      .select('*')
      .eq('fda_registration_number', scannedCode)
      .single();

    if (fdaResult.error && fdaResult.error.code !== 'PGRST116') {
      throw fdaResult.error;
    }

    if (fdaResult.data) {
      await logVerification(supabase, scannedCode, fdaResult.data.id, 'found');
      return {
        status: 'found',
        message: 'Product verified as FDA-registered',
        medicine: fdaResult.data,
      };
    }

    // Log not found
    await logVerification(supabase, scannedCode, null, 'not_found');
    return {
      status: 'not_found',
      message: 'Product not found in FDA registry. Please verify manually or report.',
      medicine: null,
    };
  } catch (error) {
    console.error('Verification failed:', error);
    return {
      status: 'error',
      message: 'Verification service unavailable. Please try again.',
      medicine: null,
    };
  }
}

async function logVerification(supabase: any, code: string, medicineId: string | null, result: string) {
  try {
    await supabase.from('verification_records').insert({
      scanned_code: code,
      medicine_id: medicineId,
      match_result: result,
      fda_data: null,
    });
  } catch {
    // Don't fail verification if logging fails
  }
}
