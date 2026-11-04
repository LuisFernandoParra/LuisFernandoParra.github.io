import { useCallback, useEffect, useState } from 'react';

export function useFullscreen() {
  const supported = typeof document !== 'undefined' && document.fullscreenEnabled === true;
  const [active, setActive] = useState(false);

  useEffect(() => {
    const onChange = () => setActive(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const toggle = useCallback(() => {
    if (!supported) return;
    const request = document.fullscreenElement
      ? document.exitFullscreen()
      : document.documentElement.requestFullscreen();
    request.catch(() => undefined);
  }, [supported]);

  return { supported, active, toggle };
}
