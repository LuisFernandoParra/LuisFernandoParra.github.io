import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { Icon, type IconName } from '@/components/atoms/Icon';
import { Breadcrumb } from '@/components/molecules/Breadcrumb';
import { person } from '@/data/shared';
import { useSystem } from '@/hooks/useSystem';

interface ContactWindowProps {
  onClose: () => void;
}

const field =
  'w-full bg-transparent px-4 py-3 text-base text-hi placeholder:text-dim/70 focus:bg-line/40 focus:outline-none lg:px-5 lg:py-4 lg:text-lg';

function Row({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <div className="grid grid-cols-[6.5rem_1fr] border-b border-accent-2 sm:grid-cols-[8.5rem_1fr]">
      <label
        htmlFor={htmlFor}
        className="border-r border-accent-2 px-4 py-3 text-sm uppercase tracking-widest text-hi lg:px-5 lg:py-4"
      >
        {label}
      </label>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

function LinkRow({
  href,
  icon,
  title,
  sub,
  external,
  download,
}: {
  href: string;
  icon: IconName;
  title: string;
  sub: string;
  external?: boolean;
  download?: boolean;
}) {
  return (
    <li className="border-t border-line first:border-t-0">
      <a
        href={href}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...(download ? { download: true } : {})}
        className="group flex items-center gap-5 px-4 py-4 no-underline transition-colors hover:bg-line/40 lg:px-5"
      >
        <span className="grid size-11 shrink-0 place-items-center border border-accent-2 text-accent transition-colors group-hover:bg-accent group-hover:text-bg">
          <Icon name={icon} />
        </span>
        <span className="flex flex-col">
          <span className="text-lg text-hi group-hover:text-accent">{title}</span>
          <span className="text-sm text-dim">{sub}</span>
        </span>
      </a>
    </li>
  );
}

/**
 * contacto.sh: ventana de mensaje sobre el escritorio (como un cliente de correo). Al enviar
 * se abre el programa de correo de quien visita con el asunto y el mensaje ya escritos;
 * no se usa ningún servicio externo.
 */
export default function ContactWindow({ onClose }: ContactWindowProps) {
  const { t, reducedMotion } = useSystem();
  const { contact } = t;
  const titleId = useId();
  const fromId = useId();
  const subjectId = useId();
  const messageId = useId();
  const dialogRef = useRef<HTMLElement>(null);
  const [from, setFrom] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    dialogRef.current?.querySelector<HTMLElement>('input')?.focus({ preventScroll: true });
    return () => {
      const target = opener?.isConnected ? opener : document.getElementById('main');
      target?.focus({ preventScroll: true });
    };
  }, []);

  const send = (e: FormEvent) => {
    e.preventDefault();
    const body = [message.trim() || contact.mailBody, from.trim() ? `\n— ${from.trim()}` : '']
      .join('\n')
      .trim();
    const subjectLine = encodeURIComponent(subject.trim() || contact.mailSubject);
    window.location.href = `mailto:${person.email}?subject=${subjectLine}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="fixed inset-x-0 bottom-0 top-10 z-40 flex flex-col">
      <div className="bg-bg">
        <Breadcrumb
          crumbs={[{ label: t.ui.breadcrumbRoot, to: '/' }, { label: t.ui.windows.contacto }]}
          hint={t.ui.escCloseWindow}
        />
      </div>
      <div
        className="flex flex-1 items-start justify-center overflow-y-auto bg-bg/75 px-3 py-6 backdrop-blur-[2px] sm:items-center sm:px-6 sm:py-10"
        onPointerDown={(e) => e.target === e.currentTarget && onClose()}
      >
        <section
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className={`w-full max-w-4xl border-2 border-accent-2 bg-panel shadow-[10px_10px_0_0_#1f4d34] ${reducedMotion ? '' : 'animate-wipe-in'}`}
        >
          <header className="relative flex items-center justify-center border-b-2 border-accent-2 px-16 py-4">
            <button
              type="button"
              onClick={onClose}
              aria-label={`${t.ui.windowClose}: ${t.ui.windows.contacto}`}
              className="absolute left-4 grid size-9 place-items-center rounded-full border-2 border-accent text-accent transition-colors hover:bg-accent hover:text-bg"
            >
              <Icon name="close" size={14} />
            </button>
            <h2 id={titleId} className="text-center text-base text-hi sm:text-lg">
              {contact.windowTitle}
            </h2>
          </header>

          <form onSubmit={send}>
            <Row label={contact.to}>
              <div className="px-4 py-3 lg:px-5 lg:py-4">
                <a
                  href={`mailto:${person.email}`}
                  className="text-base text-hi no-underline hover:text-accent lg:text-lg"
                >
                  {person.email}
                </a>
                <p className="mt-1 text-xs text-accent-2 sm:text-sm">{t.availability}</p>
              </div>
            </Row>
            <Row label={contact.from} htmlFor={fromId}>
              <input
                id={fromId}
                type="email"
                autoComplete="email"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                placeholder={contact.fromPlaceholder}
                className={field}
              />
            </Row>
            <Row label={contact.subject} htmlFor={subjectId}>
              <input
                id={subjectId}
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={contact.mailSubject}
                className={field}
              />
            </Row>
            <label htmlFor={messageId} className="sr-only">
              {contact.message}
            </label>
            <textarea
              id={messageId}
              rows={8}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`${contact.mailBody} …`}
              className={`${field} block min-h-[12rem] resize-y border-b-2 border-accent-2 lg:min-h-[16rem]`}
            />
            <button
              type="submit"
              className="flex w-full flex-col items-center gap-1 bg-accent px-4 py-5 text-bg transition-colors hover:bg-hi focus-visible:outline-offset-[-4px]"
            >
              <span className="text-base uppercase tracking-[0.2em] lg:text-lg">
                ▸ {contact.send}
              </span>
              <span className="text-2xs opacity-70">{contact.sendHint}</span>
            </button>
          </form>

          <ul>
            <LinkRow
              href={person.linkedin}
              icon="external"
              title="LinkedIn"
              sub={contact.linkedinHandle}
              external
            />
            <LinkRow
              href={person.github}
              icon="external"
              title="GitHub"
              sub={contact.githubHandle}
              external
            />
            <LinkRow
              href={person.cv}
              icon="download"
              title={t.profile.cvLabel}
              sub={contact.cvHint}
              download
            />
          </ul>
        </section>
      </div>
    </div>
  );
}
