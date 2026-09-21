'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, Search, MapPin, Coins, 
  CheckCircle2, AlertTriangle, Info, Send, Loader2
} from 'lucide-react';

interface Medicine {
  id: string;
  brand_name: string;
  generic_name: string;
  dosage_form: string;
  strength: string;
  fda_registration_number: string;
}

interface Branch {
  id: string;
  name: string;
  address: string;
  city: string;
  chain: { id: string; name: string; color: string };
}

export default function SubmitPricePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [price, setPrice] = useState('');
  const [outlierWarning, setOutlierWarning] = useState<{ isOutlier: boolean; median: number; deviation: number } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [dailyRemaining, setDailyRemaining] = useState<number | null>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      const timer = setTimeout(async () => {
        try {
          const res = await fetch(`/api/medicines?search=${encodeURIComponent(searchQuery)}&limit=8`);
          if (res.ok) {
            const result = await res.json();
            setMedicines(result.data || []);
          }
        } catch {
          setMedicines([]);
        }
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setMedicines([]);
    }
  }, [searchQuery]);

  const selectMedicine = async (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    setStep(2);
    try {
      const res = await fetch(`/api/branches`);
      if (res.ok) {
        const data = await res.json();
        setBranches(data);
      }
    } catch {
      setError('Failed to load pharmacy branches. Please try again.');
    }
  };

  const selectBranch = (branch: Branch) => {
    setSelectedBranch(branch);
    setStep(3);
  };

  const checkOutlier = useCallback(async (priceValue: number) => {
    if (!selectedMedicine) return;
    try {
      const res = await fetch(
        `/api/prices/check-outlier?medicineId=${selectedMedicine.id}&price=${priceValue}`
      );
      if (res.ok) {
        const data = await res.json();
        setOutlierWarning(data);
      }
    } catch {
      setOutlierWarning(null);
    }
  }, [selectedMedicine]);

  const handlePriceChange = (value: string) => {
    setPrice(value);
    const numVal = parseFloat(value);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    if (numVal > 0) {
      debounceTimer.current = setTimeout(() => checkOutlier(numVal), 500);
    } else {
      setOutlierWarning(null);
    }
  };

  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMedicine || !selectedBranch || !price) return;
    
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/prices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          medicineId: selectedMedicine.id,
          branchId: selectedBranch.id,
          price: parseFloat(price),
          sourceType: 'crowdsourced',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit');

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to submit price');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-surface-50">
        <header className="bg-white border-b border-surface-100">
          <div className="page-container flex items-center h-14">
            <Link href="/medicines" className="flex items-center gap-2 text-surface-600 hover:text-surface-900">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back</span>
            </Link>
          </div>
        </header>
        <main className="flex items-center justify-center min-h-[80vh]">
          <div className="card-elevated max-w-md w-full mx-4 p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-primary-600" />
            </div>
            <h1 className="heading-3 mb-2">Salamat!</h1>
            <p className="text-surface-600 mb-2">
              Ang iyong price submission ay na-submit na para sa review.
            </p>
            <p className="text-sm text-surface-500 mb-6">
              {selectedMedicine?.brand_name} @ {selectedBranch?.name} — ₱{price}
            </p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => { setSubmitted(false); setStep(1); setPrice(''); setSelectedMedicine(null); setSelectedBranch(null); setOutlierWarning(null); }} className="btn-primary">
                Submit Another
              </button>
              <Link href="/medicines" className="btn-secondary">
                View Medicines
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50">
      <header className="bg-white border-b border-surface-100">
        <div className="page-container flex items-center justify-between h-14">
          <Link href="/medicines" className="flex items-center gap-2 text-surface-600 hover:text-surface-900">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back</span>
          </Link>
          <h1 className="text-sm font-semibold text-surface-900">Submit Price</h1>
          <div className="w-16" />
        </div>
      </header>

      <main className="page-container max-w-2xl py-8">
        {/* Step Indicator */}
        <div className="flex items-center gap-3 mb-8">
          {[
            { n: 1, label: 'Select Medicine' },
            { n: 2, label: 'Select Branch' },
            { n: 3, label: 'Enter Price' },
          ].map((s, i) => (
            <div key={s.n} className="flex items-center gap-3 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium shrink-0 transition-colors ${
                step >= s.n ? 'bg-primary-600 text-white' : 'bg-surface-200 text-surface-500'
              }`}>
                {step > s.n ? <CheckCircle2 className="w-4 h-4" /> : s.n}
              </div>
              <span className={`text-sm hidden sm:block ${step >= s.n ? 'text-surface-900 font-medium' : 'text-surface-500'}`}>{s.label}</span>
              {i < 2 && <div className={`flex-1 h-px ${step > s.n ? 'bg-primary-300' : 'bg-surface-200'}`} />}
            </div>
          ))}
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-danger-light border border-danger/20 text-sm text-danger-dark flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
            {error}
          </div>
        )}

        {/* Step 1: Select Medicine */}
        {step === 1 && (
          <div className="animate-in">
            <h2 className="heading-3 mb-2">Alin ang gamot?</h2>
            <p className="text-sm text-surface-500 mb-6">I-search at piliin ang gamot na gusto mong i-submit ang presyo.</p>
            
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
              <input
                type="text"
                placeholder="Search by brand or generic name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10"
                autoFocus
                aria-label="Search medicine by brand or generic name"
              />
            </div>

            {medicines.length > 0 && (
              <div className="space-y-2">
                {medicines.map((med) => (
                  <button
                    key={med.id}
                    onClick={() => selectMedicine(med)}
                    className="w-full text-left p-4 bg-white rounded-xl border border-surface-200 hover:border-primary-300 hover:shadow-impeccable transition-all"
                  >
                    <div className="font-medium text-surface-900">{med.brand_name}</div>
                    <div className="text-sm text-surface-500">{med.generic_name} · {med.strength} · {med.dosage_form}</div>
                  </button>
                ))}
              </div>
            )}

            {searchQuery.length >= 2 && medicines.length === 0 && (
              <div className="text-center py-12 text-surface-500">
                <p>No medicines found for &ldquo;{searchQuery}&rdquo;</p>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Select Branch */}
        {step === 2 && selectedMedicine && (
          <div className="animate-in">
            <div className="mb-6">
              <div className="badge-info mb-2">{selectedMedicine.brand_name} · {selectedMedicine.strength}</div>
              <h2 className="heading-3 mb-2">Saan nabili?</h2>
              <p className="text-sm text-surface-500">Piliin ang pharmacy branch kung saan mo nakita ang presyo.</p>
            </div>

            <div className="space-y-2 max-h-[50vh] overflow-y-auto">
              {branches.map((branch) => (
                <button
                  key={branch.id}
                  onClick={() => selectBranch(branch)}
                  className="w-full text-left p-4 bg-white rounded-xl border border-surface-200 hover:border-primary-300 hover:shadow-impeccable transition-all flex items-center gap-3"
                >
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: branch.chain?.color || '#999' }} />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-surface-900 truncate">{branch.name}</div>
                    <div className="text-sm text-surface-500 truncate">{branch.chain?.name} · {branch.address}, {branch.city}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Enter Price */}
        {step === 3 && selectedMedicine && selectedBranch && (
          <div className="animate-in">
            <div className="mb-6">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="badge-info">{selectedMedicine.brand_name}</span>
                <span className="badge-info">{selectedBranch.chain?.name} · {selectedBranch.name}</span>
              </div>
              <h2 className="heading-3 mb-2">Magkano?</h2>
              <p className="text-sm text-surface-500">I-enter ang presyo ng gamot sa branch na ito.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="input-label">Price (₱)</label>
                <div className="relative">
                  <Coins className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={price}
                    onChange={(e) => handlePriceChange(e.target.value)}
                    placeholder="0.00"
                    className="input-field pl-10 text-lg font-semibold"
                    autoFocus
                    required
                  />
                </div>
              </div>

              {outlierWarning && outlierWarning.isOutlier && (
                <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-amber-800">Unusual price detected</p>
                      <p className="text-sm text-amber-700 mt-1">
                        Median price is ₱{outlierWarning.median.toFixed(2)}. Your submission is {outlierWarning.deviation.toFixed(0)}% off.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="card bg-surface-50 border-surface-200 p-4">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-surface-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-surface-600">
                    Ang submission ay subject for review. Maaaring hindi agad ma-publish hanggang ma-verify.
                  </p>
                </div>
              </div>

              <button type="submit" disabled={submitting || !price || parseFloat(price) <= 0} className="btn-primary w-full">
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    Submit Price
                  </span>
                )}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
