import { createContext } from 'react';
import type { SoundName } from '@/lib/sound';
import type { Locale, SiteContent } from '@/types/content';

export type Overlay = 'palette' | 'shortcuts' | 'about' | null;

export interface SystemState {
  locale: Locale;
  t: SiteContent;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  crt: boolean;
  toggleCrt: () => void;
  muted: boolean;
  toggleMute: () => void;
  sound: (name: SoundName) => void;
  overlay: Overlay;
  setOverlay: (overlay: Overlay) => void;
  reducedMotion: boolean;
  /** true mientras se ve la pantalla de arranque. */
  booting: boolean;
  finishBoot: () => void;
}

export const SystemContext = createContext<SystemState | null>(null);
