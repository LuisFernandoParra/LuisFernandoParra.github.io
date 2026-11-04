import type { ReactNode } from 'react';
import { Reveal } from '@/components/atoms/Reveal';
import { PixelReveal } from '@/components/molecules/PixelReveal';
import { imageMeta } from '@/data/generated/imageMeta';
import { padFigure } from '@/lib/format';

interface FigureProps {
  number: number;
  label: string;
  src: string;
  alt: string;
  caption?: string;
  badge?: ReactNode;
  eager?: boolean;
  /** Si existe, la imagen lleva a la publicación original en otra pestaña. */
  href?: string;
  /** Texto accesible del enlace. */
  linkLabel?: string;
  /** Sin pie (número ni datos): para capturas que ya muestran su información. */
  plain?: boolean;
}

/**
 * Imagen numerada con pie corto. Aparece pixelada y se resuelve al entrar en pantalla.
 * Nunca se agranda por encima de su tamaño natural.
 */
export function Figure({
  number,
  label,
  src,
  alt,
  caption,
  badge,
  eager,
  href,
  linkLabel,
  plain,
}: FigureProps) {
  const [w, h] = imageMeta[src] ?? [800, 450];
  return (
    <figure className="flex flex-col gap-2">
      <div className="border border-line bg-panel p-1 transition-colors hover:border-accent-2">
        <div className="mx-auto" style={{ maxWidth: w }}>
          {href ? (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={linkLabel ?? alt}
              className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
            >
              <PixelReveal
                src={src}
                alt={alt}
                width={w}
                height={h}
                eager={eager}
                className="block h-auto w-full"
              />
            </a>
          ) : (
            <PixelReveal
              src={src}
              alt={alt}
              width={w}
              height={h}
              eager={eager}
              className="block h-auto w-full"
            />
          )}
        </div>
      </div>
      {!plain && (
        <Reveal as="figcaption" className="flex flex-wrap items-center gap-3 text-xs text-dim">
          <span className="text-accent-2">
            {label} {padFigure(number)}
          </span>
          {badge}
          {caption && <span>{caption}</span>}
        </Reveal>
      )}
    </figure>
  );
}
