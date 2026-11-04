// Traducción pendiente de revisión.
import { areaImages } from '@/data/shared';
import type { ProfileContent } from '@/types/content';

export const profile: ProfileContent = {
  heading: 'profile/',
  intro:
    "I'm a Digital Entertainment Design Engineering student with 1 year of work experience in marketing, specialized in Meta Ads, sales content creation and video editing: I write the script, find the materials and edit image and voice, also with AI-generated presenters. I'm skilled at research and at combining AI tools to boost content creation and automate processes; I set up on my own server a WhatsApp bot that serves my store's customers. I code in C#, Python and JavaScript, and I'm learning C++. I have advanced Linux skills, especially with Parrot OS. I have UI and UX knowledge, with a focus on product design. I'm proactive, I work well in teams and I find it easy to mediate and find solutions. I'm constantly learning and developing new skills.",
  timelineHeading: 'Education and work',
  timeline: [
    {
      place: 'UPB (Medellín)',
      detail: 'Digital Entertainment Design Engineering',
      since: 'since 2023',
    },
    { place: 'Corpore', detail: 'Marketing and Social Media Advisor', since: 'since 2025' },
  ],
  areasHeading: 'Areas',
  viewProject: 'View project',
  areas: [
    {
      id: 'diseno',
      title: 'UI/UX design and interactive experiences',
      tools: ['Figma', 'Claude Design', 'Three.js'],
      description:
        'I design products and interfaces with a UI and UX focus, starting from the problem and the user, as in NOSTA. I also create interactive web experiences, such as El Retornante, where users explore and discover the information on their own.',
      portrait: {
        src: areaImages.diseno,
        alt: 'Portrait of Fercho in a beret and scarf, holding up a brush and a wireframe sketchbook with color swatches.',
      },
      projects: ['nosta', 'retornante'],
    },
    {
      id: 'contenido',
      title: 'Marketing and content creation',
      tools: ['Meta Ads', 'CapCut', 'After Effects', 'DaVinci Resolve', 'Canva'],
      description:
        'I create content that sells. I have spent 8 months editing short reels for physical products, with AI integration, and my four featured pieces add up to 67,900 views. I also worked for a year at Corpore as Marketing and Social Media Advisor, creating and supervising content and advising on online campaigns.',
      portrait: {
        src: areaImages.edicion,
        alt: 'Portrait of Fercho dressed as a director, with a beret, clapperboard, megaphone and editing screens.',
      },
      projects: ['edicion-video'],
    },
    {
      id: 'programacion',
      title: 'Programming',
      tools: [
        'C#',
        'Python',
        'JavaScript',
        'HTML and CSS',
        'Three.js',
        'Linux (Parrot OS)',
        'GitHub',
      ],
      description:
        "I code in C#, Python and JavaScript, and for the web I use HTML, CSS and Three.js. I'm learning C++. I have advanced Linux skills, especially with Parrot OS. I use GitHub for my projects.",
      portrait: {
        src: areaImages.programacion,
        alt: 'Portrait of Fercho as a hacker, in a hoodie, with three code screens, a coffee mug and a stuffed penguin.',
      },
      projects: ['retornante', 'bot-whatsapp', 'dtmf'],
    },
  ],
  cvLabel: 'Download CV (PDF)',
};
