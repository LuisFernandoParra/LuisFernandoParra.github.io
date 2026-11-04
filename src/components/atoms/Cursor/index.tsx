interface CursorProps {
  blinking?: boolean;
}

export function Cursor({ blinking = true }: CursorProps) {
  return (
    <span
      aria-hidden="true"
      className={`ml-0.5 inline-block h-[1.1em] w-[0.55em] translate-y-[0.15em] bg-accent ${blinking ? 'animate-blink' : ''}`}
    />
  );
}
