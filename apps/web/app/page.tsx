'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Search, ShieldCheck, TrendingDown, MapPin, Pill, 
  ChevronRight, Star, Users, Shield, Clock, ArrowRight,
  CheckCircle2, Zap, Heart, Coins, ScanLine, BadgeCheck
} from 'lucide-react';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
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
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-surface-100">
        <div className="page-container">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-glow">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-surface-900">BotikaBantay</span>
            </Link>
            
            <div className="hidden sm:flex items-center gap-8">
              <Link href="/medicines" className="text-sm font-medium text-surface-600 hover:text-primary-600 transition-colors">
                Presyo Check
              </Link>
              <Link href="/scanner" className="text-sm font-medium text-surface-600 hover:text-primary-600 transition-colors">
                Tunay Check
              </Link>
              <Link href="/nearby" className="text-sm font-medium text-surface-600 hover:text-primary-600 transition-colors">
                Nearby
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/login" className="btn-ghost text-sm">
                Sign in
              </Link>
              <Link href="/register" className="btn-primary text-sm">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary-50/50 via-white to-surface-50" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-r from-primary-400/20 to-emerald-400/20 rounded-full blur-3xl" />
        
        <div className="page-container relative">
          <div className="max-w-4xl mx-auto text-center">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-200 mb-8 animate-in">
              <BadgeCheck className="w-4 h-4 text-primary-600" />
              <span className="text-sm font-medium text-primary-700">Presyo na Tama, Gamot na Tunay</span>
            </div>
            
            {/* Headline */}
            <h1 className="heading-1 mb-6 animate-in stagger-1">
              Hanapin ang <span className="text-gradient">pinakamurang presyo</span> ng iyong gamot
            </h1>
            
            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-surface-600 max-w-2xl mx-auto mb-10 animate-in stagger-2">
              I-compare ang presyo sa Mercury Drug, Watsons, Rose Pharmacy at iba pa. 
              I-verify ang authenticity gamit ang FDA Philippines registry.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto animate-in stagger-3">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-emerald-500 rounded-2xl opacity-20 group-hover:opacity-30 blur-xl transition-opacity" />
                <div className="relative flex items-center bg-white rounded-2xl shadow-impeccable-lg border border-surface-200 overflow-hidden">
                  <Search className="ml-5 w-5 h-5 text-surface-400" />
                  <input
                    type="text"
                    placeholder="Maghanap ng gamot... (hal. Biogesic, Paracetamol)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 px-4 py-4 sm:py-5 text-surface-900 placeholder-surface-400 focus:outline-none bg-transparent"
                    aria-label="Search medicine"
                  />
                  <button type="submit" className="m-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors flex items-center gap-2">
                    Hanapin
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
                  className="px-3 py-1.5 text-sm text-surface-600 bg-white border border-surface-200 rounded-full hover:border-primary-300 hover:text-primary-600 transition-all"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-surface-100 bg-white">
        <div className="page-container">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {[
              { value: '20+', label: 'Gamot', icon: Pill },
              { value: '5', label: 'Pharmacy Chains', icon: MapPin },
              { value: '6', label: 'Mga Sangay', icon: Shield },
              { value: '100%', label: 'FDA Verified', icon: CheckCircle2 },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary-50 mb-3">
                  <stat.icon className="w-5 h-5 text-primary-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-surface-900">{stat.value}</div>
                <div className="text-sm text-surface-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section">
        <div className="page-container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-sm font-medium mb-4">
              <Zap className="w-3.5 h-3.5" />
              Features
            </div>
            <h2 className="heading-2 mb-4">Dalawang problema, isang solusyon</h2>
            <p className="text-lg text-surface-600">
              Hindi mo na kailangan ng dalawang app. Presyo at authenticity, nandito na lahat.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Presyo Check */}
            <div className="card-elevated group hover:shadow-impeccable-xl transition-all duration-300">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-br from-primary-500 to-emerald-500 text-white shadow-glow">
                  <TrendingDown className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="heading-3">Presyo Check</h3>
                  <p className="text-surface-500 mt-1">I-compare ang presyo sa bawat pharmacy</p>
                </div>
              </div>
              
              <ul className="space-y-3 mb-6">
                {[
                  'Search by brand name o generic name',
                  'Side-by-side comparison sa Mercury, Watsons, Rose',
                  'Malaman ang savings pag gumamit ng generic',
                  'Malaman kung alin ang pinakamalapit',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-surface-600">
                    <CheckCircle2 className="w-4 h-4 text-primary-500 mt-0.5 shrink-0" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
              
              <Link href="/medicines" className="inline-flex items-center gap-2 text-primary-600 font-medium text-sm hover:gap-3 transition-all">
                Mag-compare na
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Tunay Check */}
            <div className="card-elevated group hover:shadow-impeccable-xl transition-all duration-300">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-br from-medical-500 to-blue-500 text-white shadow-glow-medical">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="heading-3">Tunay Check</h3>
                  <p className="text-surface-500 mt-1">I-verify kung FDA-registered ang gamot</p>
                </div>
              </div>
              
              <ul className="space-y-3 mb-6">
                {[
                  'Scan ang barcode o QR code ng gamot',
                  'Cross-reference sa FDA Philippines registry',
                  'Malaman kung tunay o peke ang produkto',
                  'I-report ang mga kahina-hinalang gamot',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-surface-600">
                    <CheckCircle2 className="w-4 h-4 text-medical-500 mt-0.5 shrink-0" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
              
              <Link href="/scanner" className="inline-flex items-center gap-2 text-medical-600 font-medium text-sm hover:gap-3 transition-all">
                Mag-verify na
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section bg-white">
        <div className="page-container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-sm font-medium mb-4">
              <Heart className="w-3.5 h-3.5" />
              Paano Gamitin
            </div>
            <h2 className="heading-2 mb-4">Tatlong hakbang lang</h2>
            <p className="text-lg text-surface-600">
              Madali lang gamitin. Walang kumplikadong proseso.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Maghanap',
                description: 'I-type ang pangalan ng gamot na kailangan mo. Puwede brand name o generic name.',
                icon: Search,
                color: 'primary',
              },
              {
                step: '02',
                title: 'I-compare',
                description: 'Tingnan ang presyo sa bawat pharmacy. Malaman mo agad kung saan ang pinakamura.',
                icon: TrendingDown,
                color: 'emerald',
              },
              {
                step: '03',
                title: 'I-verify',
                description: 'I-scan ang barcode para malaman kung FDA-registered at tunay ang gamot.',
                icon: ScanLine,
                color: 'medical',
              },
            ].map((item, i) => (
              <div key={i} className="relative text-center group">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-surface-100 text-surface-900 font-bold text-lg mb-4 group-hover:scale-110 transition-transform">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-surface-900 mb-2">{item.title}</h3>
                <p className="text-sm text-surface-600 max-w-xs mx-auto">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pharmacy Partners */}
      <section className="section">
        <div className="page-container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="heading-3 mb-4">Mga Kasamang Pharmacy</h2>
            <p className="text-surface-600">
              Suriin ang presyo sa mga pangunahing pharmacy chain sa buong Pilipinas.
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
              <div key={chain.name} className="flex items-center gap-3 px-6 py-4 bg-white rounded-xl border border-surface-200 shadow-impeccable">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: chain.color }} />
                <span className="font-medium text-surface-700">{chain.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why BotikaBantay */}
      <section className="section bg-surface-900 text-white">
        <div className="page-container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="heading-2 text-white mb-4">Bakit BotikaBantay?</h2>
            <p className="text-lg text-surface-400">
              Ginawa para sa Pilipino, ng Pilipino.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                icon: Coins,
                title: 'Tipid Tips',
                description: 'Malaman mo agad kung magkano ang matitipid pag gumamit ng generic kaysa branded.',
              },
              {
                icon: ShieldCheck,
                title: 'Ligtas na Pamimili',
                description: 'I-verify ang bawat gamot bago mo bilhin. Walang peke, walang plastik.',
              },
              {
                icon: MapPin,
                title: 'Malapit Sa\'Yo',
                description: 'Hanapin ang pinakamalapit na pharmacy na may best price gamit ang iyong location.',
              },
            ].map((item, i) => (
              <div key={i} className="text-center p-6 rounded-2xl bg-surface-800 border border-surface-700">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-600/20 text-primary-400 mb-4">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-surface-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials / Social Proof */}
      <section className="section">
        <div className="page-container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="heading-3 mb-4">Pinagkakatiwalaan ng mga Pilipino</h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                quote: 'Nakatipid ako ng ₱200 buwan-buwan sa maintenance meds ko. Salamat BotikaBantay!',
                author: 'Maria S.',
                role: 'Manila',
                stars: 5,
              },
              {
                quote: 'Nalaman ko na peke pala ang nabili kong gamot dahil sa Tunay Check. Nakakatakot!',
                author: 'Juan D.',
                role: 'Cebu',
                stars: 5,
              },
              {
                quote: 'Madali gamitin at walang kumplikado. Perfect sa mga matatanda na gaya ko.',
                author: 'Lola Rosa',
                role: 'Davao',
                stars: 5,
              },
            ].map((testimonial, i) => (
              <div key={i} className="card p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.stars)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-surface-600 text-sm mb-4">&ldquo;{testimonial.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary-700">{testimonial.author[0]}</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-surface-900">{testimonial.author}</div>
                    <div className="text-xs text-surface-500">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section">
        <div className="page-container">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 to-primary-700 p-8 sm:p-12 lg:p-16 text-center">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Simulan nang mag-save ngayon
              </h2>
              <p className="text-lg text-primary-100 max-w-2xl mx-auto mb-8">
                Hanapin ang pinakamurang presyo ng iyong gamot at i-verify ang authenticity. 
                Libre at walang kailangan na account.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/medicines" className="px-8 py-4 bg-white text-primary-700 rounded-xl font-semibold hover:bg-primary-50 transition-colors shadow-impeccable-lg">
                  Mag-compare ng Presyo
                </Link>
                <Link href="/scanner" className="px-8 py-4 bg-primary-800 text-white rounded-xl font-semibold hover:bg-primary-900 transition-colors border border-primary-500/30">
                  I-verify ang Gamot
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-900 text-surface-400 py-12">
        <div className="page-container">
          <div className="grid sm:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-white">BotikaBantay</span>
              </div>
              <p className="text-sm text-surface-500">
                Presyo na Tama, Gamot na Tunay.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Features</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/medicines" className="hover:text-primary-400 transition-colors">Presyo Check</Link></li>
                <li><Link href="/scanner" className="hover:text-primary-400 transition-colors">Tunay Check</Link></li>
                <li><Link href="/nearby" className="hover:text-primary-400 transition-colors">Nearby Pharmacies</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Mga Pharmacy</h4>
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
                <li><Link href="#" className="hover:text-primary-400 transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-primary-400 transition-colors">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-primary-400 transition-colors">FDA Disclaimer</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="divider border-surface-800 mb-8" />
          
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-surface-500">
              &copy; {new Date().getFullYear()} BotikaBantay. Hindi ito kapalit ng propesyonal na medical advice.
            </p>
            <p className="text-xs text-surface-600">
              Data sourced from FDA Philippines public registry
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
