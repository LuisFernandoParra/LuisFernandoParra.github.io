import { useEffect, useRef, useState } from 'react';
import { useSystem } from '@/hooks/useSystem';
import {
  dragFade,
  greenPalette,
  dash,
  DragField,
  mouseVelocity,
  RevealTrail,
  dissolve,
  loadImage,
  PORTRAIT_ASPECT,
  samplePortrait,
  type SampleOptions,
} from '@/lib/particles';

export interface PortraitSource extends SampleOptions {
  key: string;
  src: string;
}

export type PortraitMode = 'assemble' | 'explode';

interface ParticlePortraitProps {
  sources: PortraitSource[];
  active: string;
  mode: PortraitMode;
  label: string;
  className?: string;
}

/** Partículas y columnas de muestreo: más densidad = más detalle en la cara. */
const MAX = 22000;
const COLS = 170;
const PALETTE_STEPS = 14;
const palette = greenPalette(PALETTE_STEPS);
/** Radio de la foto revelada y del arrastre, en proporción al ancho del retrato. */
const LENS_RATIO = 0.14;
const DRAG_RATIO = 0.2;

interface Loaded {
  image: HTMLImageElement;
  points: Float32Array;
}

/**
 * Retrato de partículas en canvas: se arma al llegar, sigue el ratón con un leve paralaje,
 * bajo el cursor deja ver la foto original (lupa) y se dispersa con `mode="explode"`.
 * Con movimiento reducido se muestra la imagen fija teñida de verde.
 */
export function ParticlePortrait({
  sources,
  active,
  mode,
  label,
  className = '',
}: ParticlePortraitProps) {
  const { reducedMotion } = useSystem();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const setsRef = useRef<Map<string, Loaded>>(new Map());
  const stateRef = useRef({ active, mode });
  const [ready, setReady] = useState(false);
  stateRef.current = { active, mode };

  // Carga y muestreo de todas las imágenes (una sola vez).
  useEffect(() => {
    if (reducedMotion) return;
    let cancelled = false;
    Promise.all(
      sources.map((s) =>
        loadImage(s.src)
          .then(
            (image) =>
              [s.key, { image, points: samplePortrait(image, { cols: COLS, ...s }, MAX) }] as const,
          )
          .catch(() => null),
      ),
    ).then((results) => {
      if (cancelled) return;
      for (const r of results) if (r) setsRef.current.set(r[0], r[1]);
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [sources, reducedMotion]);

  // Bucle de animación.
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ready || !canvas || !ctx) return;

    const n = MAX;
    const px = new Float32Array(n);
    const py = new Float32Array(n);
    const pb = new Float32Array(n);
    const pa = new Float32Array(n);
    const vx = new Float32Array(n);
    const vy = new Float32Array(n);
    const speed = new Float32Array(n);
    const seed = new Float32Array(n);
    const ex = new Float32Array(n); // dirección de dispersión
    const ey = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const ang = Math.random() * Math.PI * 2;
      const r = 0.35 + Math.random() * 0.9;
      px[i] = 0.5 + Math.cos(ang) * r;
      py[i] = 0.5 + Math.sin(ang) * r;
      speed[i] = 0.05 + Math.random() * 0.09;
      seed[i] = Math.random();
      ex[i] = Math.cos(ang) * (0.4 + Math.random() * 0.9);
      ey[i] = Math.sin(ang) * (0.4 + Math.random() * 0.9) - 0.15;
    }

    let width = 0;
    let height = 0;
    let dpr = 1;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const mouse = { x: 0, y: 0, sx: 0, sy: 0, cx: -9999, cy: -9999, rx: -9999, ry: -9999 };
    const onMove = (e: PointerEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
      mouse.cx = e.clientX;
      mouse.cy = e.clientY;
    };
    const onLeave = () => {
      mouse.cx = mouse.cy = -9999;
    };
    window.addEventListener('pointermove', onMove);
    document.addEventListener('pointerleave', onLeave);

    let frame = 0;
    let onScreen = true;
    let glitchUntil = 0;
    let glitchRow = 0;
    let lastMode = stateRef.current.mode;
    let lastKey = stateRef.current.active;
    let explodeStart = 0;
    let lensAlpha = 0;
    const drag = new DragField(n);
    const trail = new RevealTrail();
    const prevMouse = { x: -9999, y: -9999 };
    // Búferes de dibujo reutilizados en cada cuadro.
    const drawX = new Float32Array(n);
    const drawY = new Float32Array(n);
    const drawS = new Float32Array(n);
    const drawA = new Float32Array(n);
    const drawBucket = new Int8Array(n);
    const order = new Uint32Array(n);
    const bucketCount = new Int32Array(PALETTE_STEPS);
    const bucketStart = new Int32Array(PALETTE_STEPS);
    const bucketFill = new Int32Array(PALETTE_STEPS);

    const draw = (t: number) => {
      if (!onScreen) {
        frame = 0;
        return;
      }
      const { active: key, mode: m } = stateRef.current;
      const loaded = setsRef.current.get(key) ?? setsRef.current.values().next().value;
      const target = loaded?.points;
      const rect = canvas.getBoundingClientRect();
      const targetRx = mouse.cx - rect.left;
      const targetRy = mouse.cy - rect.top;
      if (mouse.rx < -5000 || targetRx < -5000) {
        mouse.rx = targetRx;
        mouse.ry = targetRy;
      } else {
        mouse.rx += (targetRx - mouse.rx) * 0.3;
        mouse.ry += (targetRy - mouse.ry) * 0.3;
      }

      if (m !== lastMode) {
        if (m === 'explode') {
          explodeStart = t;
        } else {
          // Al volver, se arman desde una nube dispersa.
          for (let i = 0; i < n; i++) {
            px[i] = 0.5 + (ex[i] ?? 0) * 1.4;
            py[i] = 0.5 + (ey[i] ?? 0) * 1.4;
            pa[i] = 0;
          }
        }
        lastMode = m;
      }
      // Cambio de retrato: las partículas salen en remolino y se reordenan en el nuevo.
      if (key !== lastKey) {
        for (let i = 0; i < n; i++) {
          const dx = (px[i] ?? 0) - 0.5;
          const dy = (py[i] ?? 0) - 0.5;
          vx[i] = (vx[i] ?? 0) - dy * 0.06 + (Math.random() - 0.5) * 0.05;
          vy[i] = (vy[i] ?? 0) + dx * 0.06 + (Math.random() - 0.5) * 0.05 - 0.01;
        }
        lastKey = key;
      }

      mouse.sx += (mouse.x - mouse.sx) * 0.06;
      mouse.sy += (mouse.y - mouse.sy) * 0.06;

      const boxH = Math.min(height * 0.84, (width * 0.92) / PORTRAIT_ASPECT);
      const boxW = boxH * PORTRAIT_ASPECT;
      const ox = (width - boxW) / 2;
      const oy = height - boxH;
      const cell = boxW / COLS;
      const lensR = Math.max(40, boxW * LENS_RATIO);
      const dragR = Math.max(60, boxW * DRAG_RATIO);
      // Rotación 3D: la nube gira un poco hacia el ratón y flota sola en el espacio.
      const yaw = mouse.sx * 0.3 + Math.sin(t * 0.00035) * 0.08;
      const pitch = -mouse.sy * 0.18 + Math.sin(t * 0.00027) * 0.04;
      const cosY = Math.cos(yaw);
      const sinY = Math.sin(yaw);
      const cosP = Math.cos(pitch);
      const sinP = Math.sin(pitch);
      const pivotX = ox + boxW / 2;
      const pivotY = oy + boxH / 2;
      const focal = boxW * 2.2;

      if (t > glitchUntil + 2600 && Math.random() < 0.02) {
        glitchUntil = t + 140;
        glitchRow = Math.random();
      }
      const glitching = t < glitchUntil;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      const exploding = m === 'explode';
      const { vx: mvx, vy: mvy } = mouseVelocity(prevMouse, mouse.rx, mouse.ry);
      const ePhase = exploding ? Math.min(1, (t - explodeStart) / 700) : 0;
      const insideBox =
        mouse.rx > ox && mouse.rx < ox + boxW && mouse.ry > oy && mouse.ry < oy + boxH;
      lensAlpha += ((insideBox && !exploding ? 1 : 0) - lensAlpha) * 0.15;
      let visible = 0;

      // La foto original está fija debajo y se ve por donde pasa el cursor (sin deformarse).
      const box = { x: ox, y: oy, w: boxW, h: boxH };
      trail.update(box, mouse.rx, mouse.ry, lensR, insideBox && !exploding);
      if (loaded) trail.draw(ctx, loaded.image, box);

      // Pasada 1: física, proyección 3D, arrastre y desvanecido de cada partícula.
      bucketCount.fill(0);
      for (let i = 0; i < n; i++) {
        const s = speed[i] ?? 0.1;
        if (exploding) {
          px[i] = (px[i] ?? 0) + (ex[i] ?? 0) * 0.018;
          py[i] = (py[i] ?? 0) + (ey[i] ?? 0) * 0.018;
          vx[i] = 0;
          vy[i] = 0;
          pa[i] = Math.max(0, 1 - ePhase * 1.15);
        } else if (target) {
          // Muelle con amortiguación: llegan con un leve rebote.
          const spring = s * 0.3;
          vx[i] = ((vx[i] ?? 0) + ((target[i * 3] ?? 0) - (px[i] ?? 0)) * spring) * 0.88;
          vy[i] = ((vy[i] ?? 0) + ((target[i * 3 + 1] ?? 0) - (py[i] ?? 0)) * spring) * 0.88;
          px[i] = (px[i] ?? 0) + (vx[i] ?? 0);
          py[i] = (py[i] ?? 0) + (vy[i] ?? 0);
          pb[i] = (pb[i] ?? 0) + ((target[i * 3 + 2] ?? 0) - (pb[i] ?? 0)) * s * 0.6;
          pa[i] = Math.min(1, (pa[i] ?? 0) + 0.04);
        }
        drawBucket[i] = -1;
        const b = pb[i] ?? 0;
        const a = pa[i] ?? 0;
        if (a <= 0.01 || b < 0.03) continue;
        const sd = seed[i] ?? 0;
        const y0 = py[i] ?? 0;
        // Punto en 3D sobre una superficie curva (como una cabeza) con un toque de relieve por
        // brillo; así la imagen se mantiene nítida al girar.
        const x3 = ((px[i] ?? 0) - 0.5) * boxW;
        const y3 = (y0 - 0.5) * boxH;
        const rr = (x3 / boxW) ** 2 * 2.2 + ((y3 / boxH) * 0.9) ** 2;
        const z3 =
          (0.55 - rr) * boxW * 0.32 +
          (b - 0.45) * boxW * 0.035 +
          Math.sin(t * 0.0009 + sd * 6.28) * boxW * 0.006;
        const xr = x3 * cosY + z3 * sinY;
        const zr = -x3 * sinY + z3 * cosY;
        const yr = y3 * cosP - zr * sinP;
        const zz = y3 * sinP + zr * cosP;
        const persp = focal / (focal - zz);
        let x = pivotX + xr * persp;
        let y = pivotY + yr * persp;
        if (glitching && Math.abs(y0 - glitchRow) < 0.025) x += 10;
        let size = cell * (0.35 + 0.65 * b) * persp;
        let alpha = a;
        // Arrastre: las partículas se deslizan un poco con el ratón y, al apartarse, se
        // desvanecen para dejar ver la foto de debajo; luego vuelven con inercia.
        const [gx, gy] = drag.step(i, x, y, mouse.rx, mouse.ry, mvx, mvy, dragR);
        let fade = dragFade(gx, gy, cell * 2);
        x += gx * 0.5;
        y += gy * 0.5;
        if (lensAlpha > 0.01) {
          const [jx, jy, kd] = dissolve(x, y, mouse.rx, mouse.ry, lensR, lensAlpha, sd, t);
          x += jx * 0.4;
          y += jy * 0.4;
          fade = Math.max(fade, kd);
        }
        size *= 1 - fade * 0.7;
        alpha *= 1 - fade * 0.9;
        if (alpha <= 0.02) continue;
        const bucket = Math.min(PALETTE_STEPS - 1, Math.floor(b * PALETTE_STEPS));
        drawX[i] = x;
        drawY[i] = y;
        drawS[i] = size;
        drawA[i] = alpha;
        drawBucket[i] = bucket;
        bucketCount[bucket] = (bucketCount[bucket] ?? 0) + 1;
        visible++;
      }

      // Pasada 2: dibuja agrupando por color (un solo cambio de color por grupo).
      let offset = 0;
      for (let k = 0; k < PALETTE_STEPS; k++) {
        bucketStart[k] = offset;
        offset += bucketCount[k] ?? 0;
        bucketFill[k] = bucketStart[k] ?? 0;
      }
      for (let i = 0; i < n; i++) {
        const k = drawBucket[i] ?? -1;
        if (k < 0) continue;
        order[bucketFill[k] ?? 0] = i;
        bucketFill[k] = (bucketFill[k] ?? 0) + 1;
      }
      let currentAlpha = 1;
      ctx.globalAlpha = 1;
      for (let k = 0; k < PALETTE_STEPS; k++) {
        const from = bucketStart[k] ?? 0;
        const to = from + (bucketCount[k] ?? 0);
        if (from === to) continue;
        ctx.fillStyle = palette[k] ?? '#7dff9b';
        for (let o = from; o < to; o++) {
          const i = order[o] ?? 0;
          const alpha = drawA[i] ?? 1;
          if (Math.abs(alpha - currentAlpha) > 0.04) {
            ctx.globalAlpha = alpha;
            currentAlpha = alpha;
          }
          dash(ctx, drawX[i] ?? 0, drawY[i] ?? 0, drawS[i] ?? 1);
        }
      }
      ctx.globalAlpha = 1;

      // Con la nube ya invisible, se detiene hasta el próximo cambio de modo.
      if (exploding && ePhase >= 1 && visible === 0) {
        frame = 0;
        return;
      }
      frame = requestAnimationFrame(draw);
    };

    function start() {
      if (!frame && !document.hidden && onScreen) frame = requestAnimationFrame(draw);
    }
    const io = new IntersectionObserver(([entry]) => {
      onScreen = Boolean(entry?.isIntersecting);
      if (onScreen) start();
    });
    io.observe(canvas);
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(frame);
        frame = 0;
      } else start();
    };
    document.addEventListener('visibilitychange', onVisibility);
    start();
    const poll = window.setInterval(start, 250); // reactiva el bucle tras una explosión

    return () => {
      cancelAnimationFrame(frame);
      window.clearInterval(poll);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [ready]);

  if (reducedMotion) {
    const src = sources.find((s) => s.key === active)?.src ?? sources[0]?.src;
    return (
      <div className={`flex items-end justify-center ${className}`}>
        <img
          src={src}
          alt={label}
          width={720}
          height={900}
          className="portrait-tint h-[90%] w-auto max-w-full object-contain"
        />
      </div>
    );
  }

  return (
    <div role="img" aria-label={label} className={className}>
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
