import type { ElementType, ReactNode } from 'react';
import { useInViewReveal } from '@/hooks/useInViewReveal';
import { useSystem } from '@/hooks/useSystem';

interface RevealProps {
  as?: ElementType;
  delay?: number;
  className?: string;
  children: ReactNode;
}

/** Aparece (sube y se funde) la primera vez que entra en pantalla. */
export function Reveal({ as: Tag = 'div', delay = 0, className = '', children }: RevealProps) {
  const { reducedMotion } = useSystem();
  const { ref, inView } = useInViewReveal<HTMLElement>();
  const state = reducedMotion ? '' : inView ? 'animate-reveal' : 'opacity-0';
  return (
    <Tag
      ref={ref}
      className={`${state} ${className}`}
      style={delay && inView ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
