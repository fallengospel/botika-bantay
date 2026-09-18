import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

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

  if (!body.scannedCode || !body.description) {
    return NextResponse.json({ error: 'scannedCode and description are required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('suspicious_product_reports')
    .insert({
      scanned_code: body.scannedCode,
      description: body.description,
      medicine_id: body.medicineId || null,
      user_id: body.userId || null,
      photo_url: body.photoUrl || null,
      latitude: body.latitude || null,
      longitude: body.longitude || null,
      moderation_status: 'pending',
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
