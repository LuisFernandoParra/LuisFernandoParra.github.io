// Convierte las imágenes de assets-src/ a WebP en public/images/ y genera
// src/data/generated/imageMeta.ts con el ancho y alto de cada una.
// Uso: npm run images
import { mkdir, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '..');
const srcDir = path.join(root, 'assets-src', 'images');
const outDir = path.join(root, 'public', 'images');
const metaFile = path.join(root, 'src', 'data', 'generated', 'imageMeta.ts');

// Ancho máximo por carpeta. Las capturas de proyectos nunca se agrandan ni se recortan.
const maxWidth = { areas: 720, hero: 720 };
// Capturas con texto pequeño: WebP casi sin pérdida para que se sigan leyendo.
const nearLossless = new Set();

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)])),
  );
  return files.flat().filter((f) => /\.(png|jpe?g|webp)$/i.test(f));
}

const meta = {};
for (const file of await walk(srcDir)) {
  const rel = path.relative(srcDir, file).replaceAll('\\', '/');
  const folder = rel.split('/')[0];
  const name = path.basename(rel, path.extname(rel));
  const outRel = rel.replace(/\.(png|jpe?g|webp)$/i, '.webp');
  const outPath = path.join(outDir, outRel);
  await mkdir(path.dirname(outPath), { recursive: true });

  let pipeline = sharp(file);
  const limit = maxWidth[folder];
  if (limit) pipeline = pipeline.resize({ width: limit, withoutEnlargement: true });
  pipeline = nearLossless.has(name)
    ? pipeline.webp({ nearLossless: true, quality: 80 })
    : pipeline.webp({ quality: 82 });

  const info = await pipeline.toFile(outPath);
  const before = (await stat(file)).size;
  meta[`/images/${outRel}`] = [info.width, info.height];
  console.log(`${rel}: ${(before / 1024).toFixed(0)} KB -> ${(info.size / 1024).toFixed(0)} KB`);
}

// Imagen Open Graph provisional (placeholder hasta que Fercho entregue la definitiva).
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#07140d"/>
  <rect x="24" y="24" width="1152" height="582" fill="none" stroke="#1f4d34" stroke-width="2"/>
  <text x="80" y="140" fill="#8fcfa5" font-family="monospace" font-size="30">fercho@medellin:~$ ferchux</text>
  <text x="80" y="330" fill="#7dff9b" font-family="monospace" font-size="84" font-weight="bold">Luis Fernando Parra</text>
  <text x="80" y="410" fill="#d8ffe3" font-family="monospace" font-size="36">Ingeniero en Diseño de Entretenimiento Digital</text>
  <text x="80" y="540" fill="#8fcfa5" font-family="monospace" font-size="28">Medellín</text>
</svg>`;
await sharp(Buffer.from(og))
  .png()
  .toFile(path.join(root, 'public', 'og.png'));

await mkdir(path.dirname(metaFile), { recursive: true });
const body = Object.entries(meta)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([k, [w, h]]) => `  '${k}': [${w}, ${h}],`)
  .join('\n');
await writeFile(
  metaFile,
  `// Archivo generado por scripts/optimize-images.mjs. No editar a mano.\nexport const imageMeta: Record<string, readonly [number, number]> = {\n${body}\n};\n`,
);
console.log(`\n${Object.keys(meta).length} imágenes -> ${path.relative(root, metaFile)}`);
