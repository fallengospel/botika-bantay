import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { checkRateLimit } from '@/lib/api-utils';

export async function POST(request: Request) {
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
  }

  // Rate limit: 10 reports per minute per IP
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  const rateLimit = checkRateLimit(`report:${ip}`, 10, 60000);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!body.scannedCode || !body.description) {
    return NextResponse.json({ error: 'scannedCode and description are required' }, { status: 400 });
  }

  // No .select() read-back — INSERT policy only; RETURNING would need a SELECT policy
  const { error } = await supabase.from('suspicious_product_reports').insert({
    scanned_code: body.scannedCode,
    description: body.description,
    medicine_id: body.medicineId || null,
    user_id: body.userId || null,
    photo_url: body.photoUrl || null,
    latitude: body.latitude || null,
    longitude: body.longitude || null,
    moderation_status: 'pending',
  });

  if (error) {
    // QA-001: never leak raw DB errors (RLS/schema details) to clients
    if (error.message?.includes('row-level security')) {
      return NextResponse.json(
        { error: 'Hindi pa naka-set up ang security settings para sa reports. Subukan muli mamaya o kontakin ang support.' },
        { status: 503 }
      );
    }
    console.error('reports insert error:', error.message);
    return NextResponse.json({ error: 'Hindi ma-save ang report. Subukan muli mamaya.' }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    scanned_code: body.scannedCode,
    moderation_status: 'pending',
  });
}
