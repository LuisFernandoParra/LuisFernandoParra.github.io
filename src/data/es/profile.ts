import { areaImages } from '@/data/shared';
import type { ProfileContent } from '@/types/content';

export const profile: ProfileContent = {
  heading: 'perfil/',
  intro:
    'Soy estudiante de Ingeniería en Diseño de Entretenimiento Digital con 1 año de experiencia laboral en marketing, especializado en Meta Ads, creación de contenido para ventas y edición de video: hago el guion, busco los materiales y edito imagen y voz, también con presentadores generados con IA. Soy hábil en investigación y en el uso combinado de herramientas de IA para potenciar la creación de contenido y automatizar procesos; monté en mi propio servidor un bot de WhatsApp que atiende a los clientes de mi tienda. Programo en C#, Python y JavaScript, y estoy aprendiendo C++. Tengo manejo alto de Linux, especialmente de Parrot OS. Tengo conocimientos de UI y UX, con enfoque en diseño de producto. Soy proactivo, trabajo bien en equipo y me resulta fácil mediar y encontrar soluciones. Estoy en constante aprendizaje y desarrollo de nuevas habilidades.',
  timelineHeading: 'Formación y trabajo',
  timeline: [
    {
      place: 'UPB (Medellín)',
      detail: 'Ingeniería en Diseño de Entretenimiento Digital',
      since: 'desde 2023',
    },
    { place: 'Corpore', detail: 'Asesor de Marketing y redes', since: 'desde 2025' },
  ],
  areasHeading: 'Áreas',
  viewProject: 'Ver proyecto',
  areas: [
    {
      id: 'diseno',
      title: 'Diseño UI/UX y experiencias interactivas',
      tools: ['Figma', 'Claude Design', 'Three.js'],
      description:
        'Diseño productos e interfaces con enfoque en UI y UX, partiendo del problema y del usuario, como en NOSTA. También creo experiencias web interactivas, como El Retornante, donde el usuario explora y descubre la información por sí mismo.',
      portrait: {
        src: areaImages.diseno,
        alt: 'Retrato de Fercho con boina y pañuelo, un pincel en alto y un cuaderno de wireframes con muestras de color.',
      },
      projects: ['nosta', 'retornante'],
    },
    {
      id: 'contenido',
      title: 'Marketing y creación de contenido',
      tools: ['Meta Ads', 'CapCut', 'After Effects', 'DaVinci Resolve', 'Canva'],
      description:
        'Creo contenido que vende. Llevo 8 meses editando reels cortos para productos físicos, con integración de IA, y mis cuatro piezas destacadas suman 67.900 reproducciones. Además, trabajé un año en Corpore como asesor de Marketing y redes: creé y supervisé contenido y asesoré campañas virtuales.',
      portrait: {
        src: areaImages.edicion,
        alt: 'Retrato de Fercho vestido de director, con boina, claqueta, megáfono y pantallas de edición.',
      },
      projects: ['edicion-video'],
    },
    {
      id: 'programacion',
      title: 'Programación',
      tools: [
        'C#',
        'Python',
        'JavaScript',
        'HTML y CSS',
        'Three.js',
        'Linux (Parrot OS)',
        'GitHub',
      ],
      description:
        'Programo en C#, Python y JavaScript, y para la web uso HTML, CSS y Three.js. Estoy aprendiendo C++. Tengo manejo alto de Linux, especialmente de Parrot OS. Uso GitHub para mis proyectos.',
      portrait: {
        src: areaImages.programacion,
        alt: 'Retrato de Fercho como hacker, con sudadera, tres pantallas de código, una taza de café y un pingüino de peluche.',
      },
      projects: ['retornante', 'bot-whatsapp', 'dtmf'],
    },
  ],
  cvLabel: 'Descargar CV (PDF)',
};
