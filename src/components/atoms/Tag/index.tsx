import { TypeText } from '@/components/atoms/TypeText';

interface TagProps {
  children: string;
  /** Se escribe sola al entrar en pantalla. */
  typed?: boolean;
  delay?: number;
}

export function Tag({ children, typed = false, delay = 0 }: TagProps) {
  return (
    <span className="inline-block border border-line bg-panel px-2 py-0.5 text-2xs text-dim sm:text-xs">
      {typed ? (
        <TypeText text={children} inline speed={35} delay={delay} highlightTail={0} />
      ) : (
        children
      )}
    </span>
  );
}
