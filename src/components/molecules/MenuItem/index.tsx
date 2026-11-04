import type { ReactNode } from 'react';

interface MenuItemProps {
  onSelect: () => void;
  children: ReactNode;
  hint?: string;
  disabled?: boolean;
}

/** Opción de un menú desplegable de la barra superior. */
export function MenuItem({ onSelect, children, hint, disabled }: MenuItemProps) {
  return (
    <button
      type="button"
      role="menuitem"
      disabled={disabled}
      onClick={onSelect}
      className="flex w-full items-center justify-between gap-6 px-4 py-2 text-left text-sm text-hi hover:bg-line focus-visible:bg-line focus-visible:outline-none disabled:cursor-not-allowed disabled:text-dim disabled:hover:bg-transparent"
    >
      <span>{children}</span>
      {hint && <kbd className="border border-line px-1.5 font-mono text-2xs text-dim">{hint}</kbd>}
    </button>
  );
}
