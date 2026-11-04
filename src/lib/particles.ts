// Utilidades compartidas por los sistemas de partículas (retratos, áreas y sala de proyectos).

export const PORTRAIT_COLS = 96;
export const PORTRAIT_ASPECT = 0.8; // ancho / alto de los retratos (4:5)

const DARK = [31, 77, 52];
const LIGHT = [216, 255, 227];

/** Paleta verde de oscuro a claro para dibujar partículas por grupos de color. */
export function greenPalette(steps: number): string[] {
  return Array.from({ length: steps }, (_, i) => {
    const t = i / (steps - 1);
    return `rgb(${DARK.map((d, k) => Math.round(d + ((LIGHT[k] ?? 0) - d) * t)).join(',')})`;
  });
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  const image = new Image();
  image.src = src;
  return image.decode().then(() => image);
}

export interface SampleOptions {
  /** Desvanece los bordes (foto con fondo). */
  vignette?: boolean;
  /** Recorte de sombras: más alto = menos fondo. */
  threshold?: number;
  /** Columnas de la rejilla de muestreo (más = más detalle). */
  cols?: number;
  /** Realce de detalles (contraste local): 0 = nada. */
  detail?: number;
}

/**
 * Muestrea un retrato en una rejilla y devuelve exactamente `count` puntos [x, y, brillo]
 * (0–1), en orden de filas, para que dos retratos se puedan transformar uno en otro.
 * El contraste se calcula solo sobre la figura (ignora el fondo transparente) y se realzan
 * los detalles para que la cara se lea bien aunque la foto esté a contraluz.
 */
export function samplePortrait(
  image: HTMLImageElement,
  { vignette, threshold = 0.12, cols = PORTRAIT_COLS, detail = 0.9 }: SampleOptions,
  count: number,
): Float32Array {
  const rows = Math.round(cols / PORTRAIT_ASPECT);
  const out = new Float32Array(count * 3);
  const read = (blur: number) => {
    const canvas = document.createElement('canvas');
    canvas.width = cols;
    canvas.height = rows;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return null;
    if (blur) ctx.filter = `blur(${blur}px)`;
    ctx.drawImage(image, 0, 0, cols, rows);
    return ctx.getImageData(0, 0, cols, rows).data;
  };
  const data = read(0);
  const soft = detail > 0 ? read(Math.max(1.5, cols / 60)) : null;
  if (!data) return out;

  const lumAt = (d: Uint8ClampedArray, o: number) =>
    (0.2126 * (d[o] ?? 0) + 0.7152 * (d[o + 1] ?? 0) + 0.0722 * (d[o + 2] ?? 0)) / 255;
  const n = cols * rows;
  const lum = new Float32Array(n);
  const alpha = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const o = i * 4;
    alpha[i] = (data[o + 3] ?? 0) / 255;
    const l = lumAt(data, o);
    lum[i] = soft ? l + (l - lumAt(soft, o)) * detail * 2 : l;
  }
  // Niveles automáticos solo con los píxeles de la figura.
  const visible: number[] = [];
  for (let i = 0; i < n; i++) if ((alpha[i] ?? 0) > 0.5) visible.push(lum[i] ?? 0);
  visible.sort((a, b) => a - b);
  const lo = visible[Math.floor(visible.length * 0.02)] ?? 0;
  const hi = visible[Math.floor(visible.length * 0.985)] ?? 1;
  const range = Math.max(0.05, hi - lo);

  const pts: number[] = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const i = y * cols + x;
      const a = alpha[i] ?? 0;
      if (a < 0.4) continue;
      let b = Math.min(1, Math.max(0, ((lum[i] ?? 0) - lo) / range)) ** 0.85 * a;
      if (vignette) {
        const dx = (x / cols - 0.5) * 2;
        const dy = (y / rows - 0.42) * 1.6;
        b *= Math.max(0, 1 - Math.pow(Math.hypot(dx, dy), 2.6));
      }
      b = (b - threshold) / (1 - threshold);
      if (b > 0.02) pts.push((x + 0.5) / cols, (y + 0.5) / rows, Math.min(1, b));
    }
  }

  const m = pts.length / 3;
  for (let i = 0; i < count; i++) {
    const j = m ? Math.floor((i * m) / count) : 0;
    out[i * 3] = pts[j * 3] ?? 0.5;
    out[i * 3 + 1] = pts[j * 3 + 1] ?? 0.5;
    out[i * 3 + 2] = pts[j * 3 + 2] ?? 0;
  }
  return out;
}

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * Disolución bajo el cursor: las partículas cercanas se encogen y se esparcen como polvo
 * (desplazamiento aleatorio, no radial) para dejar ver la foto original sin dibujar ningún
 * anillo. Devuelve [dx, dy, k], con k = cuánto se disuelve (0–1).
 */
export function dissolve(
  x: number,
  y: number,
  mx: number,
  my: number,
  radius: number,
  strength: number,
  seed: number,
  time: number,
): [number, number, number] {
  if (strength <= 0) return [0, 0, 0];
  const dx = x - mx;
  const dy = y - my;
  const d2 = dx * dx + dy * dy;
  if (d2 >= radius * radius) return [0, 0, 0];
  const f = 1 - Math.sqrt(d2) / radius;
  const k = f * f * (3 - 2 * f) * strength;
  const angle = seed * 6.2832 + time * 0.0025;
  const amp = k * radius * 0.3 * (0.4 + ((seed * 7.31) % 1) * 0.6);
  return [Math.cos(angle) * amp, Math.sin(angle) * amp, k];
}

/** Dibuja una partícula como un trazo corto horizontal (parecido a un carácter de texto). */
export function dash(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  const w = size * 1.45;
  const h = Math.max(0.7, size * 0.72);
  ctx.fillRect(x - w / 2, y - h / 2, w, h);
}

/**
 * Arrastre con inercia: las partículas cercanas al cursor reciben un empujón en la dirección
 * en que se mueve el ratón (y uno leve hacia afuera), se deslizan y vuelven solas a su sitio.
 * Guarda un desplazamiento por partícula; `step` se llama una vez por partícula y cuadro.
 */
export class DragField {
  private offX: Float32Array;
  private offY: Float32Array;
  private velX: Float32Array;
  private velY: Float32Array;

  constructor(count: number) {
    this.offX = new Float32Array(count);
    this.offY = new Float32Array(count);
    this.velX = new Float32Array(count);
    this.velY = new Float32Array(count);
  }

  /** Devuelve el desplazamiento [dx, dy] de la partícula `i` para este cuadro. */
  step(
    i: number,
    x: number,
    y: number,
    mx: number,
    my: number,
    mvx: number,
    mvy: number,
    radius: number,
  ): [number, number] {
    let vx = this.velX[i] ?? 0;
    let vy = this.velY[i] ?? 0;
    const dx = x - mx;
    const dy = y - my;
    const d2 = dx * dx + dy * dy;
    if (d2 < radius * radius) {
      const d = Math.sqrt(d2) || 0.001;
      const f = (1 - d / radius) ** 2;
      vx += mvx * f * 0.4 + (dx / d) * f * 0.12;
      vy += mvy * f * 0.4 + (dy / d) * f * 0.12;
    }
    vx *= 0.86;
    vy *= 0.86;
    // Muelle de vuelta a su sitio (~0,5 s).
    const ox = ((this.offX[i] ?? 0) + vx) * 0.915;
    const oy = ((this.offY[i] ?? 0) + vy) * 0.915;
    this.velX[i] = vx;
    this.velY[i] = vy;
    this.offX[i] = ox;
    this.offY[i] = oy;
    return [ox, oy];
  }
}

/** Velocidad del ratón entre cuadros (px), limitada para evitar saltos. */
export function mouseVelocity(prev: { x: number; y: number }, x: number, y: number) {
  const valid = x > -5000 && prev.x > -5000;
  const vx = valid ? Math.max(-60, Math.min(60, x - prev.x)) : 0;
  const vy = valid ? Math.max(-60, Math.min(60, y - prev.y)) : 0;
  prev.x = x;
  prev.y = y;
  return { vx, vy };
}

/**
 * Estela de revelado: la imagen original está fija debajo y se deja ver por donde pasa el
 * cursor; la estela se vuelve a tapar en ~0,5 s. La imagen nunca se deforma: solo las
 * partículas de encima se apartan y se desvanecen.
 */
export class RevealTrail {
  private mask = document.createElement('canvas');
  private tmp = document.createElement('canvas');
  /** Cuánta estela queda (0 = nada que dibujar). */
  energy = 0;

  update(rect: Rect, mx: number, my: number, radius: number, on: boolean) {
    const scale = 0.5;
    const w = Math.max(1, Math.round(rect.w * scale));
    const h = Math.max(1, Math.round(rect.h * scale));
    if (this.mask.width !== w || this.mask.height !== h) {
      this.mask.width = w;
      this.mask.height = h;
    }
    const m = this.mask.getContext('2d');
    if (!m) return;
    m.globalCompositeOperation = 'destination-out';
    m.fillStyle = 'rgba(0,0,0,0.09)';
    m.fillRect(0, 0, w, h);
    if (on) {
      const lx = (mx - rect.x) * scale;
      const ly = (my - rect.y) * scale;
      const r = radius * scale;
      const grad = m.createRadialGradient(lx, ly, 0, lx, ly, r);
      grad.addColorStop(0, 'rgba(255,255,255,0.35)');
      grad.addColorStop(0.55, 'rgba(255,255,255,0.18)');
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      m.globalCompositeOperation = 'source-over';
      m.fillStyle = grad;
      m.fillRect(lx - r, ly - r, r * 2, r * 2);
      this.energy = 1;
    } else {
      this.energy *= 0.9;
    }
  }

  draw(ctx: CanvasRenderingContext2D, image: HTMLImageElement, rect: Rect) {
    if (this.energy < 0.02) return;
    const w = Math.max(1, Math.round(Math.min(rect.w, 900)));
    const h = Math.max(1, Math.round((w / rect.w) * rect.h));
    if (this.tmp.width !== w || this.tmp.height !== h) {
      this.tmp.width = w;
      this.tmp.height = h;
    }
    const t = this.tmp.getContext('2d');
    if (!t) return;
    t.globalCompositeOperation = 'source-over';
    t.clearRect(0, 0, w, h);
    t.drawImage(image, 0, 0, w, h);
    t.globalCompositeOperation = 'destination-in';
    t.drawImage(this.mask, 0, 0, w, h);
    ctx.drawImage(this.tmp, rect.x, rect.y, rect.w, rect.h);
  }
}

/** Cuánto se desvanece una partícula según su desplazamiento por el arrastre (0–1). */
export function dragFade(ox: number, oy: number, cell: number): number {
  return Math.min(1, Math.hypot(ox, oy) / Math.max(4, cell * 3));
}
