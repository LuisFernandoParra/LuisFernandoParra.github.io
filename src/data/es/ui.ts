import type { SiteContent, UiStrings } from '@/types/content';

export const ui: UiStrings = {
  skipToContent: 'Saltar al contenido',
  menu: {
    file: 'Archivo',
    system: 'Sistema',
    language: 'Idioma',
    openWindow: (name) => `Abrir ${name}`,
    downloadCv: 'Descargar CV (PDF)',
    printCv: 'Imprimir CV',
    about: 'Acerca de Ferchux',
    fullscreen: 'Pantalla completa',
    exitFullscreen: 'Salir de pantalla completa',
    fullscreenUnavailable: 'Pantalla completa no disponible (prueba F11)',
    crtOff: 'Apagar efecto CRT',
    crtOn: 'Encender efecto CRT',
    mute: 'Silenciar sonido',
    unmute: 'Activar sonido',
    commandPalette: 'Paleta de comandos',
    shortcuts: 'Atajos de teclado',
    switchTo: 'Cambiar a',
  },
  desktop: {
    eyebrow: 'Ingeniero en Diseño de Entretenimiento Digital',
    location: 'Medellín · abierto a trabajo remoto o presencial',
    locationShort: 'Medellín',
    openHint: 'abrir',
    heroAlt: 'Foto de Luis Fernando Parra (Fercho).',
  },
  windows: { proyectos: 'proyectos/', perfil: 'perfil/', contacto: 'contacto.sh' },
  windowClose: 'Cerrar ventana',
  breadcrumbRoot: '~/desktop',
  escToDesktop: 'Esc — volver al escritorio',
  escCloseWindow: 'Esc — cerrar ventana',
  escCloseProject: 'Esc — cerrar proyecto',
  project: {
    type: 'tipo',
    role: 'rol',
    period: 'periodo',
    tools: 'herramientas',
    links: 'enlaces',
    figure: 'fig.',
    openPost: (alt) => alt + ' (ver en Instagram, se abre en otra pestaña)',
    prev: 'Anterior',
    next: 'Siguiente',
    index: 'Todos los proyectos',
    upNext: 'Siguiente',
    viewsLabel: (n) => `${n} reproducciones`,
    playVideo: (title) => `Reproducir video: ${title}`,
    openProject: 'abrir',
    viewLabel: 'Vista',
    viewRoom: 'sala',
    viewList: 'lista',
    dragHint: 'arrastra para explorar',
  },
  palette: {
    placeholder: 'Escribe un comando…',
    empty: 'Sin resultados',
    copyEmail: 'Copiar correo',
    emailCopied: 'Correo copiado',
    toggleLanguage: 'Cambiar idioma a English',
  },
  shortcutsHelp: {
    title: 'Atajos de teclado',
    items: [
      ['1 · 2 · 3', 'Abrir proyectos/, perfil/ o contacto.sh'],
      ['Esc', 'Cerrar la ventana o volver al escritorio'],
      ['Ctrl/⌘ + K', 'Paleta de comandos'],
      ['?', 'Mostrar esta ayuda'],
    ],
  },
  about: {
    title: 'Acerca de Ferchux',
    lines: [
      'Ferchux — el portafolio de Luis Fernando Parra.',
      'fercho@medellin:~$',
      'Hecho con Vite, React, TypeScript y Tailwind CSS.',
    ],
  },
  close: 'Cerrar',
  notFound: {
    title: '404',
    body: 'bash: ruta no encontrada',
    back: 'Volver al escritorio',
  },
  devPending: 'Pendiente (solo visible en desarrollo)',
};

export const seo: SiteContent['seo'] = {
  home: {
    title: 'Luis Fernando Parra — Ingeniero en Diseño de Entretenimiento Digital',
    description:
      'Portafolio de Luis Fernando Parra, Ingeniero en Diseño de Entretenimiento Digital. Medellín · abierto a trabajo remoto o presencial.',
  },
  proyectos: {
    title: 'proyectos/ — Luis Fernando Parra',
    description: 'DtMF, NOSTA, Edición de video y Bot de WhatsApp.',
  },
  perfil: {
    title: 'perfil/ — Luis Fernando Parra',
    description:
      'Diseño de producto, UI y UX · Marketing y contenido · Edición de video · Programación. Cómo trabajo con IA.',
  },
  contacto: {
    title: 'contacto.sh — Luis Fernando Parra',
    description: 'ferchopacas@gmail.com · GitHub · LinkedIn · CV en PDF.',
  },
  notFound: { title: '404 — Ferchux', description: 'Ruta no encontrada.' },
};
