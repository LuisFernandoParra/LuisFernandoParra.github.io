import { Modal } from '@/components/organisms/Modal';
import { useSystem } from '@/hooks/useSystem';

/** Ayuda de atajos de teclado y cuadro "Acerca de". */
export default function SystemDialogs() {
  const { t, overlay, setOverlay } = useSystem();
  const close = () => setOverlay(null);

  if (overlay === 'shortcuts') {
    const { title, items } = t.ui.shortcutsHelp;
    return (
      <Modal title={title} closeLabel={t.ui.close} onClose={close}>
        <dl className="flex flex-col p-4">
          {items.map(([keys, action]) => (
            <div
              key={keys}
              className="grid grid-cols-[8rem_1fr] gap-3 border-b border-line py-2 last:border-0"
            >
              <dt>
                <kbd className="border border-line bg-bg px-1.5 text-xs text-accent">{keys}</kbd>
              </dt>
              <dd className="text-sm text-hi">{action}</dd>
            </div>
          ))}
        </dl>
      </Modal>
    );
  }

  if (overlay === 'about') {
    const { title, lines } = t.ui.about;
    return (
      <Modal title={title} closeLabel={t.ui.close} onClose={close}>
        <div className="flex flex-col gap-2 p-6">
          <p className="font-display text-5xl leading-none text-accent">Ferchux</p>
          {lines.map((line) => (
            <p key={line} className="text-sm text-dim">
              {line}
            </p>
          ))}
        </div>
      </Modal>
    );
  }

  return null;
}
