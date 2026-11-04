import type { BootContent } from '@/types/content';

export const boot: BootContent = {
  command: 'sudo apt install fercho',
  lines: [
    { status: 'ok', label: 'marketing', value: '1 año' },
    { status: 'ok', label: 'c# y python', value: 'listo' },
    { status: 'wip', label: 'c++', value: 'aprendiendo' },
    { status: 'ok', label: 'linux (parrot os)', value: 'listo' },
    { status: 'ok', label: 'figma', value: 'listo' },
    { status: 'ok', label: 'camellar.sys', value: 'nivel alto' },
    { status: 'wip', label: 'montando proyectos', value: '4/4' },
  ],
  skipHint: 'presiona cualquier tecla para entrar',
  subtitle: 'fercho@medellin · Medellín',
  loading: 'montando proyectos',
  sound: 'sonido',
  soundOn: 'sí',
  soundOff: 'no',
};
