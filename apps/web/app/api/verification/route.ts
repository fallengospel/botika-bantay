import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { checkRateLimit } from '@/lib/api-utils';

export async function POST(request: Request) {
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
  }

  // Rate limit: 30 requests per minute per IP
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  const rateLimit = checkRateLimit(`verify:${ip}`, 30, 60000);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': '30',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': Math.ceil(rateLimit.resetAt / 1000).toString(),
          'Retry-After': Math.ceil((rateLimit.resetAt - Date.now()) / 1000).toString(),
        },
      }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { scannedCode } = body;

  if (!scannedCode || typeof scannedCode !== 'string' || scannedCode.trim().length === 0) {
    return NextResponse.json(
      { error: 'scannedCode is required and must be a non-empty string' },
      { status: 400 }
    );
  }

  // QA-007: bound input length — real barcodes/FDA codes are well under 64 chars
  if (scannedCode.trim().length > 64) {
    return NextResponse.json(
      { error: 'scannedCode must be 64 characters or fewer' },
      { status: 400 }
    );
  }

  const code = scannedCode.trim();

  // Escape PostgREST `.or()` metacharacters (same as mobile)
  const safe = code.replace(/[,()%*]/g, ' ').replace(/\s+/g, ' ').slice(0, 64);

  let medicine = null;

  // 1. Try exact match by barcode
  const byBarcode = await supabase
    .from('medicines')
    .select('*')
    .eq('barcode', code)
    .single();

  if (byBarcode.data) {
    medicine = byBarcode.data;
  }

  // 2. Try exact match by FDA registration number
  if (!medicine) {
    const byFda = await supabase
      .from('medicines')
      .select('*')
      .eq('fda_registration_number', code)
      .single();

    if (byFda.data) {
      medicine = byFda.data;
    }
  }

  // 3. Try ilike search across brand_name, generic_name, barcode, fda_registration_number
  if (!medicine && safe) {
    const { data: results } = await supabase
      .from('medicines')
      .select('*')
      .or(
        `brand_name.ilike.%${safe}%,generic_name.ilike.%${safe}%,barcode.ilike.%${safe}%,fda_registration_number.ilike.%${safe}%`
      )
      .limit(1);

    if (results && results.length > 0) {
      medicine = results[0];
    }
  }

  // 4. Try partial word match (e.g. "CDRR" matches "Ceterizine" type logic — search each word)
  if (!medicine) {
    const words = safe.split(/[\s\-_/]+/).filter((w) => w.length >= 3);
    if (words.length > 0) {
      const orClause = words
        .map(w => `brand_name.ilike.%${w}%,generic_name.ilike.%${w}%`)
        .join(',');

      const { data: results } = await supabase
        .from('medicines')
        .select('*')
        .or(orClause)
        .limit(5);

      if (results && results.length === 1) {
        medicine = results[0];
      } else if (results && results.length > 1) {
        // Return ambiguous match
        await logVerification(supabase, code, null, 'ambiguous');
        return NextResponse.json({
          status: 'ambiguous',
          message: `Found ${results.length} possible matches in our catalog. Please scan again or search by brand/generic name.`,
          medicine: null,
          suggestions: results.map((m: any) => ({
            id: m.id,
            brand_name: m.brand_name,
            generic_name: m.generic_name,
          })),
        });
      }
    }
  }

  // Log the verification attempt
  await logVerification(supabase, code, medicine?.id || null, medicine ? 'found' : 'not_found');

  if (!medicine) {
    return NextResponse.json({
      status: 'not_found',
      message: `Not found in the BotikaBantay catalog for "${code}". The product may be new, the code may be wrong, or it is not listed yet. This is not a live FDA registry check.`,
      medicine: null,
    });
  }

  return NextResponse.json({
    status: 'found',
    message: `Found in catalog: ${medicine.brand_name} (${medicine.generic_name}) — FDA Registration ${medicine.fda_registration_number}. Checked against BotikaBantay's database, not a live FDA API.`,
    medicine,
  });
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
    // Log but don't fail the request
  }
}
