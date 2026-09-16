'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Pill, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

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
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Presyo Check</h1>
          <p className="text-gray-600">Compare medicine prices across pharmacies</p>
        </div>
      </div>

      {/* Search */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by brand name, generic name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-12"
          />
        </form>
      </div>

      {/* Medicine List */}
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
              <Link
                key={medicine.id}
                href={`/medicines/${medicine.id}`}
                className="card hover:shadow-md transition-shadow block"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary-100 rounded-xl">
                    <Pill className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{medicine.brand_name}</h3>
                    <p className="text-sm text-gray-600">{medicine.generic_name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {medicine.dosage_form} • {medicine.strength} • {medicine.manufacturer}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-primary-600 font-medium">View Prices</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
