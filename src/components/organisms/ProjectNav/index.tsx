import { Link } from 'react-router-dom';
import { Icon } from '@/components/atoms/Icon';
import { useSystem } from '@/hooks/useSystem';
import { projectPath } from '@/lib/routes';
import type { Project } from '@/types/content';

interface ProjectNavProps {
  prev: Project;
  next: Project;
}

/** Navegación inferior: anterior / índice / siguiente. */
export function ProjectNav({ prev, next }: ProjectNavProps) {
  const { t } = useSystem();
  const labels = t.ui.project;
  const linkClass =
    'group flex flex-col gap-1 border border-line bg-panel p-4 no-underline transition-colors hover:border-accent';

  return (
    <nav
      aria-label={labels.index}
      className="mx-auto max-w-[1680px] px-5 pb-24 sm:px-10 lg:px-16 2xl:px-24"
    >
      <ul className="grid gap-3 sm:grid-cols-3">
        <li>
          <Link to={projectPath(prev.slug)} className={linkClass} rel="prev">
            <span className="flex items-center gap-2 text-2xs uppercase tracking-widest text-dim">
              <Icon name="arrow-left" size={12} /> {labels.prev}
            </span>
            <span className="font-display text-2xl text-hi group-hover:text-accent">
              {prev.title}
            </span>
          </Link>
        </li>
        <li>
          <Link
            to="/proyectos"
            className={`${linkClass} items-center justify-center text-center sm:h-full`}
          >
            <span className="font-display text-2xl text-hi group-hover:text-accent">
              {labels.index}
            </span>
          </Link>
        </li>
        <li>
          <Link
            to={projectPath(next.slug)}
            className={`${linkClass} items-end text-right`}
            rel="next"
          >
            <span className="flex items-center gap-2 text-2xs uppercase tracking-widest text-dim">
              {labels.next} <Icon name="arrow-right" size={12} />
            </span>
            <span className="font-display text-2xl text-hi group-hover:text-accent">
              {next.title}
            </span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
