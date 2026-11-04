# Ferchux — portafolio de Luis Fernando Parra

Escritorio retro tipo Linux ("Ferchux") con pantalla de arranque, ventanas con URL propia,
páginas de proyecto y sección "Cómo trabajo con IA". Español e inglés.

Stack: Vite · React 18 · TypeScript estricto · Tailwind CSS · react-router-dom · Lenis (scroll suave, ~4 KB). Sin librerías de UI,
sin analítica y sin servicios externos (los videos de YouTube se cargan solo al hacer clic, desde
`youtube-nocookie.com`).

## Comandos

```bash
npm install
npm run dev       # servidor de desarrollo (muestra los placeholders pendientes)
npm run build     # genera dist/ estático, listo para cualquier hosting
npm run preview   # sirve dist/ en local
npm run lint      # ESLint
npm run format    # Prettier
npm run images    # reconvierte assets-src/ → public/images/*.webp y regenera imageMeta.ts
```

Antes de publicar, copia `.env.example` a `.env` y pon el dominio definitivo en `VITE_SITE_URL`
(se usa en canonical, hreflang, Open Graph, `sitemap.xml` y `robots.txt`).

En el hosting, configura el fallback de SPA a `index.html` (o usa el `404.html` generado). Las rutas
principales ya tienen su propio HTML con título y metas en `dist/<ruta>/index.html`.

## Estructura

```
assets-src/            imágenes originales (no se publican) y referencias de diseño
public/                CV, favicon, og.png e imágenes optimizadas (WebP)
scripts/
  optimize-images.mjs  WebP + tamaños (src/data/generated/imageMeta.ts)
  postbuild.mjs        HTML por ruta, 404.html, sitemap.xml, robots.txt
src/
  components/
    atoms/             Button, Tag, Icon, Cursor, Eyebrow, DevPlaceholder,
                       TypeText, Reveal
    molecules/         DesktopIcon, MenuItem, MenuDropdown, BootLine, ProgressBlocks, ProjectCard,
                       SpecSheet, Figure, PixelReveal, ViewBadge, VideoEmbed,
                       Clock, Breadcrumb
    organisms/         BootScreen, MenuBar, Desktop, ParticlePortrait, AreaShowcase, Window, ProjectsWindow,
                       ProjectsRoom, ProfileWindow, AiSection, AiProcessIllustration,
                       ContactWindow, ProjectDetail, ProjectNav, CommandPalette, SystemDialogs,
                       Modal
    templates/         DesktopTemplate, ProjectTemplate
  context/             estado del sistema (idioma, CRT, sonido) y gestor de ventanas
  data/
    es/  en/           todo el texto, por idioma
    shared.ts          datos comunes: enlaces, rutas de imágenes, IDs de YouTube
    generated/         tamaños de imagen (generado)
  hooks/               useBootSequence, useWindowManager, useLocale, useKeyboardShortcuts,
                       useInViewReveal, useDocumentMeta, useFullscreen…
  lib/                 utilidades (storage seguro, rutas, formato, sonido, portapapeles)
  pages/               HomePage, ProjectPage, NotFoundPage
  styles/              Tailwind + capas base
  types/               tipos del contenido
```

## Editar contenido

Todo el texto está en `src/data/es/` y `src/data/en/` (mismos archivos y estructura):

| Archivo       | Contenido                                                 |
| ------------- | --------------------------------------------------------- |
| `boot.ts`     | líneas de la pantalla de arranque                         |
| `profile.ts`  | presentación, formación y trabajo, las 4 áreas            |
| `ai.ts`       | sección "Cómo trabajo con IA" y rótulos de la ilustración |
| `projects.ts` | los 4 proyectos (ficha, textos, figuras, enlaces, videos) |
| `contact.ts`  | `contacto.sh`                                             |
| `ui.ts`       | textos de interfaz, SEO por página                        |

Enlaces y videos se activan o desactivan con `enabled: true | false` en `projects.ts` de **ambos**
idiomas. Los IDs de YouTube y URLs comunes están en `src/data/shared.ts`.

Para cambiar una imagen: ponla en `assets-src/images/...`, ejecuta `npm run images` y referencia la
ruta `.webp` en `shared.ts`. El retrato de portada se cambia en `heroPortrait` (`shared.ts`).

> **Textos en inglés: pendientes de revisión.** La traducción de `src/data/en/` es fiel al español,
> sin añadir ni quitar contenido, pero Fercho todavía no la ha revisado. El titular de la sección de
> IA es "La IA acelera las cosas. Yo marco el rumbo." en español y "AI speeds things up. I set the
> direction." en inglés.

## Movimiento

- **Arranque:** el comando se teclea, las líneas aparecen con su número subiendo, barra de bloques
  y salida con una línea de luz que barre la pantalla. `S` activa o silencia el sonido.
- **Escritorio:** retrato de portada en partículas (`ParticlePortrait`) que se arma al entrar,
  sigue el ratón, se aparta del cursor y se dispersa al abrir una ventana.
- **perfil/:** primero las 4 áreas juntas y, al bajar, cada una en detalle (`AreaShowcase`).
  Un solo sistema de partículas se deshace, viaja con el scroll y forma el retrato siguiente.
- **Lupa:** al pasar el cursor por cualquier retrato o portada de partículas se ve la imagen
  original bajo el cursor (`drawLens` en `lib/particles.ts`).
- **Ventanas:** páginas completas que entran con barrido; título tecleado (`TypeText`), textos
  que aparecen al hacer scroll (`Reveal`) y scroll suave.
- **Proyectos:** sala arrastrable infinita (`ProjectsRoom`) con las portadas hechas de partículas vivas en un
  solo canvas (se arman al centrarse, se dispersan lejos y se apartan del cursor), o vista de lista; en cada proyecto,
  título y resumen tecleados, paralaje de la cabecera e imágenes que pasan de pixeladas a nítidas
  (`PixelReveal`, sin filtros al terminar).
- **IA:** cada escena se dibuja al entrar en pantalla y la terminal teclea `revisar --resultados`.
- **CRT:** líneas de barrido, marco redondeado y banda de luz que recorre la pantalla.

Todo se desactiva con `prefers-reduced-motion` (imágenes fijas teñidas, textos completos).

## Accesibilidad y rendimiento

- Navegación completa por teclado: `1` `2` `3` abren ventanas, `Esc` cierra o vuelve, `Ctrl/⌘ + K`
  paleta de comandos, `?` ayuda de atajos.
- Ventanas con `role="dialog"`, foco gestionado y devuelto al cerrar; modales con foco atrapado.
- `prefers-reduced-motion`: sin CRT, sin escritura animada, retratos como foto teñida de verde.
- Contraste AA verificado en todas las combinaciones de tokens (mínimo 4,95:1).
- Code splitting por ruta y por ventana; fuentes autoalojadas (`@fontsource`, subconjunto latin,
  `font-display: swap`, precargadas).
