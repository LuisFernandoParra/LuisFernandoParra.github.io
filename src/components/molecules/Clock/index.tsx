import { useEffect, useState } from 'react';
import type { Locale } from '@/types/content';

interface ClockProps {
  locale: Locale;
}

/** Fecha y hora local de la barra superior (se actualiza cada 30 s). */
export function Clock({ locale }: ClockProps) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  const tag = locale === 'es' ? 'es-CO' : 'en-US';
  const date = now.toLocaleDateString(tag, { weekday: 'short', day: 'numeric', month: 'short' });
  const time = now.toLocaleTimeString(tag, { hour: '2-digit', minute: '2-digit', hour12: false });

  return (
    <time dateTime={now.toISOString()} className="whitespace-nowrap text-xs text-dim">
      {date} · {time}
    </time>
  );
}
