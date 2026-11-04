import { useEffect, useState } from 'react';

interface TypewriterOptions {
  /** Milisegundos por carácter. */
  speed?: number;
  delay?: number;
  /** Empieza a escribir solo cuando es `true`. */
  start?: boolean;
  /** Muestra el texto completo de inmediato (movimiento reducido). */
  instant?: boolean;
}

/** Devuelve cuántos caracteres de `text` se han "tecleado" hasta ahora. */
export function useTypewriter(
  text: string,
  { speed = 28, delay = 0, start = true, instant = false }: TypewriterOptions = {},
) {
  const [count, setCount] = useState(instant ? text.length : 0);

  useEffect(() => {
    if (instant) {
      setCount(text.length);
      return;
    }
    if (!start) return;
    setCount(0);
    let i = 0;
    let timer = 0;
    const tick = () => {
      // Escribe más rápido en textos largos para que nunca pase de ~1,6 s.
      const step = Math.max(1, Math.ceil(text.length / (1600 / speed)));
      i = Math.min(text.length, i + step);
      setCount(i);
      if (i < text.length) timer = window.setTimeout(tick, speed);
    };
    timer = window.setTimeout(tick, delay);
    return () => window.clearTimeout(timer);
  }, [text, speed, delay, start, instant]);

  return { count, done: count >= text.length };
}
