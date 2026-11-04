import { links, person, projectImages as img, youtube } from '@/data/shared';
import type { Project } from '@/types/content';

export const projects: Project[] = [
  {
    slug: 'dtmf',
    title: 'DtMF',
    summary: 'Simula un concierto inspirado en Debí tirar más fotos.',
    type: 'Proyecto personal, en conjunto',
    role: 'Ideación, planeación y ejecución',
    period: 'Septiembre–octubre de 2025',
    tools: ['Node.js', 'Express', 'Socket.IO', 'p5.js'],
    links: [
      {
        label: 'Video en YouTube',
        href: `https://www.youtube.com/watch?v=${youtube.dtmf}`,
        enabled: true,
      },
      // [Confirmar] segundo video del mismo proyecto.
      {
        label: 'Segundo video',
        href: `https://www.youtube.com/watch?v=${youtube.dtmfSecond}`,
        enabled: false,
      },
      // [Confirmar] el repositorio incluye un mp3 con posibles derechos.
      { label: 'Repositorio', href: links.dtmfRepo, enabled: false },
    ],
    paragraphs: [
      'En un concierto hay distintos momentos y escenarios que una persona se encarga de manejar; la idea fue crear una experiencia interactiva donde el público pudiera hacer parte con algo tan sencillo que todos tenemos a la mano: su teléfono celular.',
    ],
    cover: { src: img.dtmf.solVsLuna, alt: 'Escena Sol vs Luna de DtMF en la pantalla grande.' },
    video: { youtubeId: youtube.dtmf, title: 'DtMF', enabled: true },
    figures: [
      {
        src: img.dtmf.solVsLuna,
        text: 'El concierto se maneja desde un panel de control con las escenas en orden: intro, fuegos, foto y final. En la primera, una parte del público toca SUN para subir los tonos naranja y la otra toca MOON para llevar el cielo a tonos púrpura, y cada toque cambia el visualizador de la pantalla grande.',
        alt: 'Escena Sol vs Luna en la pantalla grande.',
        caption: 'Escena Sol vs Luna',
      },
      {
        src: img.dtmf.petardos,
        text: 'Cuando caen los disparos de la canción, la pantalla pide levantar los móviles. Cada sacudida fuerte dispara fuegos digitales en el visualizador, y en la misma escena el público puede enviar selfies que aparecen en vivo.',
        alt: 'Fuegos artificiales en la pantalla grande al agitar los celulares.',
        caption: '¡Lanza los petardos!',
      },
      {
        src: img.dtmf.fotoTribu,
        text: 'Desde el panel se habilita la foto y todos reciben el aviso en su celular: «¡Sonríe y mantente listo!». La pantalla grande junta al público para la toma final.',
        alt: 'Foto de grupo tomada con la cámara web y mostrada en la pantalla grande.',
        caption: 'Foto de grupo',
      },
      {
        src: img.dtmf.maracaStickers,
        text: 'El celular se vuelve maraca: al agitarlo cuando suena el coro, cada movimiento enciende la foto de la tribu. También se puede arrastrar un sticker al marco, como la palmera que aparece en la pantalla grande.',
        alt: 'Maracas y stickers de palmeras sobre las selfies.',
        caption: 'Maracas y stickers de palmeras',
      },
    ],
  },
  {
    slug: 'nosta',
    title: 'NOSTA',
    summary:
      'Una tostadora inteligente para 2026: tú eliges cómo quieres tu tostada y NOSTA adapta el proceso al pan que pusiste.',
    type: 'Trabajo universitario (materia de UI/UX)',
    role: 'Diseñador UI/UX',
    period: 'Septiembre de 2026',
    tools: ['Figma', 'Claude Design'],
    links: [
      {
        label: 'Video de la página funcionando',
        href: `https://www.youtube.com/watch?v=${youtube.nosta}`,
        enabled: true,
      },
      // [Confirmar] si se enlaza el prototipo publicado.
      { label: 'Prototipo publicado', href: links.nostaPrototype, enabled: false },
    ],
    paragraphs: [
      'NOSTA trae al presente un objeto de los años 60, una tostadora automática, y lo reinventa para 2026. Tras el wireframe y la estructura, lo llevé a una página web interactiva que recorre el problema, el usuario, el producto y una simulación que se puede probar.',
    ],
    cover: {
      src: img.nosta.portada,
      alt: 'Portada de la página de NOSTA: una tostadora con pantalla táctil.',
    },
    video: { youtubeId: youtube.nosta, title: 'NOSTA', enabled: true, poster: img.nosta.portada },
    figures: [
      {
        src: img.nosta.tradicional,
        text: 'Las tostadoras llevan décadas automatizando el calor, pero siguen dependiendo de un ajuste general: el mismo número en la perilla da resultados distintos según el tamaño, el grosor, la forma, el color o el tipo de pan. NOSTA cambia la pregunta: ya no controlas el proceso, defines el resultado.',
        alt: 'Comparación entre una tostadora tradicional y NOSTA.',
        caption: 'De controlar el proceso a definir el resultado',
      },
      {
        src: img.nosta.usuario,
        text: 'Lo diseñé para adultos de 25 a 45 años con rutinas ocupadas, que saben cómo les gusta su tostada pero no quieren vigilarla. Sus puntos de dolor guiaron cada decisión: resultados inconsistentes, demasiada atención y poca información cuando algo sale mal.',
        alt: 'Perfil del usuario, puntos de dolor y lo que valora.',
        caption: 'El usuario',
      },
      {
        src: img.nosta.funciona,
        text: 'El flujo tiene seis pasos: detecta, elige, adapta, tuesta, recuerda y resuelve. En la página se puede probar la pantalla: introducir el pan, elegir el modo, ver el tostado y hasta provocar un alimento no reconocido o un atasco para ver cómo responde.',
        alt: 'Los seis pasos de NOSTA y la simulación de la pantalla.',
        caption: 'Cómo funciona y simulación',
      },
      {
        src: img.nosta.pantalla,
        text: 'Una interfaz simple y clara, de cristal oscuro y al ras del cuerpo. Muestra el modo de tostado (cuatro resultados, nada más), la detección automática del pan y en tiempo real qué está haciendo NOSTA y cuánto falta.',
        alt: 'Pantalla táctil con el modo de tostado, la detección y el tiempo restante.',
        caption: 'Pantalla intuitiva',
      },
      {
        src: img.nosta.adaptativo,
        text: 'Pides dorado y obtienes dorado, sea cual sea el pan. Detrás del cristal, NOSTA sigue un camino distinto para cada uno: más corto para el pan blanco, un inicio más suave para la masa madre, vigilado de cerca para el integral y más tiempo para el bagel.',
        alt: 'El mismo dorado con un proceso distinto para cada tipo de pan.',
        caption: 'Tostado adaptativo',
      },
      {
        src: img.nosta.app,
        text: 'La tostadora se encarga del momento y la app recuerda lo que te gusta: preferencias, historial, notificaciones, ajustes del dispositivo, mantenimiento y ayuda. Es opcional: NOSTA funciona completamente sin ella.',
        alt: 'La app de NOSTA en un teléfono.',
        caption: 'La app',
      },
      {
        src: img.nosta.hardware,
        text: 'Forma familiar, construcción contemporánea: detección de alimentos, pantalla táctil, palanca física, tostado adaptativo, dos ranuras anchas y una construcción premium.',
        alt: 'Vista del hardware con sus partes señaladas.',
        caption: 'Hardware',
      },
    ],
  },
  {
    slug: 'edicion-video',
    title: 'Edición de video',
    summary:
      'Contenido en video para mi propio negocio, publicado en Instagram: reels y publicaciones con entre 3.000 y 18.000 reproducciones.',
    type: 'Proyecto personal',
    role: 'Guion, búsqueda de materiales, edición de video y de voz',
    period: '1 año, en curso',
    tools: ['CapCut', 'Gemini Omni Flash'],
    links: [{ label: 'Instagram', href: person.instagram, enabled: true }],
    paragraphs: [
      'Me encargo de todo el proceso: guion, búsqueda de materiales, edición de video y de voz. Las cuatro piezas destacadas superan las 16.000 reproducciones y en total suman 67.900.',
    ],
    cover: { src: img.edicion.esqueleto, alt: 'Cuadro de un reel de Fortnite con un esqueleto.' },
    figures: [
      {
        src: img.edicion.roblox,
        text: 'No vende de frente: el reel da consejos útiles a jugadores de Roblox y se gana su confianza antes de mostrarles la tienda. 17.200 reproducciones.',
        caption: 'Contenido de valor',
        alt: 'Cuadro de un reel de Roblox.',
        views: 17200,
        href: 'https://www.instagram.com/reel/DbWUc75Meue/',
      },
      // Baja calidad: recorte de la cuadrícula. Reemplazar si aparece la original.
      {
        src: img.edicion.moneda,
        text: 'Abre con «Tus skins favoritas no deberían costar tanto», algo que el jugador ya piensa, y presenta la tienda como la forma de dejar de pagar de más. 16.500 reproducciones.',
        caption: 'Tocar el dolor del precio',
        alt: 'Cuadro de un reel con una moneda.',
        views: 16500,
        href: 'https://www.instagram.com/reel/DY1PUxLMLny/',
      },
      {
        src: img.edicion.esqueleto,
        text: 'Cuatro packs por el precio que antes costaba uno, y un límite claro: «asegura el tuyo antes de que se acabe la promo». 16.200 reproducciones.',
        caption: 'Oferta con urgencia',
        alt: 'Cuadro de un reel de Fortnite con un esqueleto.',
        views: 16200,
        href: 'https://www.instagram.com/reel/DaJoDDGMPlx/',
      },
      {
        src: img.edicion.club,
        text: 'Le habla a quien ya quiere comprar el Club de Fortnite pero duda por el precio, y le da la razón para hacerlo aquí: «No pagues de más». 18.000 reproducciones.',
        caption: 'Resolver la objeción',
        alt: 'Cuadro del reel del Club de Fortnite: un personaje de capucha azul sobre un muro.',
        views: 18000,
        href: 'https://www.instagram.com/reel/DaJo9yCMHmQ/',
      },
    ],
    extraVideo: {
      youtubeId: youtube.presenter,
      title: 'Video con una persona artificial',
      enabled: true,
      vertical: true,
      label: 'Video con una persona artificial',
      text: 'La persona y el entorno de este video son artificiales, creados 100 % por mí, y casi no se distinguen de los reales. Con esta técnica produzco videos tipo pódcast, hablando a la cámara, enseñando un producto o caminando, y elijo el acento, el lugar y la persona que cada marca necesite.',
    },
  },
  {
    slug: 'bot-whatsapp',
    title: 'Bot de WhatsApp',
    summary:
      'Montado en mi propio servidor desde junio de 2026, el bot atiende a clientes reales de mi tienda por WhatsApp.',
    type: 'Proyecto personal, en producción con clientes reales',
    role: 'Diseño y montaje completo: el flujo en n8n y las conexiones con el servidor',
    period: 'Junio de 2026 – actualidad',
    tools: ['n8n', 'OpenAI', 'Chatwoot', 'WhatsApp Business API'],
    links: [],
    paragraphs: [
      'El bot acompaña la conversación desde que el cliente pregunta por una skin hasta que envía el comprobante de pago. Cuando se queda en silencio, me avisa para que responda yo.',
    ],
    list: [
      'reconoce un producto a partir de una imagen',
      'revisa stock y calcula el precio',
      'entiende texto, imágenes y audios',
      'recuerda la conversación',
      'me avisa cuando debe intervenir una persona',
    ],
    cover: {
      src: img.bot.skin,
      alt: 'Chat donde el bot identifica una skin y responde con el precio.',
    },
    video: {
      youtubeId: youtube.botDemo,
      title: 'Bot de WhatsApp',
      enabled: true,
      vertical: true,
      poster: img.bot.audio,
    },
    figures: [
      {
        src: img.bot.skin,
        text: 'Si el cliente manda la captura de una skin, el bot la identifica, revisa si hay stock y responde con el precio.',
        alt: 'Chat donde el bot identifica la skin Alastor y responde con el precio.',
        caption: 'Skin identificada',
      },
      {
        src: img.bot.audio,
        text: 'Entiende audios y recuerda la conversación. Aquí el cliente pregunta por voz por una skin que no está en la tienda, el bot se lo dice y, cuando decide llevarse el lote, le explica cómo pagar.',
        alt: 'Chat con un audio, la revisión de stock y las instrucciones de pago.',
        caption: 'Audio, stock e instrucciones de pago',
      },
      {
        src: img.bot.chatwoot,
        text: 'Cuando el cliente paga, el bot lee el comprobante, lo compara con el precio cotizado y me deja una nota privada en Chatwoot para que yo lo verifique.',
        alt: 'Nota privada en Chatwoot: comprobante recibido, verificar monto.',
        caption: 'Nota privada en Chatwoot',
      },
    ],
  },
  {
    slug: 'retornante',
    title: 'El Retornante',
    summary:
      'Una historia original mía convertida en una infografía web interactiva, con muchas formas distintas de visualizar sus datos.',
    type: 'Proyecto personal',
    role: 'Historia, visualización de datos y desarrollo web',
    period: 'Noviembre de 2026',
    tools: ['Three.js', 'JavaScript', 'HTML y CSS'],
    links: [{ label: 'Ver la página', href: links.retornanteSite, enabled: true }],
    paragraphs: [
      'El Retornante es una historia original mía convertida en una infografía web interactiva: Fer encuentra una foto del cumpleaños de su amigo Santiago, viaja a ese día y, al volver, descubre que cambió su presente. La página no se lee, se recorre: la cámara de la historia es la puerta de entrada y dentro de ella están los gráficos que visualizan sus datos.',
    ],
    cover: {
      src: img.retornante.portada,
      alt: 'Entrada de la página: la cámara El Retornante en 3D sobre un fondo crema.',
    },
    figures: [
      {
        src: img.retornante.portada,
        text: 'Todo empieza en negro, con un «Sonríe y da click». El destello de un flash revela la cámara, encontrada en una excavación en Colombia. Puedes girarla arrastrando y verla desde cualquier ángulo.',
        alt: 'La cámara El Retornante armada, en 3D, sobre un fondo crema.',
        caption: 'La cámara armada',
      },
      {
        src: img.retornante.transparente,
        text: 'Con un deslizador, la carcasa se vuelve transparente y deja ver lo que la cámara lleva adentro: el módulo temporal y el rollo.',
        alt: 'La cámara con la carcasa transparente, dejando ver el módulo y el rollo.',
        caption: 'Mirar a través de la carcasa',
      },
      {
        src: img.retornante.despiece,
        text: 'Al arrastrarla hacia arriba, la cámara se abre en despiece y cada pieza queda flotando: carcasa, lente, módulo temporal, rollo y base. El botón «Armar la cámara» la vuelve a juntar.',
        alt: 'La cámara abierta en despiece: carcasa, lente, módulo temporal, rollo y base.',
        caption: 'Abrir la cámara',
      },
      {
        src: img.retornante.modulo,
        text: 'Al tocar una pieza, la cámara se acerca, la pieza gira en el centro y un panel cuenta qué hace. El módulo temporal, por ejemplo, es el que conecta la imagen con el momento capturado.',
        alt: 'El módulo temporal en primer plano, con su panel de información.',
        caption: 'Tocar cada pieza',
      },
      {
        src: img.retornante.lente,
        text: 'En el lente, un botón hace pasar una lámina de luz que lo corta por la mitad y deja ver su mecanismo. El mismo botón lo vuelve a cerrar.',
        alt: 'El lente cortado por la mitad, mostrando su mecanismo interno.',
        caption: 'Ver el lente por dentro',
      },
      {
        src: img.retornante.rollo,
        text: 'El rollo guarda el secreto: al tocarlo y tirar de la película sale una tira de fotogramas, cada uno con un gráfico. Tocas un fotograma y el gráfico se abre a pantalla completa; con «Recoger rollo» la película vuelve a su sitio.',
        alt: 'La película sale del rollo como una tira con un gráfico en cada fotograma.',
        caption: 'Tirar de la película',
      },
      {
        src: img.retornante.domino,
        alt: 'Fila de dominós en 3D con una ficha que cuenta un suceso de la historia.',
        caption: 'Lo que cae después',
      },
      {
        src: img.retornante.desaparecidas,
        alt: 'Gráfico que compara 132.877 personas desaparecidas con 160 encontradas.',
        caption: 'Desaparecidas vs. encontradas',
      },
      {
        src: img.retornante.conavi,
        alt: 'Mapa de Colombia por departamento con las agencias de Conavi.',
        caption: 'Presencia de Conavi',
      },
      {
        src: img.retornante.rollos,
        alt: 'Línea de rollos revelados por año desde 2000 con una tira de película.',
        caption: 'Rollos revelados por año',
      },
      {
        src: img.retornante.silencio,
        alt: 'Anillo con el porcentaje de niños con indicios para evaluación de salud mental.',
        caption: 'Detrás del silencio',
      },
      {
        src: img.retornante.ramas,
        alt: 'Línea de tiempo de Fer que empieza el día en que nació.',
        caption: 'Las ramas de tiempo de Fer',
      },
    ],
  },
];
