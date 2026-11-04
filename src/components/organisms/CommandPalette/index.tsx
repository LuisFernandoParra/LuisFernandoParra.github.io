import { useMemo, useState, type KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '@/components/organisms/Modal';
import { person } from '@/data/shared';
import { useSystem } from '@/hooks/useSystem';
import { useWindowManager } from '@/hooks/useWindowManager';
import { copyText } from '@/lib/clipboard';
import { projectPath, windowIds } from '@/lib/routes';

interface Command {
  id: string;
  label: string;
  run: () => void;
}

/** Paleta de comandos (Ctrl/⌘ + K). */
export default function CommandPalette() {
  const { t, setOverlay, toggleLocale } = useSystem();
  const { open } = useWindowManager();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [notice, setNotice] = useState('');
  const close = () => setOverlay(null);

  const commands = useMemo<Command[]>(() => {
    const m = t.ui.menu;
    const done = (fn: () => void) => () => {
      fn();
      setOverlay(null);
    };
    return [
      ...windowIds.map((id) => ({
        id: `open-${id}`,
        label: m.openWindow(t.ui.windows[id]),
        run: done(() => open(id)),
      })),
      ...t.projects.map((p) => ({
        id: `project-${p.slug}`,
        label: `${t.ui.windows.proyectos}${p.title}`,
        run: done(() => navigate(projectPath(p.slug))),
      })),
      {
        id: 'copy-email',
        label: `${t.ui.palette.copyEmail} (${person.email})`,
        run: () => {
          copyText(person.email).then((ok) => ok && setNotice(t.ui.palette.emailCopied));
        },
      },
      {
        id: 'cv',
        label: m.downloadCv,
        run: done(() => window.open(person.cv, '_blank', 'noopener')),
      },
      { id: 'lang', label: t.ui.palette.toggleLanguage, run: done(toggleLocale) },
      { id: 'shortcuts', label: m.shortcuts, run: () => setOverlay('shortcuts') },
      { id: 'about', label: m.about, run: () => setOverlay('about') },
    ];
  }, [t, open, navigate, toggleLocale, setOverlay]);

  const results = commands.filter((c) =>
    c.label.toLowerCase().includes(query.trim().toLowerCase()),
  );
  const current = Math.min(active, Math.max(0, results.length - 1));

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const step = e.key === 'ArrowDown' ? 1 : -1;
      setActive((current + step + results.length) % Math.max(1, results.length));
    } else if (e.key === 'Enter') {
      results[current]?.run();
    }
  };

  return (
    <Modal title={t.ui.menu.commandPalette} closeLabel={t.ui.close} onClose={close} hideTitle>
      <div className="p-3">
        <label className="flex items-center gap-2 border border-line bg-bg px-3 py-2">
          <span className="text-accent-2" aria-hidden="true">
            &gt;
          </span>
          <input
            data-autofocus
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-results"
            aria-activedescendant={results[current] ? `cmd-${results[current].id}` : undefined}
            aria-label={t.ui.menu.commandPalette}
            placeholder={t.ui.palette.placeholder}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
            className="w-full bg-transparent text-sm text-hi placeholder:text-dim focus:outline-none"
          />
        </label>
        <ul id="palette-results" role="listbox" className="mt-2 max-h-80 overflow-y-auto">
          {results.map((cmd, i) => (
            <li
              key={cmd.id}
              id={`cmd-${cmd.id}`}
              role="option"
              aria-selected={i === current}
              onPointerEnter={() => setActive(i)}
              onClick={cmd.run}
              className={`cursor-pointer px-3 py-2 text-sm ${i === current ? 'bg-line text-accent' : 'text-hi'}`}
            >
              {cmd.label}
            </li>
          ))}
          {results.length === 0 && (
            <li className="px-3 py-2 text-sm text-dim">{t.ui.palette.empty}</li>
          )}
        </ul>
        <p role="status" className="min-h-5 px-3 pt-1 text-xs text-accent">
          {notice}
        </p>
      </div>
    </Modal>
  );
}
