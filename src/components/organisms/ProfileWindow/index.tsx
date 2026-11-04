import { Eyebrow } from '@/components/atoms/Eyebrow';
import { Reveal } from '@/components/atoms/Reveal';
import { AiSection } from '@/components/organisms/AiSection';
import { AreaShowcase } from '@/components/organisms/AreaShowcase';
import { useSystem } from '@/hooks/useSystem';

export default function ProfileWindow() {
  const { t } = useSystem();
  const { profile } = t;

  return (
    <div className="flex flex-col gap-28 px-5 pb-28 sm:px-10 lg:px-16 2xl:px-24">
      {/* Presentación a la izquierda; formación, trabajo y CV a la derecha. */}
      <section className="grid gap-12 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-20 xl:gap-28">
        <Reveal
          as="p"
          delay={500}
          className="text-lg leading-9 text-hi sm:text-xl sm:leading-10 xl:text-2xl xl:leading-[2.75rem]"
        >
          {profile.intro}
        </Reveal>
        <Reveal delay={700} className="flex flex-col gap-8 lg:pt-2">
          <div>
            <Eyebrow>{profile.timelineHeading}</Eyebrow>
            <ul className="mt-5 flex flex-col border-t border-line">
              {profile.timeline.map((item) => (
                <li key={item.place} className="flex flex-col gap-1 border-b border-line py-5">
                  <span className="font-display text-3xl leading-none text-accent xl:text-4xl">
                    {item.place}
                  </span>
                  <span className="text-sm text-hi lg:text-base">{item.detail}</span>
                  <span className="text-xs uppercase tracking-widest text-dim">{item.since}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>

      <AreaShowcase
        heading={profile.areasHeading}
        areas={profile.areas}
        projects={t.projects}
        viewProject={profile.viewProject}
      />

      <AiSection />
    </div>
  );
}
