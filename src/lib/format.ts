import type { Locale } from '@/types/content';

export function formatNumber(value: number, locale: Locale): string {
  return new Intl.NumberFormat(locale === 'es' ? 'es-CO' : 'en-US').format(value);
}

export function padFigure(n: number): string {
  return String(n).padStart(2, '0');
}
