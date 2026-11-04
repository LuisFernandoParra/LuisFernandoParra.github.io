import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSystem } from '@/hooks/useSystem';
import { windowFromPath, windowPath } from '@/lib/routes';
import type { WindowId } from '@/types/content';
import { WindowManagerContext } from './windowManager';

/**
 * La URL manda: la ruta indica la ventana enfocada. Abrir o enfocar navega a su ruta;
 * cerrar la quita de la pila y enfoca la anterior (o vuelve al escritorio).
 */
export function WindowManagerProvider({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { sound } = useSystem();
  const focused = windowFromPath(pathname);
  const [stack, setStack] = useState<WindowId[]>(() => (focused ? [focused] : []));

  useEffect(() => {
    setStack((prev) => {
      if (!focused) return [];
      if (prev[prev.length - 1] === focused) return prev;
      return [...prev.filter((id) => id !== focused), focused];
    });
  }, [focused]);

  const open = useCallback(
    (id: WindowId) => {
      if (id !== focused) sound('open');
      navigate(windowPath[id]);
    },
    [focused, navigate, sound],
  );

  const close = useCallback(
    (id: WindowId) => {
      sound('close');
      const rest = stack.filter((w) => w !== id);
      setStack(rest);
      const next = rest[rest.length - 1];
      navigate(next ? windowPath[next] : '/');
    },
    [stack, navigate, sound],
  );

  const value = useMemo(() => ({ stack, focused, open, close }), [stack, focused, open, close]);

  return <WindowManagerContext.Provider value={value}>{children}</WindowManagerContext.Provider>;
}
