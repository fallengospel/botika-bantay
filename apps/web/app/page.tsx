'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Search, ShieldCheck, TrendingDown, MapPin, Pill,
  ChevronRight, Star, Users, Shield, Clock, ArrowRight,
  CheckCircle2, Zap, Heart, Coins, ScanLine, BadgeCheck
} from 'lucide-react';
import { LogoMark } from '@/components/brand/LogoMark';
import { LogoLockup } from '@/components/brand/LogoLockup';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/medicines?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/medicines');
    }
  };

  return (
    <main className="flex-1">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-brand-line">
        <div className="page-container">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center">
              <LogoLockup markSize={30} textClass="text-lg" />
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              <Link href="/medicines" className="px-3 py-2 text-sm font-medium text-surface-600 hover:text-brand hover:bg-brand-mint rounded-lg transition-all">
                Price Check
              </Link>
              <Link href="/submit" className="px-3 py-2 text-sm font-medium text-surface-600 hover:text-brand hover:bg-brand-mint rounded-lg transition-all">
                Submit Price
              </Link>
              <Link href="/scanner" className="px-3 py-2 text-sm font-medium text-surface-600 hover:text-brand hover:bg-brand-mint rounded-lg transition-all">
                Verify
              </Link>
              <Link href="/nearby" className="px-3 py-2 text-sm font-medium text-surface-600 hover:text-brand hover:bg-brand-mint rounded-lg transition-all">
                Nearby
              </Link>
              <Link href="/report" className="px-3 py-2 text-sm font-medium text-surface-600 hover:text-brand hover:bg-brand-mint rounded-lg transition-all">
                Report
              </Link>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <Link href="/login" className="btn-ghost text-sm">
                Sign in
              </Link>
              <Link href="/register" className="btn-primary text-sm">
                Get Started
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="md:hidden p-2 rounded-lg text-surface-600 hover:bg-brand-mint transition-colors"
              aria-label={mobileNavOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileNavOpen}
            >
              {mobileNavOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile nav dropdown */}
        {mobileNavOpen && (
          <div className="md:hidden bg-white border-t border-brand-line shadow-lg">
            <div className="px-4 py-3 space-y-1">
              <Link href="/medicines" onClick={() => setMobileNavOpen(false)} className="block px-3 py-2.5 text-sm font-medium text-surface-700 hover:bg-brand-mint hover:text-brand rounded-lg transition-all">
                Price Check
              </Link>
              <Link href="/submit" onClick={() => setMobileNavOpen(false)} className="block px-3 py-2.5 text-sm font-medium text-surface-700 hover:bg-brand-mint hover:text-brand rounded-lg transition-all">
                Submit Price
              </Link>
              <Link href="/scanner" onClick={() => setMobileNavOpen(false)} className="block px-3 py-2.5 text-sm font-medium text-surface-700 hover:bg-brand-mint hover:text-brand rounded-lg transition-all">
                Verify Medicine
              </Link>
              <Link href="/nearby" onClick={() => setMobileNavOpen(false)} className="block px-3 py-2.5 text-sm font-medium text-surface-700 hover:bg-brand-mint hover:text-brand rounded-lg transition-all">
                Nearby Pharmacies
              </Link>
              <Link href="/report" onClick={() => setMobileNavOpen(false)} className="block px-3 py-2.5 text-sm font-medium text-surface-700 hover:bg-brand-mint hover:text-brand rounded-lg transition-all">
                Report Product
              </Link>
              <div className="border-t border-brand-line mt-2 pt-2 space-y-1">
                <Link href="/login" onClick={() => setMobileNavOpen(false)} className="block px-3 py-2.5 text-sm font-medium text-surface-600 hover:bg-brand-paper rounded-lg transition-all">
                  Sign in
                </Link>
                <Link href="/register" onClick={() => setMobileNavOpen(false)} className="block px-3 py-2.5 text-sm font-semibold text-white bg-brand hover:bg-brand-deep rounded-lg text-center shadow-md transition-colors">
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-brand-paper" />
        <div className="absolute top-16 right-0 w-[480px] h-[480px] bg-brand-mint rounded-full blur-3xl opacity-70" aria-hidden="true" />
        <div className="absolute bottom-0 left-0 w-[320px] h-[320px] bg-amber-100/50 rounded-full blur-3xl" aria-hidden="true" />

        <div className="page-container relative">
          <div className="max-w-4xl mx-auto text-center">
            {/* Eyebrow — brand tagline */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-mint border border-brand/15 mb-8 animate-in">
              <LogoMark size={16} />
              <span className="text-sm font-semibold text-brand-deep">Presyo na Tama, Gamot na Tunay</span>
            </div>

            {/* Headline — Taglish branding */}
            <h1 className="heading-1 mb-6 animate-in stagger-1 text-brand-ink">
              Find the <span className="text-brand">lowest price</span> for your medicine
            </h1>

            {/* Subheadline — Taglish content */}
            <p className="text-lg sm:text-xl text-brand-muted max-w-2xl mx-auto mb-10 animate-in stagger-2">
              Para sa bawat Pilipinong pamilya: compare prices across Mercury Drug, Watsons, Rose Pharmacy and more —
              then check codes against our catalog of FDA-registered products, from Aparri to Jolo.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto animate-in stagger-3">
              <div className="relative">
                <div className="relative flex items-center bg-white rounded-2xl shadow-impeccable-lg border border-brand-line overflow-hidden">
                  <Search className="ml-5 w-5 h-5 text-brand-muted" />
                  <input
                    type="text"
                    placeholder="Search medicine... (e.g. Biogesic, Paracetamol)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 px-4 py-4 sm:py-5 text-brand-ink placeholder-brand-muted focus:outline-none bg-transparent"
                    aria-label="Search medicine"
                  />
                  <button
                    type="submit"
                    className="m-2 px-6 py-3 bg-brand text-white rounded-xl font-semibold hover:bg-brand-deep transition-colors flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                  >
                    Search
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </form>

            {/* Quick search tags */}
            <div className="flex flex-wrap justify-center gap-2 mt-6 animate-in stagger-4">
              {['Paracetamol', 'Biogesic', 'Amlodipine', 'Metformin', 'Cetirizine'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => router.push(`/medicines?search=${tag}`)}
                  className="px-3 py-1.5 text-sm text-surface-600 bg-white border border-brand-line rounded-full hover:border-brand hover:text-brand transition-all"
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Verified badge */}
            <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-mint px-3 py-1.5 animate-in stagger-4">
              <LogoMark size={16} />
              <span className="text-xs font-semibold text-brand-deep">FDA Verified · Authentic</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-brand-line bg-white">
        <div className="page-container">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {[
              { value: '20+', label: 'Medicines', icon: Pill },
              { value: '5', label: 'Pharmacy Chains', icon: MapPin },
              { value: '6', label: 'Branches', icon: Shield },
              { value: '100%', label: 'FDA Verified', icon: CheckCircle2 },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-brand-mint mb-3">
                  <stat.icon className="w-5 h-5 text-brand" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-brand-ink">{stat.value}</div>
                <div className="text-sm text-brand-muted">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision / Mission */}
      <section className="section">
        <div className="page-container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-mint text-brand-deep text-sm font-medium mb-4">
              <Heart className="w-3.5 h-3.5" />
              Our Mission
            </div>
            <h2 className="heading-2 mb-4 text-brand-ink">Two problems, one solution</h2>
            <p className="text-lg text-brand-muted">
              Ginawa para sa Pilipino, ng Pilipino. You don&apos;t need two apps anymore —
              price and authenticity, nandito na lahat.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Price Check */}
            <div className="card-elevated group hover:shadow-impeccable-xl transition-all duration-300">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 rounded-xl bg-brand text-white shadow-glow">
                  <TrendingDown className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="heading-3">Price Check</h3>
                  <p className="text-brand-muted mt-1">Compare prices sa bawat pharmacy — para alam mo agad kung saan mas mura.</p>
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {[
                  'Search by brand name or generic name',
                  'Side-by-side comparison sa Mercury, Watsons, Rose',
                  'See how much you save when you go generic',
                  'Find the nearest branch with the best price',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-surface-600">
                    <CheckCircle2 className="w-4 h-4 text-brand mt-0.5 shrink-0" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>

              <Link href="/medicines" className="inline-flex items-center gap-2 text-brand font-medium text-sm hover:gap-3 transition-all">
                Compare prices
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Authenticity Check */}
            <div className="card-elevated group hover:shadow-impeccable-xl transition-all duration-300">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 rounded-xl bg-brand-ink text-white shadow-impeccable-md">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="heading-3">Authenticity Check</h3>
                  <p className="text-brand-muted mt-1">I-verify kung FDA-registered ang gamot bago mo bilhin.</p>
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {[
                  'Scan the barcode or QR code on the pack',
                  'Cross-check sa FDA Philippines registry',
                  'Know right away if the product is authentic',
                  'Report anything that looks suspicious',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-surface-600">
                    <CheckCircle2 className="w-4 h-4 text-brand-gold mt-0.5 shrink-0" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>

              <Link href="/scanner" className="inline-flex items-center gap-2 text-brand font-medium text-sm hover:gap-3 transition-all">
                Verify a medicine
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section bg-white border-y border-brand-line">
        <div className="page-container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-mint text-brand-deep text-sm font-medium mb-4">
              <Zap className="w-3.5 h-3.5" />
              How It Works
            </div>
            <h2 className="heading-2 mb-4 text-brand-ink">Three simple steps</h2>
            <p className="text-lg text-brand-muted">
              Super simple gamitin — walang kumplikadong process.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Search',
                description: 'Type the medicine you need. Brand name or generic name, both work.',
                icon: Search,
              },
              {
                step: '02',
                title: 'Compare',
                description: 'See prices side by side and find where it costs the least.',
                icon: TrendingDown,
              },
              {
                step: '03',
                title: 'Verify',
                description: 'Scan the barcode to check if it’s listed in our FDA-registered catalog.',
                icon: ScanLine,
              },
            ].map((item, i) => (
              <div key={i} className="relative text-center group">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-mint text-brand-deep font-bold text-lg mb-4 group-hover:scale-110 transition-transform">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-brand-ink mb-2">{item.title}</h3>
                <p className="text-sm text-brand-muted max-w-xs mx-auto">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pharmacy Partners */}
      <section className="section bg-brand-paper">
        <div className="page-container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="heading-3 mb-4 text-brand-ink">Partner Pharmacies</h2>
            <p className="text-brand-muted">
              Check prices sa major pharmacy chains across the Philippines.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {[
              { name: 'Mercury Drug', color: '#00A651' },
              { name: 'Watsons', color: '#E31937' },
              { name: 'Rose Pharmacy', color: '#FF69B4' },
              { name: 'Generika Drugstore', color: '#0099CC' },
              { name: 'South Star Drug', color: '#DAA520' },
            ].map((chain) => (
              <div key={chain.name} className="flex items-center gap-3 px-6 py-4 bg-white rounded-xl border border-brand-line shadow-impeccable">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: chain.color }} />
                <span className="font-medium text-surface-700">{chain.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why BotikaBantay — dark brand card */}
      <section className="section">
        <div className="page-container">
          <div className="relative overflow-hidden rounded-3xl bg-brand-ink text-white p-8 sm:p-12 lg:p-16">
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-gold/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="relative grid lg:grid-cols-2 gap-10 items-start">
              <div>
                <LogoLockup tone="reversed" markSize={44} textClass="text-3xl" />
                <p className="mt-8 text-white/75 leading-relaxed max-w-md text-lg">
                  Compare prices across Mercury Drug, Watsons, Rose Pharmacy and more.
                  Check barcodes and FDA numbers against our catalog of FDA-registered products, from Aparri to Jolo.
                </p>
                <p className="mt-4 text-white/60 text-sm max-w-md">
                  Isang sign of trust mula search hanggang checkout — para sa bawat
                  peso-conscious na household sa buong bansa.
                </p>
                <div className="mt-8">
                  <Link
                    href="/medicines"
                    className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 font-semibold text-white transition-colors duration-150 hover:bg-brand-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-ink"
                  >
                    Check your medicine
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4 lg:pt-4">
                {[
                  { icon: Coins, title: 'Save More', description: 'See how much you’ll save when you switch from branded to generic.' },
                  { icon: ShieldCheck, title: 'Shop Safe', description: 'Verify every medicine before you buy — no fakes, no worries.' },
                  { icon: MapPin, title: 'Nearby Deals', description: 'Find the closest pharmacy with the best price near you.' },
                ].map((item, i) => (
                  <div key={i} className="p-5 rounded-2xl bg-white/5 border border-white/10">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-brand/25 text-white mb-3">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-white mb-1.5 text-sm">{item.title}</h3>
                    <p className="text-xs text-white/60 leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section bg-white border-t border-brand-line">
        <div className="page-container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="heading-3 mb-4 text-brand-ink">Trusted by Filipino families</h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                quote: 'Nakatipid ako ng ₱200 every month sa maintenance meds ko. Super helpful ng BotikaBantay!',
                author: 'Maria S.',
                role: 'Manila',
                stars: 5,
              },
              {
                quote: 'Buti na lang na-verify ko sa Authenticity Check — peke pala yung nabili ko. Ingat tayo!',
                author: 'Juan D.',
                role: 'Cebu',
                stars: 5,
              },
              {
                quote: 'Easy to use and hindi complicated. Perfect even for seniors like me.',
                author: 'Lola Rosa',
                role: 'Davao',
                stars: 5,
              },
            ].map((testimonial, i) => (
              <div key={i} className="card p-6">
                <div className="flex gap-1 mb-4" role="img" aria-label={`${testimonial.stars} out of 5 stars`}>
                  {[...Array(testimonial.stars)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-brand-gold text-brand-gold" />
                  ))}
                </div>
                <p className="text-brand-muted text-sm mb-4">&ldquo;{testimonial.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-mint flex items-center justify-center">
                    <span className="text-sm font-medium text-brand-deep">{testimonial.author[0]}</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-brand-ink">{testimonial.author}</div>
                    <div className="text-xs text-brand-muted">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-brand-paper">
        <div className="page-container">
          <div className="relative overflow-hidden rounded-3xl bg-brand p-8 sm:p-12 lg:p-16 text-center">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-gold/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="relative">
              <div className="inline-flex mb-6">
                <LogoLockup tone="reversedBrand" markSize={48} textClass="text-3xl" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Start saving today
              </h2>
              <p className="text-lg text-white/85 max-w-2xl mx-auto mb-8">
                Hanapin ang pinakamurang presyo for your medicine and verify authenticity in one place.
                Free — no account needed.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/medicines" className="px-8 py-4 bg-white text-brand-deep rounded-xl font-semibold hover:bg-brand-mint transition-colors shadow-impeccable-lg">
                  Compare Prices
                </Link>
                <Link href="/scanner" className="px-8 py-4 bg-brand-deep text-white rounded-xl font-semibold hover:bg-brand-ink transition-colors border border-white/10">
                  Verify Medicine
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-ink text-white/70 py-12">
        <div className="page-container">
          <div className="grid sm:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="mb-4">
                <LogoLockup tone="reversed" markSize={28} textClass="text-lg" />
              </div>
              <p className="text-sm text-white/55">
                Presyo na Tama, Gamot na Tunay.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Features</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/medicines" className="hover:text-brand-mint transition-colors">Price Check</Link></li>
                <li><Link href="/scanner" className="hover:text-brand-mint transition-colors">Authenticity Check</Link></li>
                <li><Link href="/nearby" className="hover:text-brand-mint transition-colors">Nearby Pharmacies</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Pharmacies</h4>
              <ul className="space-y-2 text-sm">
                <li>Mercury Drug</li>
                <li>Watsons</li>
                <li>Rose Pharmacy</li>
                <li>Generika Drugstore</li>
                <li>South Star Drug</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>FDA Disclaimer</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mb-8" />

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-white/50">
              &copy; {new Date().getFullYear()} BotikaBantay. Not a substitute for professional medical advice.
            </p>
            <p className="text-xs text-white/40">
              Data sourced from FDA Philippines public registry
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
