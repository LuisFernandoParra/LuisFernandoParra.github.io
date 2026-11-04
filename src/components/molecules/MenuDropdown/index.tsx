import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';

interface MenuDropdownProps {
  label: string;
  children: (close: () => void) => ReactNode;
}

/** Menú desplegable accesible: Esc cierra, flechas recorren las opciones. */
export function MenuDropdown({ label, children }: MenuDropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointer);
    rootRef.current?.querySelector<HTMLElement>('[role="menuitem"]:not(:disabled)')?.focus();
    return () => document.removeEventListener('pointerdown', onPointer);
  }, [open]);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!open) return;
    if (e.key === 'Escape') {
      e.stopPropagation();
      setOpen(false);
      buttonRef.current?.focus();
      return;
    }
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    e.preventDefault();
    const items = Array.from(
      rootRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]:not(:disabled)') ?? [],
    );
    const current = items.indexOf(document.activeElement as HTMLElement);
    const step = e.key === 'ArrowDown' ? 1 : -1;
    items[(current + step + items.length) % items.length]?.focus();
  };

  return (
    <div ref={rootRef} className="relative" onKeyDown={onKeyDown}>
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((o) => !o)}
        className={`h-full px-3 text-sm transition-colors hover:text-accent ${open ? 'text-accent' : 'text-hi'}`}
      >
        {open ? `[${label}]` : label}
      </button>
      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label={label}
          className="absolute left-0 top-full z-[70] mt-px min-w-64 border border-line bg-panel py-1 shadow-window"
          onClick={(e) => {
            if ((e.target as HTMLElement).closest('[role="menuitem"]')) close();
          }}
        >
          {children(close)}
        </div>
      )}
    </div>
  );
}
