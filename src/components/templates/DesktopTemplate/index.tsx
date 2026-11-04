import { lazy, Suspense, type ComponentType, type LazyExoticComponent } from 'react';
import { Desktop } from '@/components/organisms/Desktop';
import { Window } from '@/components/organisms/Window';
import { useSystem } from '@/hooks/useSystem';
import { useWindowManager } from '@/hooks/useWindowManager';
import { windowIds } from '@/lib/routes';
import type { WindowId } from '@/types/content';

const windowContent: Record<Exclude<WindowId, 'contacto'>, LazyExoticComponent<ComponentType>> = {
  proyectos: lazy(() => import('@/components/organisms/ProjectsWindow')),
  perfil: lazy(() => import('@/components/organisms/ProfileWindow')),
};
const ContactWindow = lazy(() => import('@/components/organisms/ContactWindow'));

function Loading() {
  return <p className="p-6 text-xs text-dim">…</p>;
}

/**
 * Escritorio y, encima, la ventana enfocada (cada una con URL propia). proyectos/ y perfil/
 * son páginas completas; contacto.sh es una ventana de mensaje sobre el escritorio.
 */
export function DesktopTemplate() {
  const { t } = useSystem();
  const { focused, close } = useWindowManager();

  return (
    <>
      <Desktop />
      {focused === 'contacto' && (
        <Suspense fallback={null}>
          <ContactWindow onClose={() => close('contacto')} />
        </Suspense>
      )}
      {focused && focused !== 'contacto' && (
        <Window
          key={focused}
          index={windowIds.indexOf(focused) + 1}
          title={t.ui.windows[focused]}
          onClose={() => close(focused)}
        >
          <Suspense fallback={<Loading />}>
            {(() => {
              const Content = windowContent[focused];
              return <Content />;
            })()}
          </Suspense>
        </Window>
      )}
    </>
  );
}
