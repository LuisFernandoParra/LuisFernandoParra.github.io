import { useCallback, useEffect, useRef, useState } from 'react';
import { playSound } from '@/lib/sound';
import { readStorage, writeStorage } from '@/lib/storage';

const BOOT_KEY = 'ferchux:booted';
const TYPE_SPEED = 42;
const LINE_DELAY = 300;
const EXIT_DURATION = 720;

export type BootPhase = 'typing' | 'lines' | 'ready' | 'exiting' | 'done';

interface BootState {
  phase: BootPhase;
  /** Caracteres del comando ya escritos. */
  typed: number;
  /** Líneas de estado ya mostradas. */
  shownLines: number;
  /** Progreso global 0–1 (barra de bloques). */
  progress: number;
  skip: () => void;
}

/**
 * Secuencia de arranque: escribe el comando, muestra las líneas una a una y espera una tecla.
 * Cualquier tecla o clic sale con un barrido. Una vez por sesión; con movimiento reducido
 * aparece completa de inmediato y sale sin barrido.
 */
export function useBootSequence(
  command: string,
  lineCount: number,
  reducedMotion: boolean,
  muted: boolean,
): BootState {
  const [phase, setPhase] = useState<BootPhase>(() =>
    readStorage('session', BOOT_KEY) === '1' ? 'done' : reducedMotion ? 'ready' : 'typing',
  );
  const [typed, setTyped] = useState(reducedMotion ? command.length : 0);
  const [shownLines, setShownLines] = useState(reducedMotion ? lineCount : 0);
  const mutedRef = useRef(muted);
  mutedRef.current = muted;

  const skip = useCallback(() => {
    writeStorage('session', BOOT_KEY, '1');
    if (reducedMotion) {
      setPhase('done');
      return;
    }
    setPhase((p) => (p === 'exiting' || p === 'done' ? p : 'exiting'));
  }, [reducedMotion]);

  useEffect(() => {
    if (phase === 'typing') {
      if (typed >= command.length) {
        setPhase('lines');
        return;
      }
      const id = window.setTimeout(() => setTyped((n) => n + 1), TYPE_SPEED);
      return () => window.clearTimeout(id);
    }
    if (phase === 'lines') {
      if (shownLines >= lineCount) {
        setPhase('ready');
        return;
      }
      const id = window.setTimeout(() => {
        setShownLines((n) => n + 1);
        if (!mutedRef.current) playSound('click');
      }, LINE_DELAY);
      return () => window.clearTimeout(id);
    }
    if (phase === 'exiting') {
      const id = window.setTimeout(() => setPhase('done'), EXIT_DURATION);
      return () => window.clearTimeout(id);
    }
  }, [phase, typed, shownLines, command.length, lineCount]);

  const progress = Math.min(1, 0.2 * (typed / command.length) + 0.8 * (shownLines / lineCount));

  return { phase, typed, shownLines, progress, skip };
}
