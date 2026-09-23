import { NextResponse } from 'next/server';
import { supabase, supabaseAdmin, verifyUserSession } from '@/lib/supabase';

export async function GET(request: Request) {
  // Auth check
  const userId = await verifyUserSession(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = supabaseAdmin ?? supabase;
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') || 'all';
  const outliers = searchParams.get('outliers') === 'true';

  if (!db) {
    return NextResponse.json([]);
  }

  let query = db
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
  const medicineIds = Array.from(new Set(submissions.map(s => s.medicine_id)));
  const branchIds = Array.from(new Set(submissions.map(s => s.branch_id)));

  const [medsResult, branchesResult] = await Promise.all([
    db.from('medicines').select('id, brand_name, generic_name').in('id', medicineIds),
    db.from('pharmacy_branches').select('id, name').in('id', branchIds),
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
  // Auth check
  const userId = await verifyUserSession(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: 'Admin moderation requires SUPABASE_SERVICE_ROLE_KEY' },
      { status: 503 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { id, status } = body;
  if (!id || !status || !['pending', 'approved', 'rejected'].includes(status)) {
    return NextResponse.json({ error: 'id and valid status required' }, { status: 400 });
  }

  const { data: submission, error: fetchError } = await supabaseAdmin
    .from('price_submissions')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }
  if (!submission) {
    return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
  }

  const { error } = await supabaseAdmin
    .from('price_submissions')
    .update({ moderation_status: status })
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // QA-011: cascade moderation → prices so approved crowd prices become public
  const priceStatus = status === 'approved' ? 'verified' : status === 'rejected' ? 'rejected' : 'pending';
  let cascadeQuery = supabaseAdmin
    .from('prices')
    .update({ verification_status: priceStatus, last_updated: new Date().toISOString() })
    .eq('medicine_id', submission.medicine_id)
    .eq('branch_id', submission.branch_id)
    .eq('price', submission.price);

  cascadeQuery = submission.user_id
    ? cascadeQuery.eq('submitted_by', submission.user_id)
    : cascadeQuery.is('submitted_by', null);

  if (status !== 'pending') {
    // Only flip rows that are not already final, except re-open on pending
    cascadeQuery = cascadeQuery.neq('verification_status', priceStatus);
  }

  const { error: cascadeError } = await cascadeQuery;
  if (cascadeError) {
    console.error('moderation cascade error:', cascadeError.message);
    return NextResponse.json(
      { error: 'Submission updated, but price cascade failed', cascadeError: cascadeError.message },
      { status: 207 }
    );
  }

  return NextResponse.json({ success: true, cascaded: priceStatus });
}
