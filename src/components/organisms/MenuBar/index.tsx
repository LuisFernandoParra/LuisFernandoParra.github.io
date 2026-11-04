import { Link } from 'react-router-dom';
import { Clock } from '@/components/molecules/Clock';
import { MenuDropdown } from '@/components/molecules/MenuDropdown';
import { MenuItem } from '@/components/molecules/MenuItem';
import { person } from '@/data/shared';
import { useFullscreen } from '@/hooks/useFullscreen';
import { useSystem } from '@/hooks/useSystem';
import { useWindowManager } from '@/hooks/useWindowManager';
import { windowIds } from '@/lib/routes';
import type { Locale } from '@/types/content';

const Separator = () => <div role="separator" className="my-1 border-t border-line" />;

export function MenuBar() {
  const { t, locale, setLocale, crt, toggleCrt, muted, toggleMute, setOverlay, reducedMotion } =
    useSystem();
  const { open } = useWindowManager();
  const fullscreen = useFullscreen();
  const m = t.ui.menu;

  const fullscreenLabel = !fullscreen.supported
    ? m.fullscreenUnavailable
    : fullscreen.active
      ? m.exitFullscreen
      : m.fullscreen;

  return (
    <header className="relative z-[60] flex h-10 items-stretch border-b border-line bg-bg">
      <Link
        to="/"
        className="flex items-center border-r border-line px-3 font-display text-2xl leading-none text-accent no-underline"
        aria-label={`Ferchux — ${t.ui.breadcrumbRoot}`}
      >
        Fx
      </Link>
      <nav className="flex items-stretch" aria-label="Ferchux">
        <MenuDropdown label={m.file}>
          {() => (
            <>
              {windowIds.map((id, i) => (
                <MenuItem key={id} onSelect={() => open(id)} hint={String(i + 1)}>
                  {m.openWindow(t.ui.windows[id])}
                </MenuItem>
              ))}
              <Separator />
              <MenuItem onSelect={() => window.open(person.cv, '_blank', 'noopener')}>
                {m.printCv}
              </MenuItem>
              <a
                role="menuitem"
                href={person.cv}
                download
                className="block px-4 py-2 text-sm text-hi no-underline hover:bg-line focus-visible:bg-line focus-visible:outline-none"
              >
                {m.downloadCv}
              </a>
              <Separator />
              <MenuItem onSelect={() => setOverlay('about')}>{m.about}</MenuItem>
            </>
          )}
        </MenuDropdown>
        <MenuDropdown label={m.system}>
          {() => (
            <>
              <MenuItem onSelect={fullscreen.toggle} disabled={!fullscreen.supported}>
                {fullscreenLabel}
              </MenuItem>
              <MenuItem onSelect={toggleCrt} disabled={reducedMotion}>
                {crt ? m.crtOff : m.crtOn}
              </MenuItem>
              <MenuItem onSelect={toggleMute}>{muted ? m.unmute : m.mute}</MenuItem>
              <Separator />
              <MenuItem onSelect={() => setOverlay('palette')} hint="Ctrl K">
                {m.commandPalette}
              </MenuItem>
              <MenuItem onSelect={() => setOverlay('shortcuts')} hint="?">
                {m.shortcuts}
              </MenuItem>
            </>
          )}
        </MenuDropdown>
        <div className="flex items-center px-2" role="group" aria-label={m.language}>
          {(['es', 'en'] as Locale[]).map((code) => (
            <button
              key={code}
              type="button"
              lang={code}
              aria-pressed={locale === code}
              aria-label={`${m.switchTo} ${code === 'es' ? 'Español' : 'English'}`}
              onClick={() => setLocale(code)}
              className={`px-1.5 text-sm uppercase ${locale === code ? 'text-accent underline decoration-2 underline-offset-4' : 'text-dim hover:text-hi'}`}
            >
              {code}
            </button>
          ))}
        </div>
      </nav>
      <button
        type="button"
        onClick={() => open('contacto')}
        title={t.availability}
        className="ml-auto flex items-center gap-2 border-l border-line px-3 text-xs text-dim transition-colors hover:text-accent"
      >
        <span aria-hidden="true" className="size-1.5 animate-pulse rounded-full bg-accent" />
        <span className="hidden md:inline xl:hidden">{t.ui.desktop.locationShort}</span>
        <span className="hidden xl:inline">{t.availability}</span>
        <span className="sr-only md:hidden">{t.availability}</span>
      </button>
      <div className="hidden items-center border-l border-line px-3 sm:flex">
        <Clock locale={locale} />
      </div>
    </header>
  );
}
