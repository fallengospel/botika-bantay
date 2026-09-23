'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  Search,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Flag,
  Loader2,
  Clock,
  X,
  ExternalLink,
} from 'lucide-react';
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

interface VerifyResult {
  status: 'found' | 'not_found' | 'ambiguous' | 'error' | 'rate_limited';
  message?: string;
  error?: string;
  medicine?: Medicine | null;
  suggestions?: { id: string; brand_name: string; generic_name: string }[];
  checkedCode?: string;
}

interface HistoryEntry {
  code: string;
  status: VerifyResult['status'];
  brand?: string;
  at: number;
}

const HISTORY_KEY = 'botika_verify_history';
const HISTORY_MAX = 5;
const LIVE_DEBOUNCE_MS = 350;
const MIN_LIVE_CHARS = 4;

function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.slice(0, HISTORY_MAX) : [];
  } catch {
    return [];
  }
}

function pushHistory(entry: HistoryEntry): HistoryEntry[] {
  const next = [entry, ...loadHistory().filter((h) => h.code !== entry.code)].slice(
    0,
    HISTORY_MAX
  );
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  } catch {
    // ignore quota / private mode
  }
  return next;
}

function sanitizeCode(raw: string): string {
  return raw
    .trim()
    .replace(/[,()%*]/g, ' ')
    .replace(/\s+/g, ' ')
    .slice(0, 64);
}

function statusLabel(status: VerifyResult['status']): string {
  switch (status) {
    case 'found':
      return 'Listed in catalog';
    case 'not_found':
      return 'Not in catalog';
    case 'ambiguous':
      return 'Multiple matches';
    case 'rate_limited':
      return 'Rate limited';
    default:
      return 'Could not check';
  }
}

export default function ScannerPage() {
  const [searchCode, setSearchCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [liveHint, setLiveHint] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inFlightRef = useRef(0);
  const lastQueriedRef = useRef('');

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const runVerify = useCallback(async (raw: string) => {
    const code = sanitizeCode(raw);
    if (!code || code.length < MIN_LIVE_CHARS) {
      setResult(null);
      lastQueriedRef.current = '';
      return;
    }
    lastQueriedRef.current = code;

    const ticket = ++inFlightRef.current;
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scannedCode: code }),
      });

      if (response.status === 429) {
        const data = await response.json().catch(() => ({}));
        const limited: VerifyResult = {
          status: 'rate_limited',
          error: data.error || 'Too many requests. Please try again later.',
          checkedCode: code,
        };
        if (ticket === inFlightRef.current) setResult(limited);
        return;
      }

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        const failed: VerifyResult = {
          status: 'error',
          error: data.error || `Verification failed (${response.status})`,
          checkedCode: code,
        };
        if (ticket === inFlightRef.current) setResult(failed);
        return;
      }

      const data = (await response.json()) as VerifyResult;
      const next: VerifyResult = { ...data, checkedCode: code };
      if (ticket !== inFlightRef.current) return;

      setResult(next);
      if (next.status === 'found' || next.status === 'not_found' || next.status === 'ambiguous') {
        setHistory(
          pushHistory({
            code,
            status: next.status,
            brand: next.medicine?.brand_name,
            at: Date.now(),
          })
        );
      }
    } catch {
      if (ticket === inFlightRef.current) {
        setResult({
          status: 'error',
          error: 'Failed to verify product. Check your connection and try again.',
          checkedCode: code,
        });
      }
    } finally {
      if (ticket === inFlightRef.current) setLoading(false);
    }
  }, [loading]);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (debounceRef.current) clearTimeout(debounceRef.current);
    void runVerify(searchCode);
  };

  const handleChange = (value: string) => {
    setSearchCode(value);
    const code = sanitizeCode(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    setLiveHint(code.length >= MIN_LIVE_CHARS);

    if (!code) {
      setResult(null);
      lastQueriedRef.current = '';
      setLiveHint(false);
      return;
    }

    debounceRef.current = setTimeout(() => {
      void runVerify(code);
    }, LIVE_DEBOUNCE_MS);
  };

  const clearInput = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setSearchCode('');
    setResult(null);
    setLiveHint(false);
    lastQueriedRef.current = '';
    inFlightRef.current += 1;
    setLoading(false);
  };

  const restoreFromHistory = (entry: HistoryEntry) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setSearchCode(entry.code);
    setLiveHint(true);
    void runVerify(entry.code);
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const clearHistory = () => {
    try {
      localStorage.removeItem(HISTORY_KEY);
    } catch {
      // ignore
    }
    setHistory([]);
  };

  const fdaLink =
    result?.medicine?.fda_registration_number
      ? `https://www.fda.gov.ph/verification?search=${encodeURIComponent(
          result.medicine.fda_registration_number
        )}`
      : null;

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
          <p className="text-brand-muted">
            Check if a medicine is listed in the BotikaBantay catalog of FDA-registered products
          </p>
        </div>
      </div>

      <div className="page-container max-w-3xl py-8">
        {/* How to verify — honest scope */}
        <div className="card bg-medical-50 border-medical-200 mb-6">
          <h3 className="font-medium text-medical-800 mb-2">How to verify</h3>
          <ul className="text-sm text-medical-700 space-y-1.5">
            <li>• Hanapin ang barcode o FDA Registration Number (hal. FR-XXXX-XXXX) sa packaging</li>
            <li>• I-type ito sa search field — auto-check habang nagta-type ka</li>
            <li>• Iche-check namin against the BotikaBantay catalog (not a live FDA API)</li>
            <li>
              • Para sa opisyal na lookup, gamitin ang{' '}
              <a
                href="https://www.fda.gov.ph/verification"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-medium"
              >
                FDA Philippines verification page
              </a>
            </li>
          </ul>
        </div>

        {/* Manual Lookup + live input */}
        <div className="card-elevated mb-6">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <h2 className="font-semibold text-surface-900">Manual Lookup</h2>
              <p className="text-sm text-surface-500 mt-1">
                Type a barcode, QR data, or FDA registration number. Results appear as you type.
              </p>
            </div>
            <button
              type="button"
              onClick={clearInput}
              disabled={!searchCode && !result}
              className="btn-outline text-sm shrink-0 disabled:opacity-40"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
              Clear
            </button>
          </div>

          <form onSubmit={handleVerify} className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
              <input
                type="text"
                placeholder="Type barcode, QR code, or FDA registration #"
                value={searchCode}
                onChange={(e) => handleChange(e.target.value)}
                className="input-field pl-10"
                aria-label="Barcode, QR code, or FDA registration number"
                autoComplete="off"
                spellCheck={false}
                maxLength={64}
              />
            </div>
            <button
              type="submit"
              disabled={loading || sanitizeCode(searchCode).length < MIN_LIVE_CHARS}
              className="btn-primary"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Checking...
                </span>
              ) : (
                'Verify'
              )}
            </button>
          </form>
          {liveHint && !loading && (
            <p className="text-xs text-surface-500 mt-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              Live check runs automatically after a short pause
            </p>
          )}
        </div>

        {/* Result card */}
        <div role="status" aria-live="polite">
          {result && (
            <div
              className={`card-elevated mb-6 ${
                result.status === 'found'
                  ? 'border-l-4 border-l-primary-500 bg-primary-50/30'
                  : result.status === 'not_found' || result.status === 'ambiguous'
                    ? 'border-l-4 border-l-amber-500 bg-amber-50/30'
                    : 'border-l-4 border-l-danger bg-danger-light/30'
              }`}
            >
              <div className="flex items-start gap-4">
                {result.status === 'found' ? (
                  <div className="p-2 rounded-lg bg-primary-100 shrink-0">
                    <CheckCircle className="w-6 h-6 text-primary-600" />
                  </div>
                ) : result.status === 'not_found' || result.status === 'ambiguous' ? (
                  <div className="p-2 rounded-lg bg-amber-100 shrink-0">
                    <AlertTriangle className="w-6 h-6 text-amber-600" />
                  </div>
                ) : (
                  <div className="p-2 rounded-lg bg-danger-light shrink-0">
                    <XCircle className="w-6 h-6 text-danger" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span
                      className={`text-[11px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${
                        result.status === 'found'
                          ? 'bg-primary-100 text-primary-700'
                          : result.status === 'not_found' || result.status === 'ambiguous'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-danger-light text-danger'
                      }`}
                    >
                      {statusLabel(result.status)}
                    </span>
                    {result.checkedCode && (
                      <code className="text-xs text-surface-500 truncate">
                        {result.checkedCode}
                      </code>
                    )}
                  </div>

                  <h3
                    className={`text-lg font-semibold ${
                      result.status === 'found'
                        ? 'text-primary-800'
                        : result.status === 'not_found' || result.status === 'ambiguous'
                          ? 'text-amber-800'
                          : 'text-danger-dark'
                    }`}
                  >
                    {result.status === 'found'
                      ? 'Found in catalog'
                      : result.status === 'not_found'
                        ? 'Not in our catalog'
                        : result.status === 'ambiguous'
                          ? 'Multiple possible matches'
                          : result.status === 'rate_limited'
                            ? 'Too many checks'
                            : 'Could not check'}
                  </h3>

                  <p
                    className={`text-sm ${
                      result.status === 'found'
                        ? 'text-primary-700'
                        : result.status === 'not_found' || result.status === 'ambiguous'
                          ? 'text-amber-700'
                          : 'text-danger'
                    }`}
                  >
                    {result.message || result.error}
                  </p>

                  <p className="text-xs text-surface-500 mt-2">
                    This checks the BotikaBantay catalog — not a live FDA Philippines API. A listed
                    product is not a guarantee of authenticity.
                  </p>

                  {result.medicine && (
                    <div className="mt-4 p-4 bg-white rounded-xl border border-surface-200">
                      <h4 className="font-medium text-surface-900 mb-3">Product details</h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-surface-500">Brand Name</span>
                          <p className="font-medium text-surface-900">
                            {result.medicine.brand_name || '—'}
                          </p>
                        </div>
                        <div>
                          <span className="text-surface-500">Generic Name</span>
                          <p className="font-medium text-surface-900">
                            {result.medicine.generic_name || '—'}
                          </p>
                        </div>
                        <div>
                          <span className="text-surface-500">Strength / Form</span>
                          <p className="font-medium text-surface-900">
                            {[result.medicine.strength, result.medicine.dosage_form]
                              .filter(Boolean)
                              .join(' · ') || '—'}
                          </p>
                        </div>
                        <div>
                          <span className="text-surface-500">Manufacturer</span>
                          <p className="font-medium text-surface-900">
                            {result.medicine.manufacturer || '—'}
                          </p>
                        </div>
                        <div className="col-span-2">
                          <span className="text-surface-500">FDA Registration</span>
                          <p className="font-medium text-surface-900">
                            {result.medicine.fda_registration_number || '—'}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-3 mt-4">
                        <Link
                          href={`/medicines/${result.medicine.id}`}
                          className="btn-primary text-sm"
                        >
                          View Prices
                        </Link>
                        {fdaLink && (
                          <a
                            href={fdaLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-outline text-sm"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            Official FDA lookup
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {result.suggestions && result.suggestions.length > 0 && (
                    <div className="mt-4 p-4 bg-white rounded-xl border border-surface-200">
                      <h4 className="font-medium text-surface-900 mb-2">Possible matches</h4>
                      <ul className="space-y-2">
                        {result.suggestions.map((s) => (
                          <li key={s.id}>
                            <Link
                              href={`/medicines/${s.id}`}
                              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                            >
                              {s.brand_name} — {s.generic_name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {(result.status === 'not_found' || result.status === 'ambiguous') && (
                    <div className="mt-4 flex flex-wrap gap-3">
                      <Link
                        href={`/report?code=${encodeURIComponent(result.checkedCode || searchCode)}`}
                        className="btn-outline text-sm"
                      >
                        <Flag className="w-3.5 h-3.5" />
                        Report incorrect or suspicious code
                      </Link>
                      <Link
                        href={`/medicines?search=${encodeURIComponent(searchCode)}`}
                        className="btn-outline text-sm"
                      >
                        <Search className="w-3.5 h-3.5" />
                        Search by brand or generic name
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Recent checks (local, private to this device) */}
        <div className="card-elevated">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="font-semibold text-surface-900">Recent checks</h2>
              <p className="text-sm text-surface-500 mt-0.5">
                Saved on this device only (last {HISTORY_MAX})
              </p>
            </div>
            {history.length > 0 && (
              <button
                type="button"
                onClick={clearHistory}
                className="text-sm text-brand-muted hover:text-brand-ink font-medium"
              >
                Clear
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <p className="text-sm text-surface-500">
              Walang recent checks pa. Type a code above — lalabas dito ang huling verification
              results mo.
            </p>
          ) : (
            <ul className="divide-y divide-surface-100">
              {history.map((entry) => (
                <li key={`${entry.code}-${entry.at}`}>
                  <button
                    type="button"
                    onClick={() => restoreFromHistory(entry)}
                    className="w-full text-left py-3 flex items-center justify-between gap-3 hover:bg-surface-50 rounded-lg px-2 -mx-2 transition-colors"
                    aria-label={`Re-check ${entry.code}`}
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-surface-900 truncate">
                        {entry.brand || entry.code}
                      </p>
                      <p className="text-xs text-surface-500 truncate">
                        {entry.code} · {new Date(entry.at).toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`text-[11px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full shrink-0 ${
                        entry.status === 'found'
                          ? 'bg-primary-100 text-primary-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {statusLabel(entry.status)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
