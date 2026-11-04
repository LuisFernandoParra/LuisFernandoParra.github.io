import { Link } from 'react-router-dom';
import { imageMeta } from '@/data/generated/imageMeta';
import { padFigure } from '@/lib/format';
import { projectPath } from '@/lib/routes';
import type { Project } from '@/types/content';

interface ProjectCardProps {
  project: Project;
  index: number;
  openLabel: string;
}

export function ProjectCard({ project, index, openLabel }: ProjectCardProps) {
  const [w, h] = imageMeta[project.cover.src] ?? [800, 450];
  return (
    <Link
      to={projectPath(project.slug)}
      className="group grid gap-4 border border-line bg-bg p-3 no-underline transition-colors hover:border-accent sm:grid-cols-[12rem_1fr]"
    >
      <div className="aspect-video overflow-hidden border border-line bg-panel">
        <img
          src={project.cover.src}
          alt=""
          width={w}
          height={h}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-contain"
        />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-xs text-accent-2">{padFigure(index)}</span>
        <h3 className="font-display text-3xl leading-none text-hi group-hover:text-accent">
          {project.title}
        </h3>
        <p className="text-sm text-dim">{project.summary}</p>
        <p className="mt-auto pt-2 text-2xs uppercase tracking-widest text-accent-2">
          {project.type} · {openLabel} →
        </p>
      </div>
    </Link>
  );
}
