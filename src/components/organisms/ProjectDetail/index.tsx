import { useEffect, useRef } from 'react';
import { Eyebrow } from '@/components/atoms/Eyebrow';
import { Reveal } from '@/components/atoms/Reveal';
import { TypeText } from '@/components/atoms/TypeText';
import { Figure } from '@/components/molecules/Figure';
import { PixelReveal } from '@/components/molecules/PixelReveal';
import { SpecSheet } from '@/components/molecules/SpecSheet';
import { VideoEmbed } from '@/components/molecules/VideoEmbed';
import { ViewBadge } from '@/components/molecules/ViewBadge';
import { imageMeta } from '@/data/generated/imageMeta';
import { useSystem } from '@/hooks/useSystem';
import { padFigure } from '@/lib/format';
import type { Project } from '@/types/content';

interface ProjectDetailProps {
  project: Project;
  index: number;
}

/**
 * Plantilla fija: título, resumen, portada (el video principal si existe), ficha, texto,
 * lista corta y figuras numeradas, cada una junto a su texto.
 */
export function ProjectDetail({ project, index }: ProjectDetailProps) {
  const { t, reducedMotion } = useSystem();
  const heroRef = useRef<HTMLDivElement>(null);
  const labels = t.ui.project;
  const [cw, ch] = imageMeta[project.cover.src] ?? [800, 450];
  const videoActive = project.video?.enabled === true;
  const firstFigure = videoActive ? 2 : 1;
  // La portada solo se muestra si no se repite como figura.
  // Las figuras con texto se cuentan como pasos; las que no, van al final como galería.
  const story = project.figures.filter((f) => f.text);
  const gallery = project.figures.filter((f) => !f.text);
  const showCover = !project.figures.some((f) => f.src === project.cover.src);

  // Paralaje de la cabecera: el título sube más despacio y se desvanece al hacer scroll.
  useEffect(() => {
    const el = heroRef.current;
    if (!el || reducedMotion) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const y = Math.min(window.scrollY, 600);
        el.style.transform = `translate3d(0, ${y * -0.2}px, 0)`;
        el.style.opacity = String(1 - y / 650);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
    };
  }, [reducedMotion]);

  return (
    <article>
      {/* En pantallas grandes la cabecera va centrada, alineada con el contenido de abajo. */}
      <header className="mx-auto flex max-w-[1440px] flex-col gap-6 px-5 pb-8 pt-12 sm:px-10 sm:pt-20 lg:items-center lg:gap-10 lg:px-16 lg:text-center">
        <div
          ref={heroRef}
          className="flex flex-col gap-3 will-change-transform lg:items-center lg:gap-5"
        >
          <Eyebrow className="animate-reveal">
            {padFigure(index)} · {project.type}
          </Eyebrow>
          <TypeText
            as="h1"
            text={project.title}
            speed={75}
            delay={250}
            className="font-display text-6xl leading-[0.85] text-hi sm:text-8xl xl:text-9xl"
          />
          <TypeText
            as="p"
            text={project.summary}
            speed={18}
            delay={900}
            highlightTail={0}
            keepCursor
            className="max-w-4xl text-lg text-hi sm:text-xl lg:mx-auto xl:text-2xl xl:leading-10"
          />
        </div>
        {project.video ? (
          <Reveal
            as="figure"
            delay={600}
            className={`flex flex-col gap-2 ${project.video.vertical ? 'w-full max-w-[16rem] self-center' : 'w-full max-w-5xl lg:text-left'}`}
          >
            <VideoEmbed video={project.video} />
            {videoActive && (
              <figcaption className="text-xs text-accent-2">
                {labels.figure} {padFigure(1)}
              </figcaption>
            )}
          </Reveal>
        ) : (
          showCover && (
            <div className="w-fit max-w-full border border-line bg-panel p-1 lg:self-center">
              <PixelReveal
                src={project.cover.src}
                alt={project.cover.alt}
                width={cw}
                height={ch}
                eager
                className="block h-auto max-h-[60vh] w-auto max-w-full"
              />
            </div>
          )
        )}
      </header>

      <div className="mx-auto flex max-w-[1440px] flex-col gap-20 px-5 py-14 sm:px-10 lg:px-16 xl:gap-28">
        {/* Ficha e introducción lado a lado, centradas; los pasos y la galería usan todo el ancho debajo. */}
        <div className="grid w-full gap-12 lg:grid-cols-[20rem_minmax(0,1fr)] lg:gap-16 xl:grid-cols-[22rem_minmax(0,1fr)] xl:gap-20">
          <Reveal as="aside" className="lg:self-start">
            <SpecSheet
              labels={labels}
              type={project.type}
              role={project.role}
              period={project.period}
              tools={project.tools}
              links={project.links}
            />
          </Reveal>

          <div className="flex min-w-0 flex-col gap-5 text-base leading-8 text-hi lg:text-lg lg:leading-9 xl:text-xl xl:leading-10">
            {project.paragraphs.map((p, i) => (
              <Reveal as="p" key={p} delay={i * 120}>
                {p}
              </Reveal>
            ))}
            {project.list && (
              <ul className="flex flex-col gap-1 text-dim">
                {project.list.map((item, i) => (
                  <Reveal
                    as="li"
                    key={item}
                    delay={i * 80}
                    className="before:mr-2 before:text-accent before:content-['>']"
                  >
                    {item}
                  </Reveal>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-20 xl:gap-28">
          {story.map((fig, i) => {
            const [w = 1, h = 1] = imageMeta[fig.src] ?? [];
            const vertical = h > w;
            const flip = i % 2 === 1;
            // Las verticales (chats, reels) van en una columna fija junto al texto, centradas
            // como pareja, para que no quede un hueco grande a su lado.
            const cols = vertical
              ? `mx-auto w-full max-w-6xl ${flip ? 'lg:grid-cols-[22rem_minmax(0,1fr)] 2xl:grid-cols-[26rem_minmax(0,1fr)]' : 'lg:grid-cols-[minmax(0,1fr)_22rem] 2xl:grid-cols-[minmax(0,1fr)_26rem]'}`
              : 'lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]';
            return (
              <section
                key={fig.src}
                className={`grid items-center gap-6 lg:gap-12 2xl:gap-20 ${cols}`}
              >
                <Reveal
                  className={`flex flex-col gap-4 ${flip ? 'lg:order-2' : ''} max-w-[60ch] sm:max-lg:mx-auto sm:max-lg:items-center sm:max-lg:text-center`}
                >
                  {fig.caption && (
                    <h2 className="font-display text-3xl leading-none text-hi sm:text-4xl xl:text-5xl 2xl:text-6xl">
                      {fig.caption}
                    </h2>
                  )}
                  {fig.text && (
                    <p className="text-base leading-8 text-dim lg:text-lg lg:leading-9 2xl:text-xl 2xl:leading-10">
                      {fig.text}
                    </p>
                  )}
                </Reveal>
                <div
                  className={`w-full ${vertical ? 'mx-auto max-w-sm lg:max-w-none' : ''} ${flip ? 'lg:order-1' : ''}`}
                >
                  <Figure
                    number={firstFigure + i}
                    label={labels.figure}
                    src={fig.src}
                    alt={fig.alt}
                    href={fig.href}
                    linkLabel={fig.href ? labels.openPost(fig.alt) : undefined}
                    plain={fig.views !== undefined}
                  />
                </div>
              </section>
            );
          })}
        </div>

        {gallery.length > 0 && (
          <div className="grid items-start gap-8 sm:grid-cols-2 xl:grid-cols-3">
            {gallery.map((fig, i) => (
              <Figure
                key={fig.src}
                number={firstFigure + story.length + i}
                label={labels.figure}
                src={fig.src}
                alt={fig.alt}
                href={fig.href}
                linkLabel={fig.href ? labels.openPost(fig.alt) : undefined}
                caption={fig.caption}
                badge={fig.views !== undefined ? <ViewBadge views={fig.views} /> : undefined}
              />
            ))}
          </div>
        )}

        {/* Video extra con texto: se muestra como un paso más, siguiendo la alternancia. */}
        {project.extraVideo?.enabled && project.extraVideo.text && (
          <section
            className={`mx-auto grid w-full max-w-6xl items-center gap-6 lg:gap-12 2xl:gap-20 ${story.length % 2 === 1 ? 'lg:grid-cols-[22rem_minmax(0,1fr)] 2xl:grid-cols-[26rem_minmax(0,1fr)]' : 'lg:grid-cols-[minmax(0,1fr)_22rem] 2xl:grid-cols-[minmax(0,1fr)_26rem]'}`}
          >
            <Reveal
              className={`flex max-w-[60ch] flex-col gap-4 sm:max-lg:mx-auto sm:max-lg:items-center sm:max-lg:text-center ${story.length % 2 === 1 ? 'lg:order-2' : ''}`}
            >
              <h2 className="font-display text-3xl leading-none text-hi sm:text-4xl xl:text-5xl 2xl:text-6xl">
                {project.extraVideo.label}
              </h2>
              <p className="text-base leading-8 text-dim lg:text-lg lg:leading-9 2xl:text-xl 2xl:leading-10">
                {project.extraVideo.text}
              </p>
            </Reveal>
            <figure
              className={`mx-auto flex w-full max-w-sm flex-col gap-2 lg:max-w-none ${story.length % 2 === 1 ? 'lg:order-1' : ''}`}
            >
              <VideoEmbed video={project.extraVideo} />
            </figure>
          </section>
        )}

        {project.extraVideo?.enabled && !project.extraVideo.text && (
          <Reveal
            as="section"
            className={`flex flex-col gap-3 ${project.extraVideo.vertical ? 'w-full max-w-[16rem] self-center' : 'max-w-5xl'}`}
          >
            <p className="inline-flex w-fit border border-accent-2 px-2 py-1 text-xs uppercase tracking-widest text-accent">
              {project.extraVideo.label}
            </p>
            <VideoEmbed video={project.extraVideo} />
          </Reveal>
        )}
      </div>
    </article>
  );
}
