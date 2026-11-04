import type { SiteContent } from '@/types/content';
import { ai } from './ai';
import { boot } from './boot';
import { contact } from './contact';
import { profile } from './profile';
import { projects } from './projects';
import { seo, ui } from './ui';

export const es: SiteContent = {
  locale: 'es',
  name: 'Luis Fernando Parra',
  jobTitle: 'Ingeniero en Diseño de Entretenimiento Digital',
  availability: 'Medellín · abierto a trabajo remoto o presencial',
  boot,
  profile,
  ai,
  projects,
  contact,
  ui,
  seo,
};
