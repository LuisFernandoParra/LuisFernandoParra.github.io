// Sonidos sintetizados con Web Audio: sin archivos, muy cortos y a volumen bajo.
let ctx: AudioContext | null = null;
let unlocked = false;

/** Se llama en la primera interacción del usuario; antes de eso no suena nada. */
export function unlockAudio(): void {
  unlocked = true;
}

export type SoundName = 'open' | 'close' | 'click';

const tones: Record<SoundName, [number, number]> = {
  open: [660, 990],
  close: [880, 440],
  click: [1200, 1200],
};

export function playSound(name: SoundName): void {
  if (!unlocked) return;
  try {
    ctx ??= new AudioContext();
    const [from, to] = tones[name];
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(from, now);
    osc.frequency.exponentialRampToValueAtTime(to, now + 0.06);
    gain.gain.setValueAtTime(0.025, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.09);
  } catch {
    // Web Audio no disponible.
  }
}
