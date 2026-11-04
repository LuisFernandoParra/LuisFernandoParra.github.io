import { useContext } from 'react';
import { SystemContext, type SystemState } from '@/context/system';

export function useSystem(): SystemState {
  const ctx = useContext(SystemContext);
  if (!ctx) throw new Error('useSystem debe usarse dentro de <SystemProvider>');
  return ctx;
}
