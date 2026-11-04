import type { ElementType } from 'react';
import { useInViewReveal } from '@/hooks/useInViewReveal';
import { useSystem } from '@/hooks/useSystem';
import { useTypewriter } from '@/hooks/useTypewriter';

interface TypeTextProps {
  text: string;
  as?: ElementType;
  className?: string;
  id?: string;
  lang?: string;
  speed?: number;
  delay?: number;
  /** Deja el cursor parpadeando al terminar. */
  keepCursor?: boolean;
  /** Últimos caracteres resaltados mientras se escribe. */
  highlightTail?: number;
  /** Para textos cortos dentro de una línea (etiquetas). */
  inline?: boolean;
}

/**
 * Texto que se escribe solo al entrar en pantalla, con cursor de bloque.
 * El texto completo ocupa su espacio desde el principio (sin saltos de maquetación) y los
 * lectores de pantalla lo leen entero.
 */
export function TypeText({
  text,
  as: Tag = 'span',
  className = '',
  id,
  lang,
  speed,
  delay,
  keepCursor = false,
  highlightTail = 3,
  inline = false,
}: TypeTextProps) {
  const { reducedMotion } = useSystem();
  const { ref, inView } = useInViewReveal<HTMLSpanElement>('0px 0px -8% 0px');
  const { count, done } = useTypewriter(text, {
    speed,
    delay,
    start: inView,
    instant: reducedMotion,
  });

  const head = text.slice(0, Math.max(0, count - highlightTail));
  const tail = done ? '' : text.slice(Math.max(0, count - highlightTail), count);
  const showCursor = !reducedMotion && (!done || keepCursor) && inView;

  return (
    <Tag id={id} lang={lang} className={className}>
      <span className="sr-only">{text}</span>
      <span
        ref={ref}
        aria-hidden="true"
        className={inline ? 'relative inline-block' : 'relative block'}
      >
        <span className="invisible">{text}</span>
        <span className="absolute inset-0">
          {done ? text : head}
          {tail && <span className="text-accent">{tail}</span>}
          {showCursor && (
            <span className="ml-[0.05em] inline-block h-[0.9em] w-[0.5em] translate-y-[0.1em] animate-blink bg-accent align-baseline" />
          )}
        </span>
      </span>
    </Tag>
  );
}
