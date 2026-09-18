import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') || 'all';

  if (!supabase) {
    return NextResponse.json([]);
  }

  let query = supabase
    .from('suspicious_product_reports')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  if (status !== 'all') {
    query = query.eq('moderation_status', status);
  }

  const { data: reports, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!reports || reports.length === 0) {
    return NextResponse.json([]);
  }

  // Manual join for medicines
  const medicineIds = [...new Set(reports.filter(r => r.medicine_id).map(r => r.medicine_id))];
  let medsMap = new Map();
  if (medicineIds.length > 0) {
    const { data: meds } = await supabase.from('medicines').select('id, brand_name').in('id', medicineIds);
    medsMap = new Map((meds || []).map(m => [m.id, m]));
  }

  const enriched = reports.map(r => ({
    ...r,
    medicine: r.medicine_id ? medsMap.get(r.medicine_id) || null : null,
  }));

  return NextResponse.json(enriched);
}

export async function PATCH(request: Request) {
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { id, status } = body;
  if (!id || !status) {
    return NextResponse.json({ error: 'id and status required' }, { status: 400 });
  }

  const { error } = await supabase
    .from('suspicious_product_reports')
    .update({ moderation_status: status })
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
