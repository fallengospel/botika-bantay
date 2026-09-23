'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { createSupabaseClient } from '@/lib/supabase-browser';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const supabase = createSupabaseClient();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetError) throw resetError;
      setSent(true);
    } catch (err: any) {
      setError(err.message || 'Hindi naisend ang email. Subukan muli.');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50 px-4">
        <div className="w-full max-w-md">
          <div className="card-elevated p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-primary-600" />
            </div>
            <h1 className="heading-3 mb-2">Na-send na ang email</h1>
            <p className="text-surface-600 mb-2">
              Nagpadala kami ng password reset link sa <strong>{email}</strong>.
            </p>
            <p className="text-sm text-surface-500 mb-6">
              I-check ang iyong inbox at i-click ang link para mag-set ng bagong password. Kung hindi mo nakita, i-check ang spam folder.
            </p>
            <Link href="/login" className="btn-primary inline-flex">
              Bumalik sa Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-glow">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-surface-900">BotikaBantay</span>
          </Link>
        </div>

        <div className="card-elevated p-8">
          <div className="text-center mb-6">
            <h1 className="heading-3 mb-2">Nakalimutan ang password?</h1>
            <p className="text-sm text-surface-500">I-type ang iyong email at padadalhan ka namin ng reset link.</p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-lg bg-danger-light border border-danger/20 text-sm text-danger-dark">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="input-label">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending...
                </span>
              ) : (
                'I-send ang Reset Link'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/login" className="inline-flex items-center gap-1 text-sm text-surface-500 hover:text-surface-700">
              <ArrowLeft className="w-4 h-4" />
              Bumalik sa Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
