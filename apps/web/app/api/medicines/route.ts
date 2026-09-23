import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getPaginationParams, paginateResponse, checkRateLimit } from '@/lib/api-utils';

export async function GET(request: Request) {
  // Rate limit: 60 requests per minute per IP
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  const rateLimit = checkRateLimit(`medicines:${ip}`, 60, 60000);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: 'Too many requests.' }, { status: 429 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search');
  const condition = searchParams.get('condition');
  const id = searchParams.get('id');

  if (!supabase) {
    return NextResponse.json(id ? null : paginateResponse([], 0, 1, 20));
  }

  if (id) {
    // QA-002/003: invalid or unknown id → null (200) so pages show not-found UI, not 500
    const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!UUID_RE.test(id)) {
      return NextResponse.json(null);
    }

    const { data, error } = await supabase
      .from('medicines')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('medicines by id error:', error.message);
      return NextResponse.json(null);
    }

    return NextResponse.json(data);
  }

  const { page, limit, offset } = getPaginationParams(searchParams);

  let query = supabase
    .from('medicines')
    .select('*', { count: 'exact' })
    .order('brand_name');

  if (search) {
    query = query.or(`brand_name.ilike.%${search}%,generic_name.ilike.%${search}%`);
  }

  if (condition) {
    query = query.contains('conditions', [condition]);
  }

  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(paginateResponse(data || [], count || 0, page, limit));
}
