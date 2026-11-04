import { useContext } from 'react';
import { WindowManagerContext, type WindowManagerState } from '@/context/windowManager';

export function useWindowManager(): WindowManagerState {
  const ctx = useContext(WindowManagerContext);
  if (!ctx) throw new Error('useWindowManager debe usarse dentro de <WindowManagerProvider>');
  return ctx;
}
