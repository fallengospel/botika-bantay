import Link from 'next/link';
import { ArrowLeft, Search, MapPin, Pill } from 'lucide-react';
import { LogoMark } from '@/components/brand/LogoMark';
import { LogoLockup } from '@/components/brand/LogoLockup';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-paper px-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
          <div className="w-20 h-20 rounded-[22px] bg-brand flex items-center justify-center mx-auto mb-6 shadow-glow">
            <LogoMark size={52} tone="reversedBrand" title="" />
          </div>
          <div className="mb-4 flex justify-center">
            <LogoLockup markSize={24} textClass="text-base" />
          </div>
          <h1 className="text-6xl font-bold text-surface-300 mb-4">404</h1>
          <h2 className="heading-3 mb-2">Page not found</h2>
          <p className="text-brand-muted">
            Parang hindi available ang page na hinahanap mo — baka inilipat na.
          </p>
        </div>

        <div className="space-y-3 mb-8">
          <Link
            href="/medicines"
            className="flex items-center gap-3 p-4 bg-white rounded-xl border border-brand-line hover:border-brand hover:shadow-impeccable transition-all text-left"
          >
            <div className="p-2 rounded-lg bg-brand-mint">
              <Search className="w-5 h-5 text-brand" />
            </div>
            <div>
              <p className="font-medium text-brand-ink">Search Medicines</p>
              <p className="text-sm text-brand-muted">I-compare ang presyo sa mga pharmacy</p>
            </div>
          </Link>
          <Link
            href="/nearby"
            className="flex items-center gap-3 p-4 bg-white rounded-xl border border-brand-line hover:border-brand hover:shadow-impeccable transition-all text-left"
          >
            <div className="p-2 rounded-lg bg-brand-mint">
              <MapPin className="w-5 h-5 text-brand" />
            </div>
            <div>
              <p className="font-medium text-brand-ink">Nearby</p>
              <p className="text-sm text-brand-muted">Hanapin ang pinakamalapit na pharmacy</p>
            </div>
          </Link>
          <Link
            href="/scanner"
            className="flex items-center gap-3 p-4 bg-white rounded-xl border border-brand-line hover:border-brand hover:shadow-impeccable transition-all text-left"
          >
            <div className="p-2 rounded-lg bg-brand-mint">
              <Pill className="w-5 h-5 text-brand-deep" />
            </div>
            <div>
              <p className="font-medium text-brand-ink">Verify</p>
              <p className="text-sm text-brand-muted">I-check kung naka-lista ang gamot</p>
            </div>
          </Link>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-brand-muted hover:text-brand transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
