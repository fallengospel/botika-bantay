import { Price, PriceComparison } from '../types';
import { PRICE_STALENESS_THRESHOLDS } from '../constants';

export function calculateStaleness(lastUpdated: Date): 'fresh' | 'stale' | 'very_stale' {
  const now = new Date();
  const diffTime = now.getTime() - new Date(lastUpdated).getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= PRICE_STALENESS_THRESHOLDS.fresh) return 'fresh';
  if (diffDays <= PRICE_STALENESS_THRESHOLDS.stale) return 'stale';
  return 'very_stale';
}

export function calculateMedianPrice(prices: number[]): number {
  if (prices.length === 0) return 0;
  const sorted = [...prices].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[middle - 1] + sorted[middle]) / 2
    : sorted[middle];
}

export function isOutlier(price: number, median: number, threshold: number = 0.40): boolean {
  if (median === 0) return false;
  const deviation = Math.abs(price - median) / median;
  return deviation > threshold;
}

export function calculateSavings(originalPrice: number, genericPrice: number): number {
  return Math.max(0, originalPrice - genericPrice);
}

export function calculateSavingsPercentage(originalPrice: number, genericPrice: number): number {
  if (originalPrice === 0) return 0;
  return Math.round(((originalPrice - genericPrice) / originalPrice) * 100);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
  }).format(price);
}

export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
}

export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
