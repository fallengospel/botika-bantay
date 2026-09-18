'use client';

import { useState, useEffect } from 'react';
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

export default function MedicinesPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async (search?: string) => {
    setLoading(true);
    try {
      const url = search 
        ? `/api/medicines?search=${encodeURIComponent(search)}`
        : '/api/medicines';
      const response = await fetch(url);
      const data = await response.json();
      setMedicines(data);
    } catch (error) {
      console.error('Failed to fetch medicines:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMedicines(searchQuery);
  };

  return (
    <main className="flex-1 bg-gray-50">
      <Header 
        title="Presyo Check" 
        subtitle="Compare medicine prices across pharmacies"
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
            <p className="mt-4 text-gray-600">Loading medicines...</p>
          </div>
        ) : medicines.length === 0 ? (
          <div className="text-center py-12">
            <Pill className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No medicines found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {medicines.map((medicine) => (
              <MedicineCard key={medicine.id} medicine={medicine} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
