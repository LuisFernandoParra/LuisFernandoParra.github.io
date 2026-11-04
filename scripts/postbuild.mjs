// Tras `vite build`: genera un HTML por ruta con su título y metas (para buscadores y
// vistas previas al compartir), además de 404.html, sitemap.xml y robots.txt.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const dist = path.join(root, 'dist');
try {
  process.loadEnvFile(path.join(root, '.env'));
} catch {
  // Sin .env: se usa el dominio provisional.
}
const site = (process.env.VITE_SITE_URL ?? 'https://luisfernandoparra.github.io').replace(/\/$/, '');

const name = 'Luis Fernando Parra';
const projects = [
  [
    'dtmf',
    'DtMF',
    'Simula un concierto inspirado en Debí tirar más fotos.',
    'dtmf/fig02-sol-vs-luna',
  ],
  [
    'nosta',
    'NOSTA',
    'Una tostadora inteligente para 2026: tú eliges cómo quieres tu tostada y NOSTA adapta el proceso al pan que pusiste.',
    'nosta/portada',
  ],
  [
    'edicion-video',
    'Edición de video',
    'Contenido en video para mi propio negocio, publicado en Instagram: reels y publicaciones con entre 3.000 y 18.000 reproducciones.',
    'edicion-video/fig05-fortnite-esqueleto-16k2',
  ],
  [
    'bot-whatsapp',
    'Bot de WhatsApp',
    'Montado en mi propio servidor desde junio de 2026, el bot atiende a clientes reales de mi tienda por WhatsApp.',
    'bot-whatsapp/fig02-bot-skin-identificada',
  ],
  [
    'retornante',
    'El Retornante',
    'Una historia original mía convertida en una infografía web interactiva, con muchas formas distintas de visualizar sus datos.',
    'retornante/portada',
  ],
];

const routes = [
  {
    path: '/proyectos',
    title: `proyectos/ — ${name}`,
    description: 'DtMF, NOSTA, Edición de video y Bot de WhatsApp.',
  },
  {
    path: '/perfil',
    title: `perfil/ — ${name}`,
    description:
      'Diseño de producto, UI y UX · Marketing y contenido · Edición de video · Programación. Cómo trabajo con IA.',
  },
  {
    path: '/contacto',
    title: `contacto.sh — ${name}`,
    description: 'ferchopacas@gmail.com · GitHub · LinkedIn · CV en PDF.',
  },
  ...projects.map(([slug, title, description, image]) => ({
    path: `/proyectos/${slug}`,
    title: `${title} — ${name}`,
    description,
    image: `/images/projects/${image}.webp`,
  })),
];

const escape = (s) => s.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');

function withMeta(html, { path: route, title, description, image = '/og.png' }) {
  const url = `${site}${route}`;
  const t = escape(title);
  const d = escape(description);
  return html
    .replace(/<title>[^<]*<\/title>/, `<title>${t}</title>`)
    .replace(/(<meta\s+name="description"\s+content=")[^"]*"/, `$1${d}"`)
    .replace(/(<meta\s+property="og:title"\s+content=")[^"]*"/, `$1${t}"`)
    .replace(/(<meta\s+property="og:description"\s+content=")[^"]*"/, `$1${d}"`)
    .replace(/(<meta\s+name="twitter:title"\s+content=")[^"]*"/, `$1${t}"`)
    .replace(/(<meta\s+name="twitter:description"\s+content=")[^"]*"/, `$1${d}"`)
    .replace(/(<meta\s+property="og:url"\s+content=")[^"]*"/, `$1${url}"`)
    .replace(/(<meta\s+property="og:image"\s+content=")[^"]*"/, `$1${site}${image}"`)
    .replace(/(<meta\s+name="twitter:image"\s+content=")[^"]*"/, `$1${site}${image}"`)
    .replace(/(<link\s+rel="canonical"\s+href=")[^"]*"/, `$1${url}"`)
    .replace(/(hreflang="es"\s+href=")[^"]*"/, `$1${url}?lang=es"`)
    .replace(/(hreflang="en"\s+href=")[^"]*"/, `$1${url}?lang=en"`)
    .replace(/(hreflang="x-default"\s+href=")[^"]*"/, `$1${url}"`);
}

const template = await readFile(path.join(dist, 'index.html'), 'utf8');

for (const route of routes) {
  const dir = path.join(dist, route.path);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, 'index.html'), withMeta(template, route));
}

await writeFile(
  path.join(dist, '404.html'),
  withMeta(template, {
    path: '/404',
    title: '404 — Ferchux',
    description: 'Ruta no encontrada.',
  }).replace('</head>', '    <meta name="robots" content="noindex" />\n  </head>'),
);

const urls = ['/', ...routes.map((r) => r.path)];
const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls
  .map((u) => {
    const loc = `${site}${u === '/' ? '/' : u}`;
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <xhtml:link rel="alternate" hreflang="es" href="${loc}?lang=es"/>
    <xhtml:link rel="alternate" hreflang="en" href="${loc}?lang=en"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${loc}"/>
  </url>`;
  })
  .join('\n')}
</urlset>
`;
await writeFile(path.join(dist, 'sitemap.xml'), sitemap);
await writeFile(
  path.join(dist, 'robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${site}/sitemap.xml\n`,
);

console.log(`postbuild: ${routes.length} rutas, 404.html, sitemap.xml y robots.txt (${site})`);
