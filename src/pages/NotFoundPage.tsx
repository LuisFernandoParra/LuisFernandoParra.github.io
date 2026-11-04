import { Link } from 'react-router-dom';
import { Cursor } from '@/components/atoms/Cursor';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { useSystem } from '@/hooks/useSystem';

export default function NotFoundPage() {
  const { t, locale } = useSystem();
  const { notFound } = t.ui;

  useDocumentMeta({ ...t.seo.notFound, path: '/404', locale });

  return (
    <main
      id="main"
      tabIndex={-1}
      className="desktop-glow grid min-h-[calc(100dvh-2.5rem)] place-items-center px-4 focus:outline-none"
    >
      <div className="w-full max-w-lg border border-line bg-panel p-6 shadow-window">
        <h1 className="font-display text-8xl leading-none text-accent">{notFound.title}</h1>
        <p className="mt-4 text-sm text-dim">
          <span className="text-accent-2">fercho@medellin:~$</span> cd {window.location.pathname}
        </p>
        <p className="text-sm text-hi">
          {notFound.body}
          <Cursor />
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex border border-accent bg-accent px-4 py-2 text-sm text-bg no-underline hover:bg-hi"
        >
          {notFound.back}
        </Link>
      </div>
    </main>
  );
}
