import { useEffect, useState } from 'react';
import { Eyebrow } from '@/components/atoms/Eyebrow';
import { Reveal } from '@/components/atoms/Reveal';
import { Tag } from '@/components/atoms/Tag';
import { TypeText } from '@/components/atoms/TypeText';
import {
  AiProcessIllustration,
  type IllustrationStage,
} from '@/components/organisms/AiProcessIllustration';
import { useInViewReveal } from '@/hooks/useInViewReveal';
import { useSystem } from '@/hooks/useSystem';
import type { AiStep } from '@/types/content';

const TYPE_MS = 45;
const DECIDE_DELAY = 900;

function StepIndicator({
  current,
  total,
  label,
}: {
  current: number;
  total: number;
  label: string;
}) {
  return (
    <p
      className="flex items-center gap-2 text-2xs text-dim"
      aria-label={`${label} ${current}/${total}`}
    >
      <span aria-hidden="true">{label}</span>
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={`inline-block size-2 border border-accent-2 ${i < current ? 'bg-accent-2' : ''}`}
        />
      ))}
    </p>
  );
}

/** Panel de los pasos 01 y 02: se dibuja al entrar en pantalla. */
function ScenePanel({ stage }: { stage: IllustrationStage }) {
  const { t, reducedMotion } = useSystem();
  const { illustration } = t.ai;
  const { ref, inView } = useInViewReveal<HTMLDivElement>('0px 0px -20% 0px');
  return (
    <div ref={ref}>
      <AiProcessIllustration
        stage={stage}
        playing={reducedMotion || inView}
        labels={illustration.labels}
        description={illustration.descriptions[stage]}
      />
    </div>
  );
}

/**
 * Panel del paso 03: al entrar en pantalla se teclea `revisar --resultados`, espera la
 * respuesta y pasa de "esperando" a "decidido".
 */
function ReviewPanel() {
  const { t, reducedMotion } = useSystem();
  const { illustration } = t.ai;
  const command = illustration.labels.command;
  const { ref, inView } = useInViewReveal<HTMLDivElement>('0px 0px -25% 0px');
  const [typed, setTyped] = useState(0);
  const [decided, setDecided] = useState(false);
  const stage: IllustrationStage = reducedMotion || decided ? 'decided' : 'waiting';

  useEffect(() => {
    if (!inView || reducedMotion || decided) return;
    if (typed < command.length) {
      const id = window.setTimeout(() => setTyped((n) => n + 1), TYPE_MS);
      return () => window.clearTimeout(id);
    }
    const id = window.setTimeout(() => setDecided(true), DECIDE_DELAY);
    return () => window.clearTimeout(id);
  }, [inView, reducedMotion, decided, typed, command.length]);

  return (
    <div ref={ref}>
      <AiProcessIllustration
        stage={stage}
        playing={reducedMotion || inView}
        typed={reducedMotion ? command.length : typed}
        labels={illustration.labels}
        description={illustration.descriptions[stage]}
      />
      <p className="mt-2 text-right text-2xs text-dim" aria-live="polite">
        {stage === 'decided' ? illustration.stateDecided : illustration.stateWaiting}
      </p>
    </div>
  );
}

function Step({ step, index, total }: { step: AiStep; index: number; total: number }) {
  const { t } = useSystem();
  const { illustration } = t.ai;
  const stage: IllustrationStage = index === 0 ? 'plan' : 'produce';

  return (
    <li className="grid gap-10 border-t border-line py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:items-center lg:gap-16 xl:gap-24">
      <div className="flex flex-col gap-3">
        <Reveal as="span" className="text-xs text-accent-2">
          {step.number}
        </Reveal>
        <TypeText
          as="h4"
          text={step.title}
          speed={40}
          className="font-display text-4xl leading-none text-accent sm:text-5xl xl:text-6xl"
        />
        <Reveal
          as="p"
          delay={250}
          className="text-base leading-8 text-dim lg:text-lg lg:leading-9 xl:text-xl xl:leading-10"
        >
          {step.body}
        </Reveal>
        {step.tags.length > 0 && (
          <ul className="flex flex-wrap gap-1.5 pt-1">
            {step.tags.map((tag, i) => (
              <li key={tag}>
                <Tag typed delay={500 + i * 140}>
                  {tag}
                </Tag>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Reveal className="border border-line bg-bg p-3">
        <StepIndicator current={index + 1} total={total} label={illustration.stepIndicator} />
        <div className="mt-2">
          {index === total - 1 ? <ReviewPanel /> : <ScenePanel stage={stage} />}
        </div>
      </Reveal>
    </li>
  );
}

/** Sección "Cómo trabajo con IA": titular, tres pasos con etiquetas y un panel animado por paso. */
export function AiSection() {
  const { t } = useSystem();
  const { ai } = t;
  return (
    <section aria-labelledby="ai-heading" className="flex flex-col gap-4">
      <Eyebrow>{ai.eyebrow}</Eyebrow>
      <TypeText
        as="h3"
        id="ai-heading"
        text={ai.headline}
        speed={45}
        className="font-display text-5xl leading-[0.95] text-accent sm:text-6xl xl:text-8xl"
      />
      <ol className="mt-4">
        {ai.steps.map((step, i) => (
          <Step key={step.number} step={step} index={i} total={ai.steps.length} />
        ))}
      </ol>
    </section>
  );
}
