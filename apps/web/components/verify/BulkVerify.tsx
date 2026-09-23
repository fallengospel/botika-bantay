'use client';

import { useMemo, useRef, useState } from 'react';
import { ClipboardPaste, Download, Loader2, Play, Square } from 'lucide-react';

interface BulkRow {
  code: string;
  status: 'pending' | 'found' | 'not_found' | 'ambiguous' | 'error' | 'rate_limited' | 'skipped';
  brand?: string;
  fda?: string;
  message?: string;
}

const BULK_MAX = 20;
const BULK_DELAY_MS = 650;

function parseCodes(raw: string): string[] {
  const lines = raw
    .split(/[\n\r,;]+/)
    .map((l) => l.trim())
    .filter(Boolean);
  const seen = new Set<string>();
  const out: string[] = [];
  for (const line of lines) {
    const code = line.slice(0, 64);
    if (!code || seen.has(code.toLowerCase())) continue;
    seen.add(code.toLowerCase());
    out.push(code);
    if (out.length >= BULK_MAX) break;
  }
  return out;
}

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

interface BulkVerifyProps {
  /** Called after each successful check so the page can refresh recent history. */
  onEachResult?: (code: string, status: BulkRow['status'], brand?: string) => void;
}

export default function BulkVerify({ onEachResult }: BulkVerifyProps) {
  const [rawInput, setRawInput] = useState('');
  const [rows, setRows] = useState<BulkRow[]>([]);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const cancelRef = useRef(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const parsedPreview = useMemo(() => parseCodes(rawInput), [rawInput]);
  const overLimit = useMemo(() => {
    const all = rawInput
      .split(/[\n\r,;]+/)
      .map((l) => l.trim())
      .filter(Boolean);
    return all.length > BULK_MAX;
  }, [rawInput]);

  const reset = () => {
    cancelRef.current = true;
    setRunning(false);
    setRows([]);
    setProgress({ done: 0, total: 0 });
  };

  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setRawInput((prev) => (prev ? `${prev}\n${text}` : text));
      textareaRef.current?.focus();
    } catch {
      textareaRef.current?.focus();
    }
  };

  const exportCsv = () => {
    if (rows.length === 0) return;
    const header = ['code', 'status', 'brand', 'fda_registration', 'message'];
    const body = rows.map((r) =>
      [r.code, r.status, r.brand || '', r.fda || '', r.message || ''].map(csvEscape).join(',')
    );
    const csv = [header.join(','), ...body].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `botika-bulk-verify-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const runBulk = async () => {
    const codes = parseCodes(rawInput);
    if (codes.length === 0 || running) return;

    cancelRef.current = false;
    setRunning(true);
    setProgress({ done: 0, total: codes.length });
    setRows(codes.map((code) => ({ code, status: 'pending' as const })));

    for (let i = 0; i < codes.length; i++) {
      if (cancelRef.current) break;
      const code = codes[i];
      let status: BulkRow['status'] = 'error';
      let brand: string | undefined;
      let fda: string | undefined;
      let message: string | undefined;

      try {
        const response = await fetch('/api/verification', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ scannedCode: code }),
        });

        if (response.status === 429) {
          status = 'rate_limited';
          message = 'Rate limited — wait a minute and re-run remaining codes.';
          setRows((prev) =>
            prev.map((r, idx) =>
              idx === i ? { ...r, status, message } : idx > i ? { ...r, status: 'skipped', message: 'Skipped after rate limit' } : r
            )
          );
          setProgress({ done: codes.length, total: codes.length });
          break;
        }

        if (!response.ok) {
          status = 'error';
          message = `HTTP ${response.status}`;
        } else {
          const data = await response.json();
          status =
            data.status === 'found' || data.status === 'not_found' || data.status === 'ambiguous'
              ? data.status
              : 'error';
          brand = data.medicine?.brand_name;
          fda = data.medicine?.fda_registration_number;
          message = data.message || data.error;
        }
      } catch {
        status = 'error';
        message = 'Network error';
      }

      const row: BulkRow = { code, status, brand, fda, message };
      setRows((prev) => prev.map((r, idx) => (idx === i ? row : r)));
      setProgress({ done: i + 1, total: codes.length });
      onEachResult?.(code, status, brand);

      if (i < codes.length - 1 && !cancelRef.current) {
        await new Promise((resolve) => setTimeout(resolve, BULK_DELAY_MS));
      }
    }

    setRunning(false);
  };

  const counts = rows.reduce(
    (acc, r) => {
      acc[r.status] = (acc[r.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="card-elevated mb-6">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
        <div>
          <h2 className="font-semibold text-surface-900">Bulk verify</h2>
          <p className="text-sm text-surface-500 mt-1">
            Paste up to {BULK_MAX} codes (one per line, or comma-separated). Checked one-by-one on
            this device — no batch API.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={pasteFromClipboard} className="btn-outline text-sm">
            <ClipboardPaste className="w-3.5 h-3.5" />
            Paste
          </button>
          {rows.length > 0 && !running && (
            <button type="button" onClick={exportCsv} className="btn-outline text-sm">
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </button>
          )}
        </div>
      </div>

      <label htmlFor="bulk-codes" className="sr-only">
        Codes to verify
      </label>
      <textarea
        id="bulk-codes"
        ref={textareaRef}
        value={rawInput}
        onChange={(e) => setRawInput(e.target.value)}
        rows={5}
        maxLength={4000}
        placeholder={'Paste codes here, e.g.\n48000000000000\nFR-2020-0001\nBiogesic'}
        className="input-field w-full font-mono text-sm mb-2"
        disabled={running}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className={`text-xs ${overLimit ? 'text-danger font-medium' : 'text-surface-500'}`}>
          {overLimit
            ? `Only the first ${BULK_MAX} unique codes will run.`
            : `${parsedPreview.length} / ${BULK_MAX} unique codes ready`}
        </p>
        <div className="flex gap-2">
          {running && (
            <button type="button" onClick={reset} className="btn-outline text-sm">
              <Square className="w-3.5 h-3.5" />
              Stop
            </button>
          )}
          <button
            type="button"
            onClick={runBulk}
            disabled={running || parsedPreview.length === 0}
            className="btn-primary text-sm"
          >
            {running ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Checking {progress.done}/{progress.total}…
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Play className="w-3.5 h-3.5" />
                Verify {parsedPreview.length || ''} code{parsedPreview.length === 1 ? '' : 's'}
              </span>
            )}
          </button>
        </div>
      </div>

      {running && progress.total > 0 && (
        <div className="mt-3">
          <div className="h-2 rounded-full bg-surface-100 overflow-hidden">
            <div
              className="h-full bg-brand transition-all"
              style={{ width: `${(progress.done / progress.total) * 100}%` }}
            />
          </div>
        </div>
      )}

      {rows.length > 0 && (
        <div className="mt-4 overflow-x-auto">
          <div className="flex flex-wrap gap-2 mb-3 text-xs">
            <span className="px-2 py-0.5 rounded-full bg-primary-100 text-primary-700 font-medium">
              Listed: {counts.found || 0}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">
              Not listed: {counts.not_found || 0}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-surface-100 text-surface-600 font-medium">
              Other: {(counts.ambiguous || 0) + (counts.error || 0) + (counts.rate_limited || 0) + (counts.skipped || 0) + (counts.pending || 0)}
            </span>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-surface-500 border-b border-surface-200">
                <th className="py-2 pr-3 font-medium">Code</th>
                <th className="py-2 pr-3 font-medium">Status</th>
                <th className="py-2 font-medium">Result</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.code} className="border-b border-surface-100 align-top">
                  <td className="py-2 pr-3 font-mono text-xs text-surface-700">{row.code}</td>
                  <td className="py-2 pr-3">
                    <span
                      className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full whitespace-nowrap ${
                        row.status === 'found'
                          ? 'bg-primary-100 text-primary-700'
                          : row.status === 'not_found' || row.status === 'ambiguous'
                            ? 'bg-amber-100 text-amber-700'
                            : row.status === 'pending'
                              ? 'bg-surface-100 text-surface-500'
                              : 'bg-danger-light text-danger'
                      }`}
                    >
                      {row.status === 'pending'
                        ? 'Waiting'
                        : row.status === 'found'
                          ? 'Listed'
                          : row.status === 'not_found'
                            ? 'Not listed'
                            : row.status === 'rate_limited'
                              ? 'Rate limited'
                          : row.status === 'skipped'
                            ? 'Skipped'
                            : row.status === 'ambiguous'
                              ? 'Ambiguous'
                              : 'Error'}
                    </span>
                  </td>
                  <td className="py-2 text-surface-700">
                    {row.brand ? (
                      <span className="font-medium">{row.brand}</span>
                    ) : (
                      <span className="text-surface-500 line-clamp-2">{row.message || '—'}</span>
                    )}
                    {row.fda && <span className="block text-xs text-surface-500">{row.fda}</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-surface-500 mt-2">
            Catalog lookup only — not a live FDA registry check. Listed ≠ guaranteed authentic.
          </p>
        </div>
      )}
    </div>
  );
}
