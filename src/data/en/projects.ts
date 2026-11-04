// Traducción pendiente de revisión.
import { links, person, projectImages as img, youtube } from '@/data/shared';
import type { Project } from '@/types/content';

export const projects: Project[] = [
  {
    slug: 'dtmf',
    title: 'DtMF',
    summary: 'It simulates a concert inspired by Debí tirar más fotos.',
    type: 'Personal project, made jointly',
    role: 'Ideation, planning and execution',
    period: 'September–October 2025',
    tools: ['Node.js', 'Express', 'Socket.IO', 'p5.js'],
    links: [
      {
        label: 'Video on YouTube',
        href: `https://www.youtube.com/watch?v=${youtube.dtmf}`,
        enabled: true,
      },
      {
        label: 'Second video',
        href: `https://www.youtube.com/watch?v=${youtube.dtmfSecond}`,
        enabled: false,
      },
      { label: 'Repository', href: links.dtmfRepo, enabled: false },
    ],
    paragraphs: [
      'At a concert there are different moments and stages that one person is in charge of running; the idea was to create an interactive experience where the audience could take part with something as simple as what we all have at hand: their mobile phone.',
    ],
    cover: { src: img.dtmf.solVsLuna, alt: 'The Sol vs Luna scene of DtMF on the big screen.' },
    video: { youtubeId: youtube.dtmf, title: 'DtMF', enabled: true },
    figures: [
      {
        src: img.dtmf.solVsLuna,
        text: 'The concert is run from a control panel with the scenes in order: intro, fireworks, photo and finale. In the first one, part of the audience taps SUN to raise the orange tones and the other taps MOON to take the sky to purple tones, and every tap changes the visualizer on the big screen.',
        alt: 'The Sol vs Luna scene on the big screen.',
        caption: 'Sol vs Luna scene',
      },
      {
        src: img.dtmf.petardos,
        text: 'When the shots in the song hit, the screen asks everyone to raise their phones. Every strong shake fires digital fireworks on the visualizer, and in the same scene the audience can send selfies that appear live.',
        alt: 'Fireworks on the big screen when the phones are shaken.',
        caption: 'Launch the firecrackers!',
      },
      {
        src: img.dtmf.fotoTribu,
        text: 'The photo is enabled from the panel and everyone gets the prompt on their phone: "Smile and stay ready!" The big screen brings the audience together for the final shot.',
        alt: 'Group photo taken with the webcam and shown on the big screen.',
        caption: 'Group photo',
      },
      {
        src: img.dtmf.maracaStickers,
        text: 'The phone becomes a maraca: shaking it when the chorus plays, every movement lights up the group photo. You can also drag a sticker into the frame, like the palm tree that appears on the big screen.',
        alt: 'Maracas and palm tree stickers on the selfies.',
        caption: 'Maracas and palm tree stickers',
      },
    ],
  },
  {
    slug: 'nosta',
    title: 'NOSTA',
    summary:
      'A smart toaster for 2026: you choose how you want your toast and NOSTA adapts the process to the bread you put in.',
    type: 'University project (UI/UX course)',
    role: 'UI/UX Designer',
    period: 'September 2026',
    tools: ['Figma', 'Claude Design'],
    links: [
      {
        label: 'Video of the working page',
        href: `https://www.youtube.com/watch?v=${youtube.nosta}`,
        enabled: true,
      },
      { label: 'Published prototype', href: links.nostaPrototype, enabled: false },
    ],
    paragraphs: [
      'NOSTA brings a 1960s object, an automatic toaster, into the present and reinvents it for 2026. After the wireframe and the structure, I took it to an interactive website that walks through the problem, the user, the product and a simulation you can try.',
    ],
    cover: { src: img.nosta.portada, alt: 'NOSTA landing section: a toaster with a touchscreen.' },
    video: { youtubeId: youtube.nosta, title: 'NOSTA', enabled: true, poster: img.nosta.portada },
    figures: [
      {
        src: img.nosta.tradicional,
        text: 'Toasters have automated heat for decades, but they still rely on a general setting: the same number on the dial gives different results depending on the size, thickness, shape, color or type of bread. NOSTA changes the question: you no longer control the process, you define the result.',
        alt: 'Comparison between a traditional toaster and NOSTA.',
        caption: 'From controlling the process to defining the result',
      },
      {
        src: img.nosta.usuario,
        text: 'I designed it for adults aged 25 to 45 with busy routines, who know how they like their toast but do not want to watch over it. Their pain points guided every decision: inconsistent results, too much attention and little information when something goes wrong.',
        alt: 'User profile, pain points and what they value.',
        caption: 'The user',
      },
      {
        src: img.nosta.funciona,
        text: 'The flow has six steps: detect, choose, adapt, toast, remember and resolve. On the website you can try the screen: put the bread in, choose the mode, watch it toast and even trigger an unrecognized food or a jam to see how it responds.',
        alt: 'The six NOSTA steps and the screen simulation.',
        caption: 'How it works and simulation',
      },
      {
        src: img.nosta.pantalla,
        text: 'A simple, clear interface in dark glass, flush with the body. It shows the toast mode (four results, nothing more), automatic bread detection and, in real time, what NOSTA is doing and how long is left.',
        alt: 'Touchscreen with toast mode, detection and time left.',
        caption: 'Intuitive screen',
      },
      {
        src: img.nosta.adaptativo,
        text: 'Ask for golden and you get golden, whatever the bread. Behind the glass, NOSTA follows a different path for each one: shorter for white bread, a gentler start for sourdough, watched closely for whole wheat and more time for a bagel.',
        alt: 'The same golden result with a different process for each bread.',
        caption: 'Adaptive toasting',
      },
      {
        src: img.nosta.app,
        text: 'The toaster handles the moment and the app remembers what you like: preferences, history, notifications, device settings, maintenance and help. It is optional: NOSTA works fully without it.',
        alt: 'The NOSTA app on a phone.',
        caption: 'The app',
      },
      {
        src: img.nosta.hardware,
        text: 'Familiar shape, contemporary build: food detection, touchscreen, physical lever, adaptive toasting, two wide slots and a premium build.',
        alt: 'Hardware view with its parts labeled.',
        caption: 'Hardware',
      },
    ],
  },
  {
    slug: 'edicion-video',
    title: 'Video editing',
    summary:
      'Video content for my own business, published on Instagram: reels and posts with between 3,000 and 18,000 views.',
    type: 'Personal project',
    role: 'Script, material research, video and voice editing',
    period: '1 year, ongoing',
    tools: ['CapCut', 'Gemini Omni Flash'],
    links: [{ label: 'Instagram', href: person.instagram, enabled: true }],
    paragraphs: [
      'I handle the whole process: script, material research, video and voice editing. All four featured pieces exceed 16,000 views, for a total of 67,900.',
    ],
    cover: { src: img.edicion.esqueleto, alt: 'Frame from a Fortnite reel with a skeleton.' },
    figures: [
      {
        src: img.edicion.roblox,
        text: 'It does not sell head-on: the reel gives Roblox players useful tips and earns their trust before showing them the store. 17,200 views.',
        caption: 'Value content',
        alt: 'Frame from a Roblox reel.',
        views: 17200,
        href: 'https://www.instagram.com/reel/DbWUc75Meue/',
      },
      {
        src: img.edicion.moneda,
        text: 'It opens with “Your favorite skins shouldn’t cost that much”, something players already think, and presents the store as the way to stop overpaying. 16,500 views.',
        caption: 'Hitting the price pain point',
        alt: 'Frame from a reel with a coin.',
        views: 16500,
        href: 'https://www.instagram.com/reel/DY1PUxLMLny/',
      },
      {
        src: img.edicion.esqueleto,
        text: 'Four packs for the price one used to cost, and a clear limit: “get yours before the promo ends”. 16,200 views.',
        caption: 'Urgency offer',
        alt: 'Frame from a Fortnite reel with a skeleton.',
        views: 16200,
        href: 'https://www.instagram.com/reel/DaJoDDGMPlx/',
      },
      {
        src: img.edicion.club,
        text: 'It speaks to people who already want to buy the Fortnite Club but hesitate over the price, and gives them the reason to buy here: “Don’t overpay”. 18,000 views.',
        caption: 'Handling the objection',
        alt: 'Frame from the Fortnite Club reel: a character in a blue hood on a wall.',
        views: 18000,
        href: 'https://www.instagram.com/reel/DaJo9yCMHmQ/',
      },
    ],
    extraVideo: {
      youtubeId: youtube.presenter,
      title: 'A video with an artificial person',
      enabled: true,
      vertical: true,
      label: 'A video with an artificial person',
      text: 'The person and the setting in this video are artificial, created 100% by me, and they are almost impossible to tell apart from real ones. With this technique I make podcast-style videos, talking to the camera, showing a product or walking, and I choose the accent, the setting and the person each brand needs.',
    },
  },
  {
    slug: 'bot-whatsapp',
    title: 'WhatsApp bot',
    summary:
      'Running on my own server since June 2026, the bot serves real customers of my store on WhatsApp.',
    type: 'Personal project, in production with real customers',
    role: 'Full design and setup: the n8n workflow and the server connections',
    period: 'June 2026 – present',
    tools: ['n8n', 'OpenAI', 'Chatwoot', 'WhatsApp Business API'],
    links: [],
    paragraphs: [
      'The bot follows the conversation from the moment the customer asks about a skin until they send the payment receipt. When it goes silent, it alerts me so I can reply myself.',
    ],
    list: [
      'recognizes a product from an image',
      'checks stock and calculates the price',
      'understands text, images and voice notes',
      'remembers the conversation',
      'alerts me when a person needs to step in',
    ],
    cover: {
      src: img.bot.skin,
      alt: 'Chat where the bot identifies a skin and replies with the price.',
    },
    video: {
      youtubeId: youtube.botDemo,
      title: 'WhatsApp bot',
      enabled: true,
      vertical: true,
      poster: img.bot.audio,
    },
    figures: [
      {
        src: img.bot.skin,
        text: 'If the customer sends a screenshot of a skin, the bot identifies it, checks whether it is in stock and replies with the price.',
        alt: 'Chat where the bot identifies the Alastor skin and replies with the price.',
        caption: 'Skin identified',
      },
      {
        src: img.bot.audio,
        text: 'It understands voice notes and remembers the conversation. Here the customer asks by voice about a skin that is not in the store, the bot says so and, when they decide to take the bundle, explains how to pay.',
        alt: 'Chat with a voice note, the stock check and the payment instructions.',
        caption: 'Voice note, stock and payment instructions',
      },
      {
        src: img.bot.chatwoot,
        text: 'When the customer pays, the bot reads the receipt, compares it with the quoted price and leaves me a private note in Chatwoot so I can verify it.',
        alt: 'Private note in Chatwoot: receipt received, verify amount.',
        caption: 'Private note in Chatwoot',
      },
    ],
  },
  {
    slug: 'retornante',
    title: 'El Retornante',
    summary:
      'An original story of mine turned into an interactive web infographic, with many different ways to visualize its data.',
    type: 'Personal project',
    role: 'Story, data visualization and web development',
    period: 'November 2026',
    tools: ['Three.js', 'JavaScript', 'HTML and CSS'],
    links: [{ label: 'View the site', href: links.retornanteSite, enabled: true }],
    paragraphs: [
      'El Retornante is an original story of mine turned into an interactive web infographic: Fer finds a photo from his friend Santiago’s birthday, travels back to that day and, when he returns, discovers he changed his present. The site is not read, it is explored: the camera from the story is the way in, and inside it are the charts that visualize its data.',
    ],
    cover: {
      src: img.retornante.portada,
      alt: 'Entrance of the site: the El Retornante camera in 3D on a cream background.',
    },
    figures: [
      {
        src: img.retornante.portada,
        text: 'Everything starts in black, with a “Smile and click”. A camera flash reveals the camera, found during an excavation in Colombia. You can spin it by dragging and look at it from any angle.',
        alt: 'The El Retornante camera assembled, in 3D, on a cream background.',
        caption: 'The assembled camera',
      },
      {
        src: img.retornante.transparente,
        text: 'With a slider, the casing turns transparent and reveals what the camera carries inside: the time module and the film roll.',
        alt: 'The camera with a see-through casing, showing the module and the film roll.',
        caption: 'Looking through the casing',
      },
      {
        src: img.retornante.despiece,
        text: 'Drag it upward and the camera opens into an exploded view, with every part floating: casing, lens, time module, film roll and base. The “Assemble the camera” button puts it back together.',
        alt: 'The camera opened in an exploded view: casing, lens, time module, film roll and base.',
        caption: 'Opening the camera',
      },
      {
        src: img.retornante.modulo,
        text: 'Touch a part and the camera moves in, the part spins in the center and a panel explains what it does. The time module, for example, is the one that connects the image with the captured moment.',
        alt: 'The time module up close, with its information panel.',
        caption: 'Touching each part',
      },
      {
        src: img.retornante.lente,
        text: 'On the lens, a button sends a sheet of light across it that cuts it in half and reveals its mechanism. The same button closes it again.',
        alt: 'The lens cut in half, showing its inner mechanism.',
        caption: 'Seeing inside the lens',
      },
      {
        src: img.retornante.rollo,
        text: 'The film roll keeps the secret: touch it and pull the film, and a strip of frames comes out, each one with a chart. Tap a frame and the chart opens full screen; “Collect film” winds it back.',
        alt: 'The film comes out of the roll as a strip with a chart in each frame.',
        caption: 'Pulling the film',
      },
      {
        src: img.retornante.domino,
        alt: 'Row of 3D dominoes with a tile telling an event from the story.',
        caption: 'What falls next',
      },
      {
        src: img.retornante.desaparecidas,
        alt: 'Chart comparing 132,877 missing people with 160 found.',
        caption: 'Missing vs. found',
      },
      {
        src: img.retornante.conavi,
        alt: 'Map of Colombia by department with Conavi branches.',
        caption: 'Conavi’s presence',
      },
      {
        src: img.retornante.rollos,
        alt: 'Line of film rolls developed per year since 2000 with a film strip.',
        caption: 'Rolls developed per year',
      },
      {
        src: img.retornante.silencio,
        alt: 'Ring with the share of children showing signs for a mental health assessment.',
        caption: 'Behind the silence',
      },
      {
        src: img.retornante.ramas,
        alt: 'Fer’s timeline starting on the day he was born.',
        caption: 'Fer’s time branches',
      },
    ],
  },
];
