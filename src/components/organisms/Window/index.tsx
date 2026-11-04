import { useEffect, useId, useRef, type ReactNode } from 'react';
import { Eyebrow } from '@/components/atoms/Eyebrow';
import { Icon } from '@/components/atoms/Icon';
import { TypeText } from '@/components/atoms/TypeText';
import { Breadcrumb } from '@/components/molecules/Breadcrumb';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { useSystem } from '@/hooks/useSystem';

interface WindowProps {
  index: number;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

/**
 * Ventana del escritorio a pantalla completa (como una página del sistema): entra con un
 * barrido de luz, tiene ruta, título que se escribe solo y scroll suave. Recibe el foco al
 * abrirse y lo devuelve al cerrarse.
 */
export function Window({ index, title, onClose, children }: WindowProps) {
  const { t, reducedMotion } = useSystem();
  const headingId = useId();
  const ref = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  useSmoothScroll(scrollRef);

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    ref.current?.focus({ preventScroll: true });
    return () => {
      const target = opener?.isConnected ? opener : document.getElementById('main');
      target?.focus({ preventScroll: true });
    };
  }, []);

  return (
    <section
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-labelledby={headingId}
      tabIndex={-1}
      className={`fixed inset-x-0 bottom-0 top-10 z-40 flex flex-col bg-bg focus:outline-none ${reducedMotion ? '' : 'animate-wipe-in'}`}
    >
      {!reducedMotion && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 z-10 h-[2px] animate-scan-line bg-hi shadow-[0_0_24px_6px_rgba(125,255,155,0.5)]"
        />
      )}
      <div className="flex items-stretch border-b border-line">
        <div className="min-w-0 flex-1">
          <Breadcrumb
            crumbs={[{ label: t.ui.breadcrumbRoot, to: '/' }, { label: title }]}
            hint={t.ui.escToDesktop}
          />
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label={`${t.ui.windowClose}: ${title}`}
          className="grid w-10 shrink-0 place-items-center border-l border-line text-dim hover:bg-line hover:text-accent"
        >
          <Icon name="close" />
        </button>
      </div>
      <div ref={scrollRef} className="scrollbar-thin flex-1 overflow-y-auto overscroll-contain">
        <div>
          <header className="mx-auto max-w-[1680px] px-5 pb-10 pt-12 sm:px-10 sm:pt-20 lg:px-16 2xl:px-24">
            <Eyebrow>
              {String(index).padStart(2, '0')} / {title}
            </Eyebrow>
            <div className="mt-4 border-b border-accent-2/60 pb-8">
              <TypeText
                as="h2"
                id={headingId}
                text={title}
                speed={70}
                delay={350}
                keepCursor
                className="font-display text-7xl leading-[0.9] text-hi sm:text-8xl lg:text-9xl"
              />
            </div>
          </header>
          <div className="mx-auto max-w-[1680px]">{children}</div>
        </div>
      </div>
    </section>
  );
}
