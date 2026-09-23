import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { checkRateLimit } from '@/lib/api-utils';

export async function GET(request: Request) {
  // Rate limit: 60 requests per minute per IP
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  const rateLimit = checkRateLimit(`branches:${ip}`, 60, 60000);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: 'Too many requests.' }, { status: 429 });
  }

  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const radius = parseFloat(searchParams.get('radius') || '10');

  if (!supabase) {
    return NextResponse.json([]);
  }

  const { data: branches, error } = await supabase
    .from('pharmacy_branches')
    .select('*')
    .order('name');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!branches || branches.length === 0) {
    return NextResponse.json([]);
  }

  // Manual join: fetch chains
  const chainIds = Array.from(new Set(branches.map(b => b.chain_id)));
  const { data: chains } = await supabase
    .from('pharmacy_chains')
    .select('*')
    .in('id', chainIds);

  const chainsMap = new Map((chains || []).map(c => [c.id, c]));

  const enriched = branches.map(b => ({
    ...b,
    chain: chainsMap.get(b.chain_id) || null,
  }));

  if (!lat || !lng) {
    return NextResponse.json(enriched);
  }

  const userLat = parseFloat(lat);
  const userLng = parseFloat(lng);

  const branchesWithDistance = enriched.map((branch) => {
    const distance = calculateDistance(userLat, userLng, branch.latitude, branch.longitude);
    return { ...branch, distance };
  });

  const nearbyBranches = branchesWithDistance
    .filter((branch) => branch.distance <= radius)
    .sort((a, b) => a.distance - b.distance);

  return NextResponse.json(nearbyBranches);
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}
