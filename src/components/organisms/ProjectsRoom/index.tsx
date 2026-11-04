import { useEffect, useRef, type CSSProperties, type MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { useSystem } from '@/hooks/useSystem';
import { padFigure } from '@/lib/format';
import { particleSet, type ParticleSet } from '@/lib/particleImage';
import {
  dash,
  dissolve,
  DragField,
  dragFade,
  greenPalette,
  loadImage,
  mouseVelocity,
  RevealTrail,
} from '@/lib/particles';
import { projectPath } from '@/lib/routes';
import type { Project } from '@/types/content';

interface ProjectsRoomProps {
  projects: Project[];
  hint: string;
}

// Mosaico que se repite en todas direcciones, en unidades de "ancho de tarjeta" (1 = una tarjeta).
const TILE = { w: 4.65, h: 2.55 };
const SLOTS = [
  { x: 0.2, y: 0.2 },
  { x: 1.75, y: 0.05 },
  { x: 3.3, y: 0.25 },
  { x: 1.0, y: 1.35 },
  { x: 2.55, y: 1.45 },
];
const BOX_RATIO = 0.75; // alto del recuadro de la portada respecto al ancho (4:3)
const TITLE_SPACE = 64; // px bajo el recuadro para el título
const DRAG_THRESHOLD = 6;
/** Radio de la foto revelada y del arrastre, en proporción al ancho de la portada. */
const LENS_RATIO = 0.14;
const DRAG_RATIO = 0.2;
const INTRO_MS = 1400;
const COVER_COLS = 140;

const PALETTE_STEPS = 12;
const palette = greenPalette(PALETTE_STEPS);

const mod = (n: number, m: number) => ((n % m) + m) % m;

interface LoadedSet extends ParticleSet {
  /** Dirección aleatoria de dispersión por partícula (solo para la entrada). */
  dirs: Float32Array;
  /** Imagen original, para la lupa. */
  image: HTMLImageElement;
}

/** Ancho de tarjeta según el ancho de la sala: más grande en pantallas grandes. */
const cardWidthFor = (roomWidth: number) =>
  Math.round(Math.min(560, Math.max(260, roomWidth * 0.3)));

/**
 * Sala de proyectos: un plano infinito que se arrastra (ratón, dedo o rueda). Las portadas
 * están hechas de partículas en un solo canvas; todas se ven formadas y la más cercana al
 * centro se ilumina y crece. Bajo el cursor se ve la portada original. Cada proyecto es un
 * enlace accesible por teclado; al enfocarlo, el plano se desplaza para centrarlo.
 */
export function ProjectsRoom({ projects, hint }: ProjectsRoomProps) {
  const { t, reducedMotion } = useSystem();
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const setsRef = useRef<Map<string, LoadedSet>>(new Map());
  const layout = useRef({ cardW: 360 });
  const state = useRef({ x: 0, y: 0, vx: 0, vy: 0, tx: NaN, ty: NaN, dragging: false, moved: 0 });

  const items = [-1, 0, 1].flatMap((sy) =>
    [-1, 0, 1].flatMap((sx) =>
      projects.slice(0, SLOTS.length).map((project, i) => ({ project, i, sx, sy })),
    ),
  );

  // Partículas de cada portada (una vez por proyecto, compartidas por todas sus copias).
  useEffect(() => {
    projects.forEach((p) => {
      Promise.all([particleSet(p.cover.src, COVER_COLS), loadImage(p.cover.src)]).then(
        ([set, image]) => {
          if (!set) return;
          const n = set.points.length / 3;
          const dirs = new Float32Array(n * 2);
          for (let i = 0; i < n; i++) {
            const a = Math.random() * Math.PI * 2;
            const r = 0.3 + Math.random() * 0.9;
            dirs[i * 2] = Math.cos(a) * r;
            dirs[i * 2 + 1] = Math.sin(a) * r;
          }
          setsRef.current.set(p.slug, { ...set, dirs, image });
        },
      );
    });
  }, [projects]);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!root || !canvas || !ctx) return;
    const s = state.current;

    let width = 0;
    let height = 0;
    let dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = root.clientWidth;
      height = root.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      layout.current.cardW = cardWidthFor(width);
      root.style.setProperty('--card-w', `${layout.current.cardW}px`);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(root);

    // Posición de una copia en el plano (px, esquina superior izquierda de la tarjeta).
    const place = (i: number, sx: number, sy: number) => {
      const cw = layout.current.cardW;
      const tw = TILE.w * cw;
      const th = TILE.h * cw;
      const slot = SLOTS[i] ?? { x: 0, y: 0 };
      return {
        x: sx * tw + slot.x * cw + mod(s.x, tw) - tw / 2,
        y: sy * th + slot.y * cw + mod(s.y, th) - th / 2,
      };
    };

    // Arranca con el primer proyecto en el centro (entrando desde la derecha).
    {
      const cw = layout.current.cardW;
      const first = SLOTS[0] ?? { x: 0, y: 0 };
      const cardH = cw * BOX_RATIO + TITLE_SPACE;
      s.x = width / 2 - first.x * cw - cw / 2 + (TILE.w * cw) / 2;
      s.y = height / 2 - first.y * cw - cardH / 2 + (TILE.h * cw) / 2;
      s.tx = s.x;
      s.ty = s.y;
      if (!reducedMotion) s.x += cw * 0.6;
    }

    const mouse = { x: -9999, y: -9999, sx: -9999, sy: -9999 };
    const onHover = (e: PointerEvent) => {
      const r = root.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onOut = () => {
      mouse.x = mouse.y = -9999;
    };

    const start = performance.now();
    let frame = 0;
    let lensAlpha = 0;
    // Un campo de arrastre por copia de portada (se crea al dibujarla por primera vez).
    const drags = new Map<number, DragField>();
    const trails = new Map<number, RevealTrail>();
    const prevMouse = { x: -9999, y: -9999 };
    let lensKey = -1;

    const loop = (now: number) => {
      if (!Number.isNaN(s.tx)) {
        s.x += (s.tx - s.x) * (reducedMotion ? 1 : 0.08);
        s.y += (s.ty - s.y) * (reducedMotion ? 1 : 0.08);
        if (Math.abs(s.tx - s.x) < 0.5 && Math.abs(s.ty - s.y) < 0.5) s.tx = s.ty = NaN;
      } else if (!s.dragging) {
        s.x += s.vx;
        s.y += s.vy;
        s.vx *= 0.92;
        s.vy *= 0.92;
      }
      if (mouse.x < -5000) mouse.sx = mouse.sy = -9999;
      else if (mouse.sx < -5000) {
        mouse.sx = mouse.x;
        mouse.sy = mouse.y;
      } else {
        mouse.sx += (mouse.x - mouse.sx) * 0.3;
        mouse.sy += (mouse.y - mouse.sy) * 0.3;
      }

      const intro = reducedMotion ? 0 : Math.max(0, 1 - (now - start) / INTRO_MS);
      const { vx: mvx, vy: mvy } = mouseVelocity(prevMouse, mouse.sx, mouse.sy);
      const cw = layout.current.cardW;
      const boxH = cw * BOX_RATIO;
      const cx = width / 2;
      const cy = height / 2;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      let hovered = -1;

      items.forEach(({ project, i, sx, sy }, k) => {
        const el = itemRefs.current[k];
        if (!el) return;
        const cardH = el.offsetHeight || boxH + TITLE_SPACE;
        const { x, y } = place(i, sx, sy);
        const d = Math.hypot(x + cw / 2 - cx, y + cardH / 2 - cy);
        const focus = Math.max(0, 1 - d / (cw * 1.6));
        const scale = 0.86 + focus * 0.14;
        el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
        el.style.opacity = String(0.55 + focus * 0.45);
        el.style.zIndex = String(Math.round(focus * 10));

        const set = setsRef.current.get(project.slug);
        if (!set) return;
        // Portada encajada en el recuadro, con la misma escala (desde el centro) que la tarjeta.
        const fitW = set.aspect > cw / boxH ? cw : boxH * set.aspect;
        const fitH = fitW / set.aspect;
        const dw = fitW * scale;
        const dh = fitH * scale;
        const bcx = x + cw / 2;
        const bcy = y + cardH / 2 + (boxH / 2 - cardH / 2) * scale;
        if (bcx + dw < 0 || bcx - dw > width || bcy + dh < 0 || bcy - dh > height) return;

        const rx = bcx - dw / 2;
        const ry = bcy - dh / 2;
        if (
          intro < 0.2 &&
          mouse.sx > rx &&
          mouse.sx < rx + dw &&
          mouse.sy > ry &&
          mouse.sy < ry + dh
        ) {
          hovered = k;
        }
        const strength = lensKey === k ? lensAlpha : 0;
        // La portada original está fija debajo y se ve por donde pasa el cursor.
        let trail = trails.get(k);
        if (!trail) {
          trail = new RevealTrail();
          trails.set(k, trail);
        }
        const coverRect = { x: rx, y: ry, w: dw, h: dh };
        trail.update(coverRect, mouse.sx, mouse.sy, Math.max(36, dw * LENS_RATIO), hovered === k);
        trail.draw(ctx, set.image, coverRect);

        const cell = dw / set.cols;
        const pts = set.points;
        const n = pts.length / 3;
        let drag = drags.get(k);
        if (!drag) {
          drag = new DragField(n);
          drags.set(k, drag);
        }
        const spread = intro * intro;
        ctx.globalAlpha = (0.5 + focus * 0.5) * (1 - intro * 0.7);
        // Los puntos vienen ordenados por brillo: el color cambia solo al pasar de tono.
        let bucket = -1;
        for (let p = 0; p < n; p++) {
          const br = pts[p * 3 + 2] ?? 0;
          const b = Math.min(PALETTE_STEPS - 1, Math.floor(br * PALETTE_STEPS));
          if (b !== bucket) {
            bucket = b;
            ctx.fillStyle = palette[b] ?? '#7dff9b';
          }
          const wobble = reducedMotion ? 0 : Math.sin(now * 0.0015 + p) * 0.5;
          let px = rx + (pts[p * 3] ?? 0) * dw + (set.dirs[p * 2] ?? 0) * spread * dw;
          let py =
            ry + (pts[p * 3 + 1] ?? 0) * dh + (set.dirs[p * 2 + 1] ?? 0) * spread * dh + wobble;
          let fade = 0;
          if (!reducedMotion) {
            const [gx, gy] = drag.step(
              p,
              px,
              py,
              mouse.sx,
              mouse.sy,
              mvx,
              mvy,
              Math.max(52, dw * DRAG_RATIO),
            );
            fade = dragFade(gx, gy, cell);
            px += gx * 0.5;
            py += gy * 0.5;
          }
          let size = cell * (0.35 + 0.6 * br);
          if (strength > 0.01) {
            const seedP = (((p * 0.6180339) % 1) + 1) % 1;
            const [jx, jy, kd] = dissolve(
              px,
              py,
              mouse.sx,
              mouse.sy,
              Math.max(36, dw * LENS_RATIO),
              strength,
              seedP,
              now,
            );
            px += jx * 0.4;
            py += jy * 0.4;
            fade = Math.max(fade, kd);
          }
          if (fade > 0.85) continue;
          size *= 1 - fade * 0.85;
          dash(ctx, px, py, size);
        }
      });
      ctx.globalAlpha = 1;

      if (hovered !== lensKey && (lensAlpha < 0.05 || hovered >= 0)) lensKey = hovered;
      lensAlpha += ((hovered >= 0 && hovered === lensKey ? 1 : 0) - lensAlpha) * 0.15;
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    let lastX = 0;
    let lastY = 0;
    const onDown = (e: PointerEvent) => {
      s.dragging = true;
      s.moved = 0;
      s.tx = s.ty = NaN;
      s.vx = s.vy = 0;
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const onMove = (e: PointerEvent) => {
      onHover(e);
      if (!s.dragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      s.moved += Math.abs(dx) + Math.abs(dy);
      if (s.moved > DRAG_THRESHOLD && !root.hasPointerCapture(e.pointerId)) {
        root.setPointerCapture(e.pointerId);
      }
      s.x += dx;
      s.y += dy;
      s.vx = reducedMotion ? 0 : dx;
      s.vy = reducedMotion ? 0 : dy;
    };
    const onUp = () => {
      s.dragging = false;
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      s.tx = s.ty = NaN;
      s.x -= e.deltaX * 0.8;
      s.y -= e.deltaY * 0.8;
    };
    root.addEventListener('pointerdown', onDown);
    root.addEventListener('pointermove', onMove);
    root.addEventListener('pointerup', onUp);
    root.addEventListener('pointercancel', onUp);
    root.addEventListener('pointerleave', onOut);
    root.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      root.removeEventListener('pointerdown', onDown);
      root.removeEventListener('pointermove', onMove);
      root.removeEventListener('pointerup', onUp);
      root.removeEventListener('pointercancel', onUp);
      root.removeEventListener('pointerleave', onOut);
      root.removeEventListener('wheel', onWheel);
    };
    // `items` depende solo de `projects`, que no cambia mientras la sala está montada.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion, projects]);

  /** Al enfocar con teclado, centra ese proyecto. */
  const centerOn = (k: number) => {
    const root = rootRef.current;
    const item = items[k];
    const el = itemRefs.current[k];
    if (!root || !item || !el) return;
    const s = state.current;
    const cw = layout.current.cardW;
    const tw = TILE.w * cw;
    const th = TILE.h * cw;
    const slot = SLOTS[item.i] ?? { x: 0, y: 0 };
    const x = item.sx * tw + slot.x * cw + mod(s.x, tw) - tw / 2;
    const y = item.sy * th + slot.y * cw + mod(s.y, th) - th / 2;
    s.tx = s.x + (root.clientWidth / 2 - (x + cw / 2));
    s.ty = s.y + (root.clientHeight / 2 - (y + el.offsetHeight / 2));
  };

  const preventIfDragged = (e: MouseEvent) => {
    if (state.current.moved > DRAG_THRESHOLD) e.preventDefault();
  };

  return (
    <div
      ref={rootRef}
      style={{ '--card-w': '360px' } as CSSProperties}
      className="relative h-[calc(100dvh-6rem)] min-h-[34rem] cursor-grab touch-none select-none overflow-hidden border-y border-line active:cursor-grabbing"
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
      />
      {items.map(({ project, i, sx, sy }, k) => {
        const isPrimary = sx === 0 && sy === 0;
        return (
          <Link
            key={`${sx}:${sy}:${project.slug}`}
            ref={(el) => {
              itemRefs.current[k] = el;
            }}
            to={projectPath(project.slug)}
            draggable={false}
            onClick={preventIfDragged}
            onFocus={() => centerOn(k)}
            tabIndex={isPrimary ? 0 : -1}
            aria-hidden={isPrimary ? undefined : true}
            className="group absolute left-0 top-0 block w-[var(--card-w)] no-underline outline-none will-change-transform focus-visible:outline-none"
          >
            <div className="aspect-[4/3]" />
            <div className="mt-4 flex items-baseline justify-between gap-3">
              <span className="font-display text-3xl leading-none text-hi group-hover:text-accent group-focus-visible:text-accent group-focus-visible:underline xl:text-4xl">
                {project.title}
              </span>
              <span className="text-xs text-accent-2">{padFigure(i + 1)}</span>
            </div>
            <span className="sr-only">
              {project.summary} — {t.ui.project.openProject}
            </span>
          </Link>
        );
      })}
      <p className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 border border-line bg-bg/80 px-3 py-1 text-2xs uppercase tracking-widest text-dim">
        {hint}
      </p>
    </div>
  );
}
