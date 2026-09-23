import React from 'react';

export type MarkTone = 'color' | 'mono' | 'reversed' | 'reversedBrand';

interface LogoMarkProps {
  size?: number;
  tone?: MarkTone;
  title?: string;
  className?: string;
}

const TONES: Record<MarkTone, { shield: string; knock: string; accent: string }> = {
  color: { shield: '#12924A', knock: '#FFFFFF', accent: '#F2B705' },
  mono: { shield: '#0F1F17', knock: '#FFFFFF', accent: '#FFFFFF' },
  reversed: { shield: '#FFFFFF', knock: '#0F1F17', accent: '#F2B705' },
  reversedBrand: { shield: '#FFFFFF', knock: '#0A5C30', accent: '#0A5C30' },
};

export function LogoMark({ size = 48, tone = 'color', title = 'BotikaBantay', className }: LogoMarkProps) {
  const c = TONES[tone];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label={title}
      className={className}
    >
      <path
        d="M32 4 L53.5 10.6 C55 11.1 56 12.4 56 14 V30.5 C56 44.5 46.5 54.2 32 60 C17.5 54.2 8 44.5 8 30.5 V14 C8 12.4 9 11.1 10.5 10.6 Z"
        fill={c.shield}
      />
      <line x1="19.5" y1="32.5" x2="28" y2="41" stroke={c.knock} strokeWidth="7" strokeLinecap="round" />
      <line x1="28" y1="41" x2="44" y2="23" stroke={c.knock} strokeWidth="10" strokeLinecap="round" />
      <line x1="36" y1="32" x2="44" y2="23" stroke={c.accent} strokeWidth="10" strokeLinecap="butt" />
      <circle cx="44" cy="23" r="5" fill={c.accent} />
      <line x1="31.8" y1="28.3" x2="40.2" y2="35.7" stroke={c.shield} strokeWidth="1.6" />
    </svg>
  );
}
