import { useEffect, useState } from 'react';
import { Cursor } from '@/components/atoms/Cursor';
import { BootLine } from '@/components/molecules/BootLine';
import { ProgressBlocks } from '@/components/molecules/ProgressBlocks';
import { useBootSequence } from '@/hooks/useBootSequence';
import { useSystem } from '@/hooks/useSystem';

const STRIPES = ['bg-line', 'bg-accent-2/70', 'bg-accent-2', 'bg-accent', 'bg-hi', 'bg-panel'];

function LoadingDots() {
  const [n, setN] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setN((v) => (v + 1) % 4), 320);
    return () => window.clearInterval(id);
  }, []);
  return <span className="inline-block w-[3ch] text-left">{'.'.repeat(n)}</span>;
}

/** Pantalla de arranque de Ferchux. Cualquier tecla o clic entra al escritorio. */
export function BootScreen() {
  const { t, reducedMotion, muted, toggleMute, finishBoot } = useSystem();
  const { command, lines, skipHint, subtitle, loading, sound, soundOn, soundOff } = t.boot;
  const { phase, typed, shownLines, progress, skip } = useBootSequence(
    command,
    lines.length,
    reducedMotion,
    muted,
  );
  const visible = phase !== 'done';

  useEffect(() => {
    if (phase === 'exiting' || phase === 'done') finishBoot();
  }, [phase, finishBoot]);

  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') return;
      e.preventDefault();
      if (e.key.toLowerCase() === 's') {
        toggleMute();
        return;
      }
      skip();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [visible, skip, toggleMute]);

  if (!visible) return null;
  const exiting = phase === 'exiting';
  const ready = phase === 'ready' || exiting;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Ferchux"
      className="fixed inset-0 z-[100]"
      onClick={skip}
    >
      <div
        className={`grid h-full place-items-center bg-bg px-4 ${exiting ? 'animate-wipe-out' : ''}`}
      >
        <div className="w-full max-w-xl">
          <header className="relative border border-accent-2 bg-panel px-6 pb-5 pt-6 text-center shadow-[6px_6px_0_0_#4fd17a]">
            <p className="font-display text-6xl leading-none text-hi sm:text-7xl">Ferchux</p>
            <p className="mt-2 text-2xs uppercase tracking-[0.25em] text-accent-2">{subtitle}</p>
            <div className="mt-4 flex h-2" aria-hidden="true">
              {STRIPES.map((c) => (
                <span key={c} className={`flex-1 ${c}`} />
              ))}
            </div>
          </header>

          <div
            className="mt-5 border border-accent-2 bg-bg/60 p-4 text-xs sm:text-sm"
            aria-live="polite"
          >
            <p className="whitespace-pre-wrap break-all">
              <span className="text-accent-2">fercho@medellin:~$</span>{' '}
              <span className="text-hi">{command.slice(0, typed)}</span>
              {phase === 'typing' && <Cursor />}
            </p>
            <div className="mt-2 min-h-[10.5rem] overflow-x-auto">
              {lines.slice(0, shownLines).map((line) => (
                <BootLine key={line.label} {...line} animate={!reducedMotion} />
              ))}
            </div>
            <div className="mt-3">
              <ProgressBlocks value={progress} />
            </div>
          </div>

          <button
            type="button"
            onClick={skip}
            className={`mx-auto mt-6 block text-2xs uppercase tracking-[0.25em] sm:text-xs ${ready ? 'animate-pulse text-accent' : 'text-dim'}`}
          >
            ▮{' '}
            {ready ? (
              skipHint
            ) : (
              <>
                {loading}
                <LoadingDots />
              </>
            )}{' '}
            ▮
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleMute();
            }}
            className="mx-auto mt-3 block text-2xs uppercase tracking-widest text-dim hover:text-accent"
          >
            [S] {sound}: {muted ? soundOff : soundOn}
          </button>
        </div>
      </div>
      {exiting && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 h-[2px] animate-scan-line bg-hi shadow-[0_0_24px_6px_rgba(125,255,155,0.55)]"
        />
      )}
    </div>
  );
}
