import type { ReactNode } from 'react';

interface EyebrowProps {
  children: ReactNode;
  className?: string;
}

export function Eyebrow({ children, className = '' }: EyebrowProps) {
  return (
    <p className={`text-2xs uppercase tracking-[0.25em] text-accent-2 sm:text-xs ${className}`}>
      {children}
    </p>
  );
}
