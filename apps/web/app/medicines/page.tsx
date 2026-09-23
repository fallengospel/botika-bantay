'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Pill } from 'lucide-react';
import Header from '@/components/layout/Header';
import SearchBar from '@/components/search/SearchBar';
import MedicineCard from '@/components/search/MedicineCard';

interface Medicine {
  id: string;
  brand_name: string;
  generic_name: string;
  dosage_form: string;
  strength: string;
  manufacturer: string;
}

function MedicinesContent() {
  const searchParams = useSearchParams();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const q = searchParams.get('search');
    if (q) {
      setSearchQuery(q);
      fetchMedicines(q);
    } else {
      fetchMedicines();
    }
  }, [searchParams]);

  const fetchMedicines = async (search?: string) => {
    setLoading(true);
    setFetchError(null);
    try {
      const url = search
        ? `/api/medicines?search=${encodeURIComponent(search)}`
        : '/api/medicines';
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const result = await response.json();
      const items = Array.isArray(result) ? result : (Array.isArray(result?.data) ? result.data : []);
      setMedicines(items);
    } catch (error) {
      console.error('Failed to fetch medicines:', error);
      setFetchError(error instanceof Error ? error.message : 'Failed to load');
      setMedicines([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMedicines(searchQuery);
  };

  return (
    <>
      <Header
        title="Price Check"
        subtitle="I-compare ang presyo ng gamot sa mga pharmacy"
        backHref="/"
        backLabel="Back to Home"
      />

      <div className="max-w-4xl mx-auto px-4 py-6">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          onSubmit={handleSearch}
          placeholder="Search by brand name, generic name..."
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-surface-600">Loading medicines...</p>
          </div>
        ) : fetchError ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-2">Failed to load medicines</p>
            <p className="text-sm text-surface-500 mb-4">{fetchError}</p>
            <button
              onClick={() => fetchMedicines(searchQuery || undefined)}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              Try Again
            </button>
          </div>
        ) : medicines.length === 0 ? (
          <div className="text-center py-12">
            <Pill className="w-16 h-16 text-surface-300 mx-auto mb-4" />
            <p className="text-surface-600 font-medium mb-2">
              {searchQuery ? `Walang nakitang gamot para sa "${searchQuery}"` : 'Walang nakitang gamot'}
            </p>
            <p className="text-sm text-surface-500 mb-4">
              {searchQuery ? (
                <>Subukang gumamit ng ibang pangalan or generic name.</>
              ) : (
                <>Mag-search sa itaas para makahanap ng gamot.</>
              )}
            </p>
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(''); fetchMedicines(); }}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {Array.isArray(medicines) && medicines.map((medicine) => (
              <MedicineCard key={medicine.id} medicine={medicine} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default function MedicinesPage() {
  return (
    <main className="flex-1 bg-surface-50">
      <Suspense fallback={
        <div className="flex-1 flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      }>
        <MedicinesContent />
      </Suspense>
    </main>
  );
}
