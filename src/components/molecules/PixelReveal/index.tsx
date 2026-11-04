import { useEffect, useRef, useState } from 'react';
import { useInViewReveal } from '@/hooks/useInViewReveal';
import { useSystem } from '@/hooks/useSystem';

interface PixelRevealProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  eager?: boolean;
}

const STEPS = [48, 28, 16, 9, 5, 2];
const STEP_MS = 80;

/**
 * Imagen que, al entrar en pantalla, aparece pixelada y se resuelve hasta verse nítida.
 * La imagen original siempre está debajo (si algo falla, se ve igual) y al terminar queda sola,
 * sin filtros ni recortes.
 */
export function PixelReveal({ src, alt, width, height, className = '', eager }: PixelRevealProps) {
  const { reducedMotion } = useSystem();
  const { ref, inView } = useInViewReveal<HTMLDivElement>('0px');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [done, setDone] = useState(reducedMotion);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!inView || done || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let cancelled = false;
    let timer = 0;
    const image = new Image();
    image.src = src;
    image
      .decode()
      .then(() => {
        const w = Math.min(width, 1200);
        const h = Math.round((w / width) * height);
        canvas.width = w;
        canvas.height = h;
        const small = document.createElement('canvas');
        const sctx = small.getContext('2d');
        if (!sctx) return setDone(true);
        let i = 0;
        setAnimating(true);
        const step = () => {
          if (cancelled) return;
          const f = STEPS[i];
          if (f === undefined) {
            setDone(true);
            return;
          }
          small.width = Math.max(1, Math.round(w / f));
          small.height = Math.max(1, Math.round(h / f));
          sctx.drawImage(image, 0, 0, small.width, small.height);
          ctx.imageSmoothingEnabled = false;
          ctx.clearRect(0, 0, w, h);
          ctx.drawImage(small, 0, 0, w, h);
          i++;
          timer = window.setTimeout(step, STEP_MS);
        };
        step();
      })
      .catch(() => setDone(true));
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [inView, done, src, width, height]);

  return (
    <div ref={ref} className="relative">
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className={className}
      />
      {!done && (
        <canvas
          data-animating={animating}
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0 h-full w-full bg-panel opacity-0 [image-rendering:pixelated] data-[animating=true]:opacity-100"
        />
      )}
    </div>
  );
}
