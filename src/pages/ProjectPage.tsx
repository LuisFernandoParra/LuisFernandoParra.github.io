import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ProjectTemplate } from '@/components/templates/ProjectTemplate';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useSystem } from '@/hooks/useSystem';
import { projectPath } from '@/lib/routes';
import NotFoundPage from './NotFoundPage';

export default function ProjectPage() {
  const { slug } = useParams();
  const { t, locale, overlay } = useSystem();
  const navigate = useNavigate();
  const { projects } = t;
  const index = projects.findIndex((p) => p.slug === slug);
  const project = projects[index];

  useKeyboardShortcuts({ Escape: () => navigate('/proyectos') }, Boolean(project) && !overlay);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useDocumentMeta({
    title: project ? `${project.title} — ${t.name}` : t.seo.notFound.title,
    description: project?.summary ?? t.seo.notFound.description,
    path: project ? projectPath(project.slug) : '/404',
    locale,
    image: project?.cover.src,
  });

  if (!project) return <NotFoundPage />;

  const prev = projects[(index - 1 + projects.length) % projects.length] ?? project;
  const next = projects[(index + 1) % projects.length] ?? project;

  return (
    <ProjectTemplate
      key={project.slug}
      project={project}
      index={index + 1}
      prev={prev}
      next={next}
    />
  );
}
