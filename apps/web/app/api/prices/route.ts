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

  const body = await request.json();
  
  const { data, error } = await supabase
    .from('prices')
    .insert({
      medicine_id: body.medicineId,
      branch_id: body.branchId,
      price: body.price,
      source_type: body.sourceType || 'crowdsourced',
      submitted_by: body.submittedBy,
      verification_status: 'pending',
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
