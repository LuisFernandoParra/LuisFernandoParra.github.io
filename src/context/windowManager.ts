import { createContext } from 'react';
import type { WindowId } from '@/types/content';

export interface WindowManagerState {
  /** Ventanas abiertas; la última es la enfocada. */
  stack: WindowId[];
  focused: WindowId | null;
  open: (id: WindowId) => void;
  close: (id: WindowId) => void;
}

export const WindowManagerContext = createContext<WindowManagerState | null>(null);
