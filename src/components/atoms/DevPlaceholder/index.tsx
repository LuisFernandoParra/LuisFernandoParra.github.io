import type { ReactNode } from 'react';

interface DevPlaceholderProps {
  label: string;
  children?: ReactNode;
  className?: string;
}

/** Marca de contenido pendiente. Solo se renderiza en desarrollo (`npm run dev`). */
export function DevPlaceholder({ label, children, className = '' }: DevPlaceholderProps) {
  if (!import.meta.env.DEV) return null;
  return (
    <div
      className={`border border-dashed border-accent-2 bg-panel/60 p-4 text-xs text-dim ${className}`}
      data-dev-placeholder
    >
      <p className="text-accent">[ {label} ]</p>
      {children && <p className="mt-1">{children}</p>}
    </div>
  );
}
