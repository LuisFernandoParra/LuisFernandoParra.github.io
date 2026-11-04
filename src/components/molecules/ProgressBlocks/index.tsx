interface ProgressBlocksProps {
  /** 0–1 */
  value: number;
  blocks?: number;
}

/** Barra de progreso hecha de bloques, como un instalador de terminal. */
export function ProgressBlocks({ value, blocks = 40 }: ProgressBlocksProps) {
  const filled = Math.round(value * blocks);
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(value * 100)}
      className="flex gap-[2px] border border-accent-2 p-[3px]"
    >
      {Array.from({ length: blocks }, (_, i) => (
        <span
          key={i}
          className={`h-2.5 flex-1 transition-colors duration-150 ${i < filled ? 'bg-accent' : 'bg-transparent'}`}
        />
      ))}
    </div>
  );
}
