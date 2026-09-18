'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Flag, AlertTriangle, CheckCircle2, Camera, Send, Loader2 } from 'lucide-react';

export default function ReportPage() {
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [medicineName, setMedicineName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !description.trim()) return;

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scannedCode: code.trim(),
          description: description.trim(),
          medicineName: medicineName.trim() || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to submit report');
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-surface-50">
        <header className="bg-white border-b border-surface-100">
          <div className="page-container flex items-center h-14">
            <Link href="/" className="flex items-center gap-2 text-surface-600 hover:text-surface-900">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back</span>
            </Link>
          </div>
        </header>
        <main className="flex items-center justify-center min-h-[80vh]">
          <div className="card-elevated max-w-md w-full mx-4 p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-amber-600" />
            </div>
            <h1 className="heading-3 mb-2">Report Submitted</h1>
            <p className="text-surface-600 mb-6">
              Salamat sa iyong report. I-review namin ito at i-forward sa FDA kung kinakailangan.
            </p>
            <Link href="/" className="btn-primary">
              Back to Home
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50">
      <header className="bg-white border-b border-surface-100">
        <div className="page-container flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2 text-surface-600 hover:text-surface-900">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back</span>
          </Link>
          <h1 className="text-sm font-semibold text-surface-900">Report Suspicious Product</h1>
          <div className="w-16" />
        </div>
      </header>

      <main className="page-container max-w-lg py-8">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-sm font-medium mb-4">
            <AlertTriangle className="w-3.5 h-3.5" />
            I-Report ang Kahina-hinalang Gamot
          </div>
          <h1 className="heading-3 mb-2">May nakita kang peke o kahina-hinalang gamot?</h1>
          <p className="text-surface-600">
            I-submit ang mga detalye para sa aming team. I-forward namin ito sa FDA Philippines kung kinakailangan.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-danger-light border border-danger/20 text-sm text-danger-dark">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="input-label">Barcode / QR Code / FDA Registration Number *</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. 4806512345678 or PH-2024-001234"
              className="input-field"
              required
            />
            <p className="input-hint">I-scan o i-type ang code mula sa packaging ng gamot.</p>
          </div>

          <div>
            <label className="input-label">Pangalan ng Gamot (optional)</label>
            <input
              type="text"
              value={medicineName}
              onChange={(e) => setMedicineName(e.target.value)}
              placeholder="e.g. Biogesic 500mg"
              className="input-field"
            />
          </div>

          <div>
            <label className="input-label">Ano ang problema? *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ilarawan kung bakit mo naisip na kahina-hinalang gamot ito..."
              className="input-field min-h-[120px] resize-y"
              required
            />
            <p className="input-hint">Halimbawa: iba ang lasa, iba ang packaging, walang FDA number, etc.</p>
          </div>

          <div className="card bg-surface-50 border-surface-200 p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
              <div className="text-sm text-surface-600">
                <p className="font-medium text-surface-700 mb-1">Paalala:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Hindi ito kapalit ng pagpunta sa doctor.</li>
                  <li>Kung may emergency, tumawag sa 911 o pinakamalapit na hospital.</li>
                  <li>Ang report ay confidential at i-review ng aming team.</li>
                </ul>
              </div>
            </div>
          </div>

          <button type="submit" disabled={submitting || !code.trim() || !description.trim()} className="btn-primary w-full">
            {submitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting report...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Send className="w-4 h-4" />
                Submit Report
              </span>
            )}
          </button>
        </form>
      </main>
    </div>
  );
}
