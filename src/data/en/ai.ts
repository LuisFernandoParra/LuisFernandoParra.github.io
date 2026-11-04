// Traducción pendiente de revisión.
import type { AiContent } from '@/types/content';

export const ai: AiContent = {
  eyebrow: 'How I work with AI',
  headline: 'AI speeds things up. I set the direction.',
  steps: [
    {
      number: '01',
      title: 'I plan first, before opening any tool.',
      body: 'Every piece starts with my own plan: the goal, who I am talking to and how it should look and work. I make the wireframes, storyboards, scripts and the organization of the information myself. AI does not start without that plan.',
      tags: ['Wireframes', 'Storyboard', 'Script', 'Information architecture'],
    },
    {
      number: '02',
      title: 'I use AI for specific tasks.',
      body: 'AI comes in at specific steps I define: generating a presenter for a video, exploring an interface or understanding a message inside a workflow. The structure, the editing and the design decisions are still mine, and I choose each tool based on what the piece needs.',
      tags: ['CapCut', 'Gemini Omni Flash', 'Figma', 'Claude Design', 'n8n', 'OpenAI'],
    },
    {
      number: '03',
      title: 'I set limits and review everything.',
      body: 'In my WhatsApp bot, AI understands messages and reads payment receipts, but it does not confirm payments: it leaves me a note to verify and alerts me when a person needs to step in. Everything I make works the same way: I check that the result fits the plan, I fix it or redo it, and nothing goes out without my approval.',
      tags: [],
    },
  ],
  illustration: {
    labels: {
      idea: 'idea',
      me: 'me',
      video: 'video',
      design: 'design',
      process: 'process',
      aiProduces: 'AI assists',
      backToFix: 'back to correction',
      prompt: 'fercho@medellin:~$',
      command: 'review --results',
      question: 'Continue? [y/N]',
      answer: 'y',
      summary: '2 approved · 1 to correction',
      callPlan: 'the plan is mine',
      callTasks: 'specific tasks only',
      callReview: 'nothing ships without my ok',
    },
    descriptions: {
      plan: 'I plan first: with an idea, I draw a four-step path on a grid.',
      produce:
        'I use AI for specific tasks: three results come out of the fourth step, a video, a design and a process.',
      waiting:
        'Review everything, waiting: the three results dimmed with a question mark while the terminal asks whether to continue.',
      decided:
        'Review everything, decided: video and design approved; the process is rejected and goes back to correction. 2 approved, 1 to correction.',
    },
    stateWaiting: 'waiting',
    stateDecided: 'decided',
    stepIndicator: 'Step',
  },
};
