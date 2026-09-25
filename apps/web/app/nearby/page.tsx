'use client';

import { useState, useEffect, useCallback } from 'react';
import { MapPin, Navigation, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/layout/Header';

interface PharmacyBranch {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  city: string;
  province: string;
  chain: {
    id: string;
    name: string;
    color: string;
  };
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

export default function NearbyPage() {
  const [branches, setBranches] = useState<PharmacyBranch[]>([]);
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const fetchNearbyBranches = useCallback(async (lat: number, lng: number) => {
    try {
      const response = await fetch(`/api/branches?lat=${lat}&lng=${lng}`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setBranches(data);
    } catch (error) {
      console.error('Failed to fetch branches:', error);
      setLocationError('Failed to load pharmacy data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const getUserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        fetchNearbyBranches(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        setLocationError('Could not get your location. Please enable location access.');
        setLoading(false);
      }
    );
  }, [fetchNearbyBranches]);

  useEffect(() => {
    getUserLocation();
  }, [getUserLocation]);

  const getDirections = (lat: number, lng: number) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <main className="flex-1 bg-surface-50">
      <Header 
        title="Nearby" 
        subtitle="Hanapin ang pharmacy malapit sa lokasyon mo"
        backHref="/"
        backLabel="Back to Home"
      />

      <div className="max-w-4xl mx-auto px-4 py-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-surface-600">Finding nearby pharmacies...</p>
          </div>
        ) : locationError ? (
          <div className="text-center py-12">
            <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <p className="text-surface-600 mb-4">{locationError}</p>
            <button
              onClick={getUserLocation}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700"
            >
              Retry
            </button>
          </div>
        ) : branches.length === 0 ? (
          <div className="text-center py-12">
            <MapPin className="w-16 h-16 text-surface-300 mx-auto mb-4" />
            <p className="text-surface-600 font-medium mb-2">Walang nakitang pharmacy sa malapit</p>
            <p className="text-sm text-surface-500 mb-6">Subukang i-refresh ang location mo o maghanap sa ibang lugar.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={getUserLocation} className="btn-primary text-sm">
                Refresh Location
              </button>
              <Link href="/medicines" className="btn-secondary text-sm">
                Search Medicines
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {[...branches]
              .sort((a, b) => {
                if (!userLocation) return 0;
                return calculateDistance(userLocation.lat, userLocation.lng, a.latitude, a.longitude) -
                       calculateDistance(userLocation.lat, userLocation.lng, b.latitude, b.longitude);
              })
              .map((branch) => {
              const distance = userLocation
                ? calculateDistance(userLocation.lat, userLocation.lng, branch.latitude, branch.longitude)
                : null;

              return (
                <div key={branch.id} className="card">
                  <div className="flex items-start gap-4">
                    <div 
                      className="p-3 rounded-xl"
                      style={{ backgroundColor: `${branch.chain.color}20` }}
                    >
                      <MapPin 
                        className="w-6 h-6" 
                        style={{ color: branch.chain.color }}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: branch.chain.color }}
                        ></span>
                        <h3 className="font-semibold text-surface-900">{branch.chain.name}</h3>
                      </div>
                      <p className="text-sm text-surface-600">{branch.name}</p>
                      <p className="text-xs text-surface-500 mt-1">{branch.address}</p>
                      {distance !== null && (
                        <p className="text-xs text-primary-600 mt-2 font-medium">
                          {distance.toFixed(1)} km away
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => getDirections(branch.latitude, branch.longitude)}
                      className="flex items-center gap-2 text-primary-600 hover:text-primary-700 text-sm font-medium"
                      aria-label={`Get directions to ${branch.name} ${branch.chain.name}`}
                    >
                      <Navigation className="w-4 h-4" />
                      Directions
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
