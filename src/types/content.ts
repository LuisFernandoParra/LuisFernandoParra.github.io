export type Locale = 'es' | 'en';

export type WindowId = 'proyectos' | 'perfil' | 'contacto';

export interface ImageAsset {
  src: string;
  alt: string;
}

export interface LinkItem {
  label: string;
  href: string;
  /** false = no se muestra hasta que Fercho lo confirme. */
  enabled: boolean;
}

export interface VideoItem {
  /** ID del video en YouTube. */
  youtubeId: string;
  title: string;
  enabled: boolean;
  /** Imagen local para la fachada; si no hay, se usa la miniatura de YouTube. */
  poster?: string;
  vertical?: boolean;
  /** Etiqueta visible sobre el video, o título de la sección si hay `text`. */
  label?: string;
  /** Si hay texto, el video se muestra como un paso más: el texto al lado. */
  text?: string;
  /** Nota que solo se ve en desarrollo cuando el video está desactivado. */
  pendingNote?: string;
}

export interface FigureItem extends ImageAsset {
  caption?: string;
  /** Explicación de la captura: si existe, la figura se muestra junto a su texto. */
  text?: string;
  /** Enlace a la publicación original (al hacer clic en la imagen). */
  href?: string;
  /** Reproducciones; se muestran con ViewBadge como texto traducible. */
  views?: number;
}

export interface Project {
  slug: string;
  title: string;
  summary: string;
  type: string;
  role: string;
  period: string;
  tools: string[];
  links: LinkItem[];
  paragraphs: string[];
  list?: string[];
  cover: ImageAsset;
  /** Video principal; si está activo es la figura 01. */
  video?: VideoItem;
  figures: FigureItem[];
  /** Pieza aparte (Edición de video: presentador generado con IA). */
  extraVideo?: VideoItem;
}

export interface BootLine {
  status: 'ok' | 'wip';
  label: string;
  value: string;
}

export interface BootContent {
  command: string;
  lines: BootLine[];
  skipHint: string;
  subtitle: string;
  loading: string;
  sound: string;
  soundOn: string;
  soundOff: string;
}

export interface Area {
  id: string;
  title: string;
  tools: string[];
  description: string;
  portrait: ImageAsset;
  /** Slugs de los proyectos relacionados (botón «Ver proyecto»). */
  projects?: string[];
}

export interface TimelineItem {
  place: string;
  detail: string;
  since: string;
}

export interface ProfileContent {
  heading: string;
  intro: string;
  timelineHeading: string;
  timeline: TimelineItem[];
  areasHeading: string;
  /** Etiqueta del botón que lleva al proyecto de cada área. */
  viewProject: string;
  areas: Area[];
  cvLabel: string;
}

export interface AiStep {
  number: string;
  title: string;
  body: string;
  tags: string[];
}

export interface AiIllustrationLabels {
  idea: string;
  me: string;
  video: string;
  design: string;
  process: string;
  aiProduces: string;
  backToFix: string;
  prompt: string;
  command: string;
  question: string;
  answer: string;
  summary: string;
  /** Etiquetas con línea guía de cada escena. */
  callPlan: string;
  callTasks: string;
  callReview: string;
}

export interface AiContent {
  eyebrow: string;
  headline: string;
  steps: AiStep[];
  illustration: {
    labels: AiIllustrationLabels;
    /** Descripción corta de cada panel para lectores de pantalla. */
    descriptions: { plan: string; produce: string; waiting: string; decided: string };
    stateWaiting: string;
    stateDecided: string;
    stepIndicator: string;
  };
}

export interface ContactContent {
  /** Título de la ventana de mensaje. */
  windowTitle: string;
  to: string;
  from: string;
  subject: string;
  message: string;
  fromPlaceholder: string;
  mailSubject: string;
  mailBody: string;
  send: string;
  /** Aclaración bajo el botón: se abre el programa de correo. */
  sendHint: string;
  linkedinHandle: string;
  githubHandle: string;
  cvHint: string;
}

export interface SeoEntry {
  title: string;
  description: string;
}

export interface UiStrings {
  skipToContent: string;
  menu: {
    file: string;
    system: string;
    language: string;
    openWindow: (name: string) => string;
    downloadCv: string;
    printCv: string;
    about: string;
    fullscreen: string;
    exitFullscreen: string;
    fullscreenUnavailable: string;
    crtOff: string;
    crtOn: string;
    mute: string;
    unmute: string;
    commandPalette: string;
    shortcuts: string;
    switchTo: string;
  };
  desktop: {
    eyebrow: string;
    location: string;
    locationShort: string;
    openHint: string;
    heroAlt: string;
  };
  windows: Record<WindowId, string>;
  windowClose: string;
  breadcrumbRoot: string;
  escToDesktop: string;
  escCloseWindow: string;
  escCloseProject: string;
  project: {
    type: string;
    role: string;
    period: string;
    tools: string;
    links: string;
    figure: string;
    prev: string;
    next: string;
    index: string;
    upNext: string;
    viewsLabel: (formatted: string) => string;
    playVideo: (title: string) => string;
    /** Texto accesible del enlace de una captura a su publicación. */
    openPost: (alt: string) => string;
    openProject: string;
    viewLabel: string;
    viewRoom: string;
    viewList: string;
    dragHint: string;
  };
  palette: {
    placeholder: string;
    empty: string;
    copyEmail: string;
    emailCopied: string;
    toggleLanguage: string;
  };
  shortcutsHelp: {
    title: string;
    items: [string, string][];
  };
  about: {
    title: string;
    lines: string[];
  };
  close: string;
  notFound: {
    title: string;
    body: string;
    back: string;
  };
  devPending: string;
}

export interface SiteContent {
  locale: Locale;
  name: string;
  jobTitle: string;
  availability: string;
  boot: BootContent;
  profile: ProfileContent;
  ai: AiContent;
  projects: Project[];
  contact: ContactContent;
  ui: UiStrings;
  seo: {
    home: SeoEntry;
    proyectos: SeoEntry;
    perfil: SeoEntry;
    contacto: SeoEntry;
    notFound: SeoEntry;
  };
}
