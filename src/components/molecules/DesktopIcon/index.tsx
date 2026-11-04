interface DesktopIconProps {
  index: number;
  fileName: string;
  label: string;
  hint: string;
  shortcut: string;
  active: boolean;
  align?: 'left' | 'right';
  onHover: (on: boolean) => void;
  onOpen: () => void;
}

/** Icono del escritorio: número, permisos, nombre y chip "abrir ▸" al pasar por encima. */
export function DesktopIcon({
  index,
  fileName,
  label,
  hint,
  shortcut,
  active,
  align = 'left',
  onHover,
  onOpen,
}: DesktopIconProps) {
  const right = align === 'right';
  return (
    <button
      type="button"
      onClick={onOpen}
      onPointerEnter={(e) => e.pointerType === 'mouse' && onHover(true)}
      onFocus={() => onHover(true)}
      onBlur={() => onHover(false)}
      aria-keyshortcuts={shortcut}
      className={`group flex flex-col gap-1 p-2 ${right ? 'items-end text-right' : 'items-start text-left'}`}
    >
      <span
        className="font-display text-xl leading-none text-accent-2 sm:text-2xl"
        aria-hidden="true"
      >
        {String(index).padStart(2, '0')}
      </span>
      <span className="text-2xs text-dim sm:text-xs">{fileName}</span>
      <span
        className={`font-display text-3xl leading-none transition-colors sm:text-5xl ${active ? 'text-accent' : 'text-hi'}`}
      >
        {label}
      </span>
      <span
        aria-hidden="true"
        className={`mt-1 h-5 bg-accent px-2 text-2xs uppercase leading-5 tracking-widest text-bg ${active ? 'animate-chip-in' : 'invisible'}`}
      >
        {hint} ▸ <span className="opacity-60">{shortcut}</span>
      </span>
    </button>
  );
}
