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
  console.warn(
    'Warning: EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY must be set in your .env file'
  );
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder',
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
    global: { fetch: timeoutFetch },
  }
);

/** Fetch wrapper with a hard timeout so spinners never hang forever. */
async function timeoutFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const ms = 12000;
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    const nextInit: RequestInit = { ...(init || {}), signal: controller.signal };
    return await fetch(input, nextInit);
  } catch (e: any) {
    if (e?.name === 'AbortError') {
      throw new Error('Request timed out. Please check your connection and try again.');
    }
    throw e;
  } finally {
    clearTimeout(timer);
  }
}

/** Escape characters that break PostgREST `.or()` filters. */
function sanitizeSearch(search: string): string {
  return search
    .trim()
    .replace(/[,()%*]/g, ' ')
    .replace(/\s+/g, ' ')
    .slice(0, 64);
}

export async function getMedicines(search?: string) {
  const q = search ? sanitizeSearch(search) : undefined;
  const cached = await getMedicinesCached(q);
  if (cached) return cached;

  let query = supabase.from('medicines').select('*').order('brand_name');

  if (q) {
    query = query.or(`brand_name.ilike.%${q}%,generic_name.ilike.%${q}%`);
  }

  try {
    const { data, error } = await query;
    if (error) throw error;
    if (data) await setMedicinesCached(data, q);
    return data || [];
  } catch (err) {
    // Fall back to stale cache when offline (Lola #23)
    const stale = await getMedicinesCached(q, { allowExpired: true });
    if (stale) return stale;
    throw err;
  }
}

export async function getMedicineById(id: string) {
  const cached = await getMedicineDetailCached(id);
  if (cached) return cached;

  try {
    const { data, error } = await supabase
      .from('medicines')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;

    if (data) {
      await setMedicineDetailCached(id, data);
    }
    return data;
  } catch (err) {
    const stale = await getMedicineDetailCached(id, { allowExpired: true });
    if (stale) return stale;
    throw err;
  }
}

export async function getPricesForMedicine(medicineId: string) {
  const cached = await getPricesCached(medicineId);
  if (cached) return cached;

  try {
    const { data, error } = await supabase
      .from('prices')
      .select(
        `
        *,
        branch:pharmacy_branches(*, chain:pharmacy_chains(*))
      `
      )
      .eq('medicine_id', medicineId)
      .order('price');

    if (error) throw error;

    const rows = data || [];
    await setPricesCached(medicineId, rows);
    return rows;
  } catch (err) {
    const stale = await getPricesCached(medicineId, { allowExpired: true });
    if (stale) return stale;
    throw err;
  }
}

export type VerifyResult =
  | { status: 'found'; message: string; medicine: any }
  | { status: 'not_found'; message: string; medicine: null }
  | { status: 'rate_limited'; message: string; medicine: null }
  | { status: 'error'; message: string; medicine: null };

/** In-memory rate limit mirroring web /api/verification (30/min). */
const verifyWindowMs = 60_000;
const verifyMax = 30;
const verifyHits: number[] = [];

function checkVerifyRateLimit(): boolean {
  const now = Date.now();
  while (verifyHits.length > 0 && now - verifyHits[0] > verifyWindowMs) {
    verifyHits.shift();
  }
  if (verifyHits.length >= verifyMax) return false;
  verifyHits.push(now);
  return true;
}

/** Escape characters that break PostgREST `.or()` filters. */
function sanitizeCode(code: string): string {
  return code
    .trim()
    .replace(/[,()%*]/g, ' ')
    .replace(/\s+/g, ' ')
    .slice(0, 64);
}

export async function verifyMedicine(scannedCode: string): Promise<VerifyResult> {
  const code = sanitizeCode(scannedCode || '');
  if (!code) {
    return {
      status: 'error',
      message: 'Please scan a valid barcode.',
      medicine: null,
    };
  }

  if (!checkVerifyRateLimit()) {
    return {
      status: 'rate_limited',
      message: 'Too many checks. Wait a moment and try again.',
      medicine: null,
    };
  }

  try {
    const barcodeResult = await supabase
      .from('medicines')
      .select('*')
      .eq('barcode', code)
      .maybeSingle();

    if (barcodeResult.error) throw barcodeResult.error;

    if (barcodeResult.data) {
      await logVerification(supabase, code, barcodeResult.data.id, 'found');
      return {
        status: 'found',
        message: `Product found in our catalog: ${barcodeResult.data.brand_name} (${barcodeResult.data.generic_name}). FDA Registration ${barcodeResult.data.fda_registration_number || 'N/A'} — this checks our database, not a live FDA API.`,
        medicine: barcodeResult.data,
      };
    }

    const fdaResult = await supabase
      .from('medicines')
      .select('*')
      .eq('fda_registration_number', code)
      .maybeSingle();

    if (fdaResult.error) throw fdaResult.error;

    if (fdaResult.data) {
      await logVerification(supabase, code, fdaResult.data.id, 'found');
      return {
        status: 'found',
        message: `Product found in our catalog: ${fdaResult.data.brand_name} (${fdaResult.data.generic_name}). FDA Registration ${fdaResult.data.fda_registration_number || 'N/A'} — this checks our database, not a live FDA API.`,
        medicine: fdaResult.data,
      };
    }

    // Fuzzy fallback (parity with web API) — sanitized for PostgREST
    const { data: fuzzy } = await supabase
      .from('medicines')
      .select('*')
      .or(
        `brand_name.ilike.%${code}%,generic_name.ilike.%${code}%,barcode.ilike.%${code}%,fda_registration_number.ilike.%${code}%`
      )
      .limit(2);

    if (fuzzy && fuzzy.length === 1) {
      await logVerification(supabase, code, fuzzy[0].id, 'found');
      return {
        status: 'found',
        message: `Product found in our catalog: ${fuzzy[0].brand_name} (${fuzzy[0].generic_name}). FDA Registration ${fuzzy[0].fda_registration_number || 'N/A'} — this checks our database, not a live FDA API.`,
        medicine: fuzzy[0],
      };
    }

    if (fuzzy && fuzzy.length > 1) {
      await logVerification(supabase, code, null, 'ambiguous');
      return {
        status: 'not_found',
        message: `Found ${fuzzy.length} possible matches. Please be more specific or scan again.`,
        medicine: null,
      };
    }

    await logVerification(supabase, code, null, 'not_found');
    return {
      status: 'not_found',
      message: 'Product not found in our catalog.',
      medicine: null,
    };
  } catch (error) {
    console.error('Verification failed:', error);
    return {
      status: 'error',
      message: 'Could not check right now. Please check your connection and try again.',
      medicine: null,
    };
  }
}

async function logVerification(
  client: typeof supabase,
  code: string,
  medicineId: string | null,
  result: string
) {
  try {
    await client.from('verification_records').insert({
      scanned_code: code,
      medicine_id: medicineId,
      match_result: result,
      fda_data: null,
    });
  } catch {
    // Don't fail verification if logging fails
  }
}
