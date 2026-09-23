import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { checkRateLimit } from '@/lib/api-utils';

const OUTLIER_THRESHOLD = 0.40;

export async function GET(request: Request) {
  // Rate limit: 30 requests per minute per IP
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  const rateLimit = checkRateLimit(`outlier:${ip}`, 30, 60000);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: 'Too many requests.' }, { status: 429 });
  }

  const { searchParams } = new URL(request.url);
  const medicineId = searchParams.get('medicineId');
  const priceStr = searchParams.get('price');

  if (!medicineId || !priceStr) {
    return NextResponse.json({ error: 'medicineId and price are required' }, { status: 400 });
  }

  const price = parseFloat(priceStr);
  if (isNaN(price) || price <= 0) {
    return NextResponse.json({ error: 'Invalid price' }, { status: 400 });
  }

  if (!supabase) {
    return NextResponse.json({ isOutlier: false, median: 0, deviation: 0 });
  }

  const { data: prices, error } = await supabase
    .from('prices')
    .select('price')
    .eq('medicine_id', medicineId)
    .eq('verification_status', 'verified')
    .order('price');

  if (error || !prices || prices.length < 3) {
    return NextResponse.json({ isOutlier: false, median: 0, deviation: 0 });
  }

  const sorted = prices.map(p => p.price).sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  const median = sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];

  if (median === 0) {
    return NextResponse.json({ isOutlier: false, median: 0, deviation: 0 });
  }

  const deviation = Math.abs(price - median) / median;
  const isOutlier = deviation > OUTLIER_THRESHOLD;

  return NextResponse.json({ isOutlier, median, deviation: deviation * 100 });
}
