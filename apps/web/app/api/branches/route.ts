import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const radius = parseFloat(searchParams.get('radius') || '10'); // Default 10km

  if (!supabase) {
    return NextResponse.json([]);
  }

  let query = supabase
    .from('pharmacy_branches')
    .select(`
      *,
      chain:pharmacy_chains(*)
    `)
    .order('name');

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!lat || !lng) {
    return NextResponse.json(data || []);
  }

  const userLat = parseFloat(lat);
  const userLng = parseFloat(lng);

  const branchesWithDistance = (data || []).map((branch) => {
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
