import { Breadcrumb } from '@/components/molecules/Breadcrumb';
import { ProjectDetail } from '@/components/organisms/ProjectDetail';
import { ProjectNav } from '@/components/organisms/ProjectNav';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { useSystem } from '@/hooks/useSystem';
import type { Project } from '@/types/content';

interface ProjectTemplateProps {
  project: Project;
  index: number;
  prev: Project;
  next: Project;
}

export function ProjectTemplate({ project, index, prev, next }: ProjectTemplateProps) {
  const { t } = useSystem();
  useSmoothScroll();
  return (
    <>
      <div className="sticky top-0 z-[50]">
        <Breadcrumb
          crumbs={[
            { label: t.ui.breadcrumbRoot, to: '/' },
            { label: t.ui.windows.proyectos, to: '/proyectos' },
            { label: project.slug },
          ]}
          hint={t.ui.escCloseProject}
        />
      </div>
      <main id="main" tabIndex={-1} className="focus:outline-none">
        <ProjectDetail project={project} index={index} />
        <ProjectNav prev={prev} next={next} />
      </main>
    </>
  );
}
