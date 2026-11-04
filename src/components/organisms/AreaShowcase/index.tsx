import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Reveal } from '@/components/atoms/Reveal';
import { Tag } from '@/components/atoms/Tag';
import { TypeText } from '@/components/atoms/TypeText';
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
  samplePortrait,
  type Rect,
} from '@/lib/particles';
import { projectPath } from '@/lib/routes';
import type { Area, Project } from '@/types/content';

interface AreaShowcaseProps {
  heading: string;
  areas: Area[];
  /** Proyectos del sitio, para los botones «Ver proyecto». */
  projects: Project[];
  viewProject: string;
}

/** Partículas y columnas de muestreo: más densidad = más detalle en las caras. */
const COUNT = 24000;
const COLS = 150;
const PALETTE_STEPS = 12;
const palette = greenPalette(PALETTE_STEPS);
/** Radio de la foto revelada y del arrastre, en proporción al ancho del retrato. */
const LENS_RATIO = 0.14;
const DRAG_RATIO = 0.2;
/** Distancia (px) que se abren las partículas a mitad del viaje entre retratos. */
const SPREAD = 140;

const smooth = (t: number) => t * t * (3 - 2 * t);
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

function toLocal(el: Element | null, origin: DOMRect): Rect | null {
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { x: r.left - origin.left, y: r.top - origin.top, w: r.width, h: r.height };
}

interface SceneRefs {
  section: React.RefObject<HTMLElement>;
  canvas: React.RefObject<HTMLCanvasElement>;
  overview: React.RefObject<HTMLDivElement>;
  overviewSlots: React.MutableRefObject<(HTMLDivElement | null)[]>;
  detailSlots: React.MutableRefObject<(HTMLDivElement | null)[]>;
}

/**
 * Escena de partículas de la sección de áreas. Un solo sistema de partículas recorre los
 * estados: primero los cuatro retratos juntos (vista general) y luego cada área en detalle.
 * Al hacer scroll, las partículas se deshacen, viajan con la página y forman el retrato
 * siguiente. Bajo el cursor se ve la imagen original.
 */
function useAreaScene(areas: Area[], refs: SceneRefs, enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    const { section, canvas: canvasRef, overview, overviewSlots, detailSlots } = refs;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const sectionEl = section.current;
    if (!canvas || !ctx || !sectionEl) return;

    let cancelled = false;
    let frame = 0;
    let onScreen = false;
    let images: HTMLImageElement[] = [];
    let sets: Float32Array[] = [];

    const dirX = new Float32Array(COUNT);
    const dirY = new Float32Array(COUNT);
    const delay = new Float32Array(COUNT);
    const dx = new Float32Array(COUNT);
    const dy = new Float32Array(COUNT);
    const db = new Float32Array(COUNT);
    const ds = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 0.3 + Math.random() * 0.9;
      dirX[i] = Math.cos(a) * r;
      dirY[i] = Math.sin(a) * r;
      delay[i] = Math.random();
    }
    let initialized = false;

    let dpr = 1;
    let width = 0;
    let height = 0;
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = r.width;
      height = r.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const mouse = { cx: -9999, cy: -9999 };
    const onMove = (e: PointerEvent) => {
      mouse.cx = e.clientX;
      mouse.cy = e.clientY;
    };
    window.addEventListener('pointermove', onMove);

    let lensAlpha = 0;
    const drag = new DragField(COUNT);
    // Búferes de dibujo reutilizados en cada cuadro (se dibuja agrupando por color).
    const drawX = new Float32Array(COUNT);
    const drawY = new Float32Array(COUNT);
    const drawS = new Float32Array(COUNT);
    const drawBucket = new Int8Array(COUNT);
    const order = new Uint32Array(COUNT);
    const bucketCount = new Int32Array(PALETTE_STEPS);
    const bucketFill = new Int32Array(PALETTE_STEPS);
    // Una estela por retrato y estado (vista general o detalle).
    const trails = new Map<string, RevealTrail>();
    const prevMouse = { x: -9999, y: -9999 };
    let lensImage: HTMLImageElement | null = null;
    let lensRect: Rect | null = null;

    const draw = (t: number) => {
      frame = 0;
      if (!onScreen || sets.length < areas.length) return;
      const origin = canvas.getBoundingClientRect();
      // Centro de la parte visible de la ventana.
      const viewTop = Math.max(origin.top, 0);
      const centerY = viewTop + (window.innerHeight - viewTop) / 2 - origin.top;

      const overviewRects = areas.map((_, i) => toLocal(overviewSlots.current[i] ?? null, origin));
      const detailRects = areas.map((_, i) => toLocal(detailSlots.current[i] ?? null, origin));
      const overviewBox = toLocal(overview.current, origin);
      if (!overviewBox || overviewRects.some((r) => !r) || detailRects.some((r) => !r)) {
        frame = requestAnimationFrame(draw);
        return;
      }
      // Estado 0 = vista general; estados 1..n = cada área.
      const anchors = [overviewBox, ...(detailRects as Rect[])].map((r) => r.y + r.h / 2 - centerY);
      const last = anchors.length - 1;
      let a = 0;
      let b = 0;
      let f = 0;
      if ((anchors[0] ?? 0) >= 0) {
        a = b = 0;
      } else if ((anchors[last] ?? 0) <= 0) {
        a = b = last;
      } else {
        for (let s = 0; s < last; s++) {
          const c0 = anchors[s] ?? 0;
          const c1 = anchors[s + 1] ?? 0;
          if (c0 <= 0 && c1 > 0) {
            a = s;
            b = s + 1;
            f = -c0 / (c1 - c0);
            break;
          }
        }
      }
      // Zonas de reposo: el retrato queda formado mientras su bloque está cerca del centro.
      const g = smooth(clamp01((f - 0.18) / 0.64));
      const shown = g < 0.5 ? a : b;

      const statePos = (s: number, j: number) => {
        const q = s === 0 ? j % areas.length : s - 1;
        const idx = s === 0 ? (Math.floor(j / areas.length) * areas.length) % COUNT : j;
        const rect = (s === 0 ? overviewRects[q] : detailRects[q]) as Rect;
        const set = sets[q] as Float32Array;
        const br = set[idx * 3 + 2] ?? 0;
        const cell = (rect.w / COLS) * (s === 0 ? 1.6 : 1);
        return {
          x: rect.x + (set[idx * 3] ?? 0) * rect.w,
          y: rect.y + (set[idx * 3 + 1] ?? 0) * rect.h,
          b: br,
          s: cell * (0.3 + 0.62 * br),
        };
      };

      for (let j = 0; j < COUNT; j++) {
        const pa = statePos(a, j);
        const pb = a === b ? pa : statePos(b, j);
        const fj = a === b ? 0 : smooth(clamp01((g - (delay[j] ?? 0) * 0.35) / 0.65));
        const lift = Math.sin(Math.PI * fj);
        const x = pa.x + (pb.x - pa.x) * fj + (dirX[j] ?? 0) * lift * SPREAD;
        const y =
          pa.y +
          (pb.y - pa.y) * fj +
          (dirY[j] ?? 0) * lift * SPREAD +
          Math.sin(t * 0.0012 + j) * 0.6;
        const br = pa.b + (pb.b - pa.b) * fj;
        const sz = pa.s + (pb.s - pa.s) * fj;
        if (!initialized) {
          dx[j] = x;
          dy[j] = y;
          db[j] = br;
          ds[j] = sz;
        } else {
          dx[j] = (dx[j] ?? 0) + (x - (dx[j] ?? 0)) * 0.3;
          dy[j] = (dy[j] ?? 0) + (y - (dy[j] ?? 0)) * 0.3;
          db[j] = (db[j] ?? 0) + (br - (db[j] ?? 0)) * 0.3;
          ds[j] = (ds[j] ?? 0) + (sz - (ds[j] ?? 0)) * 0.3;
        }
      }
      initialized = true;

      // Lupa: solo con el retrato quieto y el cursor encima.
      const mx = mouse.cx - origin.left;
      const my = mouse.cy - origin.top;
      const { vx: mvx, vy: mvy } = mouseVelocity(
        prevMouse,
        mouse.cx > -5000 ? mx : -9999,
        mouse.cy > -5000 ? my : -9999,
      );
      const atRest = a === b || g < 0.04 || g > 0.96;
      lensImage = null;
      lensRect = null;
      if (atRest) {
        const rects = shown === 0 ? (overviewRects as Rect[]) : [detailRects[shown - 1] as Rect];
        rects.forEach((r, i) => {
          if (mx > r.x && mx < r.x + r.w && my > r.y && my < r.y + r.h) {
            lensImage = images[shown === 0 ? i : shown - 1] ?? null;
            lensRect = r;
          }
        });
      }
      lensAlpha += ((lensImage ? 1 : 0) - lensAlpha) * 0.15;
      const baseW = (shown === 0 ? overviewRects[0] : detailRects[shown - 1])?.w ?? 300;
      const radius = Math.max(32, baseW * LENS_RATIO);
      const dragR = Math.max(48, baseW * DRAG_RATIO);
      const strength = lensImage ? lensAlpha : 0;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      // La foto original está fija debajo de cada retrato y se ve por donde pasa el cursor.
      const shownRects = shown === 0 ? (overviewRects as Rect[]) : [detailRects[shown - 1] as Rect];
      shownRects.forEach((r, i) => {
        const key = `${shown}:${i}`;
        let trail = trails.get(key);
        if (!trail) {
          trail = new RevealTrail();
          trails.set(key, trail);
        }
        trail.update(r, mx, my, radius, lensRect === r);
        const img = images[shown === 0 ? i : shown - 1];
        if (img) trail.draw(ctx, img, r);
      });
      // Pasada 1: arrastre y desvanecido de cada partícula.
      bucketCount.fill(0);
      for (let j = 0; j < COUNT; j++) {
        drawBucket[j] = -1;
        const br = db[j] ?? 0;
        if (br < 0.03) continue;
        let x = dx[j] ?? 0;
        let y = dy[j] ?? 0;
        if (x < -10 || y < -10 || x > width + 10 || y > height + 10) continue;
        // Arrastre: las partículas se deslizan un poco con el ratón y, al apartarse, se
        // desvanecen para dejar ver la foto de debajo; luego vuelven con inercia.
        const [gx, gy] = drag.step(j, x, y, mx, my, mvx, mvy, dragR);
        const sz = ds[j] ?? 1;
        let fade = dragFade(gx, gy, sz * 1.5);
        x += gx * 0.5;
        y += gy * 0.5;
        if (strength > 0.01) {
          const [jx, jy, kd] = dissolve(x, y, mx, my, radius, strength, delay[j] ?? 0, t);
          x += jx * 0.4;
          y += jy * 0.4;
          fade = Math.max(fade, kd);
        }
        if (fade > 0.85) continue;
        const k = Math.min(PALETTE_STEPS - 1, Math.floor(br * PALETTE_STEPS));
        drawX[j] = x;
        drawY[j] = y;
        drawS[j] = sz * (1 - fade * 0.85);
        drawBucket[j] = k;
        bucketCount[k] = (bucketCount[k] ?? 0) + 1;
      }
      // Pasada 2: dibuja agrupando por color (un solo cambio de color por grupo).
      let offset = 0;
      for (let k = 0; k < PALETTE_STEPS; k++) {
        bucketFill[k] = offset;
        offset += bucketCount[k] ?? 0;
      }
      for (let j = 0; j < COUNT; j++) {
        const k = drawBucket[j] ?? -1;
        if (k < 0) continue;
        order[bucketFill[k] ?? 0] = j;
        bucketFill[k] = (bucketFill[k] ?? 0) + 1;
      }
      let from = 0;
      for (let k = 0; k < PALETTE_STEPS; k++) {
        const to = from + (bucketCount[k] ?? 0);
        if (to > from) ctx.fillStyle = palette[k] ?? '#7dff9b';
        for (let o = from; o < to; o++) {
          const j = order[o] ?? 0;
          dash(ctx, drawX[j] ?? 0, drawY[j] ?? 0, drawS[j] ?? 1);
        }
        from = to;
      }
      frame = requestAnimationFrame(draw);
    };

    const start = () => {
      if (!frame && onScreen && !cancelled) frame = requestAnimationFrame(draw);
    };
    const io = new IntersectionObserver(([entry]) => {
      onScreen = Boolean(entry?.isIntersecting);
      if (onScreen) start();
    });
    io.observe(sectionEl);

    Promise.all(
      areas.map((area) =>
        loadImage(area.portrait.src).then((img) => ({
          img,
          pts: samplePortrait(img, { threshold: 0.18, vignette: true, cols: COLS }, COUNT),
        })),
      ),
    )
      .then((loaded) => {
        if (cancelled) return;
        images = loaded.map((l) => l.img);
        sets = loaded.map((l) => l.pts);
        start();
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', onMove);
    };
    // Las refs son estables; `areas` solo cambia con el idioma (mismas imágenes).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, areas]);
}

/**
 * Sección de áreas del perfil, como "los sombreros" del referente: primero los cuatro
 * retratos juntos y, al bajar, cada área en detalle con su retrato, título, texto y
 * herramientas.
 */
export function AreaShowcase({ heading, areas, projects, viewProject }: AreaShowcaseProps) {
  const { reducedMotion } = useSystem();
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overviewRef = useRef<HTMLDivElement>(null);
  const overviewSlots = useRef<(HTMLDivElement | null)[]>([]);
  const detailSlots = useRef<(HTMLDivElement | null)[]>([]);

  useAreaScene(
    areas,
    { section: sectionRef, canvas: canvasRef, overview: overviewRef, overviewSlots, detailSlots },
    !reducedMotion,
  );

  const goTo = (id: string) => {
    document.getElementById(`area-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const portrait = (area: Area) =>
    reducedMotion ? (
      <img
        src={area.portrait.src}
        alt={area.portrait.alt}
        width={720}
        height={900}
        loading="lazy"
        className="portrait-tint h-full w-full object-cover"
      />
    ) : (
      <span role="img" aria-label={area.portrait.alt} className="block h-full w-full" />
    );

  return (
    <section ref={sectionRef} aria-labelledby="areas-heading" className="relative flex flex-col">
      {!reducedMotion && (
        <div
          aria-hidden="true"
          className="pointer-events-none sticky top-0 z-0 -mb-[100dvh] h-[100dvh]"
        >
          <canvas ref={canvasRef} className="h-full w-full" />
        </div>
      )}

      <div className="relative z-10 border-t border-accent-2/60 pt-10">
        <TypeText
          as="h3"
          id="areas-heading"
          text={heading}
          speed={60}
          className="font-display text-6xl leading-none text-hi sm:text-7xl xl:text-8xl"
        />
      </div>

      {/* Vista general: todos los retratos juntos, repartidos en todo el ancho. */}
      <div
        ref={overviewRef}
        className={`relative z-10 grid grid-cols-2 gap-x-8 gap-y-12 py-16 xl:py-24 ${areas.length === 3 ? 'md:grid-cols-3 md:gap-x-12 xl:gap-x-24' : 'md:grid-cols-4 xl:gap-x-14'}`}
      >
        {areas.map((area, i) => (
          <a
            key={area.id}
            href={`#area-${area.id}`}
            onClick={(e) => {
              e.preventDefault();
              goTo(area.id);
            }}
            className={`group flex flex-col items-center gap-4 no-underline ${areas.length % 2 === 1 && i === areas.length - 1 ? 'max-md:col-span-2 max-md:mx-auto max-md:w-1/2' : ''}`}
          >
            <div
              ref={(el) => {
                overviewSlots.current[i] = el;
              }}
              className="aspect-[4/5] w-full"
            >
              {portrait(area)}
            </div>
            <span className="text-center font-display text-xl leading-none text-hi group-hover:text-accent sm:text-2xl xl:text-3xl">
              {area.title}
            </span>
          </a>
        ))}
      </div>

      {/* Detalle de cada área; los lados se alternan. */}
      {areas.map((area, i) => {
        const reverse = i % 2 === 1;
        return (
          <article
            key={area.id}
            id={`area-${area.id}`}
            className="relative z-10 grid min-h-[100dvh] items-center gap-10 py-20 md:grid-cols-2 md:gap-16 xl:gap-28"
          >
            <div
              ref={(el) => {
                detailSlots.current[i] = el;
              }}
              className={`mx-auto aspect-[4/5] w-full max-w-[min(100%,74vh)] ${reverse ? 'md:order-2' : ''}`}
            >
              {portrait(area)}
            </div>
            <div
              className={`flex flex-col gap-5 ${reverse ? 'md:order-1 md:items-end md:text-right' : ''}`}
            >
              <span className="text-xs text-accent-2">{String(i + 1).padStart(2, '0')}</span>
              <TypeText
                as="h4"
                text={area.title}
                speed={45}
                className="font-display text-5xl leading-[0.9] text-hi sm:text-6xl xl:text-8xl 2xl:text-9xl"
              />
              <Reveal
                as="p"
                delay={300}
                className="max-w-xl text-base leading-8 text-dim lg:text-lg lg:leading-9 xl:text-xl xl:leading-10"
              >
                {area.description}
              </Reveal>
              <ul className={`flex flex-wrap gap-2 ${reverse ? 'md:justify-end' : ''}`}>
                {area.tools.map((tool, t) => (
                  <li key={tool}>
                    <Tag typed delay={600 + t * 140}>
                      {tool}
                    </Tag>
                  </li>
                ))}
              </ul>
              {/* Acceso directo a los proyectos de esta área. */}
              {area.projects?.length ? (
                <ul className={`flex flex-wrap gap-3 pt-2 ${reverse ? 'md:justify-end' : ''}`}>
                  {area.projects.map((slug) => {
                    const project = projects.find((p) => p.slug === slug);
                    if (!project) return null;
                    return (
                      <li key={slug}>
                        <Link
                          to={projectPath(slug)}
                          className="group inline-flex items-center gap-3 border border-accent-2 bg-panel px-4 py-3 text-sm text-hi no-underline transition-colors hover:border-accent hover:bg-accent hover:text-bg focus-visible:border-accent focus-visible:bg-accent focus-visible:text-bg focus-visible:outline-none lg:text-base"
                        >
                          <span className="text-accent group-hover:text-bg group-focus-visible:text-bg">
                            ▸
                          </span>
                          <span>
                            {viewProject}:{' '}
                            <span className="font-display text-lg">{project.title}</span>
                          </span>
                          <span aria-hidden="true">→</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              ) : null}
            </div>
          </article>
        );
      })}
    </section>
  );
}
