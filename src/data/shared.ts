// Datos que no cambian entre idiomas.

export const person = {
  name: 'Luis Fernando Parra',
  email: 'ferchopacas@gmail.com',
  github: 'https://github.com/LuisFernandoParra',
  linkedin: 'https://www.linkedin.com/in/luis-fernando-parra-castilla-a5b338424/',
  instagram: 'https://www.instagram.com/vcoinss/',
  cv: '/CV_Luis_Fernando_Parra_profesional.pdf',
  city: 'Medellín',
} as const;

export const siteUrl = (import.meta.env.VITE_SITE_URL ?? 'https://luisfernandoparra.github.io').replace(
  /\/$/,
  '',
);

/** Retrato de portada: foto real de Fercho, recortada y sin fondo (PNG transparente). */
export const heroPortrait = {
  src: '/images/hero/fercho.webp',
  transparent: true,
};

export const areaImages = {
  diseno: '/images/areas/area-diseno.webp',
  marketing: '/images/areas/area-marketing.webp',
  edicion: '/images/areas/area-edicion.webp',
  programacion: '/images/areas/area-programacion.webp',
} as const;

const p = (project: string, file: string) => `/images/projects/${project}/${file}.webp`;

export const projectImages = {
  dtmf: {
    solVsLuna: p('dtmf', 'fig02-sol-vs-luna'),
    petardos: p('dtmf', 'fig03-petardos'),
    fotoTribu: p('dtmf', 'fig04-foto-tribu'),
    maracaStickers: p('dtmf', 'fig05-maraca-stickers'),
  },
  nosta: {
    portada: p('nosta', 'portada'),
    tradicional: p('nosta', 'fig01-tradicional-vs-nosta'),
    usuario: p('nosta', 'fig02-usuario'),
    funciona: p('nosta', 'fig03-como-funciona'),
    pantalla: p('nosta', 'fig04-pantalla'),
    adaptativo: p('nosta', 'fig05-tostado-adaptativo'),
    app: p('nosta', 'fig06-app'),
    hardware: p('nosta', 'fig07-hardware'),
  },
  edicion: {
    roblox: p('edicion-video', 'fig03-roblox-17k2'),
    moneda: p('edicion-video', 'fig04-moneda-vcoinss-16k5-recorte'),
    esqueleto: p('edicion-video', 'fig05-fortnite-esqueleto-16k2'),
    club: p('edicion-video', 'fig06-club-fortnite-18k'),
  },
  retornante: {
    portada: p('retornante', 'portada'),
    transparente: p('retornante', 'fig01-carcasa-transparente'),
    despiece: p('retornante', 'fig02-despiece'),
    modulo: p('retornante', 'fig03-modulo-temporal'),
    lente: p('retornante', 'fig04-lente-por-dentro'),
    rollo: p('retornante', 'fig05-rollo-graficos'),
    domino: p('retornante', 'fig06-lo-que-cae-despues'),
    desaparecidas: p('retornante', 'fig07-desaparecidas-vs-encontradas'),
    conavi: p('retornante', 'fig08-conavi-mapa'),
    rollos: p('retornante', 'fig09-rollos-revelados'),
    silencio: p('retornante', 'fig10-detras-del-silencio'),
    ramas: p('retornante', 'fig11-ramas-de-tiempo'),
  },
  bot: {
    skin: p('bot-whatsapp', 'fig02-bot-skin-identificada'),
    audio: p('bot-whatsapp', 'fig03-bot-audio-stock-pago'),
    chatwoot: p('bot-whatsapp', 'fig04-chatwoot-nota-privada'),
  },
} as const;

export const youtube = {
  dtmf: 'L_P1sqdi8yo',
  dtmfSecond: '-jbil9_TbpY',
  nosta: 'KF8PVD1NGmo',
  presenter: 'SriinD-al6w',
  botDemo: 'lMLA9i4Q_bA',
} as const;

export const links = {
  dtmfRepo: 'https://github.com/LuisFernandoParra/DTMF',
  nostaPrototype: 'https://claude.ai/artifact/1TqKgE9XunwsiNYcaCfJst',
  retornanteSite: 'https://luisfernandoparra.github.io/graficos/',
} as const;

export const projectOrder = [
  'dtmf',
  'nosta',
  'edicion-video',
  'bot-whatsapp',
  'retornante',
] as const;
