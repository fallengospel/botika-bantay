import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') || 'all';
  const outliers = searchParams.get('outliers') === 'true';

  if (!supabase) {
    return NextResponse.json([]);
  }

  let query = supabase
    .from('price_submissions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  if (status !== 'all') {
    query = query.eq('moderation_status', status);
  }
  if (outliers) {
    query = query.eq('outlier_flag', true);
  }

  const { data: submissions, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!submissions || submissions.length === 0) {
    return NextResponse.json([]);
  }

  // Manual join
  const medicineIds = [...new Set(submissions.map(s => s.medicine_id))];
  const branchIds = [...new Set(submissions.map(s => s.branch_id))];

  const [medsResult, branchesResult] = await Promise.all([
    supabase.from('medicines').select('id, brand_name, generic_name').in('id', medicineIds),
    supabase.from('pharmacy_branches').select('id, name').in('id', branchIds),
  ]);

  const medsMap = new Map((medsResult.data || []).map(m => [m.id, m]));
  const branchesMap = new Map((branchesResult.data || []).map(b => [b.id, b]));

  const enriched = submissions.map(s => ({
    ...s,
    medicine: medsMap.get(s.medicine_id) || null,
    branch: branchesMap.get(s.branch_id) || null,
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
    .from('price_submissions')
    .update({ moderation_status: status })
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
