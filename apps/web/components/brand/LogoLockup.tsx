import React from 'react';
import { LogoMark, MarkTone } from './LogoMark';

interface LogoLockupProps {
  tone?: MarkTone;
  layout?: 'horizontal' | 'vertical';
  markSize?: number;
  textClass?: string;
  href?: string;
}

const WORD_COLORS: Record<MarkTone, { first: string; second: string }> = {
  color: { first: 'text-brand-ink', second: 'text-brand' },
  mono: { first: 'text-brand-ink', second: 'text-brand-ink' },
  reversed: { first: 'text-white', second: 'text-white/80' },
  reversedBrand: { first: 'text-white', second: 'text-white/80' },
};

export function LogoLockup({
  tone = 'color',
  layout = 'horizontal',
  markSize = 40,
  textClass = 'text-2xl',
  href,
}: LogoLockupProps) {
  const w = WORD_COLORS[tone];
  const isVertical = layout === 'vertical';
  const content = (
    <div className={`inline-flex items-center ${isVertical ? 'flex-col gap-2' : 'gap-2.5'}`}>
      <LogoMark size={markSize} tone={tone} title="" />
      <span className={`${textClass} leading-none tracking-tight whitespace-nowrap`}>
        <span className={`font-extrabold ${w.first}`}>Botika</span>
        <span className={`font-medium ${w.second}`}>Bantay</span>
      </span>
    </div>
  );

  if (href) {
    return (
      <a href={href} className="inline-flex" aria-label="BotikaBantay home">
        {content}
      </a>
    );
  }
  return content;
}
