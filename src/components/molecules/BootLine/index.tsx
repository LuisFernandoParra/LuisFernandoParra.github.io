import { useEffect, useState } from 'react';
import type { BootLine as BootLineData } from '@/types/content';

const LABEL_WIDTH = 20;
const COUNT_DURATION = 420;

interface BootLineProps extends BootLineData {
  /** Anima el número del valor desde 0 (p. ej. "0/4" → "4/4"). */
  animate?: boolean;
}

function useCountUp(target: number, animate: boolean) {
  const [value, setValue] = useState(animate ? 0 : target);
  useEffect(() => {
    if (!animate) return;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / COUNT_DURATION);
      setValue(Math.round(target * p));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, animate]);
  return value;
}

/** Línea de arranque tipo `[ OK ] marketing ........... 1 año`; el número sube al aparecer. */
export function BootLine({ status, label, value, animate = false }: BootLineProps) {
  const match = /^(\d+)(.*)$/.exec(value);
  const target = match ? Number(match[1]) : 0;
  const current = useCountUp(target, animate && Boolean(match));
  const shown = match ? `${current}${match[2] ?? ''}` : value;
  const dots = '.'.repeat(Math.max(2, LABEL_WIDTH - label.length));
  const ok = status === 'ok';

  return (
    <p className="animate-[chip-in_200ms_ease-out_both] whitespace-pre">
      <span className={ok ? 'text-accent' : 'text-dim'}>{ok ? '[ OK ]' : '[ .. ]'}</span>{' '}
      <span className="text-hi">{label}</span> <span className="text-dim/60">{dots}</span>{' '}
      <span className="text-dim">{shown}</span>
    </p>
  );
}
