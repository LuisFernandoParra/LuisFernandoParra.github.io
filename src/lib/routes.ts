import type { WindowId } from '@/types/content';

export const windowIds: WindowId[] = ['proyectos', 'perfil', 'contacto'];

export const windowPath: Record<WindowId, string> = {
  proyectos: '/proyectos',
  perfil: '/perfil',
  contacto: '/contacto',
};

export function windowFromPath(pathname: string): WindowId | null {
  const clean = pathname.replace(/\/+$/, '') || '/';
  return windowIds.find((id) => windowPath[id] === clean) ?? null;
}

export const projectPath = (slug: string) => `/proyectos/${slug}`;
