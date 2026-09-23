export const colors = {
  brand: '#12924A',
  brandDeep: '#0A5C30',
  brandMint: '#E7F4EC',
  brandGold: '#F2B705',
  ink: '#0F1F17',
  paper: '#F5F6F2',
  muted: '#5E6B63',
  line: '#E3E6DF',
  white: '#FFFFFF',
  danger: '#B42318',
  dangerBg: '#FEE4E2',
  warning: '#B54708',
  warningBg: '#FEF0C7',
  black: '#000000',
} as const;

export const space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999,
} as const;

export const font = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
} as const;

/** Minimum comfortable touch target (iOS HIG / Material). */
export const MIN_TOUCH = 44;
