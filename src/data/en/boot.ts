// Traducción pendiente de revisión.
import type { BootContent } from '@/types/content';

export const boot: BootContent = {
  command: 'sudo apt install fercho',
  lines: [
    { status: 'ok', label: 'marketing', value: '1 year' },
    { status: 'ok', label: 'c# & python', value: 'ready' },
    { status: 'wip', label: 'c++', value: 'learning' },
    { status: 'ok', label: 'linux (parrot os)', value: 'ready' },
    { status: 'ok', label: 'figma', value: 'ready' },
    { status: 'ok', label: 'camellar.sys', value: 'high level' },
    { status: 'wip', label: 'mounting projects', value: '4/4' },
  ],
  skipHint: 'press any key to enter',
  subtitle: 'fercho@medellin · Medellín',
  loading: 'mounting projects',
  sound: 'sound',
  soundOn: 'on',
  soundOff: 'off',
};
