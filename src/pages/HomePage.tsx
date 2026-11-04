import { DesktopTemplate } from '@/components/templates/DesktopTemplate';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { useSystem } from '@/hooks/useSystem';
import { useWindowManager } from '@/hooks/useWindowManager';
import { windowPath } from '@/lib/routes';

export default function HomePage() {
  const { t, locale } = useSystem();
  const { focused } = useWindowManager();
  const meta = focused ? t.seo[focused] : t.seo.home;

  useDocumentMeta({ ...meta, path: focused ? windowPath[focused] : '/', locale });

  return <DesktopTemplate />;
}
