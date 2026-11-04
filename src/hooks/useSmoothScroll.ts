import Lenis from 'lenis';
import { useEffect, type RefObject } from 'react';
import { useSystem } from './useSystem';

/**
 * Scroll suave con inercia (Lenis). Sin `ref` se aplica a la página; con `ref`, a ese
 * contenedor con scroll propio. Se desactiva con movimiento reducido.
 */
export function useSmoothScroll(ref?: RefObject<HTMLElement>) {
  const { reducedMotion } = useSystem();

  useEffect(() => {
    if (reducedMotion) return;
    const wrapper = ref?.current;
    const content = wrapper?.firstElementChild;
    if (ref && (!wrapper || !(content instanceof HTMLElement))) return;
    const lenis = new Lenis(
      wrapper && content instanceof HTMLElement ? { wrapper, content, lerp: 0.1 } : { lerp: 0.1 },
    );
    let frame = requestAnimationFrame(function loop(time) {
      lenis.raf(time);
      frame = requestAnimationFrame(loop);
    });
    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, [ref, reducedMotion]);
}
