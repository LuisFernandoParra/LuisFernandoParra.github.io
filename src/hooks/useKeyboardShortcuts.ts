import { useEffect, useRef } from 'react';

export type ShortcutMap = Record<string, (event: KeyboardEvent) => void>;

function isTyping(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
}

/**
 * Atajos globales. Claves: la tecla (`e.key`), con prefijo `mod+` para Ctrl/⌘.
 * Las teclas simples se ignoran mientras se escribe en un campo.
 */
export function useKeyboardShortcuts(map: ShortcutMap, enabled = true): void {
  const mapRef = useRef(map);
  mapRef.current = map;

  useEffect(() => {
    if (!enabled) return;
    const onKey = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey;
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      const id = mod ? `mod+${key}` : key;
      const handler = mapRef.current[id];
      if (!handler) return;
      if (!mod && (e.altKey || isTyping(e.target)) && key !== 'Escape') return;
      handler(e);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [enabled]);
}
