'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import Header from '@/components/layout/Header';
import PriceCard from '@/components/price/PriceCard';

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
      
      if (data.length > 0 && data[0].medicine) {
        setMedicine(data[0].medicine);
        setPrices(data);
      } else {
        const medResponse = await fetch(`/api/medicines?id=${params.id}`);
        const medData = await medResponse.json();
        const found = Array.isArray(medData) ? medData[0] : medData;
        if (found) {
          setMedicine(found);
          setPrices([]);
        }
      }
    } catch (error) {
      console.error('Failed to fetch medicine details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="flex-1 bg-surface-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </main>
    );
  }

  if (!medicine) {
    return (
      <main className="flex-1 bg-surface-50 flex items-center justify-center">
        <p className="text-surface-600">Medicine not found</p>
      </main>
    );
  }

  const sortedPrices = [...prices].sort((a, b) => a.price - b.price);
  const lowestPrice = sortedPrices[0]?.price || 0;
  const highestPrice = sortedPrices[sortedPrices.length - 1]?.price || 0;
  const savings = highestPrice - lowestPrice;

  return (
    <main className="flex-1 bg-surface-50">
      <Header 
        title={medicine.brand_name}
        subtitle={medicine.generic_name}
        backHref="/medicines"
        backLabel="Back to Search"
      />

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Medicine Info */}
        <div className="card mb-6">
          <h2 className="font-semibold text-surface-900 mb-4">Medicine Information</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-surface-500">Dosage Form</span>
              <p className="font-medium">{medicine.dosage_form}</p>
            </div>
            <div>
              <span className="text-surface-500">Strength</span>
              <p className="font-medium">{medicine.strength}</p>
            </div>
            <div>
              <span className="text-surface-500">Manufacturer</span>
              <p className="font-medium">{medicine.manufacturer}</p>
            </div>
            <div>
              <span className="text-surface-500">FDA Registration</span>
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
                  You can save up to {new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(savings)}
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
          <h2 className="font-semibold text-surface-900 mb-4">
            Prices ({prices.length} pharmacies)
          </h2>
          
          {prices.length === 0 ? (
            <div className="text-center py-8">
              <AlertTriangle className="w-12 h-12 text-surface-300 mx-auto mb-3" />
              <p className="text-surface-600">No prices available yet</p>
              <p className="text-sm text-surface-500 mt-1">
                Be the first to submit a price!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedPrices.map((price, index) => (
                <PriceCard 
                  key={price.id} 
                  price={price} 
                  isLowest={index === 0}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
