import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
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

  // Try to find medicine by barcode first
  let { data: medicine, error: medicineError } = await supabase
    .from('medicines')
    .select('*')
    .eq('barcode', scannedCode.trim())
    .single();

  // If not found by barcode, try by FDA registration number
  if (!medicine) {
    const result = await supabase
      .from('medicines')
      .select('*')
      .eq('fda_registration_number', scannedCode.trim())
      .single();
    
    medicine = result.data;
  }

  // Log the verification attempt (don't fail if insert fails)
  try {
    await supabase.from('verification_records').insert({
      scanned_code: scannedCode.trim(),
      medicine_id: medicine?.id || null,
      match_result: medicine ? 'found' : 'not_found',
      fda_data: medicine || null,
    });
  } catch {
    // Log but don't fail the request
  }

  if (medicineError && medicineError.code !== 'PGRST116') {
    return NextResponse.json({ error: medicineError.message }, { status: 500 });
  }

  if (!medicine) {
    return NextResponse.json({
      status: 'not_found',
      message: 'Product not found in FDA registry. Please verify manually or report.',
      medicine: null,
    });
  }

  return NextResponse.json({
    status: 'found',
    message: 'Product verified as FDA-registered',
    medicine,
  });
}
