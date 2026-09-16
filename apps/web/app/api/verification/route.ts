import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
  }

  const body = await request.json();
  const { scannedCode } = body;

  if (!scannedCode) {
    return NextResponse.json(
      { error: 'Scanned code is required' },
      { status: 400 }
    );
  }

  // Try to find medicine by barcode first
  let { data: medicine, error: medicineError } = await supabase
    .from('medicines')
    .select('*')
    .eq('barcode', scannedCode)
    .single();

  // If not found by barcode, try by FDA registration number
  if (!medicine) {
    const result = await supabase
      .from('medicines')
      .select('*')
      .eq('fda_registration_number', scannedCode)
      .single();
    
    medicine = result.data;
    medicineError = result.error;
  }

  // Log the verification attempt
  await supabase.from('verification_records').insert({
    scanned_code: scannedCode,
    medicine_id: medicine?.id || null,
    match_result: medicine ? 'found' : 'not_found',
    fda_data: medicine || null,
  });

  if (medicineError || !medicine) {
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
