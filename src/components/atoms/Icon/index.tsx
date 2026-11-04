import type { SVGProps } from 'react';

export type IconName =
  'close' | 'external' | 'download' | 'mail' | 'play' | 'copy' | 'arrow-left' | 'arrow-right';

const paths: Record<IconName, string> = {
  close: 'M4 4l8 8M12 4l-8 8',
  external: 'M6 3h7v7M13 3L5 11M3 6v7h7',
  download: 'M8 2v8M4.5 6.5L8 10l3.5-3.5M3 13h10',
  mail: 'M2 4h12v8H2zM2 4l6 5 6-5',
  play: 'M5 3l8 5-8 5z',
  copy: 'M5 5h8v8H5zM3 11V3h8',
  'arrow-left': 'M13 8H3M7 4L3 8l4 4',
  'arrow-right': 'M3 8h10M9 4l4 4-4 4',
};

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
}

/** Iconos lineales de 16×16, decorativos por defecto. */
export function Icon({ name, size = 16, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill={name === 'play' ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      <path d={paths[name]} />
    </svg>
  );
}
