// Muestrea una imagen en una rejilla y devuelve sus partículas [x, y, brillo] normalizadas
// (0–1), para dibujarlas en canvas como los retratos. Se calcula una vez y queda en caché.

export interface ParticleSet {
  /** Puntos [x, y, brillo] seguidos, ordenados de oscuro a claro. */
  points: Float32Array;
  cols: number;
  /** Ancho / alto de la imagen. */
  aspect: number;
}

const cache = new Map<string, Promise<ParticleSet | null>>();

async function sample(src: string, cols: number): Promise<ParticleSet | null> {
  const image = new Image();
  image.src = src;
  await image.decode();
  const aspect = image.naturalWidth / image.naturalHeight;
  const rows = Math.max(1, Math.round(cols / aspect));

  const canvas = document.createElement('canvas');
  canvas.width = cols;
  canvas.height = rows;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return null;
  ctx.drawImage(image, 0, 0, cols, rows);
  const { data } = ctx.getImageData(0, 0, cols, rows);
  // Copia desenfocada para realzar los detalles (contraste local).
  ctx.filter = `blur(${Math.max(1.5, cols / 60)}px)`;
  ctx.drawImage(image, 0, 0, cols, rows);
  const soft = ctx.getImageData(0, 0, cols, rows).data;

  const lumAt = (d: Uint8ClampedArray, o: number) =>
    (0.2126 * (d[o] ?? 0) + 0.7152 * (d[o + 1] ?? 0) + 0.0722 * (d[o + 2] ?? 0)) / 255;
  const lums = new Float32Array(cols * rows);
  for (let i = 0; i < lums.length; i++) {
    const l = lumAt(data, i * 4);
    lums[i] = l + (l - lumAt(soft, i * 4)) * 1.6;
  }
  const sorted = Array.from(lums).sort((a, b) => a - b);
  const lo = sorted[Math.floor(sorted.length * 0.03)] ?? 0;
  const hi = sorted[Math.floor(sorted.length * 0.98)] ?? 1;
  const range = Math.max(0.05, hi - lo);

  const found: [number, number, number][] = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const b = Math.min(1, Math.max(0, ((lums[y * cols + x] ?? 0) - lo) / range)) ** 0.85;
      if (b >= 0.06) found.push([(x + 0.5) / cols, (y + 0.5) / rows, b]);
    }
  }
  // Ordenados de oscuro a claro: así se dibujan agrupados por color en una sola pasada.
  found.sort((a, b) => a[2] - b[2]);
  return { points: new Float32Array(found.flat()), cols, aspect };
}

/** Partículas de `src` (en caché). */
export function particleSet(src: string, cols = 72): Promise<ParticleSet | null> {
  const key = `${src}|${cols}`;
  let job = cache.get(key);
  if (!job) {
    job = sample(src, cols).catch(() => null);
    cache.set(key, job);
  }
  return job;
}
