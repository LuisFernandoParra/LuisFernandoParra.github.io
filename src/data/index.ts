import type { Locale, SiteContent } from '@/types/content';
import { en } from './en';
import { es } from './es';

export const content: Record<Locale, SiteContent> = { es, en };

export const locales: Locale[] = ['es', 'en'];
