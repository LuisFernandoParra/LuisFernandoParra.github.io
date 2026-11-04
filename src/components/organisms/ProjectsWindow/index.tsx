import { useState } from 'react';
import { ProjectCard } from '@/components/molecules/ProjectCard';
import { ProjectsRoom } from '@/components/organisms/ProjectsRoom';
import { useSystem } from '@/hooks/useSystem';
import { readStorage, writeStorage } from '@/lib/storage';

type View = 'room' | 'list';
const VIEW_KEY = 'ferchux:projects-view';

export default function ProjectsWindow() {
  const { t } = useSystem();
  const [view, setView] = useState<View>(() =>
    readStorage('local', VIEW_KEY) === 'list' ? 'list' : 'room',
  );
  const labels = t.ui.project;

  const choose = (next: View) => {
    setView(next);
    writeStorage('local', VIEW_KEY, next);
  };

  return (
    <div className="pb-12">
      <div
        role="group"
        aria-label={labels.viewLabel}
        className="flex justify-end gap-1 px-5 pb-4 sm:px-10 lg:px-16"
      >
        {(['room', 'list'] as View[]).map((v) => (
          <button
            key={v}
            type="button"
            aria-pressed={view === v}
            onClick={() => choose(v)}
            className={`border px-3 py-1 text-2xs uppercase tracking-widest ${view === v ? 'border-accent bg-accent text-bg' : 'border-line text-dim hover:text-accent'}`}
          >
            {v === 'room' ? labels.viewRoom : labels.viewList}
          </button>
        ))}
      </div>

      {view === 'room' ? (
        <ProjectsRoom projects={t.projects} hint={labels.dragHint} />
      ) : (
        <ul className="flex flex-col gap-4 px-5 sm:px-10 lg:px-16">
          {t.projects.map((project, i) => (
            <li
              key={project.slug}
              className="animate-reveal"
              style={{ animationDelay: `${i * 90}ms` }}
            >
              <ProjectCard project={project} index={i + 1} openLabel={labels.openProject} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
