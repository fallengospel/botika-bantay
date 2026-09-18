'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, Flag, AlertTriangle, CheckCircle2, XCircle, Clock, Eye, Filter, Loader2 } from 'lucide-react';
import { createSupabaseClient } from '@/lib/supabase-browser';

type Tab = 'submissions' | 'reports' | 'outliers';

interface PriceSubmission {
  id: string;
  medicine_id: string;
  branch_id: string;
  price: number;
  moderation_status: string;
  outlier_flag: boolean;
  created_at: string;
  medicine: { brand_name: string; generic_name: string };
  branch: { name: string; chain: { name: string } };
}

interface SuspiciousReport {
  id: string;
  scanned_code: string;
  description: string;
  moderation_status: string;
  created_at: string;
  medicine: { brand_name: string } | null;
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>('submissions');
  const [submissions, setSubmissions] = useState<PriceSubmission[]>([]);
  const [reports, setReports] = useState<SuspiciousReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  useEffect(() => {
    loadData();
  }, [activeTab, filter]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'submissions' || activeTab === 'outliers') {
        const res = await fetch(`/api/admin/submissions?status=${filter}${activeTab === 'outliers' ? '&outliers=true' : ''}`);
        if (res.ok) {
          const data = await res.json();
          setSubmissions(data);
        }
      } else {
        const res = await fetch(`/api/admin/reports?status=${filter}`);
        if (res.ok) {
          const data = await res.json();
          setReports(data);
        }
      }
    } catch {}
    setLoading(false);
  };

  const moderateSubmission = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await fetch('/api/admin/submissions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      setSubmissions(prev => prev.filter(s => s.id !== id));
    } catch {}
  };

  const moderateReport = async (id: string, status: 'reviewed' | 'forwarded_to_fda') => {
    try {
      await fetch('/api/admin/reports', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      setReports(prev => prev.filter(r => r.id !== id));
    } catch {}
  };

  const tabs = [
    { id: 'submissions' as Tab, label: 'Price Submissions', icon: Clock },
    { id: 'reports' as Tab, label: 'Suspicious Reports', icon: Flag },
    { id: 'outliers' as Tab, label: 'Outlier Prices', icon: AlertTriangle },
  ];

  const filters = ['all', 'pending', 'approved', 'rejected'] as const;

  return (
    <div className="min-h-screen bg-surface-50">
      <header className="bg-white border-b border-surface-100">
        <div className="page-container flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2 text-surface-600 hover:text-surface-900">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back</span>
          </Link>
          <h1 className="text-sm font-semibold text-surface-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary-600" />
            Admin Dashboard
          </h1>
          <div className="w-16" />
        </div>
      </header>

      <main className="page-container py-8">
        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-surface-100 rounded-xl mb-6 max-w-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex-1 justify-center ${
                activeTab === tab.id
                  ? 'bg-white text-surface-900 shadow-impeccable'
                  : 'text-surface-500 hover:text-surface-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:block">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-6">
          <Filter className="w-4 h-4 text-surface-400" />
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                filter === f
                  ? 'bg-primary-600 text-white'
                  : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
          </div>
        ) : (
          <div className="space-y-3">
            {/* Submissions / Outliers */}
            {(activeTab === 'submissions' || activeTab === 'outliers') && submissions.length === 0 && (
              <div className="text-center py-20 text-surface-500">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-surface-300" />
                <p>No submissions to review.</p>
              </div>
            )}

            {(activeTab === 'submissions' || activeTab === 'outliers') && submissions.map((sub) => (
              <div key={sub.id} className="card flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-surface-900">{sub.medicine?.brand_name}</span>
                    {sub.outlier_flag && (
                      <span className="badge bg-amber-100 text-amber-700 text-xs">Outlier</span>
                    )}
                    <span className={`badge ${
                      sub.moderation_status === 'pending' ? 'badge-pending' :
                      sub.moderation_status === 'approved' ? 'badge-verified' : 'badge-rejected'
                    }`}>
                      {sub.moderation_status}
                    </span>
                  </div>
                  <p className="text-sm text-surface-500">
                    ₱{sub.price.toFixed(2)} · {sub.branch?.chain?.name} — {sub.branch?.name}
                  </p>
                  <p className="text-xs text-surface-400 mt-1">
                    Submitted {new Date(sub.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => moderateSubmission(sub.id, 'approved')}
                    className="btn-sm px-3 py-1.5 rounded-lg bg-primary-50 text-primary-700 hover:bg-primary-100 text-sm font-medium transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 inline mr-1" />
                    Approve
                  </button>
                  <button
                    onClick={() => moderateSubmission(sub.id, 'rejected')}
                    className="btn-sm px-3 py-1.5 rounded-lg bg-danger-light text-danger-dark hover:bg-red-100 text-sm font-medium transition-colors"
                  >
                    <XCircle className="w-3.5 h-3.5 inline mr-1" />
                    Reject
                  </button>
                </div>
              </div>
            ))}

            {/* Reports */}
            {activeTab === 'reports' && reports.length === 0 && (
              <div className="text-center py-20 text-surface-500">
                <Flag className="w-12 h-12 mx-auto mb-3 text-surface-300" />
                <p>No suspicious reports to review.</p>
              </div>
            )}

            {activeTab === 'reports' && reports.map((report) => (
              <div key={report.id} className="card">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-amber-100 shrink-0">
                    <Flag className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-surface-900">
                        {report.medicine?.brand_name || 'Unknown medicine'}
                      </span>
                      <span className={`badge ${
                        report.moderation_status === 'pending' ? 'badge-pending' :
                        report.moderation_status === 'reviewed' ? 'badge-info' : 'badge-verified'
                      }`}>
                        {report.moderation_status}
                      </span>
                    </div>
                    <p className="text-sm text-surface-600 mb-1">{report.description}</p>
                    <p className="text-xs text-surface-400">
                      Code: {report.scanned_code} · {new Date(report.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => moderateReport(report.id, 'reviewed')}
                      className="px-3 py-1.5 rounded-lg bg-primary-50 text-primary-700 hover:bg-primary-100 text-sm font-medium transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 inline mr-1" />
                      Review
                    </button>
                    <button
                      onClick={() => moderateReport(report.id, 'forwarded_to_fda')}
                      className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 text-sm font-medium transition-colors"
                    >
                      Forward to FDA
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
