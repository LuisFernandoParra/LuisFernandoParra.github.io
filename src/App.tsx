import { lazy, Suspense } from 'react';
import { BrowserRouter, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { BootScreen } from '@/components/organisms/BootScreen';
import { MenuBar } from '@/components/organisms/MenuBar';
import { SystemProvider } from '@/context/SystemContext';
import { WindowManagerProvider } from '@/context/WindowManagerContext';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useSystem } from '@/hooks/useSystem';
import { useWindowManager } from '@/hooks/useWindowManager';
import { windowIds } from '@/lib/routes';
import HomePage from '@/pages/HomePage';

const ProjectPage = lazy(() => import('@/pages/ProjectPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const CommandPalette = lazy(() => import('@/components/organisms/CommandPalette'));
const SystemDialogs = lazy(() => import('@/components/organisms/SystemDialogs'));

function GlobalShortcuts() {
  const { overlay, setOverlay } = useSystem();
  const { focused, open, close } = useWindowManager();
  const { pathname } = useLocation();
  const onProject = pathname.startsWith('/proyectos/');

  useKeyboardShortcuts({
    'mod+k': (e) => {
      e.preventDefault();
      setOverlay(overlay === 'palette' ? null : 'palette');
    },
    ...(overlay
      ? {}
      : {
          '?': () => setOverlay('shortcuts'),
          ...Object.fromEntries(windowIds.map((id, i) => [String(i + 1), () => open(id)])),
          ...(focused && !onProject ? { Escape: () => close(focused) } : {}),
        }),
  });
  return null;
}

function Layout() {
  const { t, crt, overlay } = useSystem();
  return (
    <>
      <a
        href="#main"
        className="sr-only z-[110] bg-accent px-3 py-2 text-bg focus:not-sr-only focus:fixed focus:left-2 focus:top-2"
      >
        {t.ui.skipToContent}
      </a>
      <BootScreen />
      <MenuBar />
      <Suspense fallback={null}>
        <Outlet />
      </Suspense>
      <Suspense fallback={null}>
        {overlay === 'palette' && <CommandPalette />}
        {(overlay === 'shortcuts' || overlay === 'about') && <SystemDialogs />}
      </Suspense>
      <GlobalShortcuts />
      {crt && <div className="crt-overlay" aria-hidden="true" />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <SystemProvider>
        <WindowManagerProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/proyectos" element={<HomePage />} />
              <Route path="/perfil" element={<HomePage />} />
              <Route path="/contacto" element={<HomePage />} />
              <Route path="/proyectos/:slug" element={<ProjectPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </WindowManagerProvider>
      </SystemProvider>
    </BrowserRouter>
  );
}
