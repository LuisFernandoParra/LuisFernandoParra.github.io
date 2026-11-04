// Quita el fondo negro del retrato de portada (relleno desde los bordes, así no toca la ropa
// oscura del interior), suaviza el borde y lo guarda como PNG transparente en assets-src.
// Uso: node scripts/cutout-hero.mjs <foto-entrada> [salida]
import path from 'node:path';
import sharp from 'sharp';

const [input, output = 'assets-src/images/hero/fercho.png'] = process.argv.slice(2);
if (!input) throw new Error('Falta la ruta de la foto de entrada');

const { data, info } = await sharp(input).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: w, height: h } = info;
const isBg = (i) => Math.max(data[i * 3], data[i * 3 + 1], data[i * 3 + 2]) < 18;

// Relleno por inundación desde todo el borde de la imagen.
const bg = new Uint8Array(w * h);
const stack = [];
for (let x = 0; x < w; x++) stack.push(x, (h - 1) * w + x);
for (let y = 0; y < h; y++) stack.push(y * w, y * w + w - 1);
while (stack.length) {
  const i = stack.pop();
  if (bg[i] || !isBg(i)) continue;
  bg[i] = 1;
  const x = i % w;
  if (x > 0) stack.push(i - 1);
  if (x < w - 1) stack.push(i + 1);
  if (i >= w) stack.push(i - w);
  if (i < w * (h - 1)) stack.push(i + w);
}

const alpha = Buffer.alloc(w * h);
for (let i = 0; i < w * h; i++) alpha[i] = bg[i] ? 0 : 255;
// Borde suave: un leve desenfoque solo del canal alfa.
const softAlpha = await sharp(alpha, { raw: { width: w, height: h, channels: 1 } })
  .blur(1.2)
  .extractChannel(0)
  .raw()
  .toBuffer();

const rgba = Buffer.alloc(w * h * 4);
for (let i = 0; i < w * h; i++) {
  rgba[i * 4] = data[i * 3];
  rgba[i * 4 + 1] = data[i * 3 + 1];
  rgba[i * 4 + 2] = data[i * 3 + 2];
  rgba[i * 4 + 3] = softAlpha[i];
}
await sharp(rgba, { raw: { width: w, height: h, channels: 4 } }).png().toFile(output);
console.log(`${path.basename(input)} -> ${output} (${w}×${h}, fondo eliminado)`);
