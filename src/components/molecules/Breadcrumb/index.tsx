import { Link } from 'react-router-dom';

export interface Crumb {
  label: string;
  to?: string;
}

interface BreadcrumbProps {
  crumbs: Crumb[];
  hint?: string;
}

/** Ruta tipo `~/desktop / proyectos / dtmf` con la ayuda de Esc a la derecha. */
export function Breadcrumb({ crumbs, hint }: BreadcrumbProps) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-line bg-bg/90 px-4 py-1.5 text-2xs sm:text-xs">
      <nav aria-label="breadcrumb" className="min-w-0">
        <ol className="flex min-w-0 items-center gap-2 text-dim">
          {crumbs.map((crumb, i) => {
            const last = i === crumbs.length - 1;
            return (
              <li key={`${crumb.label}-${i}`} className="flex min-w-0 items-center gap-2">
                {i > 0 && <span aria-hidden="true">/</span>}
                {crumb.to && !last ? (
                  <Link to={crumb.to} className="no-underline hover:text-accent">
                    {crumb.label}
                  </Link>
                ) : (
                  <span
                    className={`truncate ${last ? 'text-hi' : ''}`}
                    aria-current={last ? 'page' : undefined}
                  >
                    {crumb.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      {hint && <span className="hidden shrink-0 text-dim sm:inline">{hint}</span>}
    </div>
  );
}
