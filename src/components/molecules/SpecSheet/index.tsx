import type { ReactNode } from 'react';
import { Icon } from '@/components/atoms/Icon';
import type { LinkItem } from '@/types/content';

interface SpecSheetProps {
  labels: { type: string; role: string; period: string; tools: string; links: string };
  type: string;
  role: string;
  period: string;
  tools: string[];
  links: LinkItem[];
}

/** Ficha del proyecto: tipo / rol / periodo / herramientas / enlaces (solo los activos). */
export function SpecSheet({ labels, type, role, period, tools, links }: SpecSheetProps) {
  const visibleLinks = links.filter((l) => l.enabled);
  const rows: [string, ReactNode][] = [
    [labels.type, type],
    [labels.role, role],
    [labels.period, period],
    [
      labels.tools,
      <ul key="tools">
        {tools.map((tool) => (
          <li key={tool}>{tool}</li>
        ))}
      </ul>,
    ],
  ];
  if (visibleLinks.length) {
    rows.push([
      labels.links,
      <ul key="links" className="flex flex-col gap-1">
        {visibleLinks.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-accent underline hover:text-hi"
            >
              {link.label}
              <Icon name="external" size={12} />
            </a>
          </li>
        ))}
      </ul>,
    ]);
  }

  return (
    <dl className="border-t border-line">
      {rows.map(([label, value]) => (
        <div key={label} className="grid grid-cols-[6.5rem_1fr] gap-3 border-b border-line py-3">
          <dt className="text-xs uppercase tracking-widest text-accent-2">{label}</dt>
          <dd className="text-sm text-hi">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
