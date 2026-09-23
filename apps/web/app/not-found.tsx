import Link from 'next/link';
import { ShieldCheck, ArrowLeft, Search, MapPin, Pill } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 px-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center mx-auto mb-6 shadow-glow">
            <ShieldCheck className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-6xl font-bold text-surface-200 mb-4">404</h1>
          <h2 className="heading-3 mb-2">Hindi nahanap ang page</h2>
          <p className="text-surface-500">
            Ang page na hinahanap mo ay hindi available o inilipat na.
          </p>
        </div>

        <div className="space-y-3 mb-8">
          <Link
            href="/medicines"
            className="flex items-center gap-3 p-4 bg-white rounded-xl border border-surface-200 hover:border-primary-300 hover:shadow-impeccable transition-all text-left"
          >
            <div className="p-2 rounded-lg bg-primary-50">
              <Search className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="font-medium text-surface-900">Maghanap ng Gamot</p>
              <p className="text-sm text-surface-500">I-compare ang presyo sa mga pharmacy</p>
            </div>
          </Link>
          <Link
            href="/nearby"
            className="flex items-center gap-3 p-4 bg-white rounded-xl border border-surface-200 hover:border-primary-300 hover:shadow-impeccable transition-all text-left"
          >
            <div className="p-2 rounded-lg bg-emerald-50">
              <MapPin className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="font-medium text-surface-900">Malapit sa Iyo</p>
              <p className="text-sm text-surface-500">Hanapin ang pinakamalapit na pharmacy</p>
            </div>
          </Link>
          <Link
            href="/scanner"
            className="flex items-center gap-3 p-4 bg-white rounded-xl border border-surface-200 hover:border-primary-300 hover:shadow-impeccable transition-all text-left"
          >
            <div className="p-2 rounded-lg bg-blue-50">
              <Pill className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-surface-900">Tunay Check</p>
              <p className="text-sm text-surface-500">I-verify kung authentic ang gamot</p>
            </div>
          </Link>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-surface-500 hover:text-surface-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Bumalik sa Home
        </Link>
      </div>
    </div>
  );
}
