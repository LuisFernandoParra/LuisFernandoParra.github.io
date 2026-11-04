import { useSystem } from './useSystem';

/** Idioma activo y contenido traducido. */
export function useLocale() {
  const { locale, t, setLocale, toggleLocale } = useSystem();
  return { locale, t, setLocale, toggleLocale };
}
