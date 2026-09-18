'use client';

import { useState } from 'react';
import { ArrowLeft, Search, ShieldCheck, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

interface Medicine {
  id: string;
  brand_name: string;
  generic_name: string;
  dosage_form: string;
  strength: string;
  manufacturer: string;
  fda_registration_number: string;
  barcode: string;
}

export default function ScannerPage() {
  const [searchCode, setSearchCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ status: string; medicine?: Medicine; message: string } | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchCode.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scannedCode: searchCode.trim() }),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ status: 'error', message: 'Failed to verify product. Please try again.' });
    } finally {
      setLoading(false);
    }
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
          <h1 className="text-2xl font-bold text-gray-900">Tunay Check</h1>
          <p className="text-gray-600">Verify if medicine is FDA-registered and authentic</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Manual Lookup */}
        <div className="card mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">Manual Verification</h2>
          <p className="text-sm text-gray-600 mb-4">
            Enter the barcode number, QR code data, or FDA registration number to verify a product.
          </p>
          <form onSubmit={handleVerify} className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Enter barcode, QR code, or FDA registration #"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !searchCode.trim()}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Verifying...' : 'Verify'}
            </button>
          </form>
        </div>

        {/* Result */}
        {result && (
          <div className={`card ${result.status === 'found' ? 'border-green-200 bg-green-50' : result.status === 'not_found' ? 'border-yellow-200 bg-yellow-50' : 'border-red-200 bg-red-50'}`}>
            <div className="flex items-start gap-4">
              {result.status === 'found' ? (
                <CheckCircle className="w-8 h-8 text-green-600 mt-1" />
              ) : result.status === 'not_found' ? (
                <AlertTriangle className="w-8 h-8 text-yellow-600 mt-1" />
              ) : (
                <XCircle className="w-8 h-8 text-red-600 mt-1" />
              )}
              <div className="flex-1">
                <h3 className={`text-lg font-semibold ${result.status === 'found' ? 'text-green-800' : result.status === 'not_found' ? 'text-yellow-800' : 'text-red-800'}`}>
                  {result.status === 'found' ? 'Product Verified' : result.status === 'not_found' ? 'Product Not Found' : 'Error'}
                </h3>
                <p className={`text-sm ${result.status === 'found' ? 'text-green-700' : result.status === 'not_found' ? 'text-yellow-700' : 'text-red-700'}`}>
                  {result.message}
                </p>

                {result.medicine && (
                  <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-2">Product Details</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-500">Brand Name</span>
                        <p className="font-medium">{result.medicine.brand_name}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Generic Name</span>
                        <p className="font-medium">{result.medicine.generic_name}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Manufacturer</span>
                        <p className="font-medium">{result.medicine.manufacturer}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">FDA Registration</span>
                        <p className="font-medium">{result.medicine.fda_registration_number}</p>
                      </div>
                    </div>
                    <Link
                      href={`/medicines/${result.medicine.id}`}
                      className="mt-4 inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium text-sm"
                    >
                      View Prices →
                    </Link>
                  </div>
                )}

                {result.status === 'not_found' && (
                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => setResult(null)}
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      Try Another Code
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Info */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <h3 className="font-medium text-blue-800 mb-2">How to Verify</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Look for the barcode on the medicine packaging</li>
            <li>• Enter the numbers below the barcode</li>
            <li>• Or enter the FDA Registration Number (e.g., FR-XXXX-XXXX)</li>
            <li>• The system will cross-check against the FDA Philippines registry</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
