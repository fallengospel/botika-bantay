/** Format PHP price without relying on full Intl support on Hermes. */
export function formatPrice(price: number): string {
  if (!Number.isFinite(price)) return '₱0.00';
  return `₱${price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
}

/** Safe date display; avoids "Invalid Date". */
export function formatDate(value: string): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
