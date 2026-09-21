import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface HeaderProps {
  title: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
}

export default function Header({ title, subtitle, backHref, backLabel }: HeaderProps) {
  return (
    <header className="bg-white border-b border-surface-200 px-4 py-4">
      <div className="max-w-4xl mx-auto">
        {backHref && (
          <Link href={backHref} className="flex items-center gap-2 text-surface-600 hover:text-surface-900 mb-4">
            <ArrowLeft className="w-5 h-5" />
            <span>{backLabel || 'Back'}</span>
          </Link>
        )}
        <h1 className="text-2xl font-bold text-surface-900">{title}</h1>
        {subtitle && <p className="text-surface-600">{subtitle}</p>}
      </div>
    </header>
  );
}
