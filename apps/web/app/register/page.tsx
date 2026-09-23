'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { createSupabaseClient } from '@/lib/supabase-browser';
import { LogoLockup } from '@/components/brand/LogoLockup';
import { LogoMark } from '@/components/brand/LogoMark';

export default function RegisterPage() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const supabase = createSupabaseClient();
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: displayName },
        },
      });

      if (authError) throw authError;

      if (data.user) {
        await supabase.from('users' as any).upsert({
          id: data.user.id,
          email,
          display_name: displayName,
        } as any);
      }

      setRegistered(true);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (registered) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50 px-4">
        <div className="w-full max-w-md">
          <div className="card-elevated p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-brand-mint flex items-center justify-center mx-auto mb-4">
              <LogoMark size={36} />
            </div>
            <h1 className="heading-3 mb-2">Salamat sa pagpaparehistro!</h1>
            <p className="text-surface-600 mb-2">
              Nagpadala kami ng email sa <strong>{email}</strong> para sa verification.
            </p>
            <p className="text-sm text-surface-500 mb-6">
              I-check ang iyong inbox at i-click ang link para ma-activate ang iyong account. Kung hindi mo nakita, i-check ang spam folder.
            </p>
            <Link href="/login" className="btn-primary inline-flex">
              Mag-login na
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
              <Link href="/" className="inline-flex items-center">
                <LogoLockup markSize={36} textClass="text-xl" />
              </Link>
            </div>

        <div className="card-elevated p-8">
          <div className="text-center mb-6">
            <h1 className="heading-3 mb-2">Create your account</h1>
            <p className="text-sm text-surface-500">Join the community. Help others find fair prices.</p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-lg bg-danger-light border border-danger/20 text-sm text-danger-dark">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="input-label">Display name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Juan Dela Cruz"
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

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

            <div>
              <label className="input-label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  className="input-field pl-10 pr-10"
                  minLength={8}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Create account
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-surface-500">
              Already have an account?{' '}
              <Link href="/login" className="text-primary-600 font-medium hover:text-primary-700">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
