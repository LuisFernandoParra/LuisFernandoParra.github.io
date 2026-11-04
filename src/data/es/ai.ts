import type { AiContent } from '@/types/content';

export const ai: AiContent = {
  eyebrow: 'Cómo trabajo con IA',
  headline: 'La IA acelera las cosas. Yo marco el rumbo.',
  steps: [
    {
      number: '01',
      title: 'Planeo yo, antes de abrir cualquier herramienta.',
      body: 'Cada pieza empieza con un plan mío: el objetivo, a quién le hablo y cómo debe verse y funcionar. Los wireframes, los storyboards, los guiones y la organización de la información los hago yo. La IA no arranca sin ese plan.',
      tags: ['Wireframes', 'Storyboard', 'Guion', 'Arquitectura de información'],
    },
    {
      number: '02',
      title: 'Uso la IA en tareas concretas.',
      body: 'La IA entra en pasos puntuales que yo defino: generar un presentador para un video, explorar una interfaz o entender un mensaje dentro de un flujo. La estructura, la edición y las decisiones de diseño siguen siendo mías, y elijo cada herramienta según lo que necesita la pieza.',
      tags: ['CapCut', 'Gemini Omni Flash', 'Figma', 'Claude Design', 'n8n', 'OpenAI'],
    },
    {
      number: '03',
      title: 'Le pongo límites y reviso todo.',
      body: 'En mi bot de WhatsApp, la IA entiende los mensajes y lee los comprobantes, pero no confirma pagos: me deja una nota para que yo lo verifique y me avisa cuando debe intervenir una persona. Con todo lo que hago es igual: reviso que el resultado sea coherente con el plan, lo corrijo o lo rehago, y nada sale sin mi aprobación.',
      tags: [],
    },
  ],
  illustration: {
    labels: {
      idea: 'idea',
      me: 'yo',
      video: 'video',
      design: 'diseño',
      process: 'proceso',
      aiProduces: 'la IA asiste',
      backToFix: 'vuelve a corrección',
      prompt: 'fercho@medellin:~$',
      command: 'revisar --resultados',
      question: '¿Continuar? [y/N]',
      answer: 'y',
      summary: '2 aprobados · 1 a corrección',
      callPlan: 'el plan es mío',
      callTasks: 'solo tareas concretas',
      callReview: 'nada sale sin mi ok',
    },
    descriptions: {
      plan: 'Planeo yo: con una idea, trazo un camino de cuatro pasos sobre una cuadrícula.',
      produce:
        'Uso la IA en tareas concretas: del cuarto paso salen tres resultados, un video, un diseño y un proceso.',
      waiting:
        'Reviso todo, esperando: los tres resultados atenuados con un signo de pregunta y la terminal pregunta si continuar.',
      decided:
        'Reviso todo, decidido: video y diseño aprobados; el proceso se rechaza y vuelve a corrección. 2 aprobados, 1 a corrección.',
    },
    stateWaiting: 'esperando',
    stateDecided: 'decidido',
    stepIndicator: 'Paso',
  },
};
