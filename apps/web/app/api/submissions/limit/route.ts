import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { checkRateLimit } from '@/lib/api-utils';

const DAILY_SUBMISSION_LIMIT = 10;

export async function GET(request: Request) {
  // Rate limit: 30 requests per minute per IP
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  const rateLimit = checkRateLimit(`sublimit:${ip}`, 30, 60000);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: 'Too many requests.' }, { status: 429 });
  }

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ remaining: DAILY_SUBMISSION_LIMIT, limit: DAILY_SUBMISSION_LIMIT });
  }

  if (!supabase) {
    return NextResponse.json({ remaining: DAILY_SUBMISSION_LIMIT, limit: DAILY_SUBMISSION_LIMIT });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { count, error } = await supabase
    .from('price_submissions')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', today.toISOString());

  if (error) {
    return NextResponse.json({ remaining: DAILY_SUBMISSION_LIMIT, limit: DAILY_SUBMISSION_LIMIT });
  }

  const submitted = count || 0;
  return NextResponse.json({
    submitted,
    remaining: Math.max(0, DAILY_SUBMISSION_LIMIT - submitted),
    limit: DAILY_SUBMISSION_LIMIT,
  });
}
