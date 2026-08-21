import { Lang } from './i18n';

/**
 * The page's own chrome: headings, labels and control names. Content lives in
 * `site.data.ts`; this is everything the interface says about itself.
 *
 * One object per language with the same shape, so a missing string is a
 * compile error rather than an empty span.
 */
export interface Copy {
  skip: string;
  nav: { top: string; systems: string; enterprise: string; notes: string; contact: string };
  langLabel: string;
  langSwitchTo: string;

  heroEyebrow: string;
  heroTitle: string;
  heroLead: string;
  heroPrimary: string;
  heroCv: string;

  signalTitle: string;
  signalUnavailable: string;
  signalDown: string;
  signalAnswering: string;
  signalFoot: string;
  signalPlot: string;

  systemsTitle: string;
  systemsNote: string;
  fieldProblem: string;
  fieldSolution: string;
  fieldRole: string;
  openSite: string;
  readCase: string;

  sliderLabel: string;
  sliderPrev: string;
  sliderNext: string;
  sliderPause: string;
  sliderPlay: string;
  sliderGoTo: string;
  captureOf: string;
  noCapture: string;

  entKicker: string;
  entTitle: string;
  entOwn: string;

  notesKicker: string;
  notesTitle: string;
  notesNote: string;

  contactTitle: string;
  contactBody: string;
  contactCv: string;
  cardLinkedin: string;
  cardGithub: string;
  cardEnglish: string;
  cardCity: string;
  footBuilt: string;
  motionReduce: string;
  /** The three states of the first-load veil, in order. */
  boot: [string, string, string];
}

const EN: Copy = {
  skip: 'Skip to the systems',
  nav: { top: 'start', systems: 'systems', enterprise: 'enterprise', notes: 'notes', contact: 'contact' },
  langLabel: 'Language',
  langSwitchTo: 'Switch to Spanish',

  heroEyebrow: 'Senior full-stack engineer · Barranquilla, Colombia',
  heroTitle: 'Enterprise systems, still answering years later.',
  heroLead:
    'Java, Spring Boot, Angular and Oracle. Most of my work goes into platforms that were already in production: I own the data model, the REST service and the screen, and I put the business rules in the database so the reports and the screens cannot disagree.',
  heroPrimary: 'Selected systems',
  heroCv: 'CV',

  signalTitle: 'Live check',
  signalUnavailable: 'not available',
  signalDown: 'down',
  signalAnswering: 'answering',
  signalFoot:
    'The server checks each address while it renders this page. If one of them is down, you read it here first.',
  signalPlot: 'round trip from the edge, at render',

  systemsTitle: 'Selected systems',
  systemsNote:
    'Mine, deployed, and reachable from a browser. Each one lists the problem it solves, what I built and one detail you can check.',
  fieldProblem: 'Problem',
  fieldSolution: 'What I built',
  fieldRole: 'My role',
  openSite: 'Open the site',
  readCase: 'Read the case',

  sliderLabel: 'Selected systems',
  sliderPrev: 'Previous system',
  sliderNext: 'Next system',
  sliderPause: 'Pause the slider',
  sliderPlay: 'Play the slider',
  sliderGoTo: 'Go to',
  captureOf: 'Capture',
  noCapture: 'No public capture: the deployment belongs to the client.',

  entKicker: 'Enterprise',
  entTitle: 'One platform, top to bottom.',
  entOwn: 'What I own inside it',

  notesKicker: 'Engineering notes',
  notesTitle: 'Decisions, and why',
  notesNote:
    'Seven entries from the log. Each one is a decision I had to defend, or a failure that only showed up on one machine.',

  contactTitle: 'Hiring for Java and Angular?',
  contactBody:
    'Write to me directly — no form. The CV carries the full history: versions, migrations and the Oracle models behind them. Everything above is reachable from a browser, so you can check it before we talk.',
  contactCv: 'Download CV',
  cardLinkedin: 'linkedin',
  cardGithub: 'github',
  cardEnglish: 'english',
  cardCity: 'based in',
  footBuilt: 'kdealbap.com — Angular 21, rendered on the Cloudflare edge',
  motionReduce: 'Reduce motion',
  boot: ['Checking the live systems', 'Preparing the project index', 'Ready'],
};

const ES: Copy = {
  skip: 'Saltar a los sistemas',
  nav: { top: 'inicio', systems: 'sistemas', enterprise: 'empresa', notes: 'notas', contact: 'contacto' },
  langLabel: 'Idioma',
  langSwitchTo: 'Cambiar a inglés',

  heroEyebrow: 'Ingeniero full-stack senior · Barranquilla, Colombia',
  heroTitle: 'Sistemas de empresa que siguen respondiendo años después.',
  heroLead:
    'Java, Spring Boot, Angular y Oracle. La mayor parte de mi trabajo va a plataformas que ya estaban en producción: me hago cargo del modelo de datos, del servicio REST y de la pantalla, y pongo las reglas de negocio en la base para que los informes y las pantallas no puedan contradecirse.',
  heroPrimary: 'Sistemas seleccionados',
  heroCv: 'CV',

  signalTitle: 'Comprobación en vivo',
  signalUnavailable: 'no disponible',
  signalDown: 'caído',
  signalAnswering: 'respondiendo',
  signalFoot:
    'El servidor consulta cada dirección mientras renderiza esta página. Si alguno está caído, acá lo lees primero.',
  signalPlot: 'ida y vuelta desde el borde, al renderizar',

  systemsTitle: 'Sistemas seleccionados',
  systemsNote:
    'Míos, desplegados y alcanzables desde un navegador. Cada uno dice el problema que resuelve, qué construí y un detalle que puedes verificar.',
  fieldProblem: 'Problema',
  fieldSolution: 'Qué construí',
  fieldRole: 'Mi rol',
  openSite: 'Abrir el sitio',
  readCase: 'Ver el caso',

  sliderLabel: 'Sistemas seleccionados',
  sliderPrev: 'Sistema anterior',
  sliderNext: 'Sistema siguiente',
  sliderPause: 'Pausar el carrusel',
  sliderPlay: 'Reanudar el carrusel',
  sliderGoTo: 'Ir a',
  captureOf: 'Captura',
  noCapture: 'Sin captura pública: el despliegue es del cliente.',

  entKicker: 'Empresa',
  entTitle: 'Una plataforma, de arriba abajo.',
  entOwn: 'De qué me hago cargo adentro',

  notesKicker: 'Notas de ingeniería',
  notesTitle: 'Decisiones, y por qué',
  notesNote:
    'Siete entradas del registro. Cada una es una decisión que tuve que defender, o una falla que solo aparecía en una máquina.',

  contactTitle: '¿Buscas alguien de Java y Angular?',
  contactBody:
    'Escríbeme directo, sin formulario. El CV tiene la historia completa: versiones, migraciones y los modelos Oracle detrás. Todo lo de arriba se alcanza desde un navegador, así que puedes verificarlo antes de hablar conmigo.',
  contactCv: 'Descargar CV',
  cardLinkedin: 'linkedin',
  cardGithub: 'github',
  cardEnglish: 'inglés',
  cardCity: 'radicado en',
  footBuilt: 'kdealbap.com — Angular 21, renderizado en el borde de Cloudflare',
  motionReduce: 'Reducir movimiento',
  boot: ['Comprobando los sistemas en vivo', 'Preparando el índice de proyectos', 'Listo'],
};

export const COPY: Record<Lang, Copy> = { en: EN, es: ES };
