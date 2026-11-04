import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { content } from '@/data';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { playSound, unlockAudio, type SoundName } from '@/lib/sound';
import { readStorage, writeStorage } from '@/lib/storage';
import type { Locale } from '@/types/content';
import { SystemContext, type Overlay, type SystemState } from './system';

const LOCALE_KEY = 'ferchux:locale';
const CRT_KEY = 'ferchux:crt';
const MUTE_KEY = 'ferchux:muted';

function isLocale(value: string | null): value is Locale {
  return value === 'es' || value === 'en';
}

function initialLocale(): Locale {
  const fromUrl = new URLSearchParams(window.location.search).get('lang');
  if (isLocale(fromUrl)) {
    writeStorage('local', LOCALE_KEY, fromUrl);
    return fromUrl;
  }
  const stored = readStorage('local', LOCALE_KEY);
  if (isLocale(stored)) return stored;
  return navigator.language?.toLowerCase().startsWith('es') ? 'es' : 'en';
}

export function SystemProvider({ children }: { children: ReactNode }) {
  const reducedMotion = usePrefersReducedMotion();
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const [crt, setCrt] = useState(() => readStorage('local', CRT_KEY) !== 'off');
  const [muted, setMuted] = useState(() => readStorage('local', MUTE_KEY) === 'on');
  const [overlay, setOverlay] = useState<Overlay>(null);
  const [booting, setBooting] = useState(() => readStorage('session', 'ferchux:booted') !== '1');
  const finishBoot = useCallback(() => setBooting(false), []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    writeStorage('local', LOCALE_KEY, next);
  }, []);

  const toggleLocale = useCallback(
    () => setLocale(locale === 'es' ? 'en' : 'es'),
    [locale, setLocale],
  );

  const toggleCrt = useCallback(() => {
    setCrt((on) => {
      writeStorage('local', CRT_KEY, on ? 'off' : 'on');
      return !on;
    });
  }, []);

  const toggleMute = useCallback(() => {
    setMuted((on) => {
      writeStorage('local', MUTE_KEY, on ? 'off' : 'on');
      return !on;
    });
  }, []);

  const sound = useCallback(
    (name: SoundName) => {
      if (!muted) playSound(name);
    },
    [muted],
  );

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  // El audio solo se habilita tras la primera interacción real.
  useEffect(() => {
    const unlock = () => {
      unlockAudio();
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
    window.addEventListener('pointerdown', unlock);
    window.addEventListener('keydown', unlock);
    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
  }, []);

  const value = useMemo<SystemState>(
    () => ({
      locale,
      t: content[locale],
      setLocale,
      toggleLocale,
      crt: crt && !reducedMotion,
      toggleCrt,
      muted,
      toggleMute,
      sound,
      overlay,
      setOverlay,
      reducedMotion,
      booting,
      finishBoot,
    }),
    [
      locale,
      setLocale,
      toggleLocale,
      crt,
      reducedMotion,
      toggleCrt,
      muted,
      toggleMute,
      sound,
      overlay,
      booting,
      finishBoot,
    ],
  );

  return <SystemContext.Provider value={value}>{children}</SystemContext.Provider>;
}
