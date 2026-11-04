import { useState } from 'react';
import { DevPlaceholder } from '@/components/atoms/DevPlaceholder';
import { Icon } from '@/components/atoms/Icon';
import { useLocale } from '@/hooks/useLocale';
import type { VideoItem } from '@/types/content';

interface VideoEmbedProps {
  video: VideoItem;
}

/**
 * Fachada ligera de YouTube: muestra una imagen y solo carga el reproductor
 * (youtube-nocookie.com) dentro de la página cuando se hace clic.
 * Con `enabled: false` no se renderiza.
 */
export function VideoEmbed({ video }: VideoEmbedProps) {
  const { t } = useLocale();
  const [playing, setPlaying] = useState(false);

  if (!video.enabled) {
    return <DevPlaceholder label={t.ui.devPending}>{video.pendingNote}</DevPlaceholder>;
  }

  const poster = video.poster ?? `https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`;
  const frame = video.vertical ? 'aspect-[9/16]' : 'aspect-video';

  return (
    <div className={`relative w-full overflow-hidden border border-line bg-bg ${frame}`}>
      {playing ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
          title={video.title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={t.ui.project.playVideo(video.title)}
          className="group absolute inset-0 h-full w-full"
        >
          <img
            src={poster}
            alt=""
            loading="lazy"
            decoding="async"
            className={`h-full w-full object-cover opacity-70 transition-opacity group-hover:opacity-90 ${video.vertical ? 'object-top' : ''}`}
          />
          <span className="absolute inset-0 grid place-items-center">
            <span className="grid size-16 place-items-center border border-accent bg-bg/80 text-accent transition-colors group-hover:bg-accent group-hover:text-bg">
              <Icon name="play" size={22} />
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
