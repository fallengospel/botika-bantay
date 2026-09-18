import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

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

  const { data, error } = await supabase
    .from('prices')
    .insert({
      medicine_id: body.medicineId,
      branch_id: body.branchId,
      price: body.price,
      source_type: body.sourceType || 'crowdsourced',
      submitted_by: body.submittedBy || null,
      verification_status: 'pending',
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
