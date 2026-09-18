'use client';

import { useState } from 'react';
import { Search, Pill, ShieldCheck, TrendingDown, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/medicines?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            BotikaBantay
          </h1>
          <p className="text-xl md:text-2xl mb-2 text-primary-100">
            Presyo na Tama, Gamot na Tunay
          </p>
          <p className="text-lg mb-8 text-primary-200">
            The Right Price, The Real Medicine
          </p>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
              <input
                type="text"
                placeholder="Search medicine by brand, generic name, or condition..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-4 py-4 rounded-xl text-gray-900 text-lg shadow-lg focus:outline-none focus:ring-4 focus:ring-primary-300"
                aria-label="Search medicine"
              />
            </div>
          </form>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">
            What would you like to do?
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Price Check Card */}
            <Link href="/medicines" className="card hover:shadow-lg transition-shadow cursor-pointer group">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary-100 rounded-xl group-hover:bg-primary-200 transition-colors">
                  <TrendingDown className="w-8 h-8 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Presyo Check
                  </h3>
                  <p className="text-gray-600">
                    Compare medicine prices across major pharmacy chains. Find the best deals near you.
                  </p>
                </div>
              </div>
            </Link>

            {/* Verification Card */}
            <Link href="/scanner" className="card hover:shadow-lg transition-shadow cursor-pointer group">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
                  <ShieldCheck className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Tunay Check
                  </h3>
                  <p className="text-gray-600">
                    Scan barcode or QR code to verify if medicine is FDA-registered and authentic.
                  </p>
                </div>
              </div>
            </Link>

            {/* Nearby Pharmacies Card */}
            <Link href="/nearby" className="card hover:shadow-lg transition-shadow cursor-pointer group">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-orange-100 rounded-xl group-hover:bg-orange-200 transition-colors">
                  <MapPin className="w-8 h-8 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Nearby Pharmacies
                  </h3>
                  <p className="text-gray-600">
                    Find pharmacies near you with the best prices and directions.
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">
            Why BotikaBantay?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Pill className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">100+ Medicines</h3>
              <p className="text-gray-600 text-sm">
                Comprehensive database of common OTC and maintenance medications
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">FDA Verified</h3>
              <p className="text-gray-600 text-sm">
                Cross-referenced with official FDA Philippines drug registry
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Location-Based</h3>
              <p className="text-gray-600 text-sm">
                Find pharmacies near you with the best prices
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-400 text-sm mb-2">
            BotikaBantay - Presyo na Tama, Gamot na Tunay
          </p>
          <p className="text-gray-500 text-xs">
            © {new Date().getFullYear()} BotikaBantay. All rights reserved. Not a substitute for professional medical advice.
          </p>
        </div>
      </footer>
    </main>
  );
}
