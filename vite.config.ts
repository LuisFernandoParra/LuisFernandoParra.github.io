import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';

// Dominio publicado en GitHub Pages (se puede cambiar con VITE_SITE_URL, ver .env.example).
process.env.VITE_SITE_URL ??= 'https://luisfernandoparra.github.io';

/** Precarga las dos fuentes críticas (subconjunto latin) en el HTML final. */
function preloadCriticalFonts(): Plugin {
  return {
    name: 'preload-critical-fonts',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(_html, ctx) {
        if (!ctx.bundle) return [];
        return Object.keys(ctx.bundle)
          .filter((f) => /(jacquard-12|dotgothic16)-latin-400-normal.*\.woff2$/.test(f))
          .map((f) => ({
            tag: 'link',
            attrs: {
              rel: 'preload',
              href: `/${f}`,
              as: 'font',
              type: 'font/woff2',
              crossorigin: '',
            },
            injectTo: 'head' as const,
          }));
      },
    },
  };
}

export default defineConfig({
  plugins: [react(), preloadCriticalFonts()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  build: { target: 'es2020', cssMinify: true },
});
