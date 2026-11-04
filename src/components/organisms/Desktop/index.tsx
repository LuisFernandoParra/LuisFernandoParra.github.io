import { useCallback, useEffect, useRef, useState } from 'react';
import { DesktopIcon } from '@/components/molecules/DesktopIcon';
import { ParticlePortrait, type PortraitSource } from '@/components/organisms/ParticlePortrait';
import { heroPortrait } from '@/data/shared';
import { useSystem } from '@/hooks/useSystem';
import { useWindowManager } from '@/hooks/useWindowManager';
import type { WindowId } from '@/types/content';

const OPEN_DELAY = 420;

const icons: {
  id: WindowId;
  perms: string;
  position: string;
  align: 'left' | 'right';
}[] = [
  {
    id: 'proyectos',
    perms: 'drwxr-xr-x',
    position: 'left-2 top-2 sm:left-6 sm:top-6',
    align: 'left',
  },
  {
    id: 'perfil',
    perms: 'drwxr-xr-x',
    position: 'right-2 top-2 sm:right-6 sm:top-6',
    align: 'right',
  },
  {
    id: 'contacto',
    perms: '-rwxr-xr-x',
    position: 'bottom-2 left-2 sm:bottom-6 sm:left-6',
    align: 'left',
  },
];

// En el escritorio solo va el retrato de portada; los retratos de las áreas viven en perfil/.
const sources: PortraitSource[] = [
  {
    key: 'hero',
    src: heroPortrait.src,
    vignette: !heroPortrait.transparent,
    threshold: heroPortrait.transparent ? 0.05 : 0.2,
  },
];

/**
 * Escritorio de una sola pantalla (sin scroll): retrato de partículas en el centro, nombre
 * debajo e iconos en las esquinas. Al abrir una ventana, el retrato se dispersa.
 */
export function Desktop() {
  const { t, booting } = useSystem();
  const { focused, open } = useWindowManager();
  const [hovered, setHovered] = useState<WindowId | null>(null);
  const [opening, setOpening] = useState(false);
  const openTimer = useRef(0);

  useEffect(() => () => window.clearTimeout(openTimer.current), []);
  useEffect(() => {
    if (!focused) setOpening(false);
  }, [focused]);

  const requestOpen = useCallback(
    (id: WindowId) => {
      if (opening) return;
      setOpening(true);
      openTimer.current = window.setTimeout(() => open(id), OPEN_DELAY);
    },
    [open, opening],
  );

  const mode = booting || focused || opening ? 'explode' : 'assemble';

  return (
    <main
      id="main"
      tabIndex={-1}
      className="desktop-glow relative h-[calc(100dvh-2.5rem)] overflow-hidden focus:outline-none"
    >
      <ParticlePortrait
        sources={sources}
        active="hero"
        mode={mode}
        label={t.ui.desktop.heroAlt}
        className="absolute inset-x-0 bottom-[24vh] top-[15vh] sm:bottom-[7rem] sm:top-4"
      />

      <div
        key={booting ? 'name-boot' : 'name-live'}
        className={`pointer-events-none absolute inset-x-0 bottom-[17vh] px-4 text-center sm:bottom-[max(12.5rem,16vh)] ${booting ? 'invisible' : ''}`}
      >
        <p className="relative z-10 mx-auto -mb-1 w-fit animate-reveal bg-bg px-3 py-1 text-2xs uppercase tracking-[0.3em] text-accent-2 [animation-delay:500ms] sm:text-xs">
          {t.ui.desktop.eyebrow}
        </p>
        <h1 className="mt-1 animate-reveal font-display text-5xl leading-[0.85] text-hi drop-shadow-[0_0_18px_rgba(7,20,13,0.9)] [animation-delay:300ms] sm:text-7xl lg:text-8xl xl:text-9xl">
          {t.name}
        </h1>
      </div>

      <ul key={booting ? 'icons-boot' : 'icons-live'} onPointerLeave={() => setHovered(null)}>
        {icons.map(({ id, perms, position, align }, i) => (
          <li
            key={id}
            className={`absolute animate-reveal ${position}`}
            style={{ animationDelay: `${600 + i * 120}ms` }}
          >
            <DesktopIcon
              index={i + 1}
              fileName={perms}
              label={t.ui.windows[id]}
              hint={t.ui.desktop.openHint}
              shortcut={String(i + 1)}
              active={focused === id || hovered === id}
              align={align}
              onHover={(on) => setHovered(on ? id : null)}
              onOpen={() => requestOpen(id)}
            />
          </li>
        ))}
      </ul>
    </main>
  );
}
