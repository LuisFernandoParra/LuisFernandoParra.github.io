import { useLocale } from '@/hooks/useLocale';
import { formatNumber } from '@/lib/format';

interface ViewBadgeProps {
  views: number;
}

/** Reproducciones como texto traducible (nunca incrustado en la imagen). */
export function ViewBadge({ views }: ViewBadgeProps) {
  const { locale, t } = useLocale();
  const formatted = formatNumber(views, locale);
  return (
    <span className="inline-flex items-center gap-2 border border-line bg-bg px-2 py-1 text-sm text-accent">
      <span aria-hidden="true">▶ {formatted}</span>
      <span className="sr-only">{t.ui.project.viewsLabel(formatted)}</span>
    </span>
  );
}
