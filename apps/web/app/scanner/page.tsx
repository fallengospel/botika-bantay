'use client';

import { useState } from 'react';
import { ArrowLeft, Search, CheckCircle, XCircle, AlertTriangle, Flag, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { LogoMark } from '@/components/brand/LogoMark';

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
      if (!response.ok) {
        throw new Error(`Verification failed (${response.status})`);
      }
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ status: 'error', message: 'Failed to verify product. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 bg-brand-paper">
      <div className="bg-white border-b border-brand-line">
        <div className="page-container py-6">
          <Link href="/" className="flex items-center gap-2 text-brand-muted hover:text-brand-ink mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back</span>
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-brand-ink text-white shadow-impeccable-md">
              <LogoMark size={28} tone="reversed" title="" />
            </div>
            <h1 className="heading-2">Verify</h1>
          </div>
          <p className="text-brand-muted">Verify if medicine is FDA-registered and authentic</p>
        </div>
      </div>

      <div className="page-container max-w-3xl py-8">
        {/* How to Verify - Instructions first */}
        <div className="card bg-medical-50 border-medical-200 mb-6">
          <h3 className="font-medium text-medical-800 mb-2">How to verify</h3>
          <ul className="text-sm text-medical-700 space-y-1.5">
            <li>• Hanapin ang barcode sa packaging ng gamot</li>
            <li>• I-type ang mga numero sa ilalim ng barcode</li>
            <li>• Or i-enter ang FDA Registration Number (hal. FR-XXXX-XXXX)</li>
            <li>• Iche-check ito ng sistema against the FDA Philippines registry</li>
          </ul>
        </div>

        {/* Manual Lookup */}
        <div className="card-elevated mb-6">
          <h2 className="font-semibold text-surface-900 mb-2">Manual Lookup</h2>
          <p className="text-sm text-surface-500 mb-4">
            I-type ang barcode number, QR code data, o FDA registration number para ma-verify ang produkto.
          </p>
          <form onSubmit={handleVerify} className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
              <input
                type="text"
                placeholder="Type barcode, QR code, or FDA registration #"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                className="input-field pl-10"
                aria-label="Barcode, QR code, or FDA registration number"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !searchCode.trim()}
              className="btn-primary"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying...
                </span>
              ) : (
                'Verify'
              )}
            </button>
          </form>
        </div>

        {/* Result */}
        {result && (
          <div role="status" aria-live="polite" className={`card-elevated mb-6 ${
            result.status === 'found' ? 'border-l-4 border-l-primary-500 bg-primary-50/30' :
            result.status === 'not_found' ? 'border-l-4 border-l-amber-500 bg-amber-50/30' :
            'border-l-4 border-l-danger bg-danger-light/30'
          }`}>
            <div className="flex items-start gap-4">
              {result.status === 'found' ? (
                <div className="p-2 rounded-lg bg-primary-100 shrink-0">
                  <CheckCircle className="w-6 h-6 text-primary-600" />
                </div>
              ) : result.status === 'not_found' ? (
                <div className="p-2 rounded-lg bg-amber-100 shrink-0">
                  <AlertTriangle className="w-6 h-6 text-amber-600" />
                </div>
              ) : (
                <div className="p-2 rounded-lg bg-danger-light shrink-0">
                  <XCircle className="w-6 h-6 text-danger" />
                </div>
              )}
              <div className="flex-1">
                <h3 className={`text-lg font-semibold ${
                  result.status === 'found' ? 'text-primary-800' :
                  result.status === 'not_found' ? 'text-amber-800' : 'text-danger-dark'
                }`}>
                   {result.status === 'found' ? 'Authentic Product ✓' :
                   result.status === 'not_found' ? 'Product Not Found' : 'Error'}
                </h3>
                <p className={`text-sm ${
                  result.status === 'found' ? 'text-primary-700' :
                  result.status === 'not_found' ? 'text-amber-700' : 'text-danger'
                }`}>
                  {result.message}
                </p>

                {result.medicine && (
                  <div className="mt-4 p-4 bg-white rounded-xl border border-surface-200">
                    <h4 className="font-medium text-surface-900 mb-3">Product Details</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-surface-500">Brand Name</span>
                        <p className="font-medium text-surface-900">{result.medicine.brand_name}</p>
                      </div>
                      <div>
                        <span className="text-surface-500">Generic Name</span>
                        <p className="font-medium text-surface-900">{result.medicine.generic_name}</p>
                      </div>
                      <div>
                        <span className="text-surface-500">Manufacturer</span>
                        <p className="font-medium text-surface-900">{result.medicine.manufacturer}</p>
                      </div>
                      <div>
                        <span className="text-surface-500">FDA Registration</span>
                        <p className="font-medium text-surface-900">{result.medicine.fda_registration_number}</p>
                      </div>
                    </div>
                    <div className="flex gap-3 mt-4">
                      <Link
                        href={`/medicines/${result.medicine.id}`}
                        className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                      >
                        View Prices →
                      </Link>
                    </div>
                  </div>
                )}

                {result.status === 'not_found' && (
                  <div className="mt-4 flex gap-3">
                    <Link
                      href={`/report?code=${encodeURIComponent(searchCode)}`}
                      className="btn-outline text-sm"
                    >
                      <Flag className="w-3.5 h-3.5" />
                      Report Suspicious Product
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
