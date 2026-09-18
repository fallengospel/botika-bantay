import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const OUTLIER_THRESHOLD = 0.40;
const DAILY_SUBMISSION_LIMIT = 10;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const medicineId = searchParams.get('medicineId');
  const branchId = searchParams.get('branchId');

  if (!supabase) {
    return NextResponse.json([]);
  }

  let query = supabase
    .from('prices')
    .select(`
      *,
      medicine:medicines(*),
      branch:pharmacy_branches(*, chain:pharmacy_chains(*))
    `)
    .order('price');

  if (medicineId) {
    query = query.eq('medicine_id', medicineId);
  }

  if (branchId) {
    query = query.eq('branch_id', branchId);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

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

  if (!body.medicineId || !body.branchId || !body.price) {
    return NextResponse.json({ error: 'medicineId, branchId, and price are required' }, { status: 400 });
  }

  if (typeof body.price !== 'number' || body.price <= 0) {
    return NextResponse.json({ error: 'Price must be a positive number' }, { status: 400 });
  }

  // Daily submission limit check
  if (body.submittedBy) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { count } = await supabase
      .from('price_submissions')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', body.submittedBy)
      .gte('created_at', today.toISOString());

    if ((count || 0) >= DAILY_SUBMISSION_LIMIT) {
      return NextResponse.json(
        { error: `Daily submission limit reached (${DAILY_SUBMISSION_LIMIT}). Try again tomorrow.` },
        { status: 429 }
      );
    }
  }

  // Outlier detection
  let outlierFlag = false;
  const { data: existingPrices } = await supabase
    .from('prices')
    .select('price')
    .eq('medicine_id', body.medicineId)
    .eq('verification_status', 'verified')
    .order('price');

  if (existingPrices && existingPrices.length >= 3) {
    const sorted = existingPrices.map(p => p.price).sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    const median = sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];

    if (median > 0) {
      const deviation = Math.abs(body.price - median) / median;
      outlierFlag = deviation > OUTLIER_THRESHOLD;
    }
  }

  const { data: priceData, error: priceError } = await supabase
    .from('prices')
    .insert({
      medicine_id: body.medicineId,
      branch_id: body.branchId,
      price: body.price,
      source_type: body.sourceType || 'crowdsourced',
      submitted_by: body.submittedBy || null,
      verification_status: outlierFlag ? 'rejected' : 'pending',
    })
    .select()
    .single();

  if (priceError) {
    return NextResponse.json({ error: priceError.message }, { status: 500 });
  }

  // Also record in price_submissions
  if (body.submittedBy) {
    await supabase.from('price_submissions').insert({
      user_id: body.submittedBy,
      medicine_id: body.medicineId,
      branch_id: body.branchId,
      price: body.price,
      outlier_flag: outlierFlag,
      moderation_status: outlierFlag ? 'rejected' : 'pending',
    });
  }

  return NextResponse.json({
    ...priceData,
    outlier_flag: outlierFlag,
    ...(outlierFlag && { message: 'Price flagged as outlier and auto-rejected.' }),
  });
}
