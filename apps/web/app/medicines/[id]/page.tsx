'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import Link from 'next/link';
const formatPrice = (price: number) => new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(price);

const calculateStaleness = (lastUpdated: Date): 'fresh' | 'stale' | 'very_stale' => {
  const diffDays = Math.floor((Date.now() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays <= 30) return 'fresh';
  if (diffDays <= 60) return 'stale';
  return 'very_stale';
};

interface Price {
  id: string;
  price: number;
  source_type: 'official' | 'crowdsourced';
  last_updated: string;
  branch: {
    id: string;
    name: string;
    address: string;
    chain: {
      name: string;
      color: string;
    };
  };
}

interface Medicine {
  id: string;
  brand_name: string;
  generic_name: string;
  dosage_form: string;
  strength: string;
  manufacturer: string;
  fda_registration_number: string;
}

export default function MedicineDetailPage({ params }: { params: { id: string } }) {
  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [prices, setPrices] = useState<Price[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMedicineDetails();
  }, [params.id]);

  const fetchMedicineDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/prices?medicineId=${params.id}`);
      const data = await response.json();
      
      if (data.length > 0) {
        setMedicine(data[0].medicine);
        setPrices(data);
      }
    } catch (error) {
      console.error('Failed to fetch medicine details:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStalenessBadge = (lastUpdated: string) => {
    const staleness = calculateStaleness(new Date(lastUpdated));
    const badges = {
      fresh: <span className="badge-fresh">Fresh</span>,
      stale: <span className="badge-stale">Stale</span>,
      very_stale: <span className="badge-very-stale">Outdated</span>,
    };
    return badges[staleness];
  };

  if (loading) {
    return (
      <main className="flex-1 bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </main>
    );
  }

  if (!medicine) {
    return (
      <main className="flex-1 bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Medicine not found</p>
      </main>
    );
  }

  const sortedPrices = [...prices].sort((a, b) => a.price - b.price);
  const lowestPrice = sortedPrices[0]?.price || 0;
  const highestPrice = sortedPrices[sortedPrices.length - 1]?.price || 0;
  const savings = highestPrice - lowestPrice;

  return (
    <main className="flex-1 bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/medicines" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Search</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{medicine.brand_name}</h1>
          <p className="text-gray-600">{medicine.generic_name}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Medicine Info */}
        <div className="card mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">Medicine Information</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Dosage Form</span>
              <p className="font-medium">{medicine.dosage_form}</p>
            </div>
            <div>
              <span className="text-gray-500">Strength</span>
              <p className="font-medium">{medicine.strength}</p>
            </div>
            <div>
              <span className="text-gray-500">Manufacturer</span>
              <p className="font-medium">{medicine.manufacturer}</p>
            </div>
            <div>
              <span className="text-gray-500">FDA Registration</span>
              <p className="font-medium">{medicine.fda_registration_number}</p>
            </div>
          </div>
        </div>

        {/* Price Summary */}
        {savings > 0 && (
          <div className="bg-primary-50 border border-primary-200 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-primary-600" />
              <div>
                <p className="font-semibold text-primary-800">
                  You can save up to {formatPrice(savings)}
                </p>
                <p className="text-sm text-primary-600">
                  by choosing the lowest price option
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Price List */}
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-4">
            Prices ({prices.length} pharmacies)
          </h2>
          
          {prices.length === 0 ? (
            <div className="text-center py-8">
              <AlertTriangle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600">No prices available yet</p>
              <p className="text-sm text-gray-500 mt-1">
                Be the first to submit a price!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedPrices.map((price, index) => (
                <div
                  key={price.id}
                  className={`p-4 rounded-lg border ${
                    index === 0
                      ? 'border-primary-200 bg-primary-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: price.branch.chain.color }}
                        ></span>
                        <span className="font-medium text-gray-900">
                          {price.branch.chain.name}
                        </span>
                        {index === 0 && (
                          <span className="bg-primary-600 text-white text-xs px-2 py-0.5 rounded-full">
                            Lowest
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {price.branch.name} - {price.branch.address}
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                        <Clock className="w-4 h-4" />
                        Updated: {new Date(price.last_updated).toLocaleDateString()}
                        {getStalenessBadge(price.last_updated)}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-900">
                        {formatPrice(price.price)}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">
                        {price.source_type}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
