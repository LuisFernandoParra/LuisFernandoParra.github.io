// Traducción pendiente de revisión.
import type { SiteContent } from '@/types/content';
import { ai } from './ai';
import { boot } from './boot';
import { contact } from './contact';
import { profile } from './profile';
import { projects } from './projects';
import { seo, ui } from './ui';

export const en: SiteContent = {
  locale: 'en',
  name: 'Luis Fernando Parra',
  jobTitle: 'Digital Entertainment Design Engineer',
  availability: 'Medellín · open to remote or on-site work',
  boot,
  profile,
  ai,
  projects,
  contact,
  ui,
  seo,
};
