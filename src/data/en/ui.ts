// Traducción pendiente de revisión.
import type { SiteContent, UiStrings } from '@/types/content';

export const ui: UiStrings = {
  skipToContent: 'Skip to content',
  menu: {
    file: 'File',
    system: 'System',
    language: 'Language',
    openWindow: (name) => `Open ${name}`,
    downloadCv: 'Download CV (PDF)',
    printCv: 'Print CV',
    about: 'About Ferchux',
    fullscreen: 'Full screen',
    exitFullscreen: 'Exit full screen',
    fullscreenUnavailable: 'Full screen unavailable (try F11)',
    crtOff: 'Turn off CRT effect',
    crtOn: 'Turn on CRT effect',
    mute: 'Mute sound',
    unmute: 'Unmute sound',
    commandPalette: 'Command palette',
    shortcuts: 'Keyboard shortcuts',
    switchTo: 'Switch to',
  },
  desktop: {
    eyebrow: 'Digital Entertainment Design Engineer',
    location: 'Medellín · open to remote or on-site work',
    locationShort: 'Medellín',
    openHint: 'open',
    heroAlt: 'Photo of Luis Fernando Parra (Fercho).',
  },
  windows: { proyectos: 'proyectos/', perfil: 'profile/', contacto: 'contacto.sh' },
  windowClose: 'Close window',
  breadcrumbRoot: '~/desktop',
  escToDesktop: 'Esc — back to desktop',
  escCloseWindow: 'Esc — close window',
  escCloseProject: 'Esc — close project',
  project: {
    type: 'type',
    role: 'role',
    period: 'period',
    tools: 'tools',
    links: 'links',
    figure: 'fig.',
    openPost: (alt) => alt + ' (view on Instagram, opens in a new tab)',
    prev: 'Previous',
    next: 'Next',
    index: 'All projects',
    upNext: 'Up next',
    viewsLabel: (n) => `${n} views`,
    playVideo: (title) => `Play video: ${title}`,
    openProject: 'open',
    viewLabel: 'View',
    viewRoom: 'room',
    viewList: 'list',
    dragHint: 'drag to explore',
  },
  palette: {
    placeholder: 'Type a command…',
    empty: 'No results',
    copyEmail: 'Copy email',
    emailCopied: 'Email copied',
    toggleLanguage: 'Switch language to Español',
  },
  shortcutsHelp: {
    title: 'Keyboard shortcuts',
    items: [
      ['1 · 2 · 3', 'Open proyectos/, profile/ or contacto.sh'],
      ['Esc', 'Close the window or go back to the desktop'],
      ['Ctrl/⌘ + K', 'Command palette'],
      ['?', 'Show this help'],
    ],
  },
  about: {
    title: 'About Ferchux',
    lines: [
      "Ferchux — Luis Fernando Parra's portfolio.",
      'fercho@medellin:~$',
      'Built with Vite, React, TypeScript and Tailwind CSS.',
    ],
  },
  close: 'Close',
  notFound: {
    title: '404',
    body: 'bash: path not found',
    back: 'Back to desktop',
  },
  devPending: 'Pending (visible in development only)',
};

export const seo: SiteContent['seo'] = {
  home: {
    title: 'Luis Fernando Parra — Digital Entertainment Design Engineer',
    description:
      "Luis Fernando Parra's portfolio, Digital Entertainment Design Engineer. Medellín · open to remote or on-site work.",
  },
  proyectos: {
    title: 'proyectos/ — Luis Fernando Parra',
    description: 'DtMF, NOSTA, Video editing and WhatsApp bot.',
  },
  perfil: {
    title: 'profile/ — Luis Fernando Parra',
    description:
      'Product design, UI and UX · Marketing and content · Video editing · Programming. How I work with AI.',
  },
  contacto: {
    title: 'contacto.sh — Luis Fernando Parra',
    description: 'ferchopacas@gmail.com · GitHub · LinkedIn · CV in PDF.',
  },
  notFound: { title: '404 — Ferchux', description: 'Path not found.' },
};
