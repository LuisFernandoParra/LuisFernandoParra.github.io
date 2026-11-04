import { useEffect, useRef } from 'react';
import { useSystem } from '@/hooks/useSystem';
import { dash } from '@/lib/particles';
import type { AiIllustrationLabels } from '@/types/content';

export type IllustrationStage = 'plan' | 'produce' | 'waiting' | 'decided';

interface AiProcessIllustrationProps {
  stage: IllustrationStage;
  labels: AiIllustrationLabels;
  description: string;
  className?: string;
  /** Arranca la escena (al entrar en pantalla). */
  playing?: boolean;
  /** Caracteres del comando ya tecleados en la terminal. */
  typed?: number;
}

// Lienzo lógico: todo se dibuja en 800 × 520 y se escala al ancho del panel.
const W = 800;
const H = 520;
// Mismos tokens que tailwind.config.ts.
const C = {
  bg: '#07140d',
  panel: '#0d2217',
  line: '#1f4d34',
  accent: '#7dff9b',
  accent2: '#4fd17a',
  dim: '#8fcfa5',
  hi: '#d8ffe3',
};
const FONT = '11px "DotGothic16", monospace';

type V3 = readonly [number, number, number];
type P2 = readonly [number, number];
type Edge = readonly [number, number];
const ORIGIN: V3 = [0, 0, 0];
const SCREEN0: P2 = [0, 0];

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const ease = (v: number) => {
  const c = clamp01(v);
  return c * c * (3 - 2 * c);
};
/** Avance 0–1 entre dos instantes (segundos). */
const seg = (t: number, a: number, b: number) => ease((t - a) / (b - a));
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const lerp3 = (a: V3, b: V3, k: number): V3 => [
  lerp(a[0], b[0], k),
  lerp(a[1], b[1], k),
  lerp(a[2], b[2], k),
];

// ——— cámara en perspectiva ———

interface Cam {
  cos: number;
  sin: number;
  cp: number;
  sp: number;
}
const SCALE = 40;
const CENTER: P2 = [400, 250];
const DIST = 30; // distancia de la cámara: cuanto menor, más perspectiva

function makeCam(yaw: number, pitch: number): Cam {
  return { cos: Math.cos(yaw), sin: Math.sin(yaw), cp: Math.cos(pitch), sp: Math.sin(pitch) };
}

/** Proyecta un punto del mundo (z hacia arriba) a la pantalla. */
function proj(cam: Cam, [x, y, z]: V3): P2 {
  const x1 = x * cam.cos - y * cam.sin;
  const y1 = x * cam.sin + y * cam.cos;
  const up = z * cam.cp - y1 * cam.sp;
  const depth = y1 * cam.cp + z * cam.sp;
  const k = DIST / (DIST - depth);
  return [CENTER[0] + x1 * SCALE * k, CENTER[1] - up * SCALE * k];
}

function line3(ctx: CanvasRenderingContext2D, cam: Cam, a: V3, b: V3) {
  const p = proj(cam, a);
  const q = proj(cam, b);
  ctx.moveTo(p[0], p[1]);
  ctx.lineTo(q[0], q[1]);
}

function poly3(ctx: CanvasRenderingContext2D, cam: Cam, pts: V3[]) {
  pts.forEach((pt, i) => {
    const p = proj(cam, pt);
    if (i === 0) ctx.moveTo(p[0], p[1]);
    else ctx.lineTo(p[0], p[1]);
  });
  ctx.closePath();
}

// ——— mallas de alambre ———

interface Mesh {
  v: V3[];
  e: Edge[];
}

/** Caja con la base en z = 0. */
function box(w: number, d: number, h: number): Mesh {
  const x = w / 2;
  const y = d / 2;
  const v: V3[] = [
    [-x, -y, 0],
    [x, -y, 0],
    [x, y, 0],
    [-x, y, 0],
    [-x, -y, h],
    [x, -y, h],
    [x, y, h],
    [-x, y, h],
  ];
  const e: Edge[] = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0],
    [4, 5],
    [5, 6],
    [6, 7],
    [7, 4],
    [0, 4],
    [1, 5],
    [2, 6],
    [3, 7],
  ];
  return { v, e };
}

/** Une los vértices que están a la distancia de arista (poliedros regulares). */
function byDistance(v: V3[], len: number): Mesh {
  const e: Edge[] = [];
  for (let i = 0; i < v.length; i++)
    for (let j = i + 1; j < v.length; j++) {
      const a = v[i] ?? ORIGIN;
      const b = v[j] ?? ORIGIN;
      if (Math.abs(Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) - len) < 0.01) e.push([i, j]);
    }
  return { v, e };
}

function icosahedron(r: number): Mesh {
  const g = (1 + Math.sqrt(5)) / 2;
  const s = r / Math.hypot(1, g);
  const raw: V3[] = [
    [-1, g, 0],
    [1, g, 0],
    [-1, -g, 0],
    [1, -g, 0],
    [0, -1, g],
    [0, 1, g],
    [0, -1, -g],
    [0, 1, -g],
    [g, 0, -1],
    [g, 0, 1],
    [-g, 0, -1],
    [-g, 0, 1],
  ];
  return byDistance(
    raw.map(([x, y, z]) => [x * s, y * s, z * s] as const),
    2 * s,
  );
}

function octahedron(r: number, stretch = 1): Mesh {
  const v: V3[] = [
    [r, 0, 0],
    [-r, 0, 0],
    [0, r, 0],
    [0, -r, 0],
    [0, 0, r * stretch],
    [0, 0, -r * stretch],
  ];
  const e: Edge[] = [
    [0, 2],
    [2, 1],
    [1, 3],
    [3, 0],
    [4, 0],
    [4, 1],
    [4, 2],
    [4, 3],
    [5, 0],
    [5, 1],
    [5, 2],
    [5, 3],
  ];
  return { v, e };
}

function cylinder(r: number, h: number, n = 14): Mesh {
  const v: V3[] = [];
  const e: Edge[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    v.push([Math.cos(a) * r, Math.sin(a) * r, -h / 2], [Math.cos(a) * r, Math.sin(a) * r, h / 2]);
  }
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    e.push([i * 2, j * 2], [i * 2 + 1, j * 2 + 1]);
    if (i % 2 === 0) e.push([i * 2, i * 2 + 1]);
  }
  return { v, e };
}

interface Pose {
  at: V3;
  spin?: number;
  tilt?: number;
  scale?: number;
}

function place(p: V3, { at, spin = 0, tilt = 0, scale = 1 }: Pose): V3 {
  let [x, y, z] = [p[0] * scale, p[1] * scale, p[2] * scale];
  if (tilt) {
    const c = Math.cos(tilt);
    const s = Math.sin(tilt);
    [y, z] = [y * c - z * s, y * s + z * c];
  }
  if (spin) {
    const c = Math.cos(spin);
    const s = Math.sin(spin);
    [x, y] = [x * c - y * s, x * s + y * c];
  }
  return [x + at[0], y + at[1], z + at[2]];
}

/**
 * Dibuja una malla en 3D. `progress` traza las aristas una a una (como si se construyera);
 * `fill` sombrea las caras visibles con un velo muy suave.
 */
function drawMesh(
  ctx: CanvasRenderingContext2D,
  cam: Cam,
  mesh: Mesh,
  pose: Pose,
  color: string,
  alpha: number,
  progress = 1,
) {
  if (alpha <= 0.01 || progress <= 0) return;
  const pts = mesh.v.map((p) => proj(cam, place(p, pose)));
  const total = mesh.e.length * clamp01(progress);
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = color;
  ctx.beginPath();
  mesh.e.forEach(([i, j], n) => {
    if (n >= total) return;
    const a = pts[i] ?? SCREEN0;
    const b = pts[j] ?? SCREEN0;
    const r = Math.min(1, total - n);
    ctx.moveTo(a[0], a[1]);
    ctx.lineTo(lerp(a[0], b[0], r), lerp(a[1], b[1], r));
  });
  ctx.stroke();
  // Nodos brillantes en los vértices.
  ctx.fillStyle = color;
  if (progress >= 1)
    for (const p of pts) {
      ctx.fillRect(p[0] - 1.2, p[1] - 1.2, 2.4, 2.4);
    }
  ctx.globalAlpha = 1;
}

/** Punto al azar (pero fijo por semilla) sobre las aristas de una malla. */
function onMesh(mesh: Mesh, u: number, w: number): V3 {
  const edge = mesh.e[Math.floor(u * mesh.e.length) % mesh.e.length] ?? [0, 0];
  const a = mesh.v[edge[0]] ?? [0, 0, 0];
  const b = mesh.v[edge[1]] ?? [0, 0, 0];
  return lerp3(a, b, w);
}

// ——— partículas y textos ———

function makeSeeds(n: number) {
  return Array.from({ length: n }, (_, i) => ({
    a: ((i * 0.61803398875) % 1) * Math.PI * 2,
    b: ((i * 0.41421356) % 1) * 2 - 1,
    c: (i * 0.7548776662) % 1,
    d: (i * 0.5698402909) % 1,
  }));
}
/** Semillas fijas para que las partículas no salten entre cuadros. */
const SEEDS = makeSeeds(320);
const NO_SEED = { a: 0, b: 0, c: 0, d: 0 };

function particle(ctx: CanvasRenderingContext2D, cam: Cam, p: V3, size: number) {
  const [x, y] = proj(cam, p);
  dash(ctx, x, y, size);
}

/** Etiqueta con línea guía hacia un punto de la escena. */
function callout(
  ctx: CanvasRenderingContext2D,
  [ax, ay]: P2,
  text: string,
  alpha: number,
  side: 1 | -1 = -1,
) {
  if (alpha <= 0.01) return;
  const label = text.toUpperCase();
  ctx.font = FONT;
  const w = ctx.measureText(label).width + 16;
  const ex = ax + side * 34;
  const ey = ay - 30;
  const bx = side < 0 ? ex - w : ex;
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = C.accent;
  ctx.beginPath();
  ctx.arc(ax, ay, 2.5, 0, Math.PI * 2);
  ctx.moveTo(ax, ay);
  ctx.lineTo(ex, ey);
  ctx.stroke();
  ctx.fillStyle = C.bg;
  ctx.fillRect(bx, ey - 10, w, 20);
  ctx.strokeRect(bx + 0.5, ey - 9.5, w - 1, 19);
  // Esquinas marcadas, como una ventana del escritorio.
  ctx.fillStyle = C.accent;
  for (const [cx, cy] of [
    [bx, ey - 10],
    [bx + w - 3, ey - 10],
    [bx, ey + 7],
    [bx + w - 3, ey + 7],
  ] as const)
    ctx.fillRect(cx, cy, 3, 3);
  ctx.fillStyle = C.hi;
  ctx.textAlign = 'left';
  ctx.fillText(label, bx + 8, ey + 4);
  ctx.globalAlpha = 1;
}

function caption(ctx: CanvasRenderingContext2D, [x, y]: P2, text: string, alpha: number) {
  if (alpha <= 0.01) return;
  ctx.globalAlpha = alpha;
  ctx.font = FONT;
  ctx.fillStyle = C.dim;
  ctx.textAlign = 'center';
  ctx.fillText(text, x, y);
  ctx.globalAlpha = 1;
}

// ——— escenario común ———

const HALF = 5;
/** Las cuatro paradas del plan, repartidas para que no se tapen en pantalla. */
const STOPS: V3[] = [
  [-2.9, 2.6, 0],
  [-2.1, -0.4, 0],
  [1.2, 0.6, 0],
  [2.4, -2.6, 0],
];
const NO_STOP: V3 = [0, 0, 0];
/** Bloques de la estructura del plan en cada parada: [dx, dy, ancho, fondo, alto]. */
const BLOCKS: (readonly [number, number, number, number, number])[][] = [
  [
    [0, 0, 0.9, 0.9, 1.1],
    [0.55, 0.45, 0.45, 0.45, 0.6],
  ],
  [
    [0, 0, 0.8, 1.2, 1.7],
    [-0.6, 0.3, 0.4, 0.5, 0.8],
  ],
  [
    [0, 0, 1.1, 0.8, 1.35],
    [0.3, -0.6, 0.5, 0.4, 2.1],
  ],
  [
    [0, 0, 0.9, 0.9, 2.5],
    [-0.6, -0.4, 0.4, 0.4, 1.1],
  ],
];
const START: V3 = [-4.2, 4.1, 0];

function drawPlatform(ctx: CanvasRenderingContext2D, cam: Cam, appear: number) {
  if (appear <= 0) return;
  const top: V3[] = [
    [-HALF, -HALF, 0],
    [HALF, -HALF, 0],
    [HALF, HALF, 0],
    [-HALF, HALF, 0],
  ];
  const bottom = top.map(([x, y]) => [x, y, -0.5] as const);
  ctx.globalAlpha = appear;
  ctx.fillStyle = C.panel;
  ctx.beginPath();
  poly3(ctx, cam, bottom);
  ctx.fill();
  ctx.strokeStyle = C.line;
  ctx.lineWidth = 1;
  ctx.beginPath();
  top.forEach((pt, i) => line3(ctx, cam, pt, bottom[i] ?? pt));
  poly3(ctx, cam, bottom);
  ctx.stroke();
  ctx.fillStyle = 'rgba(13, 34, 23, 0.94)';
  ctx.beginPath();
  poly3(ctx, cam, top);
  ctx.fill();

  // Cuadrícula que se despliega desde el fondo.
  ctx.beginPath();
  for (let k = -HALF; k <= HALF; k++) {
    const r = clamp01(appear * 1.6 - (k + HALF) / (HALF * 4));
    if (r <= 0) continue;
    line3(ctx, cam, [k, -HALF, 0], [k, -HALF + HALF * 2 * r, 0]);
    line3(ctx, cam, [-HALF, k, 0], [-HALF + HALF * 2 * r, k, 0]);
  }
  ctx.strokeStyle = C.line;
  ctx.stroke();

  // Regla en los bordes y contorno brillante.
  ctx.beginPath();
  for (let k = -HALF + 0.5; k < HALF; k += 0.5) {
    const len = Number.isInteger(k) ? 0.32 : 0.16;
    line3(ctx, cam, [k, HALF, 0], [k, HALF, -len]);
    line3(ctx, cam, [HALF, k, 0], [HALF, k, -len]);
  }
  ctx.strokeStyle = C.accent2;
  ctx.globalAlpha = appear * 0.55;
  ctx.stroke();
  ctx.globalAlpha = appear;
  ctx.beginPath();
  poly3(ctx, cam, top);
  ctx.lineWidth = 1.2;
  ctx.stroke();
  ctx.lineWidth = 1;
  ctx.globalAlpha = 1;
}

/** Polvo de partículas que sube despacio sobre la plataforma. */
function drawDust(ctx: CanvasRenderingContext2D, cam: Cam, t: number, alpha: number) {
  ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = C.accent2;
  for (let i = 0; i < 80; i++) {
    const s = SEEDS[i + 200] ?? NO_SEED;
    const z = (s.c * 4.5 + t * (0.12 + s.d * 0.12)) % 4.5;
    ctx.globalAlpha = alpha * 0.4 * Math.sin((z / 4.5) * Math.PI) ** 2;
    particle(ctx, cam, [s.b * HALF * 0.95, (s.d * 2 - 1) * HALF * 0.95, z], 1.4);
  }
  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = 1;
}

/** Ruta en el suelo entre paradas; `progress` 0–1 sobre todo el recorrido. */
function routePoint(progress: number): V3 {
  const path = [START, ...STOPS];
  const f = clamp01(progress) * (path.length - 1);
  const i = Math.min(path.length - 2, Math.floor(f));
  return lerp3(path[i] ?? START, path[i + 1] ?? START, f - i);
}

function drawRoute(
  ctx: CanvasRenderingContext2D,
  cam: Cam,
  progress: number,
  t: number,
  alpha = 0.8,
) {
  if (progress <= 0) return;
  ctx.save();
  ctx.setLineDash([3, 5]);
  ctx.lineDashOffset = -t * 18;
  ctx.strokeStyle = C.hi;
  ctx.globalAlpha = alpha;
  ctx.beginPath();
  const steps = 60;
  for (let i = 0; i <= steps * progress; i++) {
    const p = proj(cam, routePoint(i / steps));
    if (i === 0) ctx.moveTo(p[0], p[1]);
    else ctx.lineTo(p[0], p[1]);
  }
  ctx.stroke();
  ctx.restore();
}

/** «Yo»: una sonda (octaedro alargado) con un anillo de partículas y su sombra en el suelo. */
function drawProbe(ctx: CanvasRenderingContext2D, cam: Cam, at: V3, t: number, alpha: number) {
  if (alpha <= 0.01) return;
  const hover = 1.35 + Math.sin(t * 2) * 0.08;
  const body: V3 = [at[0], at[1], hover];
  // Sombra y haz hacia el suelo.
  ctx.globalAlpha = alpha * 0.6;
  ctx.strokeStyle = C.accent2;
  ctx.beginPath();
  poly3(
    ctx,
    cam,
    Array.from({ length: 20 }, (_, i) => {
      const a = (i / 20) * Math.PI * 2;
      return [at[0] + Math.cos(a) * 0.35, at[1] + Math.sin(a) * 0.35, 0] as const;
    }),
  );
  ctx.stroke();
  ctx.setLineDash([2, 3]);
  ctx.beginPath();
  line3(ctx, cam, [at[0], at[1], 0], [at[0], at[1], hover - 0.45]);
  ctx.stroke();
  ctx.setLineDash([]);
  drawMesh(ctx, cam, octahedron(0.28, 1.6), { at: body, spin: t * 1.2 }, C.hi, alpha);
  ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = C.accent;
  for (let i = 0; i < 22; i++) {
    const a = (i / 22) * Math.PI * 2 - t * 1.6;
    ctx.globalAlpha = alpha * 0.85;
    particle(ctx, cam, [body[0] + Math.cos(a) * 0.55, body[1] + Math.sin(a) * 0.55, body[2]], 1.5);
  }
  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = 1;
}

/** Estructura del plan en una parada: bloques de alambre que crecen desde el suelo. */
function drawStructure(
  ctx: CanvasRenderingContext2D,
  cam: Cam,
  k: number,
  grow: number,
  color: string,
  alpha: number,
) {
  if (grow <= 0) return;
  const stop = STOPS[k] ?? NO_STOP;
  for (const [dx, dy, w, d, h] of BLOCKS[k] ?? []) {
    const mesh = box(w, d, Math.max(0.02, h * grow));
    // Velo en las caras para que se lea como volumen y no solo como líneas.
    const bx = stop[0] + dx;
    const by = stop[1] + dy;
    const hz = Math.max(0.02, h * grow);
    ctx.globalAlpha = alpha * 0.1;
    ctx.fillStyle = color;
    ctx.beginPath();
    poly3(ctx, cam, [
      [bx - w / 2, by + d / 2, 0],
      [bx + w / 2, by + d / 2, 0],
      [bx + w / 2, by + d / 2, hz],
      [bx - w / 2, by + d / 2, hz],
    ]);
    poly3(ctx, cam, [
      [bx + w / 2, by - d / 2, 0],
      [bx + w / 2, by + d / 2, 0],
      [bx + w / 2, by + d / 2, hz],
      [bx + w / 2, by - d / 2, hz],
    ]);
    poly3(ctx, cam, [
      [bx - w / 2, by - d / 2, hz],
      [bx + w / 2, by - d / 2, hz],
      [bx + w / 2, by + d / 2, hz],
      [bx - w / 2, by + d / 2, hz],
    ]);
    ctx.fill();
    ctx.globalAlpha = 1;
    drawMesh(ctx, cam, mesh, { at: [stop[0] + dx, stop[1] + dy, 0] }, color, alpha);
    // Pisos: líneas horizontales cada 0,3 de altura.
    ctx.globalAlpha = alpha * 0.35;
    ctx.strokeStyle = color;
    ctx.beginPath();
    for (let z = 0.3; z < h * grow; z += 0.3) {
      const x = stop[0] + dx;
      const y = stop[1] + dy;
      poly3(ctx, cam, [
        [x - w / 2, y - d / 2, z],
        [x + w / 2, y - d / 2, z],
        [x + w / 2, y + d / 2, z],
        [x - w / 2, y + d / 2, z],
      ]);
    }
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
}

function structureTop(k: number): V3 {
  const stop = STOPS[k] ?? NO_STOP;
  const tallest = Math.max(...(BLOCKS[k] ?? []).map((b) => b[4]));
  return [stop[0], stop[1], tallest];
}

// ——— paso 01: planeo yo ———

function scenePlan(
  ctx: CanvasRenderingContext2D,
  cam: Cam,
  t: number,
  labels: AiIllustrationLabels,
  callText: string,
) {
  drawPlatform(ctx, cam, seg(t, 0, 0.9));
  drawDust(ctx, cam, t, seg(t, 0.5, 1.5));

  // La sonda recorre la ruta; en cada parada levanta un bloque del plan.
  const travel = seg(t, 2.2, 7.4);
  const probeAt = routePoint(travel);
  drawRoute(ctx, cam, travel, t);
  STOPS.forEach((_, k) => {
    const arrive = 2.2 + ((k + 1) / STOPS.length) * 5.2;
    const grow = seg(t, arrive - 0.6, arrive + 0.5);
    drawStructure(ctx, cam, k, grow, C.accent, 0.95);
    // Láser de construcción mientras crece.
    if (grow > 0 && grow < 1) {
      const top = structureTop(k);
      const from = proj(cam, [probeAt[0], probeAt[1], 1.0]);
      const to = proj(cam, [top[0], top[1], top[2] * grow]);
      ctx.globalAlpha = 0.9;
      ctx.strokeStyle = C.hi;
      ctx.beginPath();
      ctx.moveTo(from[0], from[1]);
      ctx.lineTo(to[0], to[1]);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  });

  // Al final, las cimas se unen: el plan completo.
  const link = seg(t, 7.4, 8.4);
  if (link > 0) {
    ctx.save();
    ctx.setLineDash([2, 4]);
    ctx.strokeStyle = C.accent2;
    ctx.globalAlpha = link * 0.8;
    ctx.beginPath();
    for (let k = 1; k < STOPS.length; k++) line3(ctx, cam, structureTop(k - 1), structureTop(k));
    ctx.stroke();
    ctx.restore();
  }

  // La idea: una nube de partículas que se condensa en la sonda antes de salir.
  const idea: V3 = [START[0], START[1], 3.1];
  const condense = seg(t, 1.0, 2.3);
  ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = C.accent;
  for (let i = 0; i < 150; i++) {
    const s = SEEDS[i] ?? NO_SEED;
    const r = 0.5 + s.c * 1.1;
    const swirl = s.a + t * (0.5 + s.d * 0.6);
    const cloud: V3 = [
      idea[0] + Math.cos(swirl) * r,
      idea[1] + Math.sin(swirl) * r,
      idea[2] + s.b * 0.6,
    ];
    const p = lerp3(cloud, [START[0], START[1], 1.35], condense);
    ctx.globalAlpha = seg(t, 0.4, 1.0) * (1 - condense) * 0.9;
    particle(ctx, cam, p, 1.7);
  }
  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = 1;
  caption(
    ctx,
    proj(cam, [idea[0], idea[1], idea[2] + 1.0]),
    labels.idea,
    seg(t, 0.5, 1.0) * (1 - condense),
  );

  drawProbe(ctx, cam, travel > 0 ? probeAt : START, t, seg(t, 1.6, 2.3));
  const probeScreen = proj(cam, [probeAt[0], probeAt[1], 1.9]);
  caption(ctx, [probeScreen[0], probeScreen[1] - 6], labels.me, seg(t, 1.8, 2.4));
  callout(ctx, proj(cam, structureTop(0)), callText, seg(t, 7.8, 8.6));
}

// ——— paso 02: la IA en tareas concretas ———

const CORE: V3 = [-3.2, -3.2, 3.4];
const ZONES = [1, 2, 3] as const;
const RESULT_MESHES: Mesh[] = [box(0.8, 0.8, 0.8), cylinder(0.42, 0.9), octahedron(0.55)];
const CAGE = 0.9; // medio lado de las cajas de límite

function zoneCenter(z: number): V3 {
  const stop = STOPS[ZONES[z] ?? 1] ?? NO_STOP;
  return [stop[0], stop[1], 1.15];
}

function sceneProduce(
  ctx: CanvasRenderingContext2D,
  cam: Cam,
  t: number,
  labels: AiIllustrationLabels,
  callText: string,
) {
  drawPlatform(ctx, cam, seg(t, 0, 0.7));
  drawDust(ctx, cam, t, seg(t, 0.3, 1.2));
  drawRoute(ctx, cam, seg(t, 0.2, 0.8), t, 0.35);
  drawStructure(ctx, cam, 0, seg(t, 0.2, 0.8), C.accent2, 0.4);
  drawProbe(ctx, cam, START, t, 0.6);

  // Cajas de límite: solo ahí puede trabajar la IA.
  const cages = seg(t, 0.5, 1.3);
  ZONES.forEach((_, z) => {
    const c = zoneCenter(z);
    const cage = box(CAGE * 2, CAGE * 2, 2.2 * cages);
    ctx.save();
    ctx.setLineDash([4, 4]);
    drawMesh(ctx, cam, cage, { at: [c[0], c[1], 0.02] }, C.accent2, 0.7 * cages);
    ctx.restore();
  });

  // Núcleo de IA: icosaedro que gira con un octaedro dentro y un anillo de partículas.
  const coreIn = seg(t, 0.8, 1.6);
  drawMesh(
    ctx,
    cam,
    icosahedron(0.85),
    { at: CORE, spin: t * 0.5, tilt: 0.4 + t * 0.2 },
    C.accent2,
    coreIn * 0.9,
  );
  drawMesh(ctx, cam, octahedron(0.35), { at: CORE, spin: -t * 1.1, tilt: 0.3 }, C.hi, coreIn);
  ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = C.accent;
  for (let i = 0; i < 60; i++) {
    const a = (i / 60) * Math.PI * 2 + t * 0.8;
    ctx.globalAlpha = coreIn * 0.7;
    particle(
      ctx,
      cam,
      [
        CORE[0] + Math.cos(a) * 1.35,
        CORE[1] + Math.sin(a) * 1.35,
        CORE[2] + Math.sin(a * 3 + t) * 0.12,
      ],
      1.4,
    );
  }

  // Partículas que bajan solo a las cajas y construyen el resultado; las que se desvían
  // chocan con la pared de la caja y se apagan.
  const built = [0, 0, 0];
  const hits: V3[] = [];
  for (let i = 0; i < 270; i++) {
    const s = SEEDS[i] ?? NO_SEED;
    const z = i % 3;
    const c = zoneCenter(z);
    const spin = t * 0.6 + z;
    const stray = i % 8 === 0;
    const start = 1.7 + z * 0.4 + s.c * 2.4;
    const k = seg(t, start, start + 1.2);
    if (k <= 0) continue;
    let target: V3;
    if (stray) {
      const out: V3 = [c[0] + Math.cos(s.a) * 2.2, c[1] + Math.sin(s.a) * 2.2, c[2] + s.b];
      target = [
        Math.max(c[0] - CAGE, Math.min(c[0] + CAGE, out[0])),
        Math.max(c[1] - CAGE, Math.min(c[1] + CAGE, out[1])),
        out[2],
      ];
    } else target = place(onMesh(RESULT_MESHES[z] ?? box(1, 1, 1), s.d, s.c), { at: c, spin });
    const arc = Math.sin(k * Math.PI) * 0.8;
    const p = lerp3(CORE, target, k);
    const fade = stray ? 1 - seg(t, start + 1.2, start + 1.7) : 1;
    if (stray && k >= 1 && fade > 0.5) hits.push(target);
    ctx.globalAlpha = 0.9 * fade;
    particle(ctx, cam, [p[0], p[1], p[2] + arc], stray ? 2 : 1.6);
    if (!stray && k >= 1) built[z] = (built[z] ?? 0) + 1;
  }
  // Destello en la pared donde chocó una partícula desviada.
  ctx.strokeStyle = C.hi;
  for (const h of hits) {
    const p = proj(cam, h);
    ctx.globalAlpha = 0.6;
    ctx.strokeRect(p[0] - 4, p[1] - 4, 8, 8);
  }
  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = 1;

  // Los resultados: sólidos de alambre que se completan con las partículas que llegan.
  ZONES.forEach((_, z) => {
    const c = zoneCenter(z);
    const done = clamp01((built[z] ?? 0) / 75);
    drawMesh(
      ctx,
      cam,
      RESULT_MESHES[z] ?? box(1, 1, 1),
      { at: c, spin: t * 0.6 + z },
      C.accent,
      done,
      done,
    );
    const name = [labels.video, labels.design, labels.process][z] ?? '';
    caption(ctx, proj(cam, [c[0], c[1], 2.55]), name, seg(t, 1.0, 1.6));
  });

  const core = proj(cam, CORE);
  caption(ctx, [core[0], core[1] + 50], labels.aiProduces, coreIn);
  callout(ctx, [core[0] + 44, core[1] + 34], callText, seg(t, 1.6, 2.2), 1);
}

// ——— paso 03: límites y revisión ———

const GATE_Y = 0;
const LANES = [-2.2, 0, 2.2];

function sceneReview(
  ctx: CanvasRenderingContext2D,
  cam: Cam,
  t: number,
  td: number,
  decided: boolean,
  labels: AiIllustrationLabels,
  callText: string,
) {
  drawPlatform(ctx, cam, seg(t, 0, 0.7));
  drawDust(ctx, cam, t, seg(t, 0.3, 1.2));
  drawProbe(ctx, cam, START, t, seg(t, 0.4, 1.0) * 0.8);

  // Rieles: cada resultado avanza por el suyo.
  const rails = seg(t, 0.2, 0.9);
  ctx.strokeStyle = C.line;
  ctx.globalAlpha = rails;
  ctx.beginPath();
  for (const x of LANES) {
    line3(ctx, cam, [x - 0.3, 4.4, 0.02], [x - 0.3, -4.4 * rails + 4.4 * (1 - rails), 0.02]);
    line3(ctx, cam, [x + 0.3, 4.4, 0.02], [x + 0.3, -4.4 * rails + 4.4 * (1 - rails), 0.02]);
  }
  ctx.stroke();
  ctx.globalAlpha = 1;

  // El arco: dos columnas y un dintel, en 3D.
  const gate = seg(t, 0.4, 1.2);
  const gh = 2.6 * gate;
  for (const x of [-3.5, 3.5])
    drawMesh(ctx, cam, box(0.4, 0.4, gh), { at: [x, GATE_Y, 0] }, C.hi, gate);
  drawMesh(ctx, cam, box(7.4, 0.4, 0.35), { at: [0, GATE_Y, gh] }, C.hi, gate);

  // Escáner: una lámina de partículas que barre el arco mientras espero.
  if (!decided && gate > 0.9) {
    const z = 0.15 + (Math.sin(t * 2.2) * 0.5 + 0.5) * 2.3;
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = C.accent;
    for (let i = 0; i < 70; i++) {
      const x = -3.2 + (i % 35) * (6.4 / 34);
      const y = GATE_Y + (i < 35 ? -0.1 : 0.1);
      ctx.globalAlpha = 0.3 + 0.5 * Math.sin(i + t * 6) ** 2;
      particle(ctx, cam, [x, y, z], 1.8);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // Los tres resultados: esperan, y al decidir dos cruzan y uno choca y se deshace.
  LANES.forEach((x, i) => {
    const ok = i !== 2;
    const appear = seg(t, 0.9 + i * 0.2, 1.5 + i * 0.2);
    let y = 2.8;
    let alpha = appear * (decided ? 1 : 0.85);
    if (decided) {
      if (ok) y = lerp(2.8, -3, seg(td, 0.2 + i * 0.25, 1.6 + i * 0.25));
      else {
        y = lerp(2.8, GATE_Y + 0.7, seg(td, 0.3, 1.0));
        alpha *= 1 - seg(td, 1.1, 1.4);
      }
    }
    const at: V3 = [x, y, 0.9 + Math.sin(t * 1.6 + i) * 0.07];
    const color = decided ? (ok ? C.accent : C.hi) : C.dim;
    if (decided && !ok) ctx.setLineDash([4, 3]);
    drawMesh(ctx, cam, RESULT_MESHES[i] ?? box(1, 1, 1), { at, spin: t * 0.7 + i }, color, alpha);
    ctx.setLineDash([]);
    const label = proj(cam, [at[0], at[1], 2.0]);
    caption(
      ctx,
      [label[0], label[1] + 2],
      [labels.video, labels.design, labels.process][i] ?? '',
      alpha,
    );
    // Marca: ? esperando, ✓ aprobado, ✕ a corrección (símbolo, no solo color).
    const mark = decided ? (ok ? '✓' : '✕') : '?';
    const markAlpha = decided
      ? seg(td, ok ? 1.3 + i * 0.25 : 0.9, ok ? 1.7 + i * 0.25 : 1.2) *
        (ok ? 1 : 1 - seg(td, 2.4, 2.9))
      : appear;
    ctx.globalAlpha = markAlpha;
    ctx.font = '15px "DotGothic16", monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = decided ? (ok ? C.accent : C.hi) : C.dim;
    ctx.fillText(mark, label[0], label[1] - 14);
    ctx.globalAlpha = 1;
  });

  // El rechazado estalla en partículas que vuelven por el aire hasta la sonda (el inicio).
  if (decided) {
    const from: V3 = [LANES[2] ?? 2.2, GATE_Y + 0.7, 0.9];
    const to: V3 = [START[0], START[1], 1.35];
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = C.hi;
    for (let i = 0; i < 90; i++) {
      const s = SEEDS[i] ?? NO_SEED;
      const burst = seg(td, 1.1, 1.5);
      const k = seg(td, 1.5 + s.c * 0.5, 3.0 + s.c * 0.7);
      if (burst <= 0 || k >= 1) continue;
      const spread: V3 = [
        from[0] + Math.cos(s.a) * 0.7 * burst * (1 - k),
        from[1] + Math.sin(s.a) * 0.7 * burst * (1 - k),
        from[2] + s.b * 0.6 * burst * (1 - k),
      ];
      const p = lerp3(spread, to, k);
      ctx.globalAlpha = 0.85;
      particle(ctx, cam, [p[0], p[1], p[2] + Math.sin(k * Math.PI) * 2.2], 1.7);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    const mid = proj(cam, [lerp(from[0], to[0], 0.5), lerp(from[1], to[1], 0.5), 3.3]);
    caption(ctx, mid, labels.backToFix, seg(td, 1.6, 2.2));
  }

  callout(ctx, proj(cam, [3.5, GATE_Y, gh * 0.6]), callText, seg(t, 1.2, 1.8), 1);
  caption(ctx, proj(cam, [0, GATE_Y, gh + 0.55]), labels.me, gate);
}

function drawTerminal(
  ctx: CanvasRenderingContext2D,
  labels: AiIllustrationLabels,
  typed: number,
  decided: boolean,
  t: number,
) {
  ctx.font = FONT;
  ctx.textAlign = 'left';
  const typing = typed < labels.command.length;
  const blink = Math.floor(t * 2) % 2 === 0;
  ctx.fillStyle = C.dim;
  const cmd = `${labels.prompt} ${labels.command.slice(0, typed)}`;
  ctx.fillText(cmd, 28, 476);
  if (typing && blink) ctx.fillText('▮', 28 + ctx.measureText(cmd).width + 2, 476);
  if (!typing) {
    ctx.fillStyle = C.hi;
    const q = `${labels.question} `;
    ctx.fillText(q, 28, 498);
    ctx.fillStyle = C.accent;
    if (decided) ctx.fillText(labels.answer, 28 + ctx.measureText(q).width, 498);
    else if (blink) ctx.fillText('▮', 28 + ctx.measureText(q).width, 498);
  }
  if (decided) {
    ctx.textAlign = 'right';
    ctx.fillStyle = C.accent;
    ctx.fillText(labels.summary, W - 28, 498);
  }
}

/**
 * Escenas 3D del método de trabajo con IA, una por paso: la sonda «yo» levanta la
 * estructura del plan; la IA (un icosaedro) solo construye dentro de cajas de límite;
 * y en la revisión solo cruza el arco lo que apruebo. La cámara orbita y sigue al ratón.
 */
export function AiProcessIllustration({
  stage,
  labels,
  description,
  className = '',
  playing = true,
  typed,
}: AiProcessIllustrationProps) {
  const { reducedMotion } = useSystem();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({ stage, typed, labels, playing });
  const kickRef = useRef<() => void>(() => undefined);
  stateRef.current = { stage, typed, labels, playing };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    let frame = 0;
    let onScreen = false;
    let start = -1;
    let decidedAt = -1;
    const look = { x: 0, y: 0, tx: 0, ty: 0 };
    let width = 0;
    let dpr = 1;

    const resize = () => {
      width = canvas.getBoundingClientRect().width;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(((width * H) / W) * dpr);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      look.tx = ((e.clientX - r.left) / r.width - 0.5) * 0.6;
      look.ty = ((e.clientY - r.top) / r.height - 0.5) * 0.25;
    };
    const onLeave = () => {
      look.tx = 0;
      look.ty = 0;
    };
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerleave', onLeave);

    const render = (now: number) => {
      const { stage: st, typed: ty, labels: lb, playing: pl } = stateRef.current;
      if (pl && start < 0) start = now;
      const t = reducedMotion ? 30 : start < 0 ? 0 : (now - start) / 1000;
      const decided = st === 'decided';
      if (decided && decidedAt < 0) decidedAt = now;
      if (!decided) decidedAt = -1;
      const td = reducedMotion ? 30 : decidedAt < 0 ? 0 : (now - decidedAt) / 1000;

      look.x += (look.tx - look.x) * 0.05;
      look.y += (look.ty - look.y) * 0.05;
      // Órbita lenta de la cámara más el giro hacia el ratón.
      const orbit = reducedMotion ? 0 : Math.sin(t * 0.18) * 0.22;
      const cam = makeCam(Math.PI / 4 + orbit + look.x, 0.82 + look.y);

      const k = (width / W) * dpr;
      ctx.setTransform(k, 0, 0, k, 0, 0);
      ctx.fillStyle = C.bg;
      ctx.fillRect(0, 0, W, H);
      const glow = ctx.createRadialGradient(CENTER[0], CENTER[1], 20, CENTER[0], CENTER[1], 340);
      glow.addColorStop(0, 'rgba(79, 209, 122, 0.11)');
      glow.addColorStop(1, 'rgba(79, 209, 122, 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W, H);
      ctx.lineWidth = 1;

      if (st === 'plan') scenePlan(ctx, cam, t, lb, lb.callPlan);
      else if (st === 'produce') sceneProduce(ctx, cam, t, lb, lb.callTasks);
      else {
        sceneReview(ctx, cam, t, td, decided, lb, lb.callReview);
        drawTerminal(ctx, lb, ty ?? lb.command.length, decided, t);
      }

      frame = !reducedMotion && onScreen ? requestAnimationFrame(render) : 0;
    };

    const io = new IntersectionObserver(([entry]) => {
      onScreen = Boolean(entry?.isIntersecting);
      if (onScreen && !frame) frame = requestAnimationFrame(render);
    });
    io.observe(canvas);
    // Con movimiento reducido se dibuja un solo cuadro por cambio de estado.
    kickRef.current = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };
    frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      ro.disconnect();
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerleave', onLeave);
    };
  }, [reducedMotion]);

  // Redibuja al cambiar de estado (con movimiento reducido no hay bucle).
  useEffect(() => {
    kickRef.current();
  }, [stage, typed]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={description}
      className={`block aspect-[800/520] w-full ${className}`}
    />
  );
}
